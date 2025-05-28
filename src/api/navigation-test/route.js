async function handler({ path, authState }) {
  const results = {
    auth: false,
    dbConnection: false,
    flows: {
      authentication: {},
      payment: {},
      game: {},
      recovery: {},
      notifications: {},
    },
    errors: [],
    edgeCases: {},
  };

  try {
    // Test database connection
    const dbTest = await sql`SELECT 1 as connection_test`;
    results.dbConnection = dbTest?.[0]?.connection_test === 1;

    // Test Authentication Flow with edge cases
    results.flows.authentication = await testAuthFlow();
    results.edgeCases.auth = await testAuthEdgeCases();

    // Test Payment Flow with edge cases
    results.flows.payment = await testPaymentFlow();
    results.edgeCases.payment = await testPaymentEdgeCases();

    // Test Game Flow with edge cases
    results.flows.game = await testGameFlow();
    results.edgeCases.game = await testGameEdgeCases();

    // Test Recovery Systems
    results.flows.recovery = await testRecoverySystems();

    // Test Notification Systems
    results.flows.notifications = await testNotificationSystems();

    // Store test results with detailed edge case data
    await sql`
      INSERT INTO navigation_test_results (
        test_path,
        auth_state,
        success,
        error_message
      ) VALUES (
        ${path || "full_flow_test"},
        ${!!authState},
        ${Object.values(results.flows).every((flow) => !flow.error)},
        ${JSON.stringify({
          errors: results.errors,
          edgeCases: results.edgeCases,
        })}
      )
    `;
  } catch (error) {
    results.errors.push(error.message);
  }

  return results;
}

async function testAuthFlow() {
  try {
    // Test signup flow
    const signupTest = await sql`
      SELECT EXISTS(
        SELECT 1 FROM auth_users 
        WHERE email = 'test@example.com'
      ) as user_exists
    `;

    // Test signin flow
    const signinTest = await sql`
      SELECT EXISTS(
        SELECT 1 FROM auth_sessions 
        WHERE "userId" IN (
          SELECT id FROM auth_users 
          WHERE email = 'test@example.com'
        )
      ) as session_exists
    `;

    return {
      signup: signupTest.rows[0].user_exists,
      signin: signinTest.rows[0].session_exists,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testPaymentFlow() {
  try {
    // Test payment session creation
    const paymentTest = await sql`
      SELECT EXISTS(
        SELECT 1 FROM payment_sessions 
        WHERE status = 'pending'
      ) as payment_pending,
      EXISTS(
        SELECT 1 FROM payment_sessions 
        WHERE status = 'completed'
      ) as payment_completed
    `;

    // Test subscription status
    const subscriptionTest = await sql`
      SELECT EXISTS(
        SELECT 1 FROM subscriptions 
        WHERE status = 'active'
      ) as subscription_active
    `;

    return {
      payment: {
        pending: paymentTest.rows[0].payment_pending,
        completed: paymentTest.rows[0].payment_completed,
      },
      subscription: subscriptionTest.rows[0].subscription_active,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testGameFlow() {
  try {
    // Test game creation and status
    const gameTest = await sql`
      SELECT 
        EXISTS(SELECT 1 FROM games WHERE status = 'waiting') as has_waiting_games,
        EXISTS(SELECT 1 FROM games WHERE status = 'playing') as has_active_games,
        EXISTS(SELECT 1 FROM player_hands) as has_player_hands,
        EXISTS(SELECT 1 FROM round_submissions) as has_submissions
    `;

    // Test chat functionality
    const chatTest = await sql`
      SELECT EXISTS(
        SELECT 1 FROM chat_messages 
        LIMIT 1
      ) as has_chat_messages
    `;

    return {
      game: {
        waiting: gameTest.rows[0].has_waiting_games,
        active: gameTest.rows[0].has_active_games,
        hands: gameTest.rows[0].has_player_hands,
        submissions: gameTest.rows[0].has_submissions,
      },
      chat: chatTest.rows[0].has_chat_messages,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testAuthEdgeCases() {
  try {
    // Test concurrent login attempts
    const concurrentTest = await sql`
      SELECT COUNT(*) as session_count 
      FROM auth_sessions 
      WHERE "userId" IN (
        SELECT id FROM auth_users 
        WHERE email = 'test@example.com'
      )
      AND created_at > NOW() - INTERVAL '5 minutes'
    `;

    // Test expired sessions
    const expiredTest = await sql`
      SELECT COUNT(*) as expired_count
      FROM auth_sessions
      WHERE expires < NOW()
    `;

    return {
      concurrentLogins: concurrentTest.rows[0].session_count > 1,
      expiredSessions: expiredTest.rows[0].expired_count > 0,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testPaymentEdgeCases() {
  try {
    // Test incomplete payments
    const incompleteTest = await sql`
      SELECT COUNT(*) as incomplete_count
      FROM payment_sessions
      WHERE status = 'pending'
      AND created_at < NOW() - INTERVAL '1 hour'
    `;

    // Test subscription edge cases
    const subscriptionTest = await sql`
      SELECT COUNT(*) as expired_count
      FROM subscriptions
      WHERE status = 'active'
      AND updated_at < NOW() - INTERVAL '1 month'
    `;

    return {
      stuckPayments: incompleteTest.rows[0].incomplete_count > 0,
      expiredSubscriptions: subscriptionTest.rows[0].expired_count > 0,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testGameEdgeCases() {
  try {
    // Test stuck games
    const stuckGamesTest = await sql`
      SELECT COUNT(*) as stuck_count
      FROM games
      WHERE status = 'playing'
      AND updated_at < NOW() - INTERVAL '1 hour'
    `;

    // Test orphaned hands
    const orphanedTest = await sql`
      SELECT COUNT(*) as orphaned_count
      FROM player_hands ph
      LEFT JOIN games g ON g.id = ph.game_id
      WHERE g.id IS NULL
    `;

    return {
      stuckGames: stuckGamesTest.rows[0].stuck_count > 0,
      orphanedHands: orphanedTest.rows[0].orphaned_count > 0,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testRecoverySystems() {
  try {
    // Test game recovery
    const gameRecoveryTest = await sql`
      SELECT COUNT(*) as recoverable_count
      FROM games
      WHERE status IN ('waiting', 'playing')
      AND updated_at < NOW() - INTERVAL '15 minutes'
    `;

    // Test payment recovery
    const paymentRecoveryTest = await sql`
      SELECT COUNT(*) as recoverable_count
      FROM payment_sessions
      WHERE status = 'pending'
      AND created_at > NOW() - INTERVAL '1 hour'
    `;

    return {
      recoverableGames: gameRecoveryTest.rows[0].recoverable_count,
      recoverablePayments: paymentRecoveryTest.rows[0].recoverable_count,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}

async function testNotificationSystems() {
  try {
    // Test notification delivery
    const notificationTest = await sql`
      SELECT COUNT(*) as pending_count
      FROM support_requests
      WHERE status = 'pending'
      AND created_at > NOW() - INTERVAL '1 hour'
    `;

    return {
      pendingNotifications: notificationTest.rows[0].pending_count,
      error: null,
    };
  } catch (error) {
    return { error: error.message };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
async function handler({ numGames = 5, numPlayers = 20, numPayments = 10 }) {
  const results = {
    games: { success: 0, failed: 0 },
    payments: { success: 0, failed: 0 },
    timing: { start: Date.now(), end: null, duration: null },
  };

  try {
    // Simulate concurrent games
    const gamePromises = Array.from(
      { length: numGames },
      async (_, gameIndex) => {
        try {
          const channelId = `stress_test_${gameIndex}`;
          const czarId = `test_czar_${gameIndex}`;

          const gameResult = await sql`
          INSERT INTO games (channel_id, czar_user_id, status)
          VALUES (${channelId}, ${czarId}, 'active')
          RETURNING id
        `;

          // Add players to game
          const playerValues = Array.from({ length: numPlayers }, (_, i) => [
            gameResult[0].id,
            `test_user_${gameIndex}_${i}`,
            `TestPlayer${i}`,
            0,
            0,
          ]).flat();

          const placeholders = Array.from(
            { length: numPlayers },
            (_, i) =>
              `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
                i * 5 + 5
              })`
          ).join(", ");

          await sql(
            `
          INSERT INTO game_players (game_id, user_id, username, score, lifetime_score)
          VALUES ${placeholders}
        `,
            playerValues
          );

          results.games.success++;
          return true;
        } catch (err) {
          results.games.failed++;
          return false;
        }
      }
    );

    // Simulate concurrent payments
    const paymentPromises = Array.from(
      { length: numPayments },
      async (_, i) => {
        try {
          await sql`
          INSERT INTO payment_sessions (
            session_id,
            user_id,
            username,
            type,
            status
          ) VALUES (
            ${`stress_payment_${i}`},
            ${`test_user_${i}`},
            ${`TestUser${i}`},
            'subscription',
            'pending'
          )
        `;

          results.payments.success++;
          return true;
        } catch (err) {
          results.payments.failed++;
          return false;
        }
      }
    );

    // Run all simulations concurrently
    await Promise.all([...gamePromises, ...paymentPromises]);

    // Record test results
    await sql`
      INSERT INTO navigation_test_results (
        test_path,
        auth_state,
        success,
        error_message
      ) VALUES (
        'stress_test',
        false,
        ${results.games.failed === 0 && results.payments.failed === 0},
        ${
          results.games.failed > 0 || results.payments.failed > 0
            ? "Some operations failed"
            : null
        }
      )
    `;

    results.timing.end = Date.now();
    results.timing.duration = results.timing.end - results.timing.start;

    return results;
  } catch (error) {
    results.timing.end = Date.now();
    results.timing.duration = results.timing.end - results.timing.start;

    return {
      ...results,
      error: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
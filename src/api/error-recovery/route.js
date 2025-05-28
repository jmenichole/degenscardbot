async function handler({ gameId, sessionId, type }) {
  try {
    if (!type) {
      return { error: "Recovery type must be specified" };
    }

    if (type === "game") {
      if (!gameId) {
        return { error: "Game ID is required for game recovery" };
      }

      // Get game state and check if it's recoverable
      const [game] = await sql`
        SELECT * FROM games 
        WHERE id = ${gameId} 
        AND created_at > NOW() - INTERVAL '24 hours'
      `;

      if (!game) {
        return { error: "Game not found or expired" };
      }

      // Get all related game data
      const [players, hands, submissions] = await sql.transaction([
        sql`SELECT * FROM game_players WHERE game_id = ${gameId}`,
        sql`SELECT * FROM player_hands WHERE game_id = ${gameId}`,
        sql`SELECT * FROM round_submissions WHERE game_id = ${gameId}`,
      ]);

      // Update game status to active if it was stuck
      if (game.status === "waiting") {
        await sql`
          UPDATE games 
          SET status = 'active' 
          WHERE id = ${gameId}
        `;
      }

      return {
        recovered: true,
        game,
        gameState: {
          players,
          hands,
          submissions,
        },
      };
    }

    if (type === "payment") {
      if (!sessionId) {
        return { error: "Session ID is required for payment recovery" };
      }

      // Get payment session and check if it's recoverable
      const [session] = await sql`
        SELECT * FROM payment_sessions 
        WHERE session_id = ${sessionId}
        AND created_at > NOW() - INTERVAL '1 hour'
      `;

      if (!session) {
        return { error: "Payment session not found or expired" };
      }

      if (session.status === "completed") {
        return {
          recovered: true,
          status: "completed",
          session,
        };
      }

      // Update session status to pending for retry
      await sql`
        UPDATE payment_sessions
        SET status = 'pending'
        WHERE session_id = ${sessionId}
      `;

      return {
        recovered: true,
        status: "pending",
        session,
      };
    }

    return { error: "Invalid recovery type" };
  } catch (error) {
    console.error("Error in error recovery:", error);
    return { error: "Failed to process recovery request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
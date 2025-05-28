async function handler({ action, gameId, userId, message }) {
  if (!gameId) {
    return { error: "Game ID is required" };
  }

  try {
    switch (action) {
      case "send_message": {
        if (!userId || !message) {
          return { error: "User ID and message are required" };
        }

        const result = await sql`
          INSERT INTO chat_messages (game_id, user_id, message)
          VALUES (${gameId}, ${userId}, ${message})
          RETURNING id, message, created_at
        `;

        return { success: true, message: result[0] };
      }

      case "get_messages": {
        const messages = await sql`
          SELECT 
            cm.id,
            cm.message,
            cm.created_at,
            au.name as username
          FROM chat_messages cm
          JOIN auth_users au ON au.id = cm.user_id
          WHERE cm.game_id = ${gameId}
          ORDER BY cm.created_at ASC
        `;

        return { messages };
      }

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    return { error: "Failed to process chat operation" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
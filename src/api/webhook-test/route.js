async function handler({ type, sessionId, status }) {
  try {
    if (!type || !sessionId) {
      return { error: "Missing required parameters" };
    }

    const testResult = await sql`
      INSERT INTO payment_sessions (
        session_id,
        user_id,
        username,
        type,
        status
      )
      VALUES (
        ${sessionId},
        'test_user',
        'test_webhook_user',
        ${type},
        ${status || "pending"}
      )
      RETURNING id, session_id, status
    `;

    if (status === "completed") {
      await sql`
        UPDATE payment_sessions 
        SET status = 'completed' 
        WHERE session_id = ${sessionId}
      `;
    }

    return {
      success: true,
      message: "Webhook test completed successfully",
      result: testResult[0],
    };
  } catch (error) {
    console.error("Webhook test error:", error);
    return {
      success: false,
      error: "Failed to process webhook test",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
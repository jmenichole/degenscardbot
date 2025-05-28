async function handler({ session_id }) {
  if (!session_id) {
    return { error: "Session ID is required" };
  }

  try {
    const paymentSession = await sql`
      SELECT * FROM payment_sessions 
      WHERE session_id = ${session_id}
    `;

    if (!paymentSession || paymentSession.length === 0) {
      return { error: "Payment session not found" };
    }

    await sql`
      UPDATE payment_sessions 
      SET status = 'completed' 
      WHERE session_id = ${session_id}
    `;

    if (paymentSession[0].type === "subscription") {
      await sql`
        INSERT INTO subscriptions (
          user_id, 
          subscription_id, 
          status, 
          plan_type
        ) VALUES (
          ${paymentSession[0].user_id},
          ${session_id},
          'active',
          ${paymentSession[0].type}
        )
      `;
    }

    return {
      success: true,
      user_id: paymentSession[0].user_id,
      type: paymentSession[0].type,
    };
  } catch (error) {
    return {
      error: "Failed to process payment verification",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
async function handler({ subject, message, userId }) {
  if (!subject || !message) {
    return { error: "Subject and message are required" };
  }

  try {
    const result = await sql`
      INSERT INTO support_requests (user_id, subject, message)
      VALUES (${userId || null}, ${subject}, ${message})
      RETURNING id
    `;

    const supportRequest = result[0];

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "support@degensagainstdecency.com",
        to: "support@degensagainstdecency.com",
        subject: `New Support Request: ${subject}`,
        html: `
          <h2>New Support Request (#${supportRequest.id})</h2>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>User ID:</strong> ${userId || "Anonymous"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      return { error: "Failed to send email notification" };
    }

    return { success: true, id: supportRequest.id };
  } catch (error) {
    return { error: "Failed to process support request" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
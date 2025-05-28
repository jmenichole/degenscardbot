async function handler({ type, userId, message, email, gameId }) {
  try {
    const session = getSession();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Insert notification record
    const notification = await sql`
      INSERT INTO support_requests (
        user_id,
        subject,
        message,
        status
      ) VALUES (
        ${userId},
        ${type},
        ${message},
        'pending'
      ) RETURNING id
    `;

    // Send SMS for critical updates
    if (type === "critical") {
      const smsResponse = await fetch(
        "https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: "+18509776841",
            From: process.env.TWILIO_PHONE_NUMBER,
            Body: message,
          }),
        }
      );

      if (!smsResponse.ok) {
        return { error: "Failed to send SMS notification" };
      }
    }

    // Send email notification
    if (email) {
      const emailResponse = await fetch(
        "https://api.sendgrid.com/v3/mail/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email }],
              },
            ],
            from: { email: "notifications@degensagainstdecency.com" },
            subject: `Degens Against Decency - ${type} Update`,
            content: [
              {
                type: "text/plain",
                value: message,
              },
            ],
          }),
        }
      );

      if (!emailResponse.ok) {
        return { error: "Failed to send email notification" };
      }
    }

    return {
      success: true,
      notificationId: notification.id,
    };
  } catch (error) {
    console.error("Notification error:", error);
    return { error: "Failed to process notification" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
async function handler({
  contactName,
  email,
  discordServer,
  dateTime,
  timezone,
  playerCount,
  hostPreference,
  additionalNotes,
  recipientEmail,
}) {
  try {
    const booking = await sql`
      INSERT INTO game_night_bookings (
        name, 
        email, 
        booking_date, 
        number_of_players, 
        notes, 
        status
      ) 
      VALUES (
        ${contactName},
        ${email},
        ${new Date(dateTime)},
        ${parseInt(playerCount)},
        ${JSON.stringify({
          discordServer,
          timezone,
          hostPreference,
          additionalNotes,
        })},
        'pending'
      )
      RETURNING *`;

    const emailBody = `
New Game Night Booking

Contact Information:
- Name: ${contactName}
- Email: ${email}
- Discord Server: ${discordServer}

Event Details:
- Date and Time: ${new Date(dateTime).toLocaleString("en-US", {
      timeZone: timezone,
    })} ${timezone}
- Number of Players: ${playerCount}
- Host Preference: ${hostPreference}

Additional Notes:
${additionalNotes || "None provided"}
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Game Night Booking <booking@yourdomain.com>",
        to: recipientEmail,
        subject: `New Game Night Booking - ${contactName}`,
        text: emailBody,
      }),
    });

    return {
      success: true,
      booking: booking[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

function MainComponent() {
  // ... keep existing state and handleSubmit function ...

  return (
    <div className="min-h-screen bg-[#0B0B1A] p-6">
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="/" className="flex items-center">
              <img
                src="https://ucarecdn.com/307b70a9-f35f-4c93-a78b-a87cd5749420/-/format/auto/"
                alt="Degens Against Decency Logo"
                className="h-12 w-auto"
                style={{ filter: "drop-shadow(0 0 8px #00E6FF)" }}
              />
            </a>
            <a
              href="/game-monitor"
              className="text-[#00E6FF] hover:text-[#FF00FF] font-inter transition-colors duration-300"
            >
              <i className="fas fa-gamepad mr-2" />
              Game Monitor
            </a>
          </div>
        </div>
      </nav>

      {/* Add Footer */}
      <div className="text-center space-y-4 mt-8">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="bg-[#000000] rounded-lg p-3">
            <i className="fas fa-skull text-3xl text-white" />
          </div>
        </div>
        <p className="text-gray-400 font-inter">
          <strong>Powered by Degens Against Decency</strong>
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500 font-inter mt-4">
          <a href="/terms" className="hover:text-[#00FF9D]">
            Terms of Service
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-[#00FF9D]">
            Privacy Policy
          </a>
        </div>
        <p className="text-sm text-gray-500 font-inter">
          © 2025 Degens Against Decency. All rights reserved.
        </p>
      </div>
    </div>
  );
}
export async function POST(request) {
  return handler(await request.json());
}
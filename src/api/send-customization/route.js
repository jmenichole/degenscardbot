async function handler({
  serverName,
  primaryColor,
  secondaryColor,
  logoUrl,
  deckTheme,
  additionalNotes,
}) {
  if (!serverName || !primaryColor || !secondaryColor || !deckTheme) {
    return { error: "Missing required fields" };
  }

  const emailBody = `
Server Customization Request

Server Name: ${serverName}
Primary Color: ${primaryColor}
Secondary Color: ${secondaryColor}
Logo URL: ${logoUrl || "Not provided"}
Deck Theme: ${deckTheme}
Additional Notes: ${additionalNotes || "None provided"}
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cards Against Humanity <noreply@cardsagainsthumanity.app>",
        to: "jmenichole007@outlook.com",
        subject: `Customization Request: ${serverName}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send email");
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to process customization request" };
  }
}

function MainComponent() {
  // ... keep existing state and functions ...

  return (
    <div className="min-h-screen bg-[#0F1011] p-6">
      // keep existing navigation and form content
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
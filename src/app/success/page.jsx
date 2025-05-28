"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageType, setPackageType] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");

        if (!sessionId) {
          throw new Error("No session ID found");
        }

        const response = await fetch("/api/payment-success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }

        const data = await response.json();
        setPackageType(data.type);
      } catch (err) {
        console.error(err);
        setError("Could not verify payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1011] flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#00FF9D] mb-4" />
          <p className="text-gray-400 font-inter">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F1011] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <i className="fas fa-exclamation-circle text-red-400 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-red-400 font-inter mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-400 font-inter">{error}</p>
            <a
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter rounded-lg transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1011] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#00FF9D]/20 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-[#00FF9D] text-2xl" />
          </div>

          <h1 className="text-3xl font-bold text-[#00FF9D] font-inter mb-4">
            Payment Successful!
          </h1>

          {packageType === "price_game_night" && (
            <div className="space-y-4">
              <p className="text-gray-300 font-inter">
                Your game night has been booked!
              </p>
              <div className="bg-[#0F1011] rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
                  Next Steps
                </h3>
                <ul className="text-left space-y-3 text-gray-300 font-inter">
                  <li className="flex items-center">
                    <i className="fas fa-calendar-check text-[#00FF9D] mr-3" />
                    Check your email for booking confirmation
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-users text-[#00FF9D] mr-3" />
                    Invite your players using the Discord link
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-trophy text-[#00FF9D] mr-3" />
                    Prize pool will be distributed after the game
                  </li>
                </ul>
              </div>
            </div>
          )}

          {packageType === "price_monthly" && (
            <div className="space-y-4">
              <p className="text-gray-300 font-inter">
                Welcome to Degens Against Decency!
              </p>
              <div className="bg-[#0F1011] rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
                  Getting Started
                </h3>
                <ul className="text-left space-y-3 text-gray-300 font-inter">
                  <li className="flex items-center">
                    <i className="fas fa-robot text-[#00FF9D] mr-3" />
                    Add the bot to your Discord server
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-gamepad text-[#00FF9D] mr-3" />
                    Use !help to see available commands
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-cog text-[#00FF9D] mr-3" />
                    Configure your server settings
                  </li>
                </ul>
              </div>
            </div>
          )}

          {packageType === "price_lifetime" && (
            <div className="space-y-4">
              <p className="text-gray-300 font-inter">
                Welcome to the lifetime membership!
              </p>
              <div className="bg-[#0F1011] rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
                  Your Benefits
                </h3>
                <ul className="text-left space-y-3 text-gray-300 font-inter">
                  <li className="flex items-center">
                    <i className="fas fa-infinity text-[#00FF9D] mr-3" />
                    Permanent access to all features
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-star text-[#00FF9D] mr-3" />
                    Priority support and updates
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-paint-brush text-[#00FF9D] mr-3" />
                    Custom branding options
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <a
              href="/game-monitor"
              className="inline-block w-full px-6 py-3 bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter rounded-lg transition-colors"
            >
              Go to Game Monitor
            </a>
            <a
              href="/"
              className="inline-block w-full px-6 py-3 bg-transparent border border-[#00FF9D] hover:bg-[#00FF9D]/10 text-[#00FF9D] font-bold font-inter rounded-lg transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-inter">
            Need help? Contact us at support@degensagainstdecency.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
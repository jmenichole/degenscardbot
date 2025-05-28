"use client";
import React from "react";
import GameNightBooking from "../../components/game-night-booking";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async (packageType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url, error } = await response.json();
      if (error) {
        throw new Error(error);
      }

      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGameNightPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_game_night",
          amount: 3000, // $30.00
          description:
            "Game Night Booking (up to 30 players) - Includes $15 Prize Pool",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F1011] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-8 text-center">
            <i className="fas fa-check-circle text-[#00FF9D] text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-[#00FF9D] font-inter mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-300 font-inter mb-6">
              Let's schedule your game night!
            </p>
            <GameNightBooking />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1011] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00FF9D] font-inter mb-4">
            Choose Your Chaos Level
          </h1>
          <p className="text-xl text-gray-400 font-inter">
            Pick a plan that matches your degenerate energy
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm font-inter">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Starter Package */}
          <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-6 transform transition-all hover:scale-[1.02]">
            <div className="text-center mb-6">
              <i className="fas fa-rocket text-[#00FF9D] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Starter Access
              </h2>
              <div className="text-3xl font-bold text-[#00FF9D] font-inter mt-4">
                $7/mo
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Full bot access
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Basic commands
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Email support
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("starter")}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Get Started"
              )}
            </button>
          </div>

          {/* Server License */}
          <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-6 transform transition-all hover:scale-[1.02]">
            <div className="text-center mb-6">
              <i className="fas fa-server text-[#00FF9D] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Server License
              </h2>
              <div className="text-3xl font-bold text-[#00FF9D] font-inter mt-4">
                $19.99
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Everything in Starter
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Custom commands
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Priority support
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Advanced features
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("server")}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Get Server License"
              )}
            </button>
          </div>

          {/* Game Night Package */}
          <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-6 transform transition-all hover:scale-[1.02]">
            <div className="text-center mb-6">
              <i className="fas fa-trophy text-[#00FF9D] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Game Night
              </h2>
              <div className="text-3xl font-bold text-[#00FF9D] font-inter mt-4">
                $30
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Up to 30 players
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Prize Pool included
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Dedicated host
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00FF9D] mr-2" />
                Custom game settings
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("gameNight")}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Book Game Night"
              )}
            </button>
          </div>
        </div>

        <div className="text-center text-gray-400 font-inter">
          <p className="mb-2">🔒 Secure payments powered by Stripe</p>
          <p className="text-sm">
            Questions?{" "}
            <a href="/support" className="text-[#00FF9D] hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
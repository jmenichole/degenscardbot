"use client";
import React from "react";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);

    try {
      const response = await fetch("/api/game-night-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactName: formData.get("contactName"),
          email: formData.get("email"),
          discordServer: formData.get("discordServer"),
          dateTime: formData.get("dateTime"),
          timezone: formData.get("timezone"),
          playerCount: formData.get("playerCount"),
          hostPreference: formData.get("hostPreference"),
          additionalNotes: formData.get("additionalNotes"),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking form");
      }

      setSuccess(true);
      e.target.reset();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6">
            <div className="bg-[#0B0B1A] rounded-lg p-4">
              <i
                className="fas fa-skull text-4xl text-[#00E6FF] animate-pulse"
                style={{ filter: "drop-shadow(0 0 10px #00E6FF)" }}
              />
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-[#00E6FF] font-inter mb-4"
            style={{ textShadow: "0 0 10px #00E6FF" }}
          >
            Book Your Game Night
          </h1>
          <p className="text-[#B39DDB] font-inter">
            Fill out the details below to schedule your custom game night
            experience
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm font-inter">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-[#00E6FF]/10 border border-[#00E6FF] rounded-lg text-[#00E6FF] text-sm font-inter">
            <i className="fas fa-check-circle mr-2" />
            Your game night booking has been submitted successfully! We'll be in
            touch soon.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#151528] rounded-lg shadow-lg border border-[#2A2A4A] p-6 space-y-6"
          style={{ boxShadow: "0 0 20px rgba(0, 230, 255, 0.1)" }}
        >
          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Contact Name
            </label>
            <input
              type="text"
              name="contactName"
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Discord Server Name/Link
            </label>
            <input
              type="text"
              name="discordServer"
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              placeholder="Your Discord server name or invite link"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
                Preferred Date and Time
              </label>
              <input
                type="datetime-local"
                name="dateTime"
                required
                className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
                Timezone
              </label>
              <select
                name="timezone"
                required
                className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              >
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Number of Expected Players
            </label>
            <input
              type="number"
              name="playerCount"
              required
              min="3"
              max="30"
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              placeholder="Enter number of players (3-30)"
            />
          </div>

          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Host Preference
            </label>
            <select
              name="hostPreference"
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
            >
              <option value="self">I'll host the game</option>
              <option value="provided">Please provide a host</option>
            </select>
          </div>

          <div>
            <label className="block text-[#B39DDB] font-inter mb-2 text-sm">
              Additional Notes or Requests
            </label>
            <textarea
              name="additionalNotes"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-[#2A2A4A] bg-[#0B0B1A] text-[#E0E0E0] font-inter text-sm focus:outline-none focus:border-[#00E6FF] focus:ring-1 focus:ring-[#00E6FF] transition-colors duration-300"
              placeholder="Any special requests or additional information?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E6FF] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#00E6FF] text-white font-bold font-inter transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02]"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2" />
                Submitting...
              </span>
            ) : (
              "Book Game Night"
            )}
          </button>
        </form>

        <div className="text-center space-y-4 mt-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="bg-[#0B0B1A] rounded-lg p-3">
              <i
                className="fas fa-skull text-3xl text-[#00E6FF]"
                style={{ filter: "drop-shadow(0 0 10px #00E6FF)" }}
              />
            </div>
          </div>
          <p className="text-[#B39DDB] font-inter">
            <strong>Powered by Degens Against Decency</strong>
          </p>
          <div className="flex justify-center space-x-4 text-sm text-[#B39DDB] font-inter mt-4">
            <a
              href="/terms"
              className="hover:text-[#00E6FF] transition-colors duration-300"
            >
              Terms of Service
            </a>
            <span>•</span>
            <a
              href="/privacy"
              className="hover:text-[#00E6FF] transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </div>
          <p className="text-sm text-[#B39DDB] font-inter">
            © 2025 Degens Against Decency. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes neonPulse {
          0% {
            filter: drop-shadow(0 0 2px #00E6FF) drop-shadow(0 0 4px #00E6FF);
          }
          50% {
            filter: drop-shadow(0 0 8px #00E6FF) drop-shadow(0 0 12px #FF00FF);
          }
          100% {
            filter: drop-shadow(0 0 2px #00E6FF) drop-shadow(0 0 4px #00E6FF);
          }
        }

        .animate-pulse {
          animation: neonPulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default MainComponent;
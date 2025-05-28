"use client";
import React from "react";

function MainComponent() {
  const [discordStatus, setDiscordStatus] = useState("checking");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkDiscordStatus = async () => {
      try {
        const response = await fetch("/api/discord-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: 1 }), // Discord ping
        });

        if (response.ok) {
          setDiscordStatus("connected");
        } else {
          setDiscordStatus("disconnected");
        }
      } catch (err) {
        console.error(err);
        setDiscordStatus("disconnected");
      }
    };

    checkDiscordStatus();
  }, []);

  const handleSubscribe = async (priceId, isLifetime = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          amount: priceId === "price_starter" ? 700 : 1999,
          isLifetime,
          description:
            priceId === "price_starter"
              ? "Starter Access - Monthly Bot Access"
              : "Server License - Premium Features",
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

  const handleGameNightPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_game_night",
          amount: 3000,
          description:
            "Game Night Booking (up to 30 players) - Includes Prize Pool",
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

  return (
    <div className="min-h-screen bg-[#0A0014] p-6">
      <style jsx global>{`
        .cute-skull {
          filter: drop-shadow(0 0 10px #00E6FF) drop-shadow(0 0 20px #FF00FF);
        }
      `}</style>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href="/account/signin"
              className="text-[#00E6FF] hover:text-[#FF00FF] font-inter transition-colors duration-300"
            >
              <i className="fas fa-sign-in-alt mr-2" />
              Login
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                discordStatus === "connected"
                  ? "bg-[#00E6FF] shadow-[0_0_10px_#00E6FF]"
                  : discordStatus === "checking"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-[#00E6FF] font-inter capitalize">
              {discordStatus}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto relative">
        {/* Hero Section - update the skull */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6">
            <div className="bg-[#0A0014] rounded-lg p-4 relative">
              <i
                className="fas fa-skull text-5xl text-[#00E6FF]"
                style={{
                  transform: "scale(1.2)",
                  filter:
                    "drop-shadow(0 0 15px #00E6FF) drop-shadow(0 0 30px #FF00FF)",
                }}
              />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#00E6FF] font-inter mb-4">
            Degens Against Decency
          </h1>
          <p className="text-xl text-[#FF00FF] font-inter max-w-2xl mx-auto">
            A party game for chronically online people — way more tilted than
            Cards Against Humanity.
          </p>
          <p className="text-lg text-[#00E6FF] font-inter mt-4">
            Over 300 themed cards to play
          </p>
        </div>

        {/* Pricing Cards - update background and borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Starter Access */}
          <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6 transform transition-all hover:scale-[1.02] relative overflow-hidden">
            <div className="text-center mb-6">
              <i className="fas fa-rocket text-[#00E6FF] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Starter Access
              </h2>
              <div className="text-3xl font-bold text-[#00E6FF] font-inter mt-4">
                $7/mo
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Full bot access for one server
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                All game decks included
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Unlimited rounds
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Basic support
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("price_starter")}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#00E6FF] hover:bg-[#FF00FF] text-black font-bold font-inter transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Get Started"
              )}
            </button>
          </div>

          {/* Server License */}
          <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6 transform transition-all hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#00E6FF] text-black text-xs font-bold px-3 py-1 rounded-full font-inter">
                MOST POPULAR
              </span>
            </div>
            <div className="text-center mb-6">
              <i className="fas fa-crown text-[#00E6FF] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Server License
              </h2>
              <div className="text-3xl font-bold text-[#00E6FF] font-inter mt-4">
                $19/mo
              </div>
              <div className="text-sm text-gray-400 font-inter mt-1">
                or $99 one-time
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Use in multiple servers
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                All current & future decks
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Advanced settings
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Priority support
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Light customization
              </li>
            </ul>
            <div className="space-y-2">
              <button
                onClick={() => handleSubscribe("price_server_license")}
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-[#00E6FF] hover:bg-[#FF00FF] text-black font-bold font-inter transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  "Subscribe Monthly"
                )}
              </button>
              <button
                onClick={() => handleSubscribe("price_server_license", true)}
                disabled={loading}
                className="w-full px-6 py-3 rounded-lg bg-[#1E2023] hover:bg-[#2A2D31] text-[#00E6FF] font-bold font-inter transition-colors disabled:opacity-50 border border-[#00E6FF]"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  "Get Lifetime Access"
                )}
              </button>
            </div>
          </div>

          {/* Game Night */}
          <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6 transform transition-all hover:scale-[1.02] relative overflow-hidden">
            <div className="text-center mb-6">
              <i className="fas fa-trophy text-[#00E6FF] text-4xl mb-4" />
              <h2 className="text-2xl font-bold text-white font-inter">
                Game Night
              </h2>
              <div className="text-3xl font-bold text-[#00E6FF] font-inter mt-4">
                $30
                <span className="text-sm text-gray-400 font-inter">/event</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-gray-300 font-inter">
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Live host (you or us)
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Prize pool included
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Full chaos coordination
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-[#00E6FF] mr-2" />
                Perfect for events & streams
              </li>
            </ul>
            <button
              onClick={handleGameNightPayment}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-[#00E6FF] hover:bg-[#FF00FF] text-black font-bold font-inter transition-colors disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                "Book Game Night"
              )}
            </button>
          </div>
        </div>

        {/* What It Is Section */}
        <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-8 mb-8 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
            <i className="fas fa-comments mr-3" />
            What It Is
          </h2>
          <p className="text-gray-300 font-inter mb-6">
            <span className="font-bold text-[#00E6FF]">
              Degens Against Decency
            </span>{" "}
            is a multiplayer card game for servers who thrive on chaos. Think{" "}
            <em>Cards Against Humanity</em>, but if it were:
          </p>
          <ul className="list-none space-y-3 text-gray-300 mb-6">
            <li className="flex items-center">
              <i className="fas fa-tv text-[#00E6FF] mr-3" />
              Raised on Twitch
            </li>
            <li className="flex items-center">
              <i className="fas fa-microphone text-[#00E6FF] mr-3" />
              Overexposed to Discord voice chats
            </li>
            <li className="flex items-center">
              <i className="fas fa-chart-line text-[#00E6FF] mr-3" />
              Rugged by crypto
            </li>
            <li className="flex items-center">
              <i className="fas fa-brain text-[#00E6FF] mr-3" />
              Still debating whether ADHD is a personality or a business model
            </li>
          </ul>
          <div className="bg-[#0F1011] rounded-lg p-4 border border-[#2F3136]">
            <p className="text-gray-400 font-inter text-sm">
              Play entirely in Discord. 3–20 players. Emoji-powered, mod-safe,
              and totally unhinged.
              <br />
              Winners get points. Losers get exposed.
            </p>
          </div>
        </div>

        {/* Bot Status Section */}
        <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#00E6FF] font-inter">
              <i className="fas fa-robot mr-2" />
              Bot Status
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  discordStatus === "connected"
                    ? "bg-[#00E6FF]"
                    : discordStatus === "checking"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-[#00E6FF] font-inter capitalize">
                {discordStatus}
              </span>
            </div>
          </div>

          {discordStatus === "disconnected" && (
            <div className="bg-red-900/20 border border-red-800 rounded p-4">
              <div className="flex">
                <i className="fas fa-exclamation-circle text-red-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-400 font-inter">
                    Discord Bot Not Connected
                  </h3>
                  <div className="mt-2 text-sm text-red-300 font-inter">
                    Add your Discord credentials in settings to start the
                    degeneracy.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Commands Section */}
        <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-8 mb-8 relative overflow-hidden">
          <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
            <i className="fas fa-terminal mr-3" />
            Commands
          </h2>

          <div className="space-y-8">
            {/* Start The Game */}
            <div>
              <h3 className="text-lg font-medium text-[#00E6FF] font-inter mb-3">
                <i className="fas fa-running mr-2" />
                Start The Game
              </h3>
              <div className="bg-[#0F1011] rounded p-4 border border-[#2F3136] space-y-2">
                <code className="block text-sm font-mono text-gray-300">
                  !startgame #channel{" "}
                  <span className="text-gray-500">
                    — Start a public game in the specified channel
                  </span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !testgame{" "}
                  <span className="text-gray-500">
                    — Run a solo test (for devs or control freaks)
                  </span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !join{" "}
                  <span className="text-gray-500">— Join the current game</span>
                </code>
              </div>
            </div>

            {/* Gameplay */}
            <div>
              <h3 className="text-lg font-medium text-[#00E6FF] font-inter mb-3">
                <i className="fas fa-gamepad mr-2" />
                Gameplay
              </h3>
              <div className="bg-[#0F1011] rounded p-4 border border-[#2F3136] space-y-2">
                <p className="text-sm text-gray-300">
                  • Card selection is done via emoji or reply
                </p>
                <p className="text-sm text-gray-300">
                  • One player (Czar) picks the winning answer with ✅
                </p>
                <p className="text-sm text-gray-300">
                  • Round resets automatically with a short cooldown
                </p>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h3 className="text-lg font-medium text-[#00E6FF] font-inter mb-3">
                <i className="fas fa-cog mr-2" />
                Settings
              </h3>
              <div className="bg-[#0F1011] rounded p-4 border border-[#2F3136] space-y-2">
                <code className="block text-sm font-mono text-gray-300">
                  !setcards dm{" "}
                  <span className="text-gray-500">
                    — Receive card choices in DMs
                  </span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !setcards public{" "}
                  <span className="text-gray-500">
                    — Get card choices in-channel (only you can see them)
                  </span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !endgame{" "}
                  <span className="text-gray-500">— End the current game</span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !quitgame{" "}
                  <span className="text-gray-500">
                    — Leave the game mid-round
                  </span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !myscore{" "}
                  <span className="text-gray-500">
                    — View your current score
                  </span>
                </code>
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-lg font-medium text-[#00E6FF] font-inter mb-3">
                <i className="fas fa-star mr-2" />
                Extras
              </h3>
              <div className="bg-[#0F1011] rounded p-4 border border-[#2F3136] space-y-2">
                <code className="block text-sm font-mono text-gray-300">
                  !help{" "}
                  <span className="text-gray-500">— Show all commands</span>
                </code>
                <code className="block text-sm font-mono text-gray-300">
                  !invite{" "}
                  <span className="text-gray-500">
                    — Get the bot link and website
                  </span>
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - updated */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="bg-[#0A0014] rounded-lg p-3">
              <i
                className="fas fa-skull text-3xl text-[#00E6FF]"
                style={{
                  transform: "scale(1.2)",
                  filter:
                    "drop-shadow(0 0 10px #00E6FF) drop-shadow(0 0 20px #FF00FF)",
                }}
              />
            </div>
          </div>
          <p className="text-[#FF00FF] font-inter">
            <strong>Powered by Degens Against Decency</strong>
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 font-inter mt-4">
            <a href="/terms" className="hover:text-[#00E6FF]">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-[#00E6FF]">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/contact" className="hover:text-[#00E6FF]">
              Need Help? Contact Us
            </a>
          </div>
          <p className="text-sm text-gray-500 font-inter">
            © 2025 Degens Against Decency. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
"use client";
import React from "react";

function MainComponent() {
  const { data: user } = useUser();
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch("/api/game-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "list_games",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch games");
      }

      const data = await response.json();
      setGames(data.games || []);
    } catch (err) {
      setError("Failed to load games");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  const fetchChatMessages = async (gameId) => {
    try {
      const response = await fetch("/api/game-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "get_messages",
          gameId,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setChatMessages(data.messages || []);

      // Scroll to bottom of chat
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGame || !user) return;

    try {
      const response = await fetch("/api/game-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          gameId: selectedGame,
          userId: user.id,
          message: newMessage.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setNewMessage("");
      fetchChatMessages(selectedGame);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (selectedGame) {
      fetchChatMessages(selectedGame);
      const chatInterval = setInterval(
        () => fetchChatMessages(selectedGame),
        3000
      );
      return () => clearInterval(chatInterval);
    }
  }, [selectedGame]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0014]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#00E6FF] mb-4" />
          <div className="text-gray-400 font-inter">Loading the chaos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0014] p-6">
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="/dashboard" className="flex items-center space-x-3">
              <div className="text-4xl text-[#00E6FF] relative">
                <i
                  className="fas fa-skull"
                  style={{
                    filter:
                      "drop-shadow(0 0 10px #00E6FF) drop-shadow(0 0 20px #FF00FF)",
                  }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF00FF] opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-3 w-3 bg-[#FF00FF]"></div>
                </div>
              </div>
              <span className="text-[#00E6FF] hover:text-[#FF00FF] font-inter transition-colors duration-300">
                Dashboard
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {!user && (
              <a
                href="/account/signin"
                className="text-[#00E6FF] hover:text-[#FF00FF] font-inter"
              >
                <i className="fas fa-sign-in-alt mr-2" />
                Sign In
              </a>
            )}
            <a
              href="/game-night-booking"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E6FF] to-[#FF00FF] text-black font-bold font-inter hover:opacity-90 transition-opacity"
            >
              Book Game Night
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#00E6FF] font-inter">
            <i className="fas fa-dice-d20 mr-3" />
            Active Games
          </h1>
          <div className="text-gray-400 font-inter">
            {games.length} Active Game{games.length !== 1 ? "s" : ""}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8 text-red-400 text-sm font-inter">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {games.length === 0 ? (
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-12 text-center">
                <i className="fas fa-ghost text-6xl text-[#00E6FF] mb-4" />
                <div className="text-gray-400 font-inter">
                  No active games. The void is empty.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className={`bg-[#0A0014]/80 rounded-lg shadow-lg border cursor-pointer transform transition-all hover:scale-[1.02] ${
                      selectedGame === game.id
                        ? "border-[#FF00FF]"
                        : "border-[#00E6FF]"
                    }`}
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-400 font-inter">
                          Game #{game.id}
                        </span>
                        {game.nsfw_enabled && (
                          <span className="px-2 py-0.5 text-xs bg-red-900/20 text-red-400 rounded-full font-inter">
                            NSFW
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-inter ${
                          game.status === "waiting"
                            ? "bg-yellow-900/20 text-yellow-400"
                            : "bg-[#00E6FF]/20 text-[#00E6FF]"
                        }`}
                      >
                        {game.status === "waiting"
                          ? "Recruiting Degenerates"
                          : "In Progress"}
                      </span>
                    </div>

                    {game.black_card_text && (
                      <div className="mb-4 p-3 bg-[#0A0014] rounded text-[#00E6FF] font-inter text-sm border border-[#00E6FF]">
                        <i className="fas fa-quote-left text-xs mr-2 opacity-50" />
                        {game.black_card_text}
                        <i className="fas fa-quote-right text-xs ml-2 opacity-50" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-300 font-inter mb-2">
                        <i className="fas fa-users mr-2" />
                        Players ({game.player_count}):
                      </div>
                      {game.players &&
                        JSON.parse(game.players).map((player, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-[#0A0014] rounded-lg p-2 border border-[#00E6FF]/20"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-300 font-inter">
                                {player.username}
                              </span>
                              {player.is_czar && (
                                <span className="text-xs bg-[#00E6FF]/20 text-[#00E6FF] px-2 py-0.5 rounded-full font-inter">
                                  <i className="fas fa-crown mr-1" />
                                  Czar
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-[#00E6FF] font-inter">
                                {player.score}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                pts
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Updated Chat Panel */}
          <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
            <div className="flex flex-col h-[600px]">
              <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-4 flex items-center">
                <i className="fas fa-comments mr-3" />
                Game Chat
                <div className="ml-2 relative">
                  <div className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#FF00FF] opacity-75"></div>
                  <div className="relative inline-flex rounded-full h-2 w-2 bg-[#FF00FF]"></div>
                </div>
              </h2>

              {!selectedGame ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 font-inter">
                  <div className="text-center">
                    <i
                      className="fas fa-hand-pointer text-4xl text-[#00E6FF] mb-4"
                      style={{
                        filter: "drop-shadow(0 0 10px #00E6FF)",
                      }}
                    />
                    <div>Select a game to view chat</div>
                  </div>
                </div>
              ) : !user ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 font-inter">
                  <div className="text-center">
                    <i
                      className="fas fa-lock text-4xl text-[#00E6FF] mb-4"
                      style={{
                        filter: "drop-shadow(0 0 10px #00E6FF)",
                      }}
                    />
                    <div>
                      <a
                        href="/signin"
                        className="text-[#00E6FF] hover:text-[#FF00FF] transition-colors"
                      >
                        Sign in
                      </a>
                      &nbsp;to participate in chat
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#00E6FF #0A0014",
                    }}
                  >
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.username === user.username
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 border ${
                            msg.username === user.username
                              ? "bg-[#FF00FF]/10 border-[#FF00FF]/50 text-[#FF00FF]"
                              : "bg-[#00E6FF]/10 border-[#00E6FF]/50 text-[#00E6FF]"
                          }`}
                          style={{
                            boxShadow:
                              msg.username === user.username
                                ? "0 0 10px rgba(255, 0, 255, 0.1)"
                                : "0 0 10px rgba(0, 230, 255, 0.1)",
                          }}
                        >
                          <div className="text-xs opacity-75 mb-1 font-inter">
                            {msg.username}
                          </div>
                          <div className="font-inter">{msg.message}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-inter">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00E6FF] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 rounded-lg font-bold font-inter transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(to right, #00E6FF, #FF00FF)",
                        boxShadow: "0 0 10px rgba(0, 230, 255, 0.3)",
                      }}
                    >
                      <i className="fas fa-paper-plane" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
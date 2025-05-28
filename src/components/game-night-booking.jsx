"use client";
import React from "react";



export default function Index() {
  return (function MainComponent() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    players: 4,
    name: "",
    email: "",
    discordUsername: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/game-night-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to book game night");
      }

      setSuccess(true);
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to book game night. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-8 text-center">
        <i className="fas fa-check-circle text-[#00FF9D] text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-[#00FF9D] font-inter mb-4">
          Game Night Booked!
        </h2>
        <p className="text-gray-300 font-inter">
          Check your email for confirmation details.
        </p>
      </div>
    );
  }

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
                style={{ filter: "drop-shadow(0 0 8px #00FF9D)" }}
              />
            </a>
            <a
              href="/game-monitor"
              className="text-[#00FF9D] hover:text-[#00CC7D] font-inter transition-colors duration-300"
            >
              <i className="fas fa-gamepad mr-2" />
              Game Monitor
            </a>
          </div>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 font-inter mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-inter mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 font-inter mb-2">
            Number of Players
          </label>
          <input
            type="number"
            name="players"
            value={formData.players}
            onChange={handleChange}
            min={minPlayers}
            max={maxPlayers}
            required
            className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Min: {minPlayers}, Max: {maxPlayers} players
          </p>
        </div>

        <div>
          <label className="block text-gray-300 font-inter mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-inter mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-inter mb-2">
            Discord Username
          </label>
          <input
            type="text"
            name="discordUsername"
            value={formData.discordUsername}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-inter mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00FF9D] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin" />
          ) : (
            "Book Game Night"
          )}
        </button>
      </form>
    </div>
  );
}

function StoryComponent() {
  return (
    <div className="min-h-screen bg-[#0F1011] p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <MainComponent
          initialDate={new Date().toISOString().split("T")[0]}
          onSubmit={(data) => console.log("Form submitted:", data)}
        />

        <MainComponent
          initialDate={new Date().toISOString().split("T")[0]}
          minPlayers={6}
          maxPlayers={30}
          onSubmit={(data) => console.log("Form submitted:", data)}
        />
      </div>
    </div>
  );
});
}
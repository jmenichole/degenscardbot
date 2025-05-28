"use client";
import React from "react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [supportFormData, setSupportFormData] = useState({
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch("/api/get-subscription-data", {
          method: "POST",
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setSubscriptionData(data);
      } catch (err) {
        console.error("Failed to fetch subscription data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptionData();
      setUsername(user.username || "");
    }
  }, [user]);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setUsernameError(null);

    try {
      const response = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update username");
      }

      // Show success message or update UI
      setFormStatus((prev) => ({ ...prev, success: true }));
      setTimeout(
        () => setFormStatus((prev) => ({ ...prev, success: false })),
        3000
      );
    } catch (err) {
      setUsernameError(err.message);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch("/api/send-support-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportFormData),
      });

      const data = await response.json();
      if (!data.success)
        throw new Error(data.error || "Failed to send message");

      setFormStatus({ loading: false, error: null, success: true });
      setSupportFormData({ subject: "", message: "" });
    } catch (err) {
      setFormStatus({
        loading: false,
        error: err.message || "Failed to send message",
        success: false,
      });
    }
  };

  const handleSubscribe = async (packageType) => {
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
      setFormStatus({
        loading: false,
        error: "Failed to process payment. Please try again.",
        success: false,
      });
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0014] flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#00E6FF]" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0014] p-6">
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a href="/" className="flex items-center justify-center">
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
            </a>
          </div>
          <a
            href="/game-night-booking"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E6FF] to-[#FF00FF] text-black font-bold font-inter hover:opacity-90 transition-opacity"
          >
            Book Game Night
          </a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        {!subscriptionData?.status || subscriptionData.status === "inactive" ? (
          <div className="mb-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#00FF9D] font-inter mb-4">
                Choose Your Chaos Level
              </h1>
              <p className="text-xl text-gray-400 font-inter">
                Pick a plan that matches your degenerate energy
              </p>
            </div>

            {formStatus.error && (
              <div className="max-w-md mx-auto mb-8 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm font-inter">
                <i className="fas fa-exclamation-circle mr-2" />
                {formStatus.error}
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
                  disabled={formStatus.loading}
                  className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
                >
                  {formStatus.loading ? (
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
                  disabled={formStatus.loading}
                  className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
                >
                  {formStatus.loading ? (
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
                  disabled={formStatus.loading}
                  className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
                >
                  {formStatus.loading ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
                <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
                  <i className="fas fa-user-circle mr-3" />
                  Account Overview
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-[#0F1011] rounded-lg border border-[#2F3136]">
                    <div className="text-gray-300 font-inter">
                      Subscription Status
                    </div>
                    <div className="text-[#00E6FF] font-inter capitalize">
                      {subscriptionData?.status || "Inactive"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#0F1011] rounded-lg border border-[#2F3136]">
                    <div className="text-gray-300 font-inter">Plan</div>
                    <div className="text-[#00E6FF] font-inter">
                      {subscriptionData?.plan_type || "None"}
                    </div>
                  </div>
                  {subscriptionData?.next_payment && (
                    <div className="flex justify-between items-center p-4 bg-[#0F1011] rounded-lg border border-[#2F3136]">
                      <div className="text-gray-300 font-inter">
                        Next Payment
                      </div>
                      <div className="text-[#00E6FF] font-inter">
                        {new Date(
                          subscriptionData.next_payment
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Gamer Tag Section */}
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
                <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
                  <i className="fas fa-gamepad mr-3" />
                  Gamer Profile
                </h2>
                <form onSubmit={handleUsernameSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 font-inter mb-2">
                      Gamer Tag
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose your gamer tag"
                      className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00E6FF] focus:outline-none"
                      required
                    />
                    {usernameError && (
                      <p className="text-red-400 text-sm mt-2">
                        {usernameError}
                      </p>
                    )}
                    {formStatus.success && (
                      <p className="text-[#00FF9D] text-sm mt-2">
                        Gamer tag updated successfully!
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E6FF] to-[#FF00FF] text-black font-bold font-inter hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {formStatus.loading ? (
                      <i className="fas fa-spinner fa-spin" />
                    ) : (
                      "Save Gamer Tag"
                    )}
                  </button>
                </form>
              </div>

              {/* Keep existing Payment History section */}
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
                <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
                  <i className="fas fa-history mr-3" />
                  Payment History
                </h2>
                <div className="space-y-4">
                  {subscriptionData?.payment_history?.length ? (
                    subscriptionData.payment_history.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-4 bg-[#0F1011] rounded-lg border border-[#2F3136]"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-[#00E6FF] font-inter">
                            {payment.type}
                          </div>
                          <div className="text-gray-300 font-inter">
                            ${(payment.amount / 100).toFixed(2)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 font-inter">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 font-inter text-center py-4">
                      No payment history available
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
                <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
                  <i className="fas fa-cog mr-3" />
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <a
                    href="/game-monitor"
                    className="flex items-center justify-between p-4 bg-[#0F1011] rounded-lg border border-[#2F3136] hover:border-[#FF00FF] transition-colors"
                  >
                    <div className="text-gray-300 font-inter">Game Monitor</div>
                    <i className="fas fa-chevron-right text-[#00E6FF]" />
                  </a>
                  <a
                    href="/customization"
                    className="flex items-center justify-between p-4 bg-[#0F1011] rounded-lg border border-[#2F3136] hover:border-[#FF00FF] transition-colors"
                  >
                    <div className="text-gray-300 font-inter">
                      Customize Bot
                    </div>
                    <i className="fas fa-chevron-right text-[#00E6FF]" />
                  </a>
                  <a
                    href="/account/logout"
                    className="flex items-center justify-between p-4 bg-[#0F1011] rounded-lg border border-[#2F3136] hover:border-[#FF00FF] transition-colors"
                  >
                    <div className="text-gray-300 font-inter">Sign Out</div>
                    <i className="fas fa-sign-out-alt text-[#00E6FF]" />
                  </a>
                </div>
              </div>

              {/* Keep existing Contact Support section */}
              <div className="bg-[#0A0014]/80 rounded-lg shadow-lg border border-[#00E6FF] p-6">
                <h2 className="text-2xl font-bold text-[#00E6FF] font-inter mb-6">
                  <i className="fas fa-headset mr-3" />
                  Contact Support
                </h2>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={supportFormData.subject}
                      onChange={(e) =>
                        setSupportFormData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00E6FF] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="How can we help?"
                      value={supportFormData.message}
                      onChange={(e) =>
                        setSupportFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      rows="4"
                      className="w-full px-4 py-2 bg-[#0F1011] border border-[#2F3136] rounded-lg text-white font-inter focus:border-[#00E6FF] focus:outline-none"
                      required
                    />
                  </div>
                  {formStatus.error && (
                    <div className="text-red-400 text-sm font-inter">
                      {formStatus.error}
                    </div>
                  )}
                  {formStatus.success && (
                    <div className="text-[#00E6FF] text-sm font-inter">
                      Message sent successfully!
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className="w-full px-6 py-3 rounded-lg bg-[#00E6FF] hover:bg-[#FF00FF] text-black font-bold font-inter transition-colors disabled:opacity-50"
                  >
                    {formStatus.loading ? (
                      <i className="fas fa-spinner fa-spin" />
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;
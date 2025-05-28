"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [upload, { loading: uploading }] = useUpload();

  const handleLogoUpload = async (file) => {
    try {
      const { url, error } = await upload({ file });
      if (error) throw new Error(error);
      setUploadedLogo(url);
    } catch (err) {
      setError("Failed to upload logo. Please try again.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target);

    try {
      const response = await fetch("/api/send-customization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverName: formData.get("serverName"),
          primaryColor: formData.get("primaryColor"),
          secondaryColor: formData.get("secondaryColor"),
          logoUrl: uploadedLogo,
          deckTheme: formData.get("deckTheme"),
          additionalNotes: formData.get("additionalNotes"),
          email: "jmenichole007@outlook.com",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit customization form");
      }

      setSuccess(true);
      e.target.reset();
      setUploadedLogo(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1011] p-6">
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href="/"
              className="text-[#00FF9D] hover:text-[#00CC7D] font-inter"
            >
              Home
            </a>
            <a
              href="/game-monitor"
              className="text-[#00FF9D] hover:text-[#00CC7D] font-inter"
            >
              <i className="fas fa-gamepad mr-2" />
              Game Monitor
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00FF9D] font-inter mb-4">
            <i className="fas fa-paint-brush mr-3" />
            Customize Your Server
          </h1>
          <p className="text-gray-400 font-inter">
            Server License subscribers can customize their game experience
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm font-inter">
            <i className="fas fa-exclamation-circle mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-[#00FF9D]/20 border border-[#00FF9D] rounded-lg text-[#00FF9D] text-sm font-inter">
            <i className="fas fa-check-circle mr-2" />
            Your customization preferences have been submitted successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-6 space-y-6"
        >
          <div>
            <label className="block text-gray-300 font-inter mb-2 text-sm">
              Server/Community Name
            </label>
            <input
              type="text"
              name="serverName"
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2F3136] bg-[#0F1011] text-gray-100 font-inter text-sm focus:outline-none focus:border-[#00FF9D]"
              placeholder="Enter your server name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 font-inter mb-2 text-sm">
                Primary Color
              </label>
              <input
                type="color"
                name="primaryColor"
                required
                className="w-full h-10 rounded-lg border border-[#2F3136] bg-[#0F1011] cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-inter mb-2 text-sm">
                Secondary Color
              </label>
              <input
                type="color"
                name="secondaryColor"
                required
                className="w-full h-10 rounded-lg border border-[#2F3136] bg-[#0F1011] cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-inter mb-2 text-sm">
              Logo Upload
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleLogoUpload(e.target.files[0]);
                }
              }}
              className="w-full px-4 py-2 rounded-lg border border-[#2F3136] bg-[#0F1011] text-gray-100 font-inter text-sm focus:outline-none focus:border-[#00FF9D]"
            />
            {uploading && (
              <p className="mt-2 text-sm text-gray-400 font-inter">
                <i className="fas fa-spinner fa-spin mr-2" />
                Uploading...
              </p>
            )}
            {uploadedLogo && (
              <div className="mt-2">
                <img
                  src={uploadedLogo}
                  alt="Uploaded logo preview"
                  className="h-20 object-contain rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-300 font-inter mb-2 text-sm">
              Custom Deck Theme Preferences
            </label>
            <textarea
              name="deckTheme"
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[#2F3136] bg-[#0F1011] text-gray-100 font-inter text-sm focus:outline-none focus:border-[#00FF9D]"
              placeholder="Describe your preferred theme for custom cards (e.g., crypto memes, gaming culture, etc.)"
            />
          </div>

          <div>
            <label className="block text-gray-300 font-inter mb-2 text-sm">
              Additional Notes or Requests
            </label>
            <textarea
              name="additionalNotes"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-[#2F3136] bg-[#0F1011] text-gray-100 font-inter text-sm focus:outline-none focus:border-[#00FF9D]"
              placeholder="Any other customization requests or special instructions?"
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full px-6 py-3 rounded-lg bg-[#00FF9D] hover:bg-[#00CC7D] text-black font-bold font-inter transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2" />
                Submitting...
              </span>
            ) : (
              "Submit Customization Preferences"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MainComponent;
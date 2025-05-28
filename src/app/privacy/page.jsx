"use client";
import React from "react";

function MainComponent() {
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

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-8">
          <h1 className="text-3xl font-bold text-[#00FF9D] font-inter mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-300 font-inter">
            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Information We Collect
              </h2>
              <p className="mb-3">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Discord server information</li>
                <li>Email addresses for game night bookings</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Game session data and scores</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To process your payments and bookings</li>
                <li>To send you important updates about our services</li>
                <li>To improve our game experience and customer service</li>
                <li>To maintain game statistics and leaderboards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Data Protection
              </h2>
              <p className="mb-3">
                We implement appropriate security measures to protect your
                personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>
                  Limited access to personal information by authorized personnel
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Third-Party Services
              </h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Discord for game communication</li>
                <li>Stripe for payment processing</li>
                <li>Cloud hosting providers for data storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of your data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="bg-[#0F1011] rounded-lg p-4 mt-2">
                <p>Email: privacy@degensagainstdecency.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#00FF9D] mb-4">
                Updates to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. The latest
                version will always be posted on this page with the effective
                date.
              </p>
              <p className="mt-4">Last updated: January 2025</p>
            </section>
          </div>
        </div>
      </div>

      {/* Update Footer */}
      <div className="text-center mt-8 space-y-4">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="bg-[#000000] rounded-lg p-3">
            <i className="fas fa-skull text-3xl text-white" />
          </div>
        </div>
        <p className="text-gray-400 font-inter">
          <strong>Powered by Degens Against Decency</strong>
        </p>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 font-inter mt-4">
          <a href="/terms" className="hover:text-[#00FF9D]">
            Terms of Service
          </a>
          <span>•</span>
          <a href="/privacy" className="hover:text-[#00FF9D]">
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="https://github.com/sponsors/jmenichole"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#00FF9D] flex items-center"
          >
            <i className="fab fa-github mr-1" />
            Sponsor Dev
          </a>
        </div>
        <p className="text-sm text-gray-500 font-inter">
          © 2025 Degens Against Decency. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default MainComponent;
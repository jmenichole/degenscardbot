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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00FF9D] font-inter mb-4">
            <i className="fas fa-gavel mr-3" />
            Terms of Service
          </h1>
          <p className="text-gray-400 font-inter">Last updated: January 2025</p>
        </div>

        <div className="bg-[#1A1B1E] rounded-lg shadow-lg border border-[#2F3136] p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300 font-inter">
              By accessing and using Degens Against Decency, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-300 font-inter">
              Degens Against Decency is a multiplayer card game service operated
              via Discord. The service includes bot functionality, game hosting,
              and premium features available through various subscription tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 text-gray-300 font-inter space-y-2">
              <li>You must be at least 18 years old to use this service</li>
              <li>
                You are responsible for maintaining the security of your account
              </li>
              <li>
                You agree not to abuse, harass, or discriminate against other
                users
              </li>
              <li>
                You will not attempt to manipulate or exploit game mechanics
              </li>
              <li>You will not use the service for any illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              4. Payment Terms
            </h2>
            <p className="text-gray-300 font-inter mb-4">
              Subscription payments are processed through Stripe. By
              subscribing, you authorize us to charge your chosen payment method
              on a recurring basis until cancelled.
            </p>
            <ul className="list-disc pl-6 text-gray-300 font-inter space-y-2">
              <li>
                Monthly subscriptions are billed at the start of each period
              </li>
              <li>Lifetime licenses are one-time payments</li>
              <li>Game Night bookings are charged upon confirmation</li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              5. Content Guidelines
            </h2>
            <p className="text-gray-300 font-inter">
              While our game is intended to be edgy and humorous, we maintain
              certain content restrictions. Content that promotes hate speech,
              extreme violence, or illegal activities is prohibited and may
              result in service termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-300 font-inter">
              All content, including card text, graphics, and bot functionality,
              remains the property of Degens Against Decency. Users may not
              copy, modify, or distribute our content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              7. Service Modifications
            </h2>
            <p className="text-gray-300 font-inter">
              We reserve the right to modify or discontinue any part of the
              service at any time. Major changes will be communicated through
              Discord or email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              8. Termination
            </h2>
            <p className="text-gray-300 font-inter">
              We may terminate or suspend access to our service immediately,
              without prior notice, for conduct that we believe violates these
              Terms of Service or is harmful to other users or us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#00FF9D] font-inter mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-300 font-inter">
              For questions about these terms, please contact us through our
              Discord server or email at support@degensagainstdecency.com
            </p>
          </section>
        </div>

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
    </div>
  );
}

export default MainComponent;
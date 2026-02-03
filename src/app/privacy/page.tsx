"use client";

import { Navbar } from "@/components/Navbar";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <Navbar />

      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-6">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span
              className="text-sm text-emerald-600"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Your Privacy Matters
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Privacy Policy
          </h1>
          <p
            className="text-stone-500 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Last updated: February 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 space-y-8">
          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              1. Introduction
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Invitely (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              2. Information We Collect
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We collect information that you provide directly to us:
            </p>
            <ul
              className="list-disc list-inside text-stone-600 space-y-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              <li>
                <strong>Account Information:</strong> Email address, name, and password when you
                create an account
              </li>
              <li>
                <strong>Invitation Content:</strong> The messages, names, dates, and other details
                you include in your invitations
              </li>
              <li>
                <strong>Payment Information:</strong> Payment details are processed securely by
                Stripe; we do not store your full credit card information
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our Service,
                including invitation views and responses
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              3. How We Use Your Information
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We use the information we collect to:
            </p>
            <ul
              className="list-disc list-inside text-stone-600 space-y-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Track invitation delivery and responses for your dashboard</li>
              <li>Detect and prevent fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              4. Information Sharing
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We do not sell your personal information. We may share your information only in the
              following circumstances:
            </p>
            <ul
              className="list-disc list-inside text-stone-600 space-y-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              <li>
                <strong>Service Providers:</strong> With third-party vendors who assist us in
                providing the Service (e.g., Stripe for payments, Supabase for data storage)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                sale of assets
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly agree to share information
              </li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              5. Data Security
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We implement appropriate technical and organizational measures to protect your
              personal information against unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the Internet is 100% secure,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              6. Data Retention
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We retain your personal information for as long as your account is active or as
              needed to provide you services. You may request deletion of your account and
              associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              7. Your Rights
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Depending on your location, you may have the following rights:
            </p>
            <ul
              className="list-disc list-inside text-stone-600 space-y-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Request portability of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p
              className="text-stone-600 leading-relaxed mt-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              To exercise these rights, please contact us at the email below.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              8. Cookies and Tracking
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We use essential cookies to maintain your session and remember your preferences.
              We may also use analytics tools to understand how users interact with our Service.
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              9. Children&apos;s Privacy
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Our Service is not intended for children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If we learn we have collected
              such information, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              10. International Data Transfers
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Your information may be transferred to and processed in countries other than your
              own. We ensure appropriate safeguards are in place to protect your information in
              accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              11. Changes to This Policy
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the &quot;Last
              updated&quot; date. We encourage you to review this Policy periodically.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              12. Contact Us
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              If you have any questions about this Privacy Policy or our data practices, please
              contact us at{" "}
              <a
                href="mailto:privacy@invitely.app"
                className="text-rose-500 hover:text-rose-600 underline"
              >
                privacy@invitely.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

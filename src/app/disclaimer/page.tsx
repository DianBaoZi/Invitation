"use client";

import { Navbar } from "@/components/Navbar";
import { AlertCircle } from "lucide-react";

export default function DisclaimerPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full mb-6">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span
              className="text-sm text-amber-600"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Important Information
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Disclaimer
          </h1>
          <p
            className="text-stone-500 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Please read this disclaimer carefully
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 space-y-8">
          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              General Information
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              The information provided on Invitely is for general informational and entertainment
              purposes only. While we strive to keep the information up to date and accurate, we
              make no representations or warranties of any kind about the completeness, accuracy,
              reliability, suitability, or availability of the Service.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              No Guarantees
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              While our invitations are designed to be fun and engaging, we cannot guarantee any
              specific outcome or response from your recipient. The success of your invitation
              depends on many factors outside our control.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              External Links
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Our Service may contain links to external websites that are not provided or
              maintained by us. We do not guarantee the accuracy, relevance, timeliness, or
              completeness of any information on these external websites.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Service Availability
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We strive to maintain the availability of our Service, but we cannot guarantee
              uninterrupted access. The Service may be temporarily unavailable due to maintenance,
              updates, or factors beyond our control.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              User Content
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Users are solely responsible for the content they create and share through our
              platform. We do not endorse or assume responsibility for any user-generated content.
              Please ensure your invitations are appropriate and consensual.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Limitation of Liability
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              In no event shall Invitely, its directors, employees, partners, agents, suppliers,
              or affiliates be liable for any indirect, incidental, special, consequential, or
              punitive damages, including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Changes to This Disclaimer
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We reserve the right to update this disclaimer at any time. Changes will be
              effective immediately upon posting. Your continued use of the Service after any
              changes constitutes acceptance of the new disclaimer.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Contact Us
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              If you have any questions about this disclaimer, please contact us at{" "}
              <a
                href="mailto:legal@invitely.app"
                className="text-rose-500 hover:text-rose-600 underline"
              >
                legal@invitely.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

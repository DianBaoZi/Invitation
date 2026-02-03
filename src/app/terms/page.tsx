"use client";

import { Navbar } from "@/components/Navbar";
import { FileText } from "lucide-react";

export default function TermsPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-500" />
            <span
              className="text-sm text-blue-600"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Legal
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Terms of Use
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
              1. Acceptance of Terms
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              By accessing and using Invitely (&quot;the Service&quot;), you agree to be bound by
              these Terms of Use. If you do not agree to these terms, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              2. Description of Service
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Invitely provides a platform for creating and sharing interactive digital
              invitations. Users can customize templates, generate shareable links, and track
              responses.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              3. Eligibility
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              You must be at least 13 years old to use the Service. If you are under 18, you
              represent that you have your parent or guardian&apos;s permission to use the Service.
              By using the Service, you represent and warrant that you meet these requirements.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              4. User Accounts
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              5. Acceptable Use
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-3"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              You agree not to use the Service to:
            </p>
            <ul
              className="list-disc list-inside text-stone-600 space-y-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              <li>Create content that is illegal, harmful, threatening, or harassing</li>
              <li>Impersonate any person or entity</li>
              <li>Send spam or unsolicited communications</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              6. Intellectual Property
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              All content, designs, and code on Invitely are protected by intellectual property
              laws. You retain ownership of any personal content you upload, but grant us a
              license to use it for providing the Service.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              7. Payments and Refunds
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              Due to the digital nature of our products, all purchases are final and
              non-refundable, except as required by applicable law. All prices are in USD
              unless otherwise stated. We reserve the right to modify pricing at any time,
              but changes will not affect existing purchases.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              8. Limitation of Liability
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              The Service is provided &quot;as is&quot; without warranties of any kind. We are not
              liable for any indirect, incidental, special, or consequential damages arising from
              your use of the Service.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              9. Termination
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We may terminate or suspend your account and access to the Service at our sole
              discretion, without notice, for conduct that we believe violates these Terms or
              is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              10. Governing Law
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              These Terms shall be governed by and construed in accordance with the laws of
              Singapore, without regard to its conflict of law provisions. Any disputes arising
              from these Terms will be resolved in the courts of Singapore.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              11. Changes to Terms
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              We may update these terms from time to time. We will notify users of significant
              changes via email or through the Service. Continued use of the Service after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2
              className="text-xl text-stone-800 mb-3"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              12. Contact
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              For questions about these Terms of Use, please contact us at{" "}
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

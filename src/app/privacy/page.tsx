"use client";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

const sections = [
  { id: "collection", title: "Information We Collect" },
  { id: "usage", title: "How We Use Your Information" },
  { id: "legal-basis", title: "Legal Basis (GDPR)" },
  { id: "sharing", title: "Information Sharing" },
  { id: "security", title: "Data Security" },
  { id: "retention", title: "Data Retention" },
  { id: "rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "do-not-sell", title: "Do Not Sell" },
  { id: "children", title: "Children's Privacy" },
  { id: "international", title: "International Transfers" },
  { id: "changes", title: "Policy Changes" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Your Privacy Matters"
      effectiveDate="February 1, 2025"
      icon="privacy"
      sections={sections}
    >
      <p className="section-intro">
        YoursInvite is committed to protecting your privacy. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your personal information when you use our Service.
      </p>

      <h2 id="collection">1. Information We Collect</h2>
      <p>We collect several types of information from and about users of our Service:</p>

      <h3>1.1 Information You Provide Directly</h3>
      <ul>
        <li>
          <strong>Account Information:</strong> Name, email address, and password when you create an
          account
        </li>
        <li>
          <strong>Profile Information:</strong> Profile picture and display name (if you sign in
          with Google)
        </li>
        <li>
          <strong>Invitation Content:</strong> Messages, recipient names, dates, locations, and
          other details you include in your invitations
        </li>
        <li>
          <strong>Payment Information:</strong> Billing details processed securely by our payment
          processor (Stripe); we do not store your complete credit card number
        </li>
        <li>
          <strong>Communications:</strong> Information you provide when you contact us for support
        </li>
      </ul>

      <h3>1.2 Information Collected Automatically</h3>
      <ul>
        <li>
          <strong>Usage Data:</strong> Pages visited, features used, time spent on the Service, and
          interaction patterns
        </li>
        <li>
          <strong>Device Information:</strong> Browser type, operating system, device type, and
          screen resolution
        </li>
        <li>
          <strong>Log Data:</strong> IP address, access times, referring URLs, and error logs
        </li>
        <li>
          <strong>Invitation Analytics:</strong> Views, responses, and interaction data for your
          invitations
        </li>
      </ul>

      <h2 id="usage">2. How We Use Your Information</h2>
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li>To provide, operate, and maintain the Service</li>
        <li>To process transactions and send related information (receipts, confirmations)</li>
        <li>To create and manage your account</li>
        <li>To track invitation delivery, views, and responses for your dashboard</li>
        <li>To send you technical notices, security alerts, and support messages</li>
        <li>To respond to your comments, questions, and customer service requests</li>
        <li>To analyze usage patterns and improve the Service</li>
        <li>To detect, prevent, and address technical issues, fraud, or abuse</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 id="legal-basis">3. Legal Basis for Processing (GDPR)</h2>
      <p>
        If you are located in the European Economic Area (EEA), we process your personal data based
        on the following legal grounds:
      </p>
      <ul>
        <li>
          <strong>Contract Performance:</strong> Processing necessary to provide you with the
          Service you requested
        </li>
        <li>
          <strong>Legitimate Interests:</strong> Processing necessary for our legitimate business
          interests, such as fraud prevention and service improvement
        </li>
        <li>
          <strong>Consent:</strong> Where you have given us explicit consent to process your data
          for specific purposes
        </li>
        <li>
          <strong>Legal Obligation:</strong> Processing necessary to comply with applicable laws
        </li>
      </ul>

      <h2 id="sharing">4. Information Sharing and Disclosure</h2>
      <div className="legal-notice">
        <p style={{ marginBottom: 0 }}>
          <strong>We do not sell your personal information.</strong>
        </p>
      </div>
      <p>We may share your information only in the following circumstances:</p>
      <ul>
        <li>
          <strong>Service Providers:</strong> With third-party vendors who perform services on our
          behalf:
          <ul className="nested-list">
            <li>Stripe, Inc. — Payment processing</li>
            <li>Supabase, Inc. — Database and authentication services</li>
            <li>Vercel, Inc. — Website hosting</li>
          </ul>
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law, subpoena, or other legal
          process, or to protect our rights, privacy, safety, or property
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of
          all or a portion of our assets
        </li>
        <li>
          <strong>With Your Consent:</strong> When you explicitly authorize us to share your
          information
        </li>
      </ul>

      <h2 id="security">5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational security measures to protect your
        personal information against unauthorized access, alteration, disclosure, or destruction.
        These measures include encryption in transit (TLS/SSL), secure data storage, and access
        controls. However, no method of transmission over the Internet or electronic storage is 100%
        secure, and we cannot guarantee absolute security.
      </p>

      <h2 id="retention">6. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active or as needed to
        provide you services. We will also retain and use your information as necessary to comply
        with legal obligations, resolve disputes, and enforce our agreements. You may request
        deletion of your account and associated data at any time by contacting us. Upon deletion, we
        will remove your personal data within 30 days, except where retention is required by law.
      </p>

      <h2 id="rights">7. Your Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal
        information:
      </p>

      <h3>7.1 Rights for All Users</h3>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate or incomplete data</li>
        <li>Request deletion of your data</li>
        <li>Withdraw consent at any time (where processing is based on consent)</li>
      </ul>

      <h3>7.2 Additional Rights for EEA Residents (GDPR)</h3>
      <ul>
        <li>Right to data portability (receive your data in a structured format)</li>
        <li>Right to object to processing based on legitimate interests</li>
        <li>Right to restrict processing in certain circumstances</li>
        <li>Right to lodge a complaint with a supervisory authority</li>
      </ul>

      <h3>7.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
      <ul>
        <li>Right to know what personal information is collected, used, shared, or sold</li>
        <li>Right to delete personal information held by us</li>
        <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
        <li>Right to non-discrimination for exercising your privacy rights</li>
      </ul>

      <p>
        To exercise any of these rights, please contact us at{" "}
        <a href="mailto:hello@yoursinvite.com">hello@yoursinvite.com</a>. We will respond to your
        request within 30 days.
      </p>

      <h2 id="cookies">8. Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to collect and track information about your
        use of the Service. Types of cookies we use:
      </p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> Necessary for the Service to function (e.g.,
          authentication, security)
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings and preferences
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how users interact with the Service
        </li>
      </ul>
      <p>
        You can control cookie settings through your browser preferences. Note that disabling
        certain cookies may affect the functionality of the Service.
      </p>

      <h2 id="do-not-sell">9. Do Not Sell My Personal Information</h2>
      <p>
        We do not sell, rent, or trade your personal information to third parties for their
        marketing purposes. We do not engage in the &quot;sale&quot; of personal information as
        defined by the California Consumer Privacy Act (CCPA).
      </p>

      <h2 id="children">10. Children&apos;s Privacy</h2>
      <p>
        Our Service is not intended for children under the age of 13. We do not knowingly collect
        personal information from children under 13. If we learn that we have collected personal
        information from a child under 13, we will take steps to delete such information promptly.
        If you believe we have collected information from a child under 13, please contact us
        immediately.
      </p>

      <h2 id="international">11. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of
        residence, including the United States, where data protection laws may differ. When we
        transfer your data internationally, we ensure appropriate safeguards are in place, such as
        Standard Contractual Clauses approved by the European Commission, to protect your
        information in accordance with this Privacy Policy.
      </p>

      <h2 id="changes">12. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by
        posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot;
        above. For material changes, we will provide additional notice, such as via email. We
        encourage you to review this Privacy Policy periodically for any changes.
      </p>

      <h2 id="contact">13. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, your personal data, or wish to exercise
        your privacy rights, please contact us:
      </p>
      <div className="contact-box">
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>YoursInvite Privacy Team</strong>
        </p>
        <p style={{ marginBottom: 0 }}>
          Email: <a href="mailto:hello@yoursinvite.com">hello@yoursinvite.com</a>
        </p>
      </div>
      <p>
        For information about our terms of use, please see our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPageLayout>
  );
}

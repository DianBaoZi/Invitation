"use client";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "eligibility", title: "Eligibility" },
  { id: "account", title: "Account Registration" },
  { id: "payments", title: "Subscription & Payments" },
  { id: "license", title: "License Grant" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "user-content", title: "User Content" },
  { id: "ip", title: "Intellectual Property" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "warranties", title: "Disclaimer of Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "indemnification", title: "Indemnification" },
  { id: "termination", title: "Termination" },
  { id: "governing-law", title: "Governing Law" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      subtitle="Legal Agreement"
      effectiveDate="February 1, 2025"
      icon="terms"
      sections={sections}
    >
      <p className="section-intro">
        Welcome to YoursInvite. These Terms of Service govern your access to and use of our
        platform for creating beautiful, interactive digital invitations.
      </p>

      <h2 id="acceptance">1. Acceptance of Terms</h2>
      <p>
        By accessing or using the Service, you agree to be bound by these Terms and our{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree to these Terms, you may
        not access or use the Service. By clicking &quot;I agree,&quot; creating an account, or
        otherwise using the Service, you acknowledge that you have read, understood, and agree to
        be bound by these Terms.
      </p>

      <h2 id="description">2. Description of Service</h2>
      <p>
        YoursInvite provides a web-based platform that allows users to create, customize, and share
        interactive digital invitations. The Service includes access to invitation templates,
        customization tools, shareable links, and response tracking features.
      </p>

      <h2 id="eligibility">3. Eligibility</h2>
      <p>
        You must be at least 13 years of age to use the Service. If you are between 13 and 18
        years of age (or the age of legal majority in your jurisdiction), you represent that your
        parent or legal guardian has reviewed and agreed to these Terms on your behalf. By using
        the Service, you represent and warrant that you meet these eligibility requirements.
      </p>

      <h2 id="account">4. Account Registration</h2>
      <p>
        To access certain features of the Service, you must create an account. When creating an
        account, you agree to:
      </p>
      <ul>
        <li>Provide accurate, current, and complete information</li>
        <li>Maintain and promptly update your account information</li>
        <li>Maintain the security and confidentiality of your login credentials</li>
        <li>Accept responsibility for all activities that occur under your account</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
      </ul>

      <h2 id="payments">5. Subscription and Payments</h2>
      <p>
        Certain features of the Service require payment. By purchasing a subscription or digital
        product:
      </p>
      <ul>
        <li>You agree to pay all fees associated with your purchase</li>
        <li>All prices are displayed in USD unless otherwise indicated</li>
        <li>
          Payment processing is handled by Stripe, Inc., and is subject to their terms of service
        </li>
        <li>
          Due to the digital nature of our products, all purchases are final and non-refundable,
          except as required by applicable law
        </li>
        <li>We reserve the right to modify pricing at any time with notice to users</li>
      </ul>

      <h2 id="license">6. License Grant</h2>
      <p>
        Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
        non-transferable, revocable license to access and use the Service for your personal,
        non-commercial use. This license does not include the right to:
      </p>
      <ul>
        <li>Resell or make commercial use of the Service or its contents</li>
        <li>Modify, copy, or create derivative works of the Service</li>
        <li>Reverse engineer or access the Service to build a competitive product</li>
        <li>Use any data mining, robots, or similar data gathering methods</li>
      </ul>

      <h2 id="acceptable-use">7. Acceptable Use Policy</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Violate any applicable laws, regulations, or third-party rights</li>
        <li>
          Create, upload, or share content that is unlawful, harmful, threatening, abusive,
          harassing, defamatory, or otherwise objectionable
        </li>
        <li>Impersonate any person or entity or misrepresent your affiliation</li>
        <li>Send unsolicited communications, spam, or promotional materials</li>
        <li>
          Attempt to gain unauthorized access to our systems, servers, or other users&apos;
          accounts
        </li>
        <li>Interfere with or disrupt the Service or its underlying infrastructure</li>
        <li>Use the Service for any fraudulent or deceptive purpose</li>
        <li>Circumvent any access controls or usage limits of the Service</li>
      </ul>

      <h2 id="user-content">8. User Content</h2>
      <p>
        You retain ownership of any content you create or upload through the Service
        (&quot;User Content&quot;). By submitting User Content, you grant us a worldwide,
        non-exclusive, royalty-free license to use, reproduce, modify, and display such content
        solely for the purpose of providing and improving the Service.
      </p>
      <p>You represent and warrant that:</p>
      <ul>
        <li>You own or have the necessary rights to your User Content</li>
        <li>Your User Content does not infringe any third-party rights</li>
        <li>Your User Content complies with these Terms and all applicable laws</li>
      </ul>

      <h2 id="ip">9. Intellectual Property</h2>
      <p>
        The Service and its original content (excluding User Content), features, and functionality
        are and will remain the exclusive property of YoursInvite and its licensors. The Service is
        protected by copyright, trademark, and other intellectual property laws. Our trademarks
        and trade dress may not be used in connection with any product or service without our
        prior written consent.
      </p>

      <h2 id="third-party">10. Third-Party Services</h2>
      <p>
        The Service may integrate with or contain links to third-party websites, services, or
        content that are not owned or controlled by us (including Stripe for payments and Supabase
        for data storage). We are not responsible for the content, privacy policies, or practices
        of any third-party services. Your use of such services is at your own risk and subject to
        the terms of those third parties.
      </p>

      <h2 id="warranties">11. Disclaimer of Warranties</h2>
      <div className="legal-notice">
        <p style={{ marginBottom: 0 }}>
          <strong>
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
            TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
          </strong>{" "}
          We do not warrant that the Service will be uninterrupted, secure, or error-free, or that
          any defects will be corrected.
        </p>
      </div>

      <h2 id="liability">12. Limitation of Liability</h2>
      <div className="legal-notice">
        <p style={{ marginBottom: 0 }}>
          <strong>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL YOURSINVITE, ITS DIRECTORS,
            EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          </strong>{" "}
          including without limitation, loss of profits, data, use, goodwill, or other intangible
          losses, resulting from your access to or use of (or inability to access or use) the
          Service. In no event shall our total liability exceed the amount you paid us, if any, in
          the twelve (12) months preceding the claim.
        </p>
      </div>

      <h2 id="indemnification">13. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless YoursInvite and its officers, directors,
        employees, and agents from and against any claims, liabilities, damages, losses, and
        expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected
        with:
      </p>
      <ul>
        <li>Your access to or use of the Service</li>
        <li>Your violation of these Terms</li>
        <li>Your User Content</li>
        <li>Your violation of any third-party rights</li>
      </ul>

      <h2 id="termination">14. Termination</h2>
      <p>
        We may terminate or suspend your account and access to the Service immediately, without
        prior notice or liability, for any reason, including if you breach these Terms. Upon
        termination, your right to use the Service will immediately cease. All provisions of these
        Terms which by their nature should survive termination shall survive, including ownership
        provisions, warranty disclaimers, indemnification, and limitations of liability.
      </p>

      <h2 id="governing-law">15. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of Singapore,
        without regard to its conflict of law provisions. Any dispute arising from or relating to
        these Terms or the Service shall be resolved exclusively in the courts of Singapore. You
        agree to submit to the personal jurisdiction of such courts.
      </p>

      <h2 id="changes">16. Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time. If we make material
        changes, we will provide notice by posting the updated Terms on the Service and updating
        the &quot;Effective Date&quot; above. We may also notify you via email for significant
        changes. Your continued use of the Service after any changes constitutes acceptance of the
        revised Terms.
      </p>

      <h3>Severability</h3>
      <p>
        If any provision of these Terms is held to be invalid or unenforceable, such provision
        shall be struck and the remaining provisions shall remain in full force and effect.
      </p>

      <h3>Entire Agreement</h3>
      <p>
        These Terms, together with our Privacy Policy, constitute the entire agreement between you
        and YoursInvite regarding your use of the Service and supersede all prior agreements and
        understandings.
      </p>

      <h2 id="contact">17. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us:</p>
      <div className="contact-box">
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>YoursInvite Legal</strong>
        </p>
        <p style={{ marginBottom: 0 }}>
          Email:{" "}
          <a href="mailto:hello@yoursinvite.com">hello@yoursinvite.com</a>
        </p>
      </div>
    </LegalPageLayout>
  );
}

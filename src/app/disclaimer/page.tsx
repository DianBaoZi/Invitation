"use client";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

const sections = [
  { id: "warranties", title: "No Warranties" },
  { id: "results", title: "No Guarantees of Results" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "responsibility", title: "User Responsibility" },
  { id: "external-links", title: "External Links" },
  { id: "availability", title: "Service Availability" },
  { id: "advice", title: "No Professional Advice" },
  { id: "errors", title: "Errors and Omissions" },
  { id: "indemnification", title: "Indemnification" },
  { id: "changes", title: "Changes to Disclaimer" },
  { id: "severability", title: "Severability" },
  { id: "contact", title: "Contact Us" },
];

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      subtitle="Important Notice"
      effectiveDate="February 1, 2025"
      icon="disclaimer"
      sections={sections}
    >
      <p className="section-intro">
        The information provided by Invitely on our website and through our services is for general
        informational and entertainment purposes only. Please read this Disclaimer carefully before
        using the Service.
      </p>

      <h2 id="warranties">1. No Warranties</h2>
      <div className="legal-notice">
        <p style={{ marginBottom: 0 }}>
          <strong>
            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WE
            MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE
            OPERATION OF THE SERVICE, THE ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF ANY
            INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON OR OTHERWISE MADE AVAILABLE
            THROUGH THE SERVICE.
          </strong>{" "}
          To the fullest extent permitted by applicable law, we disclaim all warranties, express or
          implied, including but not limited to implied warranties of merchantability and fitness
          for a particular purpose.
        </p>
      </div>

      <h2 id="results">2. No Guarantees of Results</h2>
      <p>
        While our invitations are designed to be fun, engaging, and memorable, we make no guarantees
        regarding any specific outcome, result, or response from your recipient. The success of your
        invitation depends on many factors outside our control, including but not limited to the
        relationship between you and your recipient, timing, and personal circumstances. We are not
        responsible for the recipient&apos;s response or lack thereof.
      </p>

      <h2 id="liability">3. Limitation of Liability</h2>
      <div className="legal-notice">
        <p style={{ marginBottom: 0 }}>
          <strong>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL INVITELY, ITS
            DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          </strong>{" "}
          or any loss of profits, revenue, data, goodwill, or other intangible losses, arising out
          of or in connection with your use of or inability to use the Service, even if we have been
          advised of the possibility of such damages.
        </p>
      </div>

      <h2 id="responsibility">4. User Responsibility</h2>
      <p>You are solely responsible for:</p>
      <ul>
        <li>
          The content you create, upload, and share through the Service, including all messages,
          images, and personal information
        </li>
        <li>
          Ensuring your invitations are appropriate, respectful, and sent with the recipient&apos;s
          consent in mind
        </li>
        <li>Any consequences that may arise from sending invitations to your recipients</li>
        <li>Compliance with all applicable laws and regulations in your jurisdiction</li>
      </ul>

      <h2 id="external-links">5. External Links</h2>
      <p>
        The Service may contain links to external websites or services that are not owned or
        controlled by Invitely. We have no control over, and assume no responsibility for, the
        content, privacy policies, or practices of any third-party websites or services. We do not
        warrant the accuracy, completeness, or reliability of any information found on external
        websites. Your use of third-party websites is at your own risk.
      </p>

      <h2 id="availability">6. Service Availability</h2>
      <p>
        We strive to maintain the availability of our Service, but we do not guarantee that the
        Service will be available at all times or without interruption. The Service may be
        temporarily unavailable due to scheduled maintenance, system updates, technical issues, or
        circumstances beyond our control. We shall not be liable for any loss or damage arising from
        Service unavailability.
      </p>

      <h2 id="advice">7. No Professional Advice</h2>
      <p>
        The content provided through the Service is for entertainment and informational purposes
        only. Nothing on the Service constitutes professional relationship advice, legal advice, or
        any other form of professional advice. You should not rely on the Service as a substitute
        for professional consultation in matters related to personal relationships or other
        important decisions.
      </p>

      <h2 id="errors">8. Errors and Omissions</h2>
      <p>
        While we make reasonable efforts to ensure the accuracy of information on the Service, we do
        not warrant that the content is free from errors, omissions, or inaccuracies. The Service
        may contain typographical errors, technical inaccuracies, or outdated information. We
        reserve the right to make changes, corrections, and improvements to the Service at any time
        without notice.
      </p>

      <h2 id="indemnification">9. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Invitely and its officers, directors,
        employees, agents, and affiliates from and against any and all claims, damages, losses,
        costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to
        your use of the Service, your violation of this Disclaimer or our Terms of Service, or your
        violation of any rights of a third party.
      </p>

      <h2 id="changes">10. Changes to This Disclaimer</h2>
      <p>
        We reserve the right to update or modify this Disclaimer at any time without prior notice.
        Any changes will be effective immediately upon posting the revised Disclaimer on this page
        with an updated &quot;Effective Date.&quot; Your continued use of the Service following any
        changes constitutes your acceptance of the revised Disclaimer.
      </p>

      <h2 id="severability">11. Severability</h2>
      <p>
        If any provision of this Disclaimer is found to be invalid, illegal, or unenforceable, the
        remaining provisions shall continue in full force and effect.
      </p>

      <h2 id="contact">12. Contact Us</h2>
      <p>If you have any questions about this Disclaimer, please contact us:</p>
      <div className="contact-box">
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Invitely Legal</strong>
        </p>
        <p style={{ marginBottom: 0 }}>
          Email: <a href="mailto:legal@invitely.app">legal@invitely.app</a>
        </p>
      </div>
      <p>
        For more information about your rights and obligations, please review our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPageLayout>
  );
}

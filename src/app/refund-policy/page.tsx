"use client";

import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import Link from "next/link";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "digital-products", title: "Digital Products" },
  { id: "eligible-refunds", title: "Eligible Refunds" },
  { id: "refund-process", title: "Refund Process" },
  { id: "timeframe", title: "Refund Timeframe" },
  { id: "contact", title: "Contact Us" },
];

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      subtitle="Purchase Terms"
      effectiveDate="February 1, 2025"
      icon="terms"
      sections={sections}
    >
      <p className="section-intro">
        We want you to be completely satisfied with your purchase. This policy outlines
        our refund terms for digital products purchased on YoursInvite.
      </p>

      <h2 id="overview">1. Overview</h2>
      <p>
        Due to the digital nature of our products, all purchases are generally final once
        the digital content has been accessed or downloaded. However, we understand that
        issues may arise, and we are committed to ensuring customer satisfaction.
      </p>

      <h2 id="digital-products">2. Digital Products</h2>
      <p>
        Our digital products include:
      </p>
      <ul>
        <li><strong>Single Template:</strong> One-time purchase of a premium invitation template (1.99 USD)</li>
        <li><strong>Lifetime Access:</strong> Unlimited access to all templates forever (3.99 USD)</li>
      </ul>
      <p>
        Once a template has been customized and an invitation link has been generated,
        the product is considered &quot;delivered&quot; and is not eligible for a refund under
        normal circumstances.
      </p>

      <h2 id="eligible-refunds">3. Eligible Refunds</h2>
      <p>
        We may issue refunds in the following circumstances:
      </p>
      <ul>
        <li><strong>Technical Issues:</strong> If a technical problem on our end prevents you from
        accessing or using your purchased template, and we cannot resolve the issue</li>
        <li><strong>Duplicate Purchases:</strong> If you accidentally purchased the same template twice</li>
        <li><strong>Payment Errors:</strong> If you were charged incorrectly or multiple times for
        a single purchase</li>
        <li><strong>Service Unavailability:</strong> If the service becomes unavailable before you
        could use your purchased template</li>
      </ul>

      <h2 id="refund-process">4. Refund Process</h2>
      <p>
        To request a refund:
      </p>
      <ol>
        <li>Contact us at <a href="mailto:hello@yoursinvite.com">hello@yoursinvite.com</a> within
        7 days of your purchase</li>
        <li>Include your order confirmation email or transaction ID</li>
        <li>Describe the issue you encountered</li>
        <li>We will review your request and respond within 2-3 business days</li>
      </ol>

      <h2 id="timeframe">5. Refund Timeframe</h2>
      <p>
        If your refund request is approved:
      </p>
      <ul>
        <li>Refunds will be processed to the original payment method</li>
        <li>Processing time is typically 5-10 business days, depending on your bank or payment provider</li>
        <li>Once a refund is issued, access to the purchased template(s) will be revoked</li>
      </ul>

      <h2 id="contact">6. Contact Us</h2>
      <p>
        If you have any questions about our refund policy or need assistance with a purchase,
        please contact us:
      </p>
      <ul>
        <li>Email: <a href="mailto:hello@yoursinvite.com">hello@yoursinvite.com</a></li>
      </ul>
      <p>
        We are committed to resolving any issues and ensuring you have a positive experience
        with YoursInvite. Please don&apos;t hesitate to reach out if you encounter any problems.
      </p>

      <p className="mt-8 text-sm text-stone-500">
        This refund policy is subject to our{" "}
        <Link href="/terms" className="text-rose-500 hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    </LegalPageLayout>
  );
}

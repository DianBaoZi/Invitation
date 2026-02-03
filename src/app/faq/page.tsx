"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I create an invitation?",
    answer:
      "Simply browse our templates, choose one you love, and click to customize it. You can add your personal message, set the date and location, and share the unique link with your special someone.",
  },
  {
    question: "Are the invitations really interactive?",
    answer:
      "Yes! Each template features unique interactions — from runaway buttons that dodge clicks to scratch-off reveals and mini-games. These playful elements make the experience memorable and fun.",
  },
  {
    question: "Can I customize the text and details?",
    answer:
      "Absolutely! You can personalize the recipient's name, your message, date, time, location, and more. Each template has different customization options to make it truly yours.",
  },
  {
    question: "How do I share my invitation?",
    answer:
      "After creating your invitation, you'll receive a unique link that you can share via text, email, social media, or any messaging app. The recipient simply clicks the link to view their interactive invitation.",
  },
  {
    question: "What's the difference between free and paid templates?",
    answer:
      "Free templates offer basic interactivity and customization. Paid templates include premium interactions, more customization options, and exclusive designs. The lifetime pass gives you access to all current and future templates.",
  },
  {
    question: "Can I see a preview before purchasing?",
    answer:
      "Yes! You can preview any template before purchasing. Click on a template card to see a full demo of its interactions and design.",
  },
  {
    question: "What happens after my recipient responds?",
    answer:
      "You'll be able to see their response on your dashboard. Some templates also include fun confirmation animations when they say yes!",
  },
  {
    question: "Can I edit my invitation after creating it?",
    answer:
      "Yes, you can edit your invitation anytime from your dashboard. Changes are reflected immediately on the shared link.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the digital nature of our products, all purchases are final. However, if you experience technical issues that prevent you from using the Service, please contact us and we'll do our best to help resolve the problem.",
  },
  {
    question: "Will there be more templates in the future?",
    answer:
      "Yes! We're constantly creating new templates. Lifetime pass holders get access to all future templates at no extra cost.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:bg-stone-50 transition-colors px-2 -mx-2 rounded-lg"
      >
        <span
          className="text-stone-800 pr-4"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-stone-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p
              className="pb-5 text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-purple-500" />
            <span
              className="text-sm text-purple-600"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Got Questions?
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Frequently Asked Questions
          </h1>
          <p
            className="text-stone-500 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Everything you need to know about Invitely
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p
            className="text-stone-500"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px" }}
          >
            Still have questions?{" "}
            <a
              href="mailto:hello@invitely.app"
              className="text-rose-500 hover:text-rose-600 underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

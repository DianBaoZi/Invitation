"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ChevronUp, FileText, Shield, AlertCircle, Heart } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

interface LegalPageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  effectiveDate: string;
  icon: "terms" | "privacy" | "disclaimer";
  sections: Section[];
}

const iconMap = {
  terms: FileText,
  privacy: Shield,
  disclaimer: AlertCircle,
};

const colorMap = {
  terms: {
    bg: "bg-rose-50/80",
    text: "text-rose-700",
    border: "border-rose-200",
    accent: "#be123c",
  },
  privacy: {
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    border: "border-emerald-200",
    accent: "#059669",
  },
  disclaimer: {
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    border: "border-amber-200",
    accent: "#d97706",
  },
};

export function LegalPageLayout({
  children,
  title,
  subtitle,
  effectiveDate,
  icon,
  sections,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const Icon = iconMap[icon];
  const colors = colorMap[icon];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Find active section
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#fdfcfa]">
      <Navbar />

      {/* Elegant gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/30 via-transparent to-stone-50/50" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative top border */}
      <div
        className="fixed top-[57px] left-0 right-0 h-[2px] z-40"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.accent}40, transparent)`,
        }}
      />

      <div className="relative z-10 pt-20">
        {/* Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-12 pb-16 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Decorative flourish */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span
                className="block h-px w-16 sm:w-24"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.accent}60)`,
                }}
              />
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`p-3 rounded-full ${colors.bg} ${colors.border} border`}
              >
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </motion.div>
              <span
                className="block h-px w-16 sm:w-24"
                style={{
                  background: `linear-gradient(90deg, ${colors.accent}60, transparent)`,
                }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: colors.accent,
              }}
            >
              {subtitle}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl text-stone-800 mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-stone-500 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Effective {effectiveDate}
            </motion.p>

            {/* Quick links to other legal pages */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <span className="text-stone-400">Also see:</span>
              {icon !== "terms" && (
                <Link
                  href="/terms"
                  className="text-stone-500 hover:text-rose-600 transition-colors"
                >
                  Terms of Service
                </Link>
              )}
              {icon !== "privacy" && (
                <Link
                  href="/privacy"
                  className="text-stone-500 hover:text-rose-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              )}
              {icon !== "disclaimer" && (
                <Link
                  href="/disclaimer"
                  className="text-stone-500 hover:text-rose-600 transition-colors"
                >
                  Disclaimer
                </Link>
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* Main content area with sidebar */}
        <div className="max-w-6xl mx-auto px-4 pb-24">
          <div className="flex gap-12">
            {/* Table of Contents - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="sticky top-28">
                <p
                  className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-4 pb-2 border-b border-stone-200"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === section.id
                          ? `${colors.bg} ${colors.text}`
                          : "text-stone-500 hover:text-stone-800 hover:bg-stone-100/50"
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      <span className="opacity-50 mr-2">{index + 1}.</span>
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1 min-w-0"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-stone-100/80 overflow-hidden">
                {/* Decorative header bar */}
                <div
                  className="h-1"
                  style={{
                    background: `linear-gradient(90deg, ${colors.accent}20, ${colors.accent}60, ${colors.accent}20)`,
                  }}
                />
                <div className="p-8 sm:p-12 legal-content">{children}</div>
              </div>

              {/* Footer */}
              <div className="mt-12 text-center">
                <div className="flex items-center justify-center gap-2 text-stone-400 mb-4">
                  <Heart className="w-4 h-4 text-rose-300" />
                </div>
                <p
                  className="text-sm text-stone-500"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Questions? Contact us at{" "}
                  <a
                    href="mailto:hello@yoursinvite.com"
                    className="text-rose-500 hover:text-rose-600 underline decoration-rose-200 underline-offset-2"
                  >
                    hello@yoursinvite.com
                  </a>
                </p>
              </div>
            </motion.article>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
        }}
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full ${colors.bg} ${colors.border} border shadow-lg hover:shadow-xl transition-shadow z-50`}
        style={{ pointerEvents: showBackToTop ? "auto" : "none" }}
      >
        <ChevronUp className={`w-5 h-5 ${colors.text}`} />
      </motion.button>

      {/* Global styles for legal content */}
      <style jsx global>{`
        .legal-content {
          font-family: "Cormorant Garamond", Georgia, serif;
          color: #57534e;
          line-height: 1.8;
        }

        .legal-content .section-intro {
          font-size: 1.125rem;
          color: #44403c;
          border-left: 3px solid ${colors.accent}40;
          padding-left: 1.25rem;
          margin-bottom: 2.5rem;
          font-style: italic;
        }

        .legal-content h2 {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: #292524;
          margin-top: 3rem;
          margin-bottom: 1rem;
          padding-top: 2rem;
          border-top: 1px solid #e7e5e4;
          scroll-margin-top: 100px;
        }

        .legal-content h2:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .legal-content h3 {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 1.125rem;
          font-weight: 500;
          color: #44403c;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }

        .legal-content p {
          margin-bottom: 1.25rem;
          font-size: 1.0625rem;
        }

        .legal-content ul,
        .legal-content ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }

        .legal-content li {
          margin-bottom: 0.5rem;
          font-size: 1.0625rem;
        }

        .legal-content ul li {
          list-style-type: disc;
        }

        .legal-content ul li::marker {
          color: ${colors.accent}80;
        }

        .legal-content a {
          color: #e11d48;
          text-decoration: underline;
          text-decoration-color: #fecdd3;
          text-underline-offset: 3px;
          transition: all 0.2s;
        }

        .legal-content a:hover {
          color: #be123c;
          text-decoration-color: #e11d48;
        }

        .legal-content .legal-notice {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          font-size: 0.9375rem;
        }

        .legal-content .nested-list {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }

        .legal-content .nested-list li {
          font-size: 1rem;
          color: #78716c;
        }

        .legal-content .contact-box {
          background: linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%);
          border: 1px solid #fce7f3;
          border-radius: 1rem;
          padding: 1.5rem 2rem;
          margin-top: 1.5rem;
        }

        .legal-content strong {
          color: #44403c;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}

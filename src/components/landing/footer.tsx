"use client";

import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Footer Content */}
      <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <img
                  src="/logo.svg"
                  alt="YoursInvite"
                  className="h-16 w-auto brightness-0 invert group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <p className="text-gray-400 max-w-sm font-sans leading-relaxed">
                Create beautiful, interactive Valentine&apos;s Day invitations that
                make saying yes irresistible. Spread love with a touch of fun and
                magic!
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 font-sans">
                Product
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "About", href: "/about" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors font-sans text-sm flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 font-sans">
                Legal
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Use", href: "/terms" },
                  { label: "Refund Policy", href: "/refund-policy" },
                  { label: "Disclaimer", href: "/disclaimer" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors font-sans text-sm flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex justify-center items-center">
              <p className="text-sm text-gray-500 font-sans">
                © {new Date().getFullYear()} YoursInvite. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

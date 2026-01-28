"use client";

import Link from "next/link";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-pink-500 to-rose-500" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        {/* Floating hearts */}
        <div className="absolute top-10 left-[10%] opacity-20 animate-float-slow">
          <Heart className="w-12 h-12 text-white fill-white" />
        </div>
        <div className="absolute bottom-10 right-[15%] opacity-20 animate-float delay-500">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="absolute top-1/2 right-[5%] opacity-15 animate-float-reverse">
          <Sparkles className="w-10 h-10 text-yellow-300" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <Heart className="w-4 h-4 text-white fill-white" />
            <span className="text-sm font-medium text-white font-sans">
              Spread the Love
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Ready to Create
            <br />
            Something Beautiful?
          </h2>

          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            Join thousands of people who&apos;ve made their loved ones smile with
            our playful, interactive invitations. Start creating yours today!
          </p>

          <Button
            size="lg"
            asChild
            className="group bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-base h-14 px-10 rounded-full font-semibold"
          >
            <Link href="/create" className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Create Your Invitation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight font-sans">
                    Invitation
                  </span>
                  <p className="text-xs text-gray-500 font-sans">Say yes to love</p>
                </div>
              </Link>
              <p className="text-gray-400 max-w-sm font-sans leading-relaxed">
                Create beautiful, interactive Valentine&apos;s Day invitations that
                make saying yes irresistible. Spread love with a touch of fun and
                magic!
              </p>

              {/* Social icons placeholder */}
              <div className="flex gap-4 mt-6">
                {["twitter", "instagram", "tiktok"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                  >
                    <Heart className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6 font-sans">
                Product
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Create Invite", href: "/create" },
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
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 font-sans">
                © {new Date().getFullYear()} Invitation. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 font-sans flex items-center gap-2">
                Made with
                <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" />
                for lovers everywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

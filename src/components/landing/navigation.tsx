"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-2"
          : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-slate-200/50"
              : "px-2 py-2"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-3 group ${
              mounted ? "animate-fade-in-left" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight font-sans">
                Invitely
              </span>
              <span className="text-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-medium -mt-1 tracking-widest uppercase">
                Interactive Invites
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div
            className={`hidden md:flex items-center gap-1 ${
              mounted ? "animate-fade-in-up delay-200" : ""
            }`}
          >
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#pricing", label: "Pricing" },
            ].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-1/2 transition-all duration-300" />
                <span className="absolute bottom-0 right-1/2 w-0 h-0.5 bg-gradient-to-l from-purple-500 to-indigo-500 group-hover:w-1/2 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex items-center gap-3 ${
              mounted ? "animate-fade-in-right delay-300" : ""
            }`}
          >
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Button
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link href="/create" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Create Invite</span>
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

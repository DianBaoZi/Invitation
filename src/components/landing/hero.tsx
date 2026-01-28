"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Play, Gift, Cake, PartyPopper, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Floating decorations
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-[5%] animate-float opacity-20">
        <Star className="w-24 h-24 text-amber-400 fill-amber-400" />
      </div>
      <div className="absolute top-40 right-[10%] animate-float-slow delay-300 opacity-15">
        <Sparkles className="w-16 h-16 text-purple-400" />
      </div>
      <div className="absolute top-[60%] left-[8%] animate-float-reverse opacity-25">
        <Gift className="w-10 h-10 text-blue-400" />
      </div>
      <div className="absolute top-[30%] right-[5%] animate-float delay-500 opacity-20">
        <PartyPopper className="w-12 h-12 text-pink-400" />
      </div>
      <div className="absolute bottom-40 left-[15%] animate-float-slow delay-700 opacity-15">
        <Cake className="w-10 h-10 text-orange-400" />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-[45%] right-[15%] w-4 h-4 rounded-full bg-yellow-400/30 animate-pulse" />
      <div className="absolute top-[25%] left-[20%] w-3 h-3 rounded-full bg-purple-400/20 animate-pulse delay-300" />
      <div className="absolute bottom-[30%] right-[25%] w-2 h-2 rounded-full bg-pink-400/40 animate-pulse delay-500" />
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50/50" />

      {/* Decorative blob shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/40 to-pink-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 to-emerald-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <FloatingDecorations />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:space-y-10">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 ${
                mounted ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Interactive Invitations Made Easy
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight ${
                mounted ? "animate-fade-in-up delay-100" : "opacity-0"
              }`}
            >
              Create Invites{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent">They Can&apos;t</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8.5C50 2 150 2 198 8.5"
                    stroke="url(#underline-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="underline-gradient"
                      x1="0"
                      y1="0"
                      x2="200"
                      y2="0"
                    >
                      <stop stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 bg-clip-text text-transparent">Say No To</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-sans ${
                mounted ? "animate-fade-in-up delay-200" : "opacity-0"
              }`}
            >
              Design playful, interactive invitations with
              buttons that <span className="text-purple-600 font-medium">run away</span>,{" "}
              <span className="text-pink-600 font-medium">confetti explosions</span>,{" "}
              <span className="text-indigo-600 font-medium">scratch reveals</span>,
              and magical moments that make saying &ldquo;yes&rdquo; irresistible.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                mounted ? "animate-fade-in-up delay-300" : "opacity-0"
              }`}
            >
              <Button
                size="lg"
                asChild
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 border-0 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-1 text-base h-14 px-8 rounded-full"
              >
                <Link href="/create" className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="group border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-foreground h-14 px-8 rounded-full transition-all duration-300"
              >
                <Link href="#how-it-works" className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-200 group-hover:to-indigo-200 transition-colors">
                    <Play className="w-3 h-3 text-purple-600 ml-0.5" />
                  </span>
                  <span>See How It Works</span>
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div
              className={`flex items-center gap-6 pt-4 ${
                mounted ? "animate-fade-in-up delay-400" : "opacity-0"
              }`}
            >
              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {[
                  "from-purple-400 to-indigo-500",
                  "from-pink-400 to-rose-500",
                  "from-amber-400 to-orange-500",
                  "from-emerald-400 to-teal-500",
                  "from-blue-400 to-indigo-500",
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} border-[3px] border-white shadow-md hover:scale-110 hover:z-10 transition-transform cursor-pointer`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  <span className="font-bold text-foreground">2,847</span> invites
                  created this week
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Video Demo */}
          <div
            className={`relative ${
              mounted ? "animate-fade-in-right delay-200" : "opacity-0"
            }`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 via-pink-200/50 to-indigo-200/50 rounded-[2.5rem] blur-3xl scale-95" />

            {/* Video container with phone mockup */}
            <div className="relative">
              {/* Phone frame */}
              <div className="relative mx-auto w-[300px] sm:w-[340px] lg:w-[380px]">
                {/* Phone body */}
                <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-slate-900/30">
                  {/* Screen bezel */}
                  <div className="relative bg-slate-800 rounded-[2.5rem] overflow-hidden">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-2xl z-10" />

                    {/* Video container */}
                    <div className="relative aspect-[9/19.5] bg-gradient-to-br from-purple-100 via-white to-indigo-100 overflow-hidden">
                      {/* Video element */}
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src="/videos/Invitation.mp4" type="video/mp4" />
                        {/* Fallback content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center animate-pulse">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                            <p className="text-slate-600 font-medium">Interactive Demo</p>
                          </div>
                        </div>
                      </video>
                    </div>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-700 rounded-full" />
              </div>
            </div>

            {/* Floating feature badges */}
            <div className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-slate-200/50 animate-float-slow hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-sans">Interactive</p>
                  <p className="text-sm font-semibold text-slate-800 font-sans">
                    Confetti Effects
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-slate-200/50 animate-float delay-500 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-sans">Fun Feature</p>
                  <p className="text-sm font-semibold text-slate-800 font-sans">
                    Runaway Buttons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground font-sans uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-purple-300 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        </div>
      </div>
    </section>
  );
}

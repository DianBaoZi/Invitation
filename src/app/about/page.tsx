"use client";

import { Navbar } from "@/components/Navbar";
import { Heart, Sparkles, Users, Zap } from "lucide-react";

export default function AboutPage() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full mb-6">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span
              className="text-sm text-rose-600"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Our Story
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl text-stone-900 mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            About YoursInvite
          </h1>
          <p
            className="text-stone-500 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Making invitations memorable and interactive
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h2
              className="text-2xl text-stone-800 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Our Mission
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
            >
              We believe that invitations should be more than just a message — they should be
              an experience. That&apos;s why we created YoursInvite — a platform that transforms
              simple invitations into memorable, interactive moments that make saying
              &quot;yes&quot; irresistible.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h2
              className="text-2xl text-stone-800 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              What We Do
            </h2>
            <p
              className="text-stone-600 leading-relaxed mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
            >
              We craft beautiful, interactive digital invitations for any occasion — dates,
              proposals, parties, or just because. Each template is designed with care to
              create moments of joy, surprise, and delight.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-rose-50">
                <Sparkles className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p
                  className="text-stone-700 text-sm"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Unique Templates
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-50">
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p
                  className="text-stone-700 text-sm"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Interactive Elements
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-amber-50">
                <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p
                  className="text-stone-700 text-sm"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Personal Touch
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h2
              className="text-2xl text-stone-800 mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Contact Us
            </h2>
            <p
              className="text-stone-600 leading-relaxed"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
            >
              Have questions, feedback, or just want to say hello? We&apos;d love to hear from you.
              Reach out to us at{" "}
              <a
                href="mailto:hello@yoursinvite.com"
                className="text-rose-500 hover:text-rose-600 underline"
              >
                hello@yoursinvite.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Heart, Crown, Zap, Star } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying things out",
    features: [
      "Basic text & button elements",
      "5 beautiful backgrounds",
      "Standard animations",
      "Share via unique link",
      "Mobile-responsive design",
    ],
    cta: "Start Free",
    popular: false,
    icon: Heart,
  },
  {
    name: "Premium",
    price: "$2.99",
    period: "one-time",
    description: "Everything you need for the perfect invite",
    features: [
      "All interactive elements",
      "Runaway button magic",
      "Confetti explosions",
      "Custom music upload",
      "No watermark",
      "Priority support",
      "Unlimited edits forever",
    ],
    cta: "Get Premium",
    popular: true,
    icon: Crown,
  },
  {
    name: "Premium Plus",
    price: "$7.99",
    period: "one-time",
    description: "Ultimate features for special occasions",
    features: [
      "Everything in Premium",
      "Exclusive premium templates",
      "Custom domain for invites",
      "RSVP tracking & analytics",
      "Guest list management",
      "Multiple invite variations",
      "White-glove support",
      "Early access to new features",
    ],
    cta: "Go Premium Plus",
    popular: false,
    highlight: true,
    icon: Star,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/30 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />

      {/* Floating decorations */}
      <div className="absolute top-20 right-[10%] opacity-10 animate-float-slow">
        <Heart className="w-20 h-20 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-32 left-[5%] opacity-10 animate-float delay-500">
        <Sparkles className="w-16 h-16 text-yellow-500" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-rose rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary font-sans">
              Simple Pricing
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Choose Your
            <br />
            <span className="text-gradient">Love Plan</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Start for free or unlock premium features for just the price of a
            coffee. No subscriptions, no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative group ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-pink-500 text-white text-sm font-semibold rounded-full shadow-romantic font-sans">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Premium Plus badge */}
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg font-sans">
                    <Star className="w-4 h-4 fill-white" />
                    Best Value
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full rounded-2xl p-5 lg:p-6 transition-all duration-500 ${
                  plan.popular
                    ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-romantic-lg"
                    : plan.highlight
                    ? "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 shadow-romantic-lg"
                    : "bg-white border border-gray-100 shadow-romantic hover:shadow-romantic-lg"
                }`}
              >
                {/* Grid pattern for premium */}
                {plan.popular && (
                  <div
                    className="absolute inset-0 rounded-3xl opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                      backgroundSize: "20px 20px",
                    }}
                  />
                )}

                {/* Decorative glow for premium */}
                {plan.popular && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary via-pink-500 to-primary rounded-[1.75rem] opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                )}

                {/* Decorative glow for premium plus */}
                {plan.highlight && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-[1.75rem] opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                )}

                <div className="relative">
                  {/* Icon & Plan name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        plan.popular
                          ? "bg-gradient-to-br from-primary to-pink-500"
                          : plan.highlight
                          ? "bg-gradient-to-br from-amber-400 to-orange-500"
                          : "bg-gradient-to-br from-gray-100 to-gray-200"
                      }`}
                    >
                      <plan.icon
                        className={`w-5 h-5 ${
                          plan.popular || plan.highlight ? "text-white" : "text-gray-600"
                        } ${plan.popular || plan.highlight ? "fill-white" : ""}`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          plan.popular ? "text-white" : "text-foreground"
                        }`}
                      >
                        {plan.name}
                      </h3>
                      <p
                        className={`text-sm font-sans ${
                          plan.popular ? "text-gray-400" : "text-muted-foreground"
                        }`}
                      >
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl lg:text-4xl font-bold tracking-tight ${
                          plan.popular ? "text-white" : "text-foreground"
                        }`}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span
                          className={`text-sm font-sans ${
                            plan.popular ? "text-gray-400" : "text-muted-foreground"
                          }`}
                        >
                          / {plan.period}
                        </span>
                      )}
                    </div>
                    {(plan.popular || plan.highlight) && (
                      <p className={`text-xs mt-1 font-sans font-medium ${plan.highlight ? "text-amber-600" : "text-primary"}`}>
                        Pay once, use forever
                      </p>
                    )}
                  </div>

                  {/* Decorative line */}
                  <div
                    className={`h-px mb-4 ${
                      plan.popular
                        ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent"
                        : "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
                    }`}
                  />

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            plan.popular
                              ? "bg-primary/20"
                              : plan.highlight
                              ? "bg-amber-500/20"
                              : "bg-primary/10"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              plan.highlight ? "text-amber-600" : "text-primary"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-sm font-sans ${
                            plan.popular ? "text-gray-300" : "text-muted-foreground"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className={`w-full h-12 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-pink-500 hover:from-primary hover:to-pink-400 text-white shadow-romantic hover:shadow-xl hover:-translate-y-0.5"
                        : plan.highlight
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                    asChild
                  >
                    <Link href="/create" className="flex items-center justify-center gap-2">
                      {plan.popular && <Sparkles className="w-4 h-4" />}
                      {plan.highlight && <Star className="w-4 h-4" />}
                      {plan.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-muted-foreground font-sans">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm">All Major Cards Accepted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">Instant Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}

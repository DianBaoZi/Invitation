"use client";

import { Palette, Wand2, Send, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Palette,
    step: "01",
    title: "Choose Your Elements",
    description:
      "Pick from our beautiful collection of text styles, interactive buttons, images, and romantic decorations.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Design Your Invite",
    description:
      "Drag and drop elements onto the canvas. Customize colors, add playful animations, and make it uniquely yours.",
    color: "from-primary to-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    icon: Send,
    step: "03",
    title: "Share the Magic",
    description:
      "Get your unique invitation link and share it with your special someone. Watch the magic happen!",
    color: "from-orange-400 to-rose-500",
    bgColor: "bg-orange-50",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-white to-secondary/20" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-rose rounded-full mb-6">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary font-sans">
              Simple & Sweet
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Three Steps to
            <br />
            <span className="text-gradient">Capture Their Heart</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Create your perfect Valentine&apos;s invitation in minutes, not hours.
            No design experience needed.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
            <div className="h-full bg-gradient-to-r from-violet-200 via-pink-200 to-orange-200 rounded-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-primary to-orange-400 rounded-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative group">
                {/* Step Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-romantic hover:shadow-romantic-lg transition-all duration-500 border border-gray-100">
                  {/* Step number badge */}
                  <div className="absolute -top-5 left-8 z-10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm font-sans">{item.step}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground font-sans leading-relaxed">
                    {item.description}
                  </p>

                  {/* Decorative corner */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-tl-[100px] rounded-br-3xl transition-opacity duration-500`} />
                </div>

                {/* Connector arrow - mobile */}
                {index < steps.length - 1 && (
                  <div className="flex md:hidden justify-center my-6">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                    </div>
                  </div>
                )}

                {/* Timeline dot - desktop */}
                <div className="hidden lg:flex absolute -bottom-16 left-1/2 -translate-x-1/2 flex-col items-center">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} shadow-lg ring-4 ring-white`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 glass rounded-3xl shadow-romantic">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Ready to make them smile?
              </h3>
              <p className="text-muted-foreground font-sans">
                Start creating your Valentine&apos;s invitation now — it&apos;s free!
              </p>
            </div>

            <Button
              size="lg"
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-pink-500 hover:from-primary hover:to-pink-400 border-0 shadow-romantic hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-base h-14 px-8 rounded-full whitespace-nowrap"
            >
              <Link href="/create" className="flex items-center gap-3">
                <Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { MousePointer2, PartyPopper, Share2, Smartphone, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: MousePointer2,
    title: "Drag & Drop Magic",
    description:
      "Intuitive editor that makes designing your perfect invitation a breeze. No design skills required.",
    gradient: "from-violet-500 to-purple-600",
    delay: "0",
  },
  {
    icon: PartyPopper,
    title: "Playful Interactions",
    description:
      "Add runaway buttons, confetti explosions, and animated hearts that make your invite unforgettable.",
    gradient: "from-primary to-pink-500",
    delay: "100",
  },
  {
    icon: Share2,
    title: "One-Click Sharing",
    description:
      "Get a unique link to share with your special someone via text, email, or any social platform.",
    gradient: "from-orange-400 to-rose-500",
    delay: "200",
  },
  {
    icon: Smartphone,
    title: "Perfect on Any Device",
    description:
      "Your invitation looks stunning on phones, tablets, and desktops. Love knows no screen size.",
    gradient: "from-cyan-500 to-blue-500",
    delay: "300",
  },
];

export function Features() {
  // Extract icons for JSX usage
  const Icon0 = features[0].icon;
  const Icon1 = features[1].icon;
  const Icon2 = features[2].icon;
  const Icon3 = features[3].icon;

  return (
    <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary/20 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />

      {/* Floating hearts */}
      <div className="absolute top-1/4 right-[5%] opacity-10 animate-float-slow">
        <Heart className="w-16 h-16 text-primary fill-primary" />
      </div>
      <div className="absolute bottom-1/4 left-[8%] opacity-10 animate-float delay-500">
        <Heart className="w-12 h-12 text-pink-400 fill-pink-400" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-rose rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary font-sans">
              Powerful Features
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Everything You Need
            <br />
            <span className="text-gradient">to Create Magic</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Our powerful yet delightfully simple tools help you craft invitations
            that stand out and make your Valentine feel truly special.
          </p>
        </div>

        {/* Features Grid - Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Feature 1 - Large */}
          <div className="lg:col-span-7 group">
            <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-white border border-gray-100 shadow-romantic hover:shadow-romantic-lg transition-all duration-500 overflow-hidden">
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${features[0].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[0].gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon0 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {features[0].title}
                </h3>

                <p className="text-lg text-muted-foreground font-sans leading-relaxed max-w-md">
                  {features[0].description}
                </p>

                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-8 right-8 flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-gray-200 group-hover:bg-primary/30 transition-colors duration-500"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Medium */}
          <div className="lg:col-span-5 group">
            <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-primary to-pink-500 shadow-romantic-lg overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Icon1 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  {features[1].title}
                </h3>

                <p className="text-lg text-white/80 font-sans leading-relaxed">
                  {features[1].description}
                </p>

                {/* Floating confetti */}
                <div className="absolute top-6 right-6 animate-float-slow">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Medium */}
          <div className="lg:col-span-5 group">
            <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-100 shadow-romantic hover:shadow-romantic-lg transition-all duration-500 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${features[2].gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[2].gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <Icon2 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {features[2].title}
                </h3>

                <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                  {features[2].description}
                </p>

                {/* Share icons mockup */}
                <div className="mt-6 flex gap-3">
                  {["bg-blue-500", "bg-green-500", "bg-pink-500"].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-xl ${bg} opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 - Large with device mockup */}
          <div className="lg:col-span-7 group">
            <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-romantic-lg overflow-hidden">
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />

              <div className="relative flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${features[3].gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon3 className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    {features[3].title}
                  </h3>

                  <p className="text-lg text-gray-400 font-sans leading-relaxed">
                    {features[3].description}
                  </p>
                </div>

                {/* Device mockup */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-56 bg-gray-700 rounded-3xl border-4 border-gray-600 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-2" />
                    <div className="mt-3 mx-2 h-40 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                      <Heart className="w-10 h-10 text-primary/60 fill-primary/60 animate-pulse-glow" />
                    </div>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground font-sans mb-2">
            And so much more waiting for you...
          </p>
          <div className="inline-flex items-center gap-1 text-primary font-medium cursor-pointer group">
            <span>Explore all features</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

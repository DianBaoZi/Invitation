"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Monitor, Play, ArrowRight, Clock, Heart, Users, Zap } from "lucide-react";
import { PreviewModal } from "@/components/landing/PreviewModal";
import { TEMPLATES, PRICING, formatPrice } from "@/lib/supabase/templates";
import { Template } from "@/lib/supabase/types";

// Flip counter component for animated number display
function FlipCounter({ value }: { value: number }) {
  const formattedValue = value.toLocaleString();

  return (
    <span className="inline-flex tabular-nums">
      {formattedValue.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
          className="font-bold text-stone-800"
          style={{ display: 'inline-block', minWidth: char === ',' ? '0.3em' : '0.55em', textAlign: 'center' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Get the next Valentine's Day date based on user's local time
function getNextValentinesDay(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const valentines = new Date(currentYear, 1, 14, 0, 0, 0); // Feb 14 (month is 0-indexed)

  // If Valentine's Day has passed this year, target next year
  if (now > valentines) {
    valentines.setFullYear(currentYear + 1);
  }

  return valentines;
}

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDesktopPrompt, setShowDesktopPrompt] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0 });
  const [inviteCount, setInviteCount] = useState(2847);

  // Valentine's Day countdown timer - updates every minute
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const valentinesDate = getNextValentinesDay().getTime();
      const distance = valentinesDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Random invite count incrementer
  useEffect(() => {
    const incrementInvites = () => {
      // Randomly increment by 1-3 invites
      setInviteCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    };

    // Random interval between 2-6 seconds
    const scheduleNext = () => {
      const randomDelay = 2000 + Math.random() * 4000;
      return setTimeout(() => {
        incrementInvites();
        scheduleNext();
      }, randomDelay);
    };

    const timeoutId = scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("desktop-prompt-dismissed");
    const isMobile = window.innerWidth < 768;
    if (isMobile && !isDismissed) {
      setShowDesktopPrompt(true);
    }
  }, []);

  const dismissDesktopPrompt = () => {
    setShowDesktopPrompt(false);
    sessionStorage.setItem("desktop-prompt-dismissed", "true");
  };

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] relative">
      {/* Warm paper texture background */}
      <div
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mobile desktop prompt modal - centered with blur */}
      <AnimatePresence>
        {showDesktopPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 md:hidden"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            {/* Blur backdrop */}
            <div className="absolute inset-0 backdrop-blur-md" />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                <Monitor className="w-7 h-7 text-stone-600" />
              </div>

              {/* Text */}
              <h3
                className="text-xl text-stone-900 mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Better on Desktop
              </h3>
              <p
                className="text-stone-500 text-sm mb-6 leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px" }}
              >
                For the full experience with animations and interactions, we recommend viewing on a larger screen.
              </p>

              {/* OK Button */}
              <button
                onClick={dismissDesktopPrompt}
                className="w-full py-3.5 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all shadow-lg active:scale-[0.98]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px", letterSpacing: "0.02em" }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <div className="text-center pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-12 md:pb-16 px-4 relative z-10 overflow-visible">
        {/* Floating hearts background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-200/30"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
                fontSize: 12 + (i % 4) * 6,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 0.4, 0],
                y: [-20, -60, -100],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                rotate: [0, (i % 2 === 0 ? 15 : -15), 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "easeOut",
              }}
            >
              ♥
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-4 sm:mb-8"
        >
          <span className="block h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-rose-300/60" />
          <motion.span
            className="text-rose-400/80 text-xs sm:text-sm tracking-[0.4em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            make it count
          </motion.span>
          <span className="block h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-rose-300/60" />
        </motion.div>

        {/* Animated Hero Title */}
        <h1
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl text-stone-900 tracking-tight leading-[1.05] mb-3 sm:mb-6 overflow-visible"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600 }}
        >
          {/* Letter-by-letter "Impress" */}
          <span className="inline-block">
            {"Impress".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>{" "}
          {/* Letter-by-letter "your" */}
          <span className="inline-block">
            {"your".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.65 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>{" "}
          {/* Animated "date" with special effects */}
          <motion.span
            className="relative inline-block overflow-visible"
            style={{ paddingRight: "3rem" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow effect behind "date" */}
            <motion.span
              className="absolute inset-0 blur-xl"
              style={{
                background: "radial-gradient(ellipse, rgba(225,29,72,0.3) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* The word "date" with shimmer */}
            <motion.span
              className="relative italic"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.15em",
                background: "linear-gradient(90deg, #be123c, #e11d48, #f43f5e, #fb7185, #f43f5e, #e11d48, #be123c)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                paddingRight: "0.15em",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              date
            </motion.span>
            {/* Sparkle decorations */}
            <motion.span
              className="absolute -top-4 -right-2 text-rose-400/80 text-xl md:text-2xl"
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.5, duration: 0.5, type: "spring", stiffness: 200 }}
            >
              ✦
            </motion.span>
            <motion.span
              className="absolute -bottom-2 -left-4 text-rose-300/60 text-base md:text-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6], scale: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              ✦
            </motion.span>
            <motion.span
              className="absolute top-1/2 -right-8 text-amber-400/50 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4], rotate: [0, 180, 360] }}
              transition={{ delay: 1.9, duration: 2, repeat: Infinity }}
            >
              ✧
            </motion.span>
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-stone-500 text-sm sm:text-xl md:text-2xl max-w-xl mx-auto px-2 sm:px-4"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.03em" }}
        >
          Interactive invites they&apos;ll actually remember
        </motion.p>

        {/* Valentine's Day Countdown + Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 sm:mt-8 flex flex-row items-center justify-center gap-3 sm:gap-6"
        >
          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose-50 border border-rose-200">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-rose-400" />
            <span className="text-rose-600 text-xs sm:text-sm font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="font-bold">{countdown.days}</span>d <span className="font-bold">{countdown.hours}</span>h until Valentine&apos;s
            </span>
            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 fill-rose-400" />
          </div>

          {/* Social Proof - Desktop only */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-200">
            <Users className="w-4 h-4 text-stone-400" />
            <span className="text-stone-600 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <FlipCounter value={inviteCount} /> invites sent this week
            </span>
          </div>
        </motion.div>

      </div>

      {/* Template Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-24 relative z-10">
        {/* Desktop: 3 column masonry-style grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {TEMPLATES.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              isHovered={hoveredId === template.id}
              onHover={() => setHoveredId(template.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(template)}
            />
          ))}
          {/* Coming Soon Card */}
          <ComingSoonCard index={TEMPLATES.length} />
        </div>

        {/* Mobile: 2 column grid with preview art */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {TEMPLATES.map((template, index) => (
            <MobileCard
              key={template.id}
              template={template}
              index={index}
              onClick={() => handleCardClick(template)}
            />
          ))}
          {/* Coming Soon Card - Mobile */}
          <MobileComingSoonCard index={TEMPLATES.length} />
        </div>
      </div>

      {/* Membership Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-auto z-40"
      >
        <button
          onClick={() => setShowMembershipModal(true)}
          className="w-full md:w-auto bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3.5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] relative overflow-hidden"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <Sparkles className="w-4 h-4 text-white relative z-10" />
          <span className="text-sm tracking-wide relative z-10">
            <span className="line-through text-white/60 mr-2">{formatPrice(PRICING.originalMembership)}</span>
            <span className="font-semibold">{formatPrice(PRICING.membership)}</span>
            <span className="hidden sm:inline"> — Get All Templates</span>
          </span>
          <ArrowRight className="w-4 h-4 text-white/80 relative z-10" />
        </button>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTemplate && (
          <PreviewModal
            template={selectedTemplate}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>

      {/* Membership Modal */}
      <AnimatePresence>
        {showMembershipModal && (
          <MembershipModal onClose={() => setShowMembershipModal(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

// ============================================
// DESKTOP TEMPLATE CARD - Editorial Style
// ============================================

function TemplateCard({
  template,
  index,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  template: Template;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Reset iframe loaded state when unhovered
  useEffect(() => {
    if (!isHovered) {
      setIframeLoaded(false);
    }
  }, [isHovered]);

  // Standardized larger card height (3x original ~200px)
  const getCardHeight = () => {
    return 600;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: getCardHeight() }}
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -6 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background with preview art (static preview) */}
        <div className="absolute inset-0">
          <TemplatePreviewScene templateId={template.id} isHovered={isHovered} />
        </div>

        {/* Live iframe preview on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: iframeLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <iframe
                src={`/test/${template.id}`}
                className="w-full h-full border-0 pointer-events-none"
                title={`Preview of ${template.name}`}
                onLoad={() => setIframeLoaded(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: isHovered
              ? "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)"
              : "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Play button on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Play className="w-6 h-6 text-stone-800 ml-1" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Social proof badge */}
        {template.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-lg ${
                template.badge === "Most Popular"
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                  : template.badge === "Staff Pick"
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                  : template.badge === "New"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-white"
                  : "bg-gradient-to-r from-rose-400 to-pink-400 text-white"
              }`}
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {template.badge === "Most Popular" && "🔥 "}
              {template.badge === "Staff Pick" && "⭐ "}
              {template.badge === "New" && "✨ "}
              {template.badge === "Trending" && "📈 "}
              {template.badge}
            </span>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-4 right-4 z-10">
          {template.is_free ? (
            <span
              className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-emerald-600 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-lg"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Free
            </span>
          ) : (
            <span
              className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-semibold shadow-lg"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                color: "#92400e",
              }}
            >
              {formatPrice(template.price_cents)}
            </span>
          )}
        </div>

        {/* Content overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <motion.div
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3
              className="text-white text-lg font-medium mb-1.5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {template.name}
            </h3>
            <p
              className="text-white/70 text-xs leading-relaxed line-clamp-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "13px" }}
            >
              {template.description}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MOBILE CARD - Same preview art as desktop
// ============================================

function MobileCard({
  template,
  index,
  onClick,
}: {
  template: Template;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={onClick}
      className="relative rounded-xl overflow-hidden active:scale-[0.97] transition-transform"
      style={{ height: 480 }}
    >
      {/* Background with preview art */}
      <div className="absolute inset-0">
        <TemplatePreviewScene templateId={template.id} isHovered={false} />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Tap indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
          <Play className="w-4 h-4 text-stone-700 ml-0.5" fill="currentColor" />
        </div>
      </div>

      {/* Price badge */}
      <div className="absolute top-2.5 right-2.5">
        {template.is_free ? (
          <span className="px-2 py-1 bg-white/90 text-emerald-600 rounded-full text-[9px] font-semibold uppercase tracking-wide">
            Free
          </span>
        ) : (
          <span
            className="px-2 py-1 bg-white/90 rounded-full text-[9px] font-semibold"
            style={{ color: "#92400e" }}
          >
            {formatPrice(template.price_cents)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3
          className="text-white text-sm font-medium mb-0.5 truncate"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {template.name}
        </h3>
        <p
          className="text-white/60 text-[10px] line-clamp-1"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {template.description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// COMING SOON CARD - Desktop
// ============================================

function ComingSoonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 600 }}
      >
        {/* Gradient background with animated particles */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
          {/* Animated dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-stone-300/30"
              style={{
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                left: `${10 + (i * 8) % 80}%`,
                top: `${15 + (i * 7) % 70}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-5xl mb-6"
          >
            ✨
          </motion.div>
          <h3
            className="text-stone-400 text-xl font-medium mb-3 text-center"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            More coming soon...
          </h3>
          <p
            className="text-stone-400/70 text-sm text-center max-w-[200px]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            New magical templates are on the way
          </p>
        </div>

        {/* Dashed border */}
        <div className="absolute inset-4 border-2 border-dashed border-stone-300/50 rounded-xl pointer-events-none" />
      </div>
    </motion.div>
  );
}

// ============================================
// COMING SOON CARD - Mobile
// ============================================

function MobileComingSoonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="relative rounded-xl overflow-hidden"
      style={{ height: 480 }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
        {/* Animated dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-stone-300/30"
            style={{
              width: 3 + (i % 2) * 2,
              height: 3 + (i % 2) * 2,
              left: `${15 + (i * 12) % 70}%`,
              top: `${20 + (i * 10) % 60}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2.5 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-3xl mb-4"
        >
          ✨
        </motion.div>
        <h3
          className="text-stone-400 text-sm font-medium mb-2 text-center"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          More coming soon...
        </h3>
        <p
          className="text-stone-400/60 text-[10px] text-center"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Stay tuned
        </p>
      </div>

      {/* Dashed border */}
      <div className="absolute inset-3 border-2 border-dashed border-stone-300/40 rounded-lg pointer-events-none" />
    </motion.div>
  );
}

// ============================================
// TEMPLATE PREVIEW SCENE - Full immersive backgrounds
// ============================================

function TemplatePreviewScene({ templateId, isHovered = false }: { templateId: string; isHovered?: boolean }) {
  switch (templateId) {
    case "runaway-button":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200 flex items-center justify-center">
          {/* Floating hearts */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/40"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                fontSize: 12 + (i % 3) * 4,
              }}
              animate={isHovered ? {
                y: [-5, 5, -5],
                rotate: [-5, 5, -5],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            >
              ♥
            </motion.div>
          ))}
          {/* Interactive buttons preview */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="px-4 py-1.5 rounded-xl bg-white/90 shadow-lg">
              <span className="text-rose-500 text-xs font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Will you be my Valentine?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-[11px] font-semibold shadow-lg"
                animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Yes! 💕
              </motion.div>
              <motion.div
                className="px-5 py-2 rounded-xl bg-stone-200 text-stone-500 text-[11px] font-medium"
                animate={isHovered ? { x: [0, 12, -8, 15, 0], y: [0, -6, 4, -8, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                No
              </motion.div>
            </div>
          </div>
        </div>
      );

    case "y2k-digital-crush":
      return (
        <div className="absolute inset-0 bg-[#008080] flex items-center justify-center overflow-hidden">
          {/* CRT scanlines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
          />
          {/* Desktop icons scattered */}
          <motion.div
            className="absolute top-4 left-4 text-2xl"
            animate={isHovered ? { rotate: [0, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💾
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-6 text-xl"
            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          >
            📧
          </motion.div>
          {/* Windows dialog */}
          <div className="relative z-10 w-36">
            <div
              className="rounded-sm overflow-hidden"
              style={{ border: "2px solid #868a8e", boxShadow: "3px 3px 0 #000" }}
            >
              <div
                className="flex items-center gap-1.5 px-2 py-1"
                style={{ background: "linear-gradient(90deg, #000080, #1084d0)" }}
              >
                <span className="text-white text-[9px] font-bold">💕 crush.exe</span>
              </div>
              <div className="bg-[#c0c0c0] p-3 text-center">
                <p className="text-[11px] font-bold text-[#000080] mb-2">System Alert!</p>
                <p className="text-[9px] text-[#000080]">You&apos;ve captured my heart</p>
                <motion.div
                  className="mt-2 mx-auto w-16 h-5 bg-[#dfdfdf] border border-[#808080] flex items-center justify-center text-[8px] font-bold"
                  style={{ boxShadow: "inset -1px -1px 0 #404040, inset 1px 1px 0 #fff" }}
                  animate={isHovered ? { scale: [1, 0.95, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  OK 💝
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      );

    case "cozy-scrapbook":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5ebe0] via-[#ede0d4] to-[#e3d5ca] flex items-center justify-center">
          {/* Paper texture dots */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #c4a77d 0.5px, transparent 0)`,
            backgroundSize: '12px 12px'
          }} />
          {/* Polaroid stack */}
          <div className="relative">
            <motion.div
              className="absolute -left-4 -top-2 w-20 h-24 bg-white rounded-sm shadow-lg p-1.5 pb-6"
              style={{ transform: "rotate(-12deg)" }}
              animate={isHovered ? { rotate: [-12, -8, -12] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 rounded-sm" />
            </motion.div>
            <motion.div
              className="relative w-20 h-24 bg-white rounded-sm shadow-xl p-1.5 pb-6 z-10"
              style={{ transform: "rotate(3deg)" }}
              animate={isHovered ? { rotate: [3, 6, 3], y: [0, -3, 0] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <div className="w-full h-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-sm flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
            </motion.div>
            {/* Washi tape */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 opacity-80 rounded-sm z-20"
              style={{
                background: "repeating-linear-gradient(45deg, #f8bbd0, #f8bbd0 3px, #f48fb1 3px, #f48fb1 6px)",
              }}
            />
          </div>
        </div>
      );

    case "neon-arcade":
      return (
        <div className="absolute inset-0 bg-[#0a0014] flex items-center justify-center overflow-hidden">
          {/* Grid floor effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(#7c4dff 1px, transparent 1px), linear-gradient(90deg, #7c4dff 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
              transform: 'perspective(200px) rotateX(60deg)',
              transformOrigin: 'center 120%',
            }}
          />
          {/* Neon glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-purple-500/20 blur-xl" />
          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-xl" />
          {/* Arcade cabinet preview */}
          <div className="relative z-10">
            <motion.div
              className="px-6 py-3 rounded-lg"
              style={{
                border: "2px solid #7c4dff",
                boxShadow: "0 0 20px rgba(124,77,255,0.5), inset 0 0 20px rgba(124,77,255,0.1)",
                background: "rgba(0,0,0,0.7)",
              }}
              animate={isHovered ? { boxShadow: [
                "0 0 20px rgba(124,77,255,0.5), inset 0 0 20px rgba(124,77,255,0.1)",
                "0 0 40px rgba(224,64,251,0.7), inset 0 0 30px rgba(224,64,251,0.2)",
                "0 0 20px rgba(124,77,255,0.5), inset 0 0 20px rgba(124,77,255,0.1)",
              ]} : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.p
                className="text-sm font-bold tracking-widest text-center"
                style={{
                  color: "#e040fb",
                  textShadow: "0 0 10px rgba(224,64,251,0.8), 0 0 20px rgba(224,64,251,0.4)",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "10px",
                }}
                animate={isHovered ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                PRESS START
              </motion.p>
            </motion.div>
          </div>
        </div>
      );

    case "love-letter-mailbox":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff5f5] via-[#fce4ec] to-[#f8bbd0] flex items-center justify-center">
          {/* Soft hearts background */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute text-rose-200/30"
              style={{
                left: `${10 + i * 25}%`,
                top: `${15 + (i % 2) * 50}%`,
                fontSize: 16 + i * 4,
                transform: `rotate(${-15 + i * 10}deg)`,
              }}
            >
              ♥
            </div>
          ))}
          {/* Envelope */}
          <motion.div
            className="relative z-10"
            animate={isHovered ? { y: [0, -8, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div
              className="w-28 h-20 rounded-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #fff5f5 0%, #fce4ec 100%)",
                boxShadow: "0 10px 30px rgba(183,28,28,0.15)",
              }}
            >
              {/* Envelope flap */}
              <motion.div
                className="absolute -top-px left-0 right-0 h-10"
                style={{
                  background: "linear-gradient(180deg, #f8bbd0 0%, #fce4ec 100%)",
                  clipPath: "polygon(0 0, 50% 90%, 100% 0)",
                }}
                animate={isHovered ? {
                  clipPath: ["polygon(0 0, 50% 90%, 100% 0)", "polygon(0 0, 50% 70%, 100% 0)", "polygon(0 0, 50% 90%, 100% 0)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Heart seal */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                <motion.div
                  className="text-rose-400 text-xl"
                  animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  💌
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      );

    case "stargazer":
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#050514] via-[#0a0a2e] to-[#1a1a4e] overflow-hidden">
          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: 1 + (i % 3),
                height: 1 + (i % 3),
                left: `${5 + (i * 5) % 90}%`,
                top: `${5 + (i * 7) % 90}%`,
                opacity: 0.3 + (i % 5) * 0.15,
              }}
              animate={isHovered ? {
                opacity: [0.3 + (i % 5) * 0.15, 0.8, 0.3 + (i % 5) * 0.15],
                scale: [1, 1.5, 1],
              } : {}}
              transition={{ duration: 2 + (i % 3), delay: i * 0.1, repeat: Infinity }}
            />
          ))}
          {/* Shooting star */}
          {isHovered && (
            <motion.div
              className="absolute w-12 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ x: "-20%", y: "10%", rotate: 35, opacity: 0 }}
              animate={{ x: "120%", y: "60%", opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          {/* Central constellation text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.p
              className="text-white/50 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              animate={isHovered ? { opacity: [0.5, 0.8, 0.5] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✦ written in stars ✦
            </motion.p>
          </div>
        </div>
      );

    case "premiere":
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a0a] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
          {/* Film grain overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Spotlight beams */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-amber-500/20 to-transparent" style={{ transform: "rotate(-15deg)" }} />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-amber-500/20 to-transparent" style={{ transform: "rotate(15deg)" }} />
          {/* Marquee */}
          <div className="relative z-10">
            <motion.div
              className="px-6 py-3 rounded border-2"
              style={{
                borderColor: "rgba(245,158,11,0.6)",
                background: "rgba(0,0,0,0.7)",
                boxShadow: "0 0 30px rgba(245,158,11,0.2)",
              }}
              animate={isHovered ? {
                borderColor: ["rgba(245,158,11,0.6)", "rgba(245,158,11,1)", "rgba(245,158,11,0.6)"],
                boxShadow: ["0 0 30px rgba(245,158,11,0.2)", "0 0 50px rgba(245,158,11,0.4)", "0 0 30px rgba(245,158,11,0.2)"],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p
                className="text-amber-400 text-xs font-bold tracking-widest text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                🎬 PREMIERE
              </p>
            </motion.div>
          </div>
        </div>
      );

    case "forest-adventure":
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a3c1a] via-[#2d5a2d] to-[#1a3c1a] flex items-center justify-center overflow-hidden">
          {/* Pixel trees silhouettes */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end justify-around opacity-30">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0f2a0f]"
                style={{
                  width: 20 + i * 5,
                  height: 30 + (i % 3) * 15,
                  clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                }}
              />
            ))}
          </div>
          {/* Pixel art character */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={isHovered ? { y: [0, -6, 0] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #fbbf24, #f59e0b)",
                  border: "3px solid #92400e",
                  boxShadow: "0 4px 0 #78350f",
                }}
              >
                <span className="text-2xl">🧙</span>
              </div>
            </motion.div>
            <motion.div
              className="mt-3 px-4 py-1.5 rounded"
              style={{
                background: "rgba(0,0,0,0.7)",
                border: "2px solid #22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.3)",
              }}
              animate={isHovered ? { boxShadow: [
                "0 0 10px rgba(34,197,94,0.3)",
                "0 0 20px rgba(34,197,94,0.5)",
                "0 0 10px rgba(34,197,94,0.3)",
              ]} : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "8px", color: "#86efac" }}>
                BEGIN QUEST
              </p>
            </motion.div>
          </div>
        </div>
      );

    case "scratch-reveal":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 flex items-center justify-center">
          {/* Scratch ticket */}
          <motion.div
            className="relative w-32 h-20 rounded-lg overflow-hidden"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-400" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-stone-400 to-stone-500"
              animate={isHovered ? {
                clipPath: [
                  "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  "polygon(20% 0, 100% 0, 100% 100%, 0 100%)",
                  "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-stone-600 text-[10px] font-bold">SCRATCH ME</p>
            </div>
          </motion.div>
        </div>
      );

    case "elegant-invitation":
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf7] via-[#f8e8e4] to-[#fdfbf7] flex items-center justify-center overflow-hidden">
          {/* Subtle floral pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b76e79' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Floating decorations */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + (i * 15) % 80}%`,
                top: `${15 + (i * 12) % 70}%`,
                fontSize: 10 + (i % 3) * 2,
                color: "#d4a5a5",
                opacity: 0.35,
              }}
              animate={isHovered ? {
                y: [0, -8, 0],
                rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                opacity: [0.35, 0.5, 0.35],
              } : {}}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            >
              {i % 2 === 0 ? "✦" : "❀"}
            </motion.div>
          ))}
          {/* Elegant card preview */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Decorative line */}
            <motion.div
              className="w-16 h-px mb-3"
              style={{ background: "linear-gradient(90deg, transparent, #b76e79, transparent)" }}
              animate={isHovered ? { scaleX: [1, 1.3, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Main question text */}
            <motion.p
              className="text-center px-4 mb-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "14px",
                fontStyle: "italic",
                color: "#b76e79",
              }}
              animate={isHovered ? {
                textShadow: ["0 0 0px rgba(183,110,121,0)", "0 0 15px rgba(183,110,121,0.3)", "0 0 0px rgba(183,110,121,0)"],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Will you be my Valentine?
            </motion.p>
            {/* Decorative flower */}
            <motion.div
              animate={isHovered ? { rotate: [0, 360] } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="my-2"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#b76e79" opacity="0.6" />
                <circle cx="12" cy="12" r="6" stroke="#d4a5a5" strokeWidth="1" fill="none" opacity="0.4" />
                <path d="M12 4C12 4 14 8 12 12C10 8 12 4 12 4Z" fill="#e8c4bc" opacity="0.5" />
                <path d="M12 20C12 20 10 16 12 12C14 16 12 20 12 20Z" fill="#e8c4bc" opacity="0.5" />
                <path d="M4 12C4 12 8 10 12 12C8 14 4 12 4 12Z" fill="#e8c4bc" opacity="0.5" />
                <path d="M20 12C20 12 16 14 12 12C16 10 20 12 20 12Z" fill="#e8c4bc" opacity="0.5" />
              </svg>
            </motion.div>
            {/* Decorative line */}
            <motion.div
              className="w-16 h-px mt-2"
              style={{ background: "linear-gradient(90deg, transparent, #b76e79, transparent)" }}
              animate={isHovered ? { scaleX: [1, 1.3, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* RSVP buttons preview */}
            <div className="flex gap-2 mt-4">
              <motion.div
                className="px-4 py-1.5 rounded text-[10px] text-white"
                style={{
                  background: "#b76e79",
                  fontFamily: "'Cormorant Garamond', serif",
                  boxShadow: "0 2px 8px rgba(183,110,121,0.3)",
                }}
                animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Yes, I&apos;ll Be There
              </motion.div>
              <motion.div
                className="px-3 py-1.5 rounded text-[10px]"
                style={{
                  background: "transparent",
                  border: "1px solid #e8c4bc",
                  color: "#7a6f6f",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
                animate={isHovered ? { x: [0, 8, -5, 10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Perhaps Not
              </motion.div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
          <span className="text-4xl">💌</span>
        </div>
      );
  }
}

// ============================================
// MEMBERSHIP MODAL
// ============================================

function MembershipModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#faf9f7] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Limited Time Badge */}
        <div className="bg-rose-500 text-white text-center py-2 px-4">
          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
          >
            <Zap className="w-3 h-3" />
            Valentine&apos;s Day Special — 63% OFF
            <Zap className="w-3 h-3" />
          </motion.span>
        </div>

        <div
          className="bg-stone-900 p-8 text-center relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center relative z-10"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2
            className="text-2xl text-white mb-2 relative z-10"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            All-Access Pass
          </h2>
          <p
            className="text-stone-400 text-sm relative z-10"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Unlock every template, forever
          </p>
        </div>

        <div className="p-8">
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
            <span className="text-amber-700 text-xs" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              🔥 <strong>847 people</strong> bought this week
            </span>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "All 8 premium templates ($7.92 value)",
              "Future templates included FREE",
              "Priority support",
              "One-time payment — no subscription",
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span
                  className="text-stone-700 text-sm"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "15px" }}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Price with Anchoring */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3">
              <span
                className="text-xl text-stone-400 line-through"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {formatPrice(PRICING.originalMembership)}
              </span>
              <span
                className="text-4xl text-stone-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {formatPrice(PRICING.membership)}
              </span>
            </div>
            <span
              className="text-stone-400 text-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              one-time payment • less than a latte ☕
            </span>
          </div>

          <button
            className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", letterSpacing: "0.02em" }}
          >
            🎁 Unlock All Templates Now
          </button>

          {/* Urgency Text */}
          <p
            className="text-xs text-rose-500 text-center mt-3 font-medium"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            ⏰ Offer ends on Valentine&apos;s Day
          </p>

          <p
            className="text-xs text-stone-400 text-center mt-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Secure payment via Stripe
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

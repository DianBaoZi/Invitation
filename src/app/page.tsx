"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Monitor, Play, ArrowRight } from "lucide-react";
import { PreviewModal } from "@/components/landing/PreviewModal";
import { TEMPLATES, PRICING, formatPrice } from "@/lib/supabase/templates";
import { Template } from "@/lib/supabase/types";

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDesktopPrompt, setShowDesktopPrompt] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    <main className="min-h-screen bg-[#faf9f7] relative overflow-x-hidden">
      {/* Warm paper texture background */}
      <div
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mobile desktop prompt toast */}
      <AnimatePresence>
        {showDesktopPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-50 md:hidden"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200/60 p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-4 h-4 text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900">Better on desktop</p>
                <p className="text-xs text-stone-500">Full animations work best on larger screens</p>
              </div>
              <button
                onClick={dismissDesktopPrompt}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <div className="text-center pt-14 md:pt-20 pb-10 md:pb-14 px-4 relative z-10">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <span className="block h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-rose-300/60" />
          <span
            className="text-rose-400/80 text-[10px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}
          >
            make it count
          </span>
          <span className="block h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-rose-300/60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl text-stone-900 tracking-tight leading-[1.1] mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
        >
          Impress your{" "}
          <span className="relative inline-block">
            <span
              className="italic"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.15em",
                background: "linear-gradient(135deg, #be123c, #e11d48, #f43f5e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              date
            </span>
            <motion.span
              className="absolute -top-2 -right-5 text-rose-300/70 text-base"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              ✦
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-stone-400 text-sm sm:text-base max-w-md mx-auto"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.1rem", letterSpacing: "0.02em" }}
        >
          Interactive invites they&apos;ll actually remember
        </motion.p>
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
          className="w-full md:w-auto bg-stone-900 text-white px-6 py-3.5 rounded-full flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:bg-stone-800 active:scale-[0.98]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm tracking-wide">
            {formatPrice(PRICING.membership)} — Unlock all templates
          </span>
          <ArrowRight className="w-4 h-4 text-stone-400" />
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
  // Varying heights for visual interest
  const getCardHeight = () => {
    const heights = [220, 200, 240, 200, 220, 200, 240, 200, 220];
    return heights[index % heights.length];
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
        {/* Background with preview art */}
        <div className="absolute inset-0">
          <TemplatePreviewScene templateId={template.id} isHovered={isHovered} />
        </div>

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
      style={{ height: 160 }}
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

    case "avocado-valentine":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0] flex items-center justify-center">
          {/* Confetti dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ["#86efac", "#fca5a5", "#fcd34d", "#c4b5fd"][i % 4],
                left: `${10 + (i * 12) % 80}%`,
                top: `${15 + (i * 11) % 70}%`,
              }}
              animate={isHovered ? {
                y: [0, -10, 0],
                rotate: [0, 180, 360],
              } : {}}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
          {/* Avocado */}
          <motion.div
            className="relative z-10"
            animate={isHovered ? { rotate: [-8, 8, -8], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-5xl drop-shadow-lg">🥑</span>
          </motion.div>
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
          <div className="space-y-4 mb-8">
            {[
              "All 9 premium templates",
              "Future templates included",
              "Priority support",
              "One-time payment",
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

          <div className="text-center mb-6">
            <span
              className="text-4xl text-stone-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {formatPrice(PRICING.membership)}
            </span>
            <span
              className="text-stone-400 ml-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              one-time
            </span>
          </div>

          <button
            className="w-full py-4 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "16px", letterSpacing: "0.02em" }}
          >
            Get All-Access Pass
          </button>
          <p
            className="text-xs text-stone-400 text-center mt-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Secure payment via Stripe (coming soon)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

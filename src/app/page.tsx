"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Monitor, Play } from "lucide-react";
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
    <main className="min-h-screen bg-gradient-to-b from-[#fafafa] via-white to-[#f5f5f5] relative overflow-x-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Mobile desktop prompt toast */}
      <AnimatePresence>
        {showDesktopPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-50 md:hidden"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Monitor className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Better on desktop</p>
                <p className="text-xs text-gray-500">Full animations work best on larger screens</p>
              </div>
              <button
                onClick={dismissDesktopPrompt}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <div className="text-center pt-12 md:pt-16 pb-8 md:pb-12 px-4 relative z-10">
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="block h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-rose-300" />
          <span className="text-rose-300 text-xs tracking-[0.3em] uppercase font-medium">
            make it count
          </span>
          <span className="block h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-rose-300" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Impress your{" "}
          <span className="relative inline-block">
            <span
              className="italic"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.1em",
                background: "linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              date
            </span>
            <motion.span
              className="absolute -top-1 -right-4 text-rose-300 text-sm"
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
          className="text-gray-400 text-sm sm:text-base max-w-sm mx-auto"
        >
          Interactive invites they&apos;ll actually remember
        </motion.p>
      </div>

      {/* Template Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Desktop: 4 column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-5">
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

        {/* Mobile: 2 column grid */}
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
          className="w-full md:w-auto bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium">
            {formatPrice(PRICING.membership)} — All templates + future releases
          </span>
          <Sparkles className="w-4 h-4 text-amber-400" />
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
// DESKTOP TEMPLATE CARD
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
  const getPreviewBg = () => {
    switch (template.id) {
      case "runaway-button":
        return "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)";
      case "y2k-digital-crush":
        return "linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)";
      case "cozy-scrapbook":
        return "linear-gradient(135deg, #fef9ef 0%, #fdf2e0 50%, #f5e6c8 100%)";
      case "neon-arcade":
        return "linear-gradient(180deg, #0a0014 0%, #1a0033 100%)";
      case "love-letter-mailbox":
        return "linear-gradient(135deg, #fff5f5 0%, #fce4ec 50%, #f8bbd0 100%)";
      case "stargazer":
        return "linear-gradient(180deg, #050514 0%, #0a0a2e 50%, #1a1a4e 100%)";
      case "avocado-valentine":
        return "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)";
      case "premiere":
        return "linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)";
      case "forest-adventure":
        return "linear-gradient(180deg, #1a3c1a 0%, #2d5a2d 50%, #1a3c1a 100%)";
      default:
        return "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <motion.div
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
        animate={{
          scale: isHovered ? 1.03 : 1,
          y: isHovered ? -8 : 0,
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          borderRadius: isHovered ? "20px" : "16px",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Preview Area */}
        <div
          className="relative h-40 overflow-hidden flex items-center justify-center"
          style={{ background: getPreviewBg() }}
        >
          <TemplatePreviewArt templateId={template.id} isHovered={isHovered} />

          {/* Play overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Play className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Price badge */}
          <div className="absolute top-3 right-3 z-10">
            {template.is_free ? (
              <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
                Free
              </span>
            ) : (
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#78350f",
                }}
              >
                {formatPrice(template.price_cents)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">{template.emoji}</span>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {template.name}
            </h3>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MOBILE CARD
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
  const getPreviewBg = () => {
    switch (template.id) {
      case "runaway-button":
        return "linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)";
      case "y2k-digital-crush":
        return "#c0c0c0";
      case "cozy-scrapbook":
        return "linear-gradient(135deg, #fef9ef 0%, #f5e6c8 100%)";
      case "neon-arcade":
        return "linear-gradient(180deg, #0a0014 0%, #1a0033 100%)";
      case "love-letter-mailbox":
        return "linear-gradient(135deg, #fff5f5 0%, #f8bbd0 100%)";
      case "stargazer":
        return "linear-gradient(180deg, #050514 0%, #1a1a4e 100%)";
      case "avocado-valentine":
        return "linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)";
      case "premiere":
        return "linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 100%)";
      case "forest-adventure":
        return "linear-gradient(180deg, #1a3c1a 0%, #2d5a2d 100%)";
      default:
        return "#f5f5f5";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
    >
      {/* Preview */}
      <div
        className="relative h-28 flex items-center justify-center"
        style={{ background: getPreviewBg() }}
      >
        <span className="text-3xl">{template.emoji}</span>

        {/* Price badge */}
        <div className="absolute top-2 right-2">
          {template.is_free ? (
            <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[9px] font-bold uppercase">
              Free
            </span>
          ) : (
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-bold"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#78350f",
              }}
            >
              {formatPrice(template.price_cents)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate">
          {template.name}
        </h3>
        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
          {template.description}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// TEMPLATE PREVIEW ART
// ============================================

function TemplatePreviewArt({ templateId, isHovered = false }: { templateId: string; isHovered?: boolean }) {
  switch (templateId) {
    case "runaway-button":
      return (
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-white/80 text-[10px] font-semibold text-rose-400">
            Will you be my Valentine?
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-[9px] font-bold shadow-md">
              Yes! 💕
            </div>
            <motion.div
              className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-500 text-[9px] font-semibold"
              animate={isHovered ? { x: [0, 8, -6, 10, 0], y: [0, -4, 3, -6, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              No
            </motion.div>
          </div>
        </div>
      );

    case "y2k-digital-crush":
      return (
        <div className="relative z-10 w-32">
          <div className="rounded-sm overflow-hidden" style={{ border: "2px solid #868a8e", boxShadow: "2px 2px 0 #000" }}>
            <div className="flex items-center gap-1 px-1.5 py-0.5" style={{ background: "linear-gradient(90deg, #000080, #1084d0)" }}>
              <span className="text-white text-[8px] font-bold">💕 crush.exe</span>
            </div>
            <div className="bg-[#c0c0c0] p-2 text-center">
              <p className="text-[9px] font-bold text-[#000080]">Be mine?</p>
            </div>
          </div>
        </div>
      );

    case "cozy-scrapbook":
      return (
        <div className="relative z-10">
          <motion.div
            className="bg-white p-1.5 pb-5 rounded-sm shadow-lg"
            style={{ transform: "rotate(-3deg)" }}
            animate={isHovered ? { rotate: [-3, 0, -3] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-20 h-14 rounded-sm bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
          </motion.div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-3 opacity-60"
            style={{ background: "repeating-linear-gradient(45deg, #f8bbd0, #f8bbd0 2px, #f48fb1 2px, #f48fb1 4px)" }}
          />
        </div>
      );

    case "neon-arcade":
      return (
        <div className="relative z-10">
          <div className="px-4 py-2 rounded-lg" style={{ border: "2px solid #7c4dff", boxShadow: "0 0 15px rgba(124,77,255,0.5)", background: "rgba(0,0,0,0.6)" }}>
            <motion.p
              className="text-[10px] font-bold tracking-wider text-center"
              style={{ color: "#e040fb", textShadow: "0 0 8px rgba(224,64,251,0.8)" }}
              animate={isHovered ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              PRESS START
            </motion.p>
          </div>
        </div>
      );

    case "love-letter-mailbox":
      return (
        <motion.div
          className="relative z-10"
          animate={isHovered ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-24 h-16 rounded-lg relative" style={{ background: "linear-gradient(160deg, #fff5f5 0%, #f8bbd0 100%)", boxShadow: "0 8px 24px rgba(183,28,28,0.12)" }}>
            <div className="absolute -top-px left-0 right-0 h-8" style={{ background: "linear-gradient(180deg, #f8bbd0 0%, #fce4ec 100%)", clipPath: "polygon(0 0, 50% 85%, 100% 0)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400">
              <span className="text-lg">💌</span>
            </div>
          </div>
        </motion.div>
      );

    case "stargazer":
      return (
        <div className="relative z-10 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + (i * 10) % 60}%`,
                top: `${15 + (i * 15) % 70}%`,
                opacity: 0.6 + (i % 3) * 0.2,
              }}
              animate={isHovered ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : {}}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] text-white/70 font-light tracking-widest">✦ written in the stars ✦</p>
          </div>
        </div>
      );

    case "avocado-valentine":
      return (
        <motion.div
          animate={isHovered ? { rotate: [-5, 5, -5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-4xl">🥑</span>
        </motion.div>
      );

    case "premiere":
      return (
        <div className="relative z-10 text-center">
          <motion.div
            className="px-4 py-2 rounded border-2 border-amber-500/50"
            style={{ background: "rgba(0,0,0,0.6)" }}
            animate={isHovered ? { borderColor: ["rgba(245,158,11,0.5)", "rgba(245,158,11,1)", "rgba(245,158,11,0.5)"] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-[10px] text-amber-400 font-bold tracking-wider">🎬 PREMIERE</p>
          </motion.div>
        </div>
      );

    case "forest-adventure":
      return (
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={isHovered ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(180deg, #fbbf24, #f59e0b)", border: "2px solid #92400e" }}>
              <span className="text-xl">🧙</span>
            </div>
          </motion.div>
          <div className="mt-2 px-3 py-1 rounded" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid #22c55e" }}>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "#86efac" }}>BEGIN QUEST</p>
          </div>
        </div>
      );

    default:
      return <span className="text-4xl">{templateId}</span>;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">All-Access Pass</h2>
          <p className="text-gray-400 text-sm">Unlock every template, forever</p>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            {[
              "All 8 premium templates",
              "Future templates included",
              "Priority support",
              "One-time payment",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(PRICING.membership)}</span>
            <span className="text-gray-500 ml-2">one-time</span>
          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl">
            Get All-Access Pass
          </button>
          <p className="text-xs text-gray-400 text-center mt-3">
            Secure payment via Stripe (coming soon)
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

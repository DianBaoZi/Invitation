"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { PreviewModal } from "@/components/landing/PreviewModal";
import { TEMPLATES, PRICING, formatPrice } from "@/lib/supabase/templates";
import { Template } from "@/lib/supabase/types";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      setSelectedTemplate(TEMPLATES[index]);
      setIsModalOpen(true);
    } else {
      setCurrentIndex(index);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const goNext = () => {
    if (currentIndex < TEMPLATES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafafa] via-white to-[#f5f5f5] flex flex-col items-center justify-center px-4 py-4 relative overflow-y-auto">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Hero section */}
      <div className="text-center mb-4 md:mb-6 relative z-10">
        {/* Decorative flourish */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="block h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-rose-300" />
          <span className="text-rose-300 text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
            make it count
          </span>
          <span className="block h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-rose-300" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-semibold text-gray-900 tracking-[-0.02em] leading-[1.1] mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Impress your
          <br />
          <span className="relative inline-block">
            <span
              className="italic font-medium relative z-10"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: "1.15em",
                background: "linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.4,
                display: "inline-block",
                paddingBottom: "0.05em",
              }}
            >
              date
            </span>
            {/* Decorative swash underline */}
            <motion.svg
              viewBox="0 0 200 12"
              className="absolute -bottom-1 left-0 w-full"
              style={{ height: "0.25em" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.path
                d="M8 8 C 40 2, 80 2, 100 6 S 160 12, 192 6"
                fill="none"
                stroke="url(#swash-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id="swash-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </motion.svg>
            {/* Sparkle accent */}
            <motion.span
              className="absolute -top-2 -right-5 sm:-top-3 sm:-right-7 text-rose-300 pointer-events-none"
              style={{ fontSize: "0.3em" }}
              initial={{ opacity: 0, scale: 0, rotate: -30 }}
              animate={{ opacity: [0, 1, 0.7], scale: [0, 1.2, 1], rotate: [-30, 0, 0] }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            >
              ✦
            </motion.span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="text-base sm:text-lg text-gray-400 font-light max-w-xs sm:max-w-sm mx-auto"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Interactive invites they&apos;ll actually remember
        </motion.p>
      </div>

      {/* Card carousel */}
      <div className="relative w-full max-w-[500px] md:max-w-[800px] h-[300px] md:h-[420px] mb-3">
        <AnimatePresence mode="popLayout">
          {TEMPLATES.map((template, index) => {
            const offset = index - currentIndex;
            const isVisible = Math.abs(offset) <= 1;

            if (!isVisible) return null;

            return (
              <FanCardWrapper
                key={template.id}
                template={template}
                offset={offset}
                isCurrent={offset === 0}
                onClick={() => handleCardClick(index)}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center gap-6 mb-3 relative z-20"
      >
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {TEMPLATES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative p-1"
            >
              <span
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gray-900 scale-125"
                    : "bg-gray-300 group-hover:bg-gray-400"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === TEMPLATES.length - 1}
          className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-gray-200 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Membership banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-sm cursor-pointer group"
        style={{
          background: "linear-gradient(135deg, rgba(212,160,23,0.06), rgba(245,200,66,0.1))",
          borderColor: "rgba(212,160,23,0.25)",
        }}
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-sm text-gray-700">
          <span className="font-bold" style={{ color: "#b8860b" }}>$3</span>
          {" "}— All templates + future releases
        </span>
        <svg className="w-3.5 h-3.5 text-amber-600 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
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
    </main>
  );
}

// ============================================
// FAN CARD WRAPPER - handles positioning
// ============================================

function useIsMd() {
  const [isMd, setIsMd] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsMd(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isMd;
}

function FanCardWrapper({
  template,
  offset,
  isCurrent,
  onClick,
}: {
  template: Template;
  offset: number;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const isMd = useIsMd();
  const fanSpread = isMd ? 200 : 130;
  const cardW = isMd ? 300 : 240;
  const cardH = isMd ? 400 : 300;

  const variants = {
    left: {
      x: -fanSpread,
      rotate: -8,
      scale: 0.9,
      zIndex: 1,
      opacity: 0.6,
    },
    center: {
      x: 0,
      rotate: 0,
      scale: 1,
      zIndex: 10,
      opacity: 1,
    },
    right: {
      x: fanSpread,
      rotate: 8,
      scale: 0.9,
      zIndex: 1,
      opacity: 0.6,
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      transition: { duration: 0.2 }
    },
  };

  const position = offset === 0 ? "center" : offset < 0 ? "left" : "right";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{ marginLeft: -(cardW / 2), marginTop: -(cardH / 2) }}
      variants={variants}
      initial={position}
      animate={position}
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      onClick={onClick}
      whileHover={{
        scale: isCurrent ? 1.02 : 0.93,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: isCurrent ? 0.98 : 0.88 }}
    >
      <FanCard template={template} isCurrent={isCurrent} isMd={isMd} />
    </motion.div>
  );
}

// ============================================
// FAN CARD COMPONENT
// ============================================

function FanCard({
  template,
  isCurrent,
  isMd,
}: {
  template: Template;
  isCurrent: boolean;
  isMd: boolean;
}) {
  const getPreviewStyle = (): React.CSSProperties => {
    switch (template.id) {
      case "runaway-button":
        return { background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #fecdd3 100%)" };
      case "scratch-reveal":
        return { background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fbbf24 100%)" };
      case "y2k-digital-crush":
        return { background: "#c0c0c0", borderBottom: "2px solid #868a8e" };
      case "cozy-scrapbook":
        return {
          background: "linear-gradient(135deg, #fef9ef 0%, #fdf2e0 40%, #f5e6c8 100%)",
          backgroundImage: `linear-gradient(135deg, #fef9ef 0%, #fdf2e0 40%, #f5e6c8 100%), repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(210,180,140,0.05) 35px, rgba(210,180,140,0.05) 36px)`,
        };
      case "neon-arcade":
        return {
          background: "linear-gradient(180deg, #0a0014 0%, #1a0033 50%, #0d001a 100%)",
        };
      case "love-letter-mailbox":
        return { background: "linear-gradient(135deg, #fff5f5 0%, #fce4ec 40%, #f8bbd0 100%)" };
      case "stargazer":
        return {
          background: "linear-gradient(180deg, #050514 0%, #0a0a2e 40%, #1a1a4e 100%)",
        };
      case "avocado-valentine":
        return { background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)" };
      case "premiere":
        return {
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 40%, #0a0a0a 100%)",
        };
      default:
        return { background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)" };
    }
  };

  const cardW = isMd ? 300 : 240;
  const cardH = isMd ? 400 : 300;
  const previewH = isMd ? 200 : 150;

  return (
    <div
      style={{ width: cardW, height: cardH }}
      className={`bg-white rounded-2xl overflow-hidden select-none transition-all duration-300 border flex flex-col ${
        isCurrent
          ? "border-gray-200 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)]"
          : "border-gray-100 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
      }`}
    >
      {/* Preview area */}
      <div style={{ height: previewH, ...getPreviewStyle() }} className="flex items-center justify-center relative overflow-hidden">
        <TemplatePreviewArt templateId={template.id} />

        {/* Price badge */}
        <div className="absolute top-3 right-3 z-20">
          {template.is_free ? (
            <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-md text-[11px] font-semibold uppercase tracking-wider">
              Free
            </span>
          ) : (
            <span
              className="px-2.5 py-1 rounded-md text-[11px] font-bold"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f5c842, #d4a017)",
                color: "#5c3d00",
                boxShadow: "0 2px 8px rgba(212,160,23,0.35)",
                letterSpacing: "0.03em",
              }}
            >
              {formatPrice(template.price_cents)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base mb-1">
          {template.name}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {template.description}
        </p>

        {/* CTA button */}
        <div className={`pt-2 mt-auto transition-opacity duration-200 ${isCurrent ? 'opacity-100' : 'opacity-0'}`}>
          <div
            className="w-full py-2.5 rounded-lg text-center text-sm font-semibold text-white cursor-pointer hover:brightness-110 active:scale-[0.97] transition-all"
            style={{
              background: template.is_free
                ? "linear-gradient(135deg, #10b981, #059669)"
                : "linear-gradient(135deg, #e11d48, #f43f5e)",
              boxShadow: template.is_free
                ? "0 3px 10px rgba(16,185,129,0.3)"
                : "0 3px 10px rgba(225,29,72,0.3)",
            }}
          >
            {template.is_free ? "Pick this template — Free" : "Pick this template"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// TEMPLATE PREVIEW ART - mini illustrations
// ============================================

function TemplatePreviewArt({ templateId }: { templateId: string }) {
  switch (templateId) {
    case "runaway-button":
      return (
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Mini question */}
          <div className="px-4 py-1.5 rounded-lg bg-white/70 text-[11px] font-semibold text-rose-400 tracking-wide">
            Will you be my Valentine?
          </div>
          {/* Mini buttons */}
          <div className="flex items-center gap-3">
            <div className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold shadow-md">
              Yes! 💕
            </div>
            <motion.div
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-500 text-xs font-semibold"
              animate={{ x: [0, 12, -8, 15, -12, 0], y: [0, -6, 4, -10, 6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              No
            </motion.div>
          </div>
        </div>
      );

    case "scratch-reveal":
      return (
        <div className="relative z-10 w-[160px] h-[100px]">
          {/* Golden card */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #f9a825 0%, #fdd835 30%, #f57f17 60%, #fbc02d 100%)",
              boxShadow: "0 4px 20px rgba(245,127,23,0.3), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          />
          {/* Scratch marks */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute top-3 left-4 w-16 h-2 rounded-full bg-white/20 rotate-[-5deg]" />
            <div className="absolute top-7 left-6 w-12 h-1.5 rounded-full bg-white/15 rotate-[3deg]" />
            <div className="absolute bottom-5 right-4 w-14 h-2 rounded-full bg-white/20 rotate-[-8deg]" />
          </div>
          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2 text-yellow-300 text-lg"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✦
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -left-1 text-amber-300 text-sm"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            ✦
          </motion.div>
          {/* Center text hint */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/50 text-xs font-bold tracking-widest uppercase">Scratch me</span>
          </div>
        </div>
      );

    case "y2k-digital-crush":
      return (
        <div className="relative z-10 w-[170px]">
          {/* Win95 window */}
          <div className="rounded-sm overflow-hidden" style={{ border: "2px solid #868a8e", boxShadow: "2px 2px 0 #000, inset -1px -1px 0 #868a8e, inset 1px 1px 0 #fff" }}>
            {/* Title bar */}
            <div className="flex items-center gap-1 px-1.5 py-0.5" style={{ background: "linear-gradient(90deg, #000080, #1084d0)" }}>
              <span className="text-white text-[9px] font-bold flex-1">💕 crush.exe</span>
              <div className="flex gap-0.5">
                <div className="w-3 h-3 bg-[#c0c0c0] border border-t-white border-l-white border-b-[#868a8e] border-r-[#868a8e] flex items-center justify-center text-[7px] font-bold">_</div>
                <div className="w-3 h-3 bg-[#c0c0c0] border border-t-white border-l-white border-b-[#868a8e] border-r-[#868a8e] flex items-center justify-center text-[7px] font-bold">×</div>
              </div>
            </div>
            {/* Content */}
            <div className="bg-[#c0c0c0] p-2.5 text-center space-y-2" style={{ borderTop: "1px solid #fff" }}>
              <p className="text-[10px] font-bold text-[#000080]">Be my Valentine?</p>
              <div className="flex gap-1.5 justify-center">
                <div className="px-3 py-0.5 text-[9px] font-bold bg-[#c0c0c0] border border-t-white border-l-white border-b-[#868a8e] border-r-[#868a8e]">Yes ♥</div>
                <motion.div
                  className="px-3 py-0.5 text-[9px] font-bold bg-[#c0c0c0] border border-t-white border-l-white border-b-[#868a8e] border-r-[#868a8e] text-red-600"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  N̷o̷
                </motion.div>
              </div>
            </div>
          </div>
          {/* Error popup */}
          <motion.div
            className="absolute -bottom-3 -right-3 rounded-sm overflow-hidden"
            style={{ border: "2px solid #868a8e", boxShadow: "2px 2px 0 #000", width: "100px" }}
            animate={{ rotate: [0, -2, 0], y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center px-1 py-0.5" style={{ background: "linear-gradient(90deg, #800000, #ff0000)" }}>
              <span className="text-white text-[7px] font-bold">⚠ Error</span>
            </div>
            <div className="bg-[#c0c0c0] px-1.5 py-1">
              <p className="text-[7px] text-red-700 font-bold">crush.exe: No is not valid</p>
            </div>
          </motion.div>
        </div>
      );

    case "cozy-scrapbook":
      return (
        <div className="relative z-10">
          {/* Polaroid frame */}
          <div
            className="bg-white p-2 pb-8 rounded-sm relative"
            style={{
              transform: "rotate(-3deg)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            {/* Photo area */}
            <div
              className="w-[120px] h-[80px] rounded-sm flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)" }}
            >
              <span className="text-3xl">📸</span>
            </div>
            {/* Caption */}
            <p
              className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] text-gray-400"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              our memory ♥
            </p>
          </div>
          {/* Washi tape strips */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 opacity-60"
            style={{
              background: "repeating-linear-gradient(45deg, #f8bbd0, #f8bbd0 3px, #f48fb1 3px, #f48fb1 6px)",
              transform: "translateX(-50%) rotate(2deg)",
            }}
          />
          {/* Decorative sticker */}
          <motion.div
            className="absolute -bottom-3 -right-4 text-xl"
            animate={{ rotate: [0, 10, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌸
          </motion.div>
          {/* Small heart sticker */}
          <div className="absolute -top-3 -left-2 text-sm opacity-70">💗</div>
        </div>
      );

    case "neon-arcade":
      return (
        <div className="relative z-10 flex flex-col items-center">
          {/* Neon border frame */}
          <div
            className="relative px-5 py-3 rounded-lg"
            style={{
              border: "2px solid #7c4dff",
              boxShadow: "0 0 10px rgba(124,77,255,0.5), 0 0 30px rgba(124,77,255,0.2), inset 0 0 10px rgba(124,77,255,0.1)",
              background: "rgba(0,0,0,0.6)",
            }}
          >
            <motion.p
              className="text-center font-bold text-[11px] tracking-[0.2em] uppercase"
              style={{
                color: "#e040fb",
                textShadow: "0 0 8px rgba(224,64,251,0.8), 0 0 20px rgba(224,64,251,0.4)",
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Press Start
            </motion.p>
            <p
              className="text-center text-[9px] mt-1 tracking-widest"
              style={{
                color: "#69f0ae",
                textShadow: "0 0 6px rgba(105,240,174,0.6)",
              }}
            >
              ♥ PLAYER 1 ♥
            </p>
          </div>
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
            }}
          />
          {/* Glow dots */}
          <motion.div
            className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
            style={{ background: "#ff1744", boxShadow: "0 0 6px #ff1744" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
            style={{ background: "#00e5ff", boxShadow: "0 0 6px #00e5ff" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
        </div>
      );

    case "love-letter-mailbox":
      return (
        <div className="relative z-10">
          {/* Envelope */}
          <motion.div
            className="relative"
            style={{ width: "140px", height: "100px" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Envelope body */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(160deg, #fff5f5 0%, #fce4ec 40%, #f8bbd0 100%)",
                boxShadow: "0 10px 30px rgba(183,28,28,0.12)",
              }}
            />
            {/* Flap */}
            <div
              className="absolute -top-px left-0 right-0"
              style={{
                height: "50px",
                background: "linear-gradient(180deg, #f8bbd0 0%, #fce4ec 100%)",
                clipPath: "polygon(0 0, 50% 85%, 100% 0)",
                filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.05))",
              }}
            />
            {/* Wax seal */}
            <motion.div
              className="absolute left-1/2 flex items-center justify-center"
              style={{
                top: "28px",
                transform: "translateX(-50%)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 35%, #ef5350 0%, #c62828 60%, #8e1318 100%)",
                boxShadow: "0 3px 8px rgba(183,28,28,0.35), inset 0 -1px 3px rgba(0,0,0,0.2)",
                zIndex: 2,
              }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span style={{ fontSize: "14px", color: "#ffcdd2" }}>♥</span>
            </motion.div>
            {/* Paper lines */}
            <div className="absolute bottom-4 left-5 right-5 space-y-1.5 opacity-10">
              <div className="h-px bg-rose-400 w-3/4 mx-auto" />
              <div className="h-px bg-rose-400 w-1/2 mx-auto" />
            </div>
          </motion.div>
          {/* Floating petal */}
          <motion.div
            className="absolute -top-3 -right-3 text-base opacity-50"
            animate={{ y: [0, -8, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌸
          </motion.div>
        </div>
      );

    case "stargazer":
      return (
        <div className="absolute inset-0 z-10">
          {/* Stars scattered across the card */}
          {[
            { x: 15, y: 20, s: 2, d: 0, gold: false },
            { x: 72, y: 12, s: 1.5, d: 0.5, gold: true },
            { x: 40, y: 55, s: 2.5, d: 1.2, gold: false },
            { x: 85, y: 40, s: 1, d: 0.3, gold: false },
            { x: 25, y: 75, s: 1.5, d: 1.8, gold: true },
            { x: 60, y: 30, s: 1, d: 0.7, gold: false },
            { x: 50, y: 80, s: 2, d: 2, gold: false },
            { x: 10, y: 45, s: 1, d: 1.5, gold: false },
            { x: 90, y: 70, s: 1.5, d: 0.9, gold: true },
            { x: 33, y: 15, s: 1, d: 2.2, gold: false },
            { x: 78, y: 60, s: 2, d: 1, gold: false },
            { x: 55, y: 42, s: 1.5, d: 0.2, gold: false },
          ].map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.s,
                height: star.s,
                background: star.gold ? "#fbbf24" : "#e8e4ff",
                boxShadow: star.gold
                  ? `0 0 ${star.s * 3}px rgba(251,191,36,0.6)`
                  : `0 0 ${star.s * 2}px rgba(232,228,255,0.4)`,
              }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 2 + (i % 3), delay: star.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Nebula glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 70% 50% at 30% 40%, rgba(124,58,237,0.15), transparent),
                radial-gradient(ellipse 50% 70% at 75% 65%, rgba(236,72,153,0.1), transparent)
              `,
            }}
          />

          {/* Central constellation + text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Glowing star */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fbbf24",
                boxShadow: "0 0 20px #fbbf24, 0 0 40px rgba(124,58,237,0.5), 0 0 60px rgba(251,191,36,0.3)",
                marginBottom: 12,
              }}
            />

            {/* Title text */}
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "13px",
                fontWeight: 600,
                color: "#e8e4ff",
                textShadow: "0 0 20px rgba(124,58,237,0.6), 0 0 40px rgba(124,58,237,0.3)",
                letterSpacing: "0.08em",
              }}
            >
              written in the stars
            </p>

            {/* Decorative line */}
            <motion.div
              className="mt-2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 50, opacity: 0.4 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, #fbbf24, transparent)",
              }}
            />
          </div>

          {/* Shooting star */}
          <motion.div
            className="absolute"
            style={{
              top: "18%",
              left: "-10%",
              width: 40,
              height: 1,
              background: "linear-gradient(90deg, transparent, #fbbf24, transparent)",
              borderRadius: 1,
              opacity: 0.6,
            }}
            animate={{
              left: ["−10%", "110%"],
              top: ["18%", "35%"],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              delay: 1.5,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeOut",
            }}
          />
        </div>
      );

    case "avocado-valentine":
      return (
        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl"
          >
            🥑
          </motion.div>
          <p
            className="mt-2 text-[10px] font-bold text-green-700 tracking-wide"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            You&apos;re the good kind of fat
          </p>
        </div>
      );

    case "premiere":
      return (
        <div className="absolute inset-0 z-10">
          {/* Film grain subtle texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: "overlay",
            }}
          />

          {/* Red velvet curtain sides */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: "15%",
              background: "linear-gradient(90deg, #8b1a2b 0%, #5a1018 60%, transparent 100%)",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0"
            style={{
              width: "15%",
              background: "linear-gradient(-90deg, #8b1a2b 0%, #5a1018 60%, transparent 100%)",
              opacity: 0.7,
            }}
          />

          {/* Gold spotlight beam from top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "60%",
              height: "70%",
              background: "radial-gradient(ellipse at top center, rgba(212,160,23,0.15) 0%, transparent 70%)",
            }}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Clapperboard icon */}
            <motion.div
              className="relative mb-3"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                style={{
                  width: 44,
                  height: 32,
                  background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
                  border: "1.5px solid #d4a017",
                  borderRadius: 3,
                  position: "relative",
                }}
              >
                {/* Clapperboard top (the clapper) */}
                <motion.div
                  animate={{ rotate: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: -8,
                    left: -1,
                    width: 46,
                    height: 10,
                    background: "repeating-linear-gradient(135deg, #d4a017 0px, #d4a017 4px, #0a0a0a 4px, #0a0a0a 8px)",
                    borderRadius: "2px 2px 0 0",
                    transformOrigin: "left bottom",
                  }}
                />
                {/* Text lines on board */}
                <div className="absolute bottom-1 left-1 right-1 flex flex-col gap-[2px]">
                  <div style={{ height: 1, background: "#d4a017", opacity: 0.4 }} />
                  <div style={{ height: 1, background: "#d4a017", opacity: 0.3, width: "70%" }} />
                </div>
              </div>
            </motion.div>

            {/* Title text */}
            <p
              style={{
                fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                color: "#d4a017",
                textShadow: "0 0 20px rgba(212,160,23,0.5), 0 0 40px rgba(212,160,23,0.2)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Premiere
            </p>

            {/* Decorative line */}
            <motion.div
              className="mt-1"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 40, opacity: 0.5 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, #c41e3a, transparent)",
              }}
            />
          </div>

          {/* Vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
            }}
          />
        </div>
      );

    default:
      return <span className="text-7xl relative z-10">{templateId}</span>;
  }
}

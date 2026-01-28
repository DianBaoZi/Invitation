"use client";

// ============================================
// INTERACTION PREVIEW CARD
// Animated cards showing mini demos of each interaction
// ============================================

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, Sparkles } from "lucide-react";
import { InteractionDefinition, PLAYFUL_COLORS } from "./types";

interface InteractionPreviewCardProps {
  interaction: InteractionDefinition;
  isSelected: boolean;
  selectionOrder?: number;
  onSelect: () => void;
  disabled?: boolean;
}

export function InteractionPreviewCard({
  interaction,
  isSelected,
  selectionOrder,
  onSelect,
  disabled = false,
}: InteractionPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -4 },
    tap: { scale: 0.98 },
    selected: { scale: 1, y: 0 },
  };

  const isLocked = !interaction.isAvailable;
  const isPremium = interaction.isPremium && interaction.isAvailable;

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${disabled ? "pointer-events-none opacity-50" : ""}`}
      variants={cardVariants}
      initial="initial"
      whileHover={!isSelected && !disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      animate={isSelected ? "selected" : "initial"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !disabled && !isLocked && onSelect()}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute -inset-1 rounded-2xl z-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: PLAYFUL_COLORS.funGradient,
            }}
          />
        )}
      </AnimatePresence>

      {/* Main card */}
      <div
        className={`relative overflow-hidden rounded-xl p-4 transition-shadow duration-300 ${
          isSelected
            ? "bg-white shadow-lg"
            : "bg-white border border-gray-100 shadow-md hover:shadow-xl"
        }`}
        style={{
          boxShadow: isHovered && !isSelected
            ? PLAYFUL_COLORS.cardShadowHover
            : PLAYFUL_COLORS.cardShadow,
        }}
      >
        {/* Selection badge */}
        {isSelected && selectionOrder !== undefined && (
          <motion.div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            style={{ background: PLAYFUL_COLORS.funGradient }}
          >
            {selectionOrder}
          </motion.div>
        )}

        {/* Premium badge */}
        {isPremium && !isSelected && (
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold text-white flex items-center gap-1 z-10"
            style={{ background: PLAYFUL_COLORS.funGradient }}
          >
            <Sparkles className="w-3 h-3" />
            Premium
          </div>
        )}

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-20">
            <Lock className="w-8 h-8 text-white/80 mb-2" />
            <span className="text-white/80 text-sm font-medium">Coming Soon</span>
          </div>
        )}

        {/* Mini demo area */}
        <div className="h-32 mb-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          <MiniDemo interaction={interaction} isHovered={isHovered} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{interaction.emoji}</span>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {interaction.name}
            </h3>
          </div>

          {/* Short description */}
          <p className="text-sm text-gray-500 leading-snug">
            {interaction.shortDescription}
          </p>
        </div>

        {/* Hover effect glow */}
        {isHovered && !isSelected && !isLocked && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              boxShadow: `inset 0 0 0 2px ${PLAYFUL_COLORS.purple}40`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// MINI DEMO COMPONENTS
// Live previews of each interaction
// ============================================

interface MiniDemoProps {
  interaction: InteractionDefinition;
  isHovered: boolean;
}

function MiniDemo({ interaction, isHovered }: MiniDemoProps) {
  switch (interaction.type) {
    case "yes-no-runaway":
      return <RunawayButtonDemo isHovered={isHovered} />;
    case "yes-no-shrinking":
      return <ShrinkingButtonDemo isHovered={isHovered} />;
    case "scratch-reveal":
      return <ScratchRevealDemo isHovered={isHovered} />;
    case "spin-wheel":
      return <SpinWheelDemo isHovered={isHovered} />;
    case "shake-reveal":
      return <ShakeRevealDemo isHovered={isHovered} />;
    case "swipe-cards":
      return <SwipeCardsDemo isHovered={isHovered} />;
    case "tap-counter":
      return <TapCounterDemo isHovered={isHovered} />;
    default:
      return <DefaultDemo emoji={interaction.emoji} />;
  }
}

// Runaway Button Demo
function RunawayButtonDemo({ isHovered }: { isHovered: boolean }) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = () => {
    const newX = (Math.random() - 0.5) * 60;
    const newY = (Math.random() - 0.5) * 40;
    setNoPos({ x: newX, y: newY });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center gap-3">
      {/* Yes button */}
      <motion.button
        className="px-4 py-2 rounded-lg text-white text-sm font-medium"
        style={{ background: PLAYFUL_COLORS.green }}
        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        Yes
      </motion.button>

      {/* No button that runs away */}
      <motion.button
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium"
        animate={{ x: noPos.x, y: noPos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        onHoverStart={moveNoButton}
      >
        No
      </motion.button>
    </div>
  );
}

// Shrinking Button Demo
function ShrinkingButtonDemo({ isHovered }: { isHovered: boolean }) {
  const [scale, setScale] = useState(1);

  return (
    <div className="relative w-full h-full flex items-center justify-center gap-3">
      <motion.button
        className="px-4 py-2 rounded-lg text-white text-sm font-medium"
        style={{ background: PLAYFUL_COLORS.green }}
        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        Yes
      </motion.button>

      <motion.button
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium"
        animate={{ scale }}
        onHoverStart={() => setScale((s) => Math.max(0.3, s - 0.2))}
        onHoverEnd={() => setScale(1)}
      >
        No
      </motion.button>
    </div>
  );
}

// Scratch Reveal Demo
function ScratchRevealDemo({ isHovered }: { isHovered: boolean }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-28 h-16 rounded-lg overflow-hidden">
        {/* Hidden content */}
        <div
          className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ background: PLAYFUL_COLORS.funGradient }}
        >
          🎉 You&apos;re Invited!
        </div>

        {/* Scratch overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 50%, #D4AF37 100%)",
          }}
          animate={isHovered ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onHoverStart={() => setRevealed((r) => Math.min(100, r + 30))}
        >
          <span className="text-amber-900 text-xs font-medium">Scratch me!</span>
        </motion.div>
      </div>
    </div>
  );
}

// Spin Wheel Demo
function SpinWheelDemo({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="w-20 h-20 rounded-full border-4 border-gray-200 relative overflow-hidden"
        animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
      >
        {/* Wheel segments */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{
              background: `conic-gradient(from ${i * 60}deg, ${
                i % 2 === 0 ? PLAYFUL_COLORS.purple : PLAYFUL_COLORS.pink
              } 0deg, ${
                i % 2 === 0 ? PLAYFUL_COLORS.purple : PLAYFUL_COLORS.pink
              } 60deg, transparent 60deg)`,
            }}
          />
        ))}
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white shadow-md" />
        </div>
      </motion.div>

      {/* Pointer */}
      <div
        className="absolute top-2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent"
        style={{ borderTopColor: PLAYFUL_COLORS.yellow }}
      />
    </div>
  );
}

// Shake Reveal Demo (Coming Soon)
function ShakeRevealDemo({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center"
        animate={isHovered ? { x: [-3, 3, -3, 3, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
      >
        <span className="text-3xl">📱</span>
        <span className="text-xs text-gray-400 mt-1">Shake!</span>
      </motion.div>
    </div>
  );
}

// Swipe Cards Demo (Coming Soon)
function SwipeCardsDemo({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-16 h-20">
        {[2, 1, 0].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-lg bg-white border border-gray-200 shadow-md flex items-center justify-center"
            style={{
              transform: `rotate(${i * 3 - 3}deg)`,
              zIndex: 3 - i,
            }}
            animate={
              isHovered && i === 0
                ? { x: [0, 40, 0], rotate: [0, 5, 0] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="text-lg">💌</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Tap Counter Demo (Coming Soon)
function TapCounterDemo({ isHovered }: { isHovered: boolean }) {
  const [count, setCount] = useState(0);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
      <motion.button
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
        style={{ background: PLAYFUL_COLORS.funGradient }}
        animate={isHovered ? { scale: [1, 0.9, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.3 }}
        onClick={() => setCount((c) => c + 1)}
      >
        👆
      </motion.button>
      <div className="text-xs text-gray-400">{count}/10 taps</div>
    </div>
  );
}

// Default demo fallback
function DefaultDemo({ emoji }: { emoji: string }) {
  return (
    <motion.div
      className="text-5xl"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >
      {emoji}
    </motion.div>
  );
}

export default InteractionPreviewCard;

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ArrowLeft, Heart, Share2, Sparkles, Gift, Star } from "lucide-react";

// ============================================
// ROMANTIC COLOR PALETTE
// ============================================
const VALENTINE_COLORS = {
  // Primary romance
  rose: "#E11D48",
  roseLight: "#FB7185",
  roseDark: "#BE123C",
  blush: "#FFF1F2",

  // Warm accents
  gold: "#D4AF37",
  goldLight: "#F7E7CE",
  champagne: "#F7E7CE",

  // Deep romance
  burgundy: "#881337",
  wine: "#4C0519",

  // Soft neutrals
  cream: "#FFFBEB",
  ivory: "#FFFFF0",

  // Text
  text: "#1F2937",
  textMuted: "#6B7280",
  white: "#FFFFFF",
};

// ============================================
// FONT CONFIGURATION
// ============================================
const FONTS = {
  script: "'Great Vibes', cursive",
  serif: "'Playfair Display', serif",
  sans: "'Lato', sans-serif",
};

// ============================================
// INTERFACES
// ============================================
interface InteractionData {
  interactionType?: "yes-no-runaway" | "yes-no-shrinking" | "scratch-reveal" | "spin-wheel";
  interactionId?: string;
  role?: "question" | "yes-button" | "no-button" | "reveal-area" | "wheel" | "sticker";
  wheelOptions?: string[];
  revealContent?: string;
  stickerType?: string;
  stickerAnimation?: Record<string, number[]>;
}

interface FabricObject {
  type: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  backgroundColor?: string;
  textAlign?: string;
  radius?: number;
  rx?: number;
  ry?: number;
  stroke?: string;
  strokeWidth?: number;
  data?: InteractionData;
  objects?: FabricObject[];
  originX?: string;
  originY?: string;
}

interface FabricDesign {
  objects: FabricObject[];
  background?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

interface InteractionState {
  noButtonScale: Record<string, number>;
  noButtonPosition: Record<string, { x: number; y: number }>;
  noButtonAttempts: Record<string, number>;
  scratchRevealed: Record<string, boolean>;
  scratchProgress: Record<string, number>;
  wheelSpinning: Record<string, boolean>;
  wheelRotation: Record<string, number>;
  wheelResult: Record<string, string>;
  showSuccessMessage: boolean;
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================
const FloatingHearts = () => {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: 10 + Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-rose-300"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          animate={{
            y: [800, -100],
            x: [0, Math.sin(heart.id) * 30],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// SPARKLE EFFECT
// ============================================
const SparkleEffect = ({ active }: { active: boolean }) => {
  if (!active) return null;

  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    delay: i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute left-1/2 top-1/2 w-2 h-2"
          style={{
            background: `radial-gradient(circle, ${VALENTINE_COLORS.gold} 0%, transparent 70%)`,
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((sparkle.angle * Math.PI) / 180) * 60,
            y: Math.sin((sparkle.angle * Math.PI) / 180) * 60,
          }}
          transition={{
            duration: 0.6,
            delay: sparkle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// YES BUTTON COMPONENT
// ============================================
const YesButton = ({
  pos,
  onClick,
  label = "Yes"
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  onClick: () => void;
  label?: string;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className="absolute cursor-pointer overflow-visible"
      style={{ left: pos.adjustedLeft, top: pos.adjustedTop, width: pos.width, height: pos.height }}
      onClick={() => {
        setIsPressed(true);
        onClick();
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <SparkleEffect active={isPressed} />
      <motion.div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${VALENTINE_COLORS.rose} 0%, ${VALENTINE_COLORS.roseDark} 100%)`,
          boxShadow: `0 4px 20px ${VALENTINE_COLORS.rose}50, inset 0 2px 4px rgba(255,255,255,0.3)`,
          fontFamily: FONTS.sans,
          fontSize: Math.min(pos.width, pos.height) * 0.35,
          letterSpacing: "0.05em",
        }}
        animate={isPressed ? { scale: [1, 1.1, 1] } : {}}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)",
          }}
          animate={{ x: [-200, 200] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <span className="relative z-10">{label} 💕</span>
      </motion.div>
    </motion.button>
  );
};

// ============================================
// RUNAWAY NO BUTTON
// ============================================
const RunawayNoButton = ({
  pos,
  position,
  attempts,
  onHover,
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  position: { x: number; y: number };
  attempts: number;
  onHover: () => void;
}) => {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailId = useRef(0);

  const taunts = [
    "No 😏",
    "Nope! 🏃",
    "Can't catch me!",
    "Try again! 😜",
    "Too slow!",
    "Hehe! 💨",
    "Miss me?",
    "Keep trying!",
  ];

  const handleHover = () => {
    // Add trail effect
    setTrail((prev) => [...prev.slice(-5), { x: position.x, y: position.y, id: trailId.current++ }]);
    onHover();
  };

  return (
    <>
      {/* Trail effects */}
      <AnimatePresence>
        {trail.map((t) => (
          <motion.div
            key={t.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: t.x,
              top: t.y,
              width: pos.width,
              height: pos.height,
              background: VALENTINE_COLORS.textMuted,
              opacity: 0.2,
            }}
            initial={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 0.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

      <motion.button
        className="absolute cursor-pointer"
        animate={{
          left: position.x,
          top: position.y,
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          rotate: { duration: 0.3 }
        }}
        style={{ width: pos.width, height: pos.height }}
        onMouseEnter={handleHover}
        onTouchStart={handleHover}
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-medium relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${VALENTINE_COLORS.textMuted} 0%, #4B5563 100%)`,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            fontFamily: FONTS.sans,
            fontSize: Math.min(pos.width, pos.height) * 0.28,
          }}
          whileHover={{ scale: 0.95 }}
        >
          <motion.span
            key={attempts}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            {taunts[attempts % taunts.length]}
          </motion.span>
        </motion.div>
      </motion.button>
    </>
  );
};

// ============================================
// SHRINKING NO BUTTON
// ============================================
const ShrinkingNoButton = ({
  pos,
  scale,
  onClick,
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  scale: number;
  onClick: () => void;
}) => {
  const [wobble, setWobble] = useState(false);

  // Color transitions as button shrinks
  const hue = Math.round(220 + (1 - scale) * 40); // Goes from gray to slightly purple
  const saturation = Math.round(10 + (1 - scale) * 30);

  const messages = scale > 0.7 ? "No" : scale > 0.4 ? "No... 😰" : "ok fine... 😢";

  const handleClick = () => {
    setWobble(true);
    setTimeout(() => setWobble(false), 500);
    onClick();
  };

  if (scale < 0.15) return null;

  return (
    <motion.button
      className="absolute cursor-pointer origin-center"
      style={{
        left: pos.adjustedLeft,
        top: pos.adjustedTop,
        width: pos.width,
        height: pos.height,
      }}
      animate={{
        scale,
        rotate: wobble ? [0, -10, 10, -5, 5, 0] : 0,
      }}
      transition={{
        scale: { type: "spring", stiffness: 300, damping: 15 },
        rotate: { duration: 0.5 }
      }}
      onClick={handleClick}
    >
      <motion.div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-medium relative overflow-hidden"
        style={{
          background: `hsl(${hue}, ${saturation}%, 45%)`,
          boxShadow: `0 4px 15px hsla(${hue}, ${saturation}%, 30%, 0.3)`,
          fontFamily: FONTS.sans,
          fontSize: Math.min(pos.width, pos.height) * 0.3,
        }}
        animate={{
          boxShadow: wobble
            ? `0 0 30px hsla(${hue}, ${saturation}%, 50%, 0.5)`
            : `0 4px 15px hsla(${hue}, ${saturation}%, 30%, 0.3)`,
        }}
      >
        <motion.span
          key={messages}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {messages}
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

// ============================================
// GOLDEN SCRATCH REVEAL
// ============================================
const GoldenScratchReveal = ({
  pos,
  isRevealed,
  revealContent,
  progress,
  onScratch,
  onReveal,
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  isRevealed: boolean;
  revealContent: string;
  progress: number;
  onScratch: (progress: number) => void;
  onReveal: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [scratched, setScratched] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create golden gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, pos.width, pos.height);
    gradient.addColorStop(0, "#D4AF37");
    gradient.addColorStop(0.3, "#F7E7CE");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(0.7, "#B8860B");
    gradient.addColorStop(1, "#D4AF37");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, pos.width, pos.height);

    // Add shimmer pattern
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * pos.width;
      const y = Math.random() * pos.height;
      const radius = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Add text
    ctx.font = `bold ${Math.min(pos.width, pos.height) * 0.15}px ${FONTS.sans}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#8B4513";
    ctx.fillText("✨ Scratch Me! ✨", pos.width / 2, pos.height / 2);
  }, [pos.width, pos.height, isRevealed]);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] < 128) transparent++;
    }
    const newProgress = (transparent / (canvas.width * canvas.height)) * 100;
    setScratched(newProgress);
    onScratch(newProgress);

    if (newProgress > 50 && !isRevealed) {
      setShowSparkles(true);
      setTimeout(() => onReveal(), 300);
    }
  };

  return (
    <div
      className="absolute cursor-pointer overflow-hidden"
      style={{
        left: pos.adjustedLeft,
        top: pos.adjustedTop,
        width: pos.width,
        height: pos.height,
        borderRadius: 16,
        boxShadow: `0 8px 32px ${VALENTINE_COLORS.gold}40`,
      }}
    >
      {/* Hidden content */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{
          background: `linear-gradient(135deg, ${VALENTINE_COLORS.blush} 0%, ${VALENTINE_COLORS.cream} 100%)`,
        }}
        animate={isRevealed ? { scale: [0.9, 1.05, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-center font-bold"
          style={{
            fontFamily: FONTS.script,
            fontSize: Math.min(pos.width, pos.height) * 0.2,
            color: VALENTINE_COLORS.rose,
            textShadow: `0 2px 10px ${VALENTINE_COLORS.rose}30`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {revealContent}
        </motion.p>
      </motion.div>

      {/* Scratch overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            width={pos.width}
            height={pos.height}
            className="absolute inset-0"
            style={{ touchAction: "none" }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onMouseDown={() => (isDrawing.current = true)}
            onMouseUp={() => (isDrawing.current = false)}
            onMouseLeave={() => (isDrawing.current = false)}
            onMouseMove={scratch}
            onTouchStart={() => (isDrawing.current = true)}
            onTouchEnd={() => (isDrawing.current = false)}
            onTouchMove={scratch}
          />
        )}
      </AnimatePresence>

      {/* Sparkle burst on reveal */}
      {showSparkles && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 text-yellow-400"
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
              }}
              transition={{ duration: 0.8, delay: i * 0.02 }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Decorative border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: `3px solid ${VALENTINE_COLORS.gold}`,
          borderRadius: 16,
        }}
      />
    </div>
  );
};

// ============================================
// CASINO SPIN WHEEL
// ============================================
const CasinoSpinWheel = ({
  pos,
  options,
  isSpinning,
  rotation,
  result,
  onSpin,
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  options: string[];
  isSpinning: boolean;
  rotation: number;
  result: string | null;
  onSpin: () => void;
}) => {
  const size = Math.min(pos.width, pos.height);
  const segmentAngle = 360 / options.length;

  const colors = [
    VALENTINE_COLORS.rose,
    VALENTINE_COLORS.gold,
    VALENTINE_COLORS.roseLight,
    VALENTINE_COLORS.champagne,
    VALENTINE_COLORS.burgundy,
    "#FF6B9D",
  ];

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{ left: pos.adjustedLeft, top: pos.adjustedTop, width: pos.width, height: pos.height }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size + 20,
          height: size + 20,
          background: `radial-gradient(circle, ${VALENTINE_COLORS.gold}40 0%, transparent 70%)`,
        }}
        animate={isSpinning ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
      />

      {/* Wheel container */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Wheel */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            boxShadow: `
              0 0 0 4px ${VALENTINE_COLORS.gold},
              0 0 0 8px ${VALENTINE_COLORS.wine},
              0 10px 40px rgba(0,0,0,0.3)
            `,
          }}
          animate={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 4 : 0,
            ease: [0.2, 0.8, 0.3, 1],
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {options.map((option, i) => {
              const startAngle = i * segmentAngle - 90;
              const endAngle = (i + 1) * segmentAngle - 90;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);
              const largeArc = segmentAngle > 180 ? 1 : 0;
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
              const textX = 50 + 32 * Math.cos(midAngle);
              const textY = 50 + 32 * Math.sin(midAngle);
              const textRotation = (startAngle + endAngle) / 2 + 90;

              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={colors[i % colors.length]}
                    stroke={VALENTINE_COLORS.white}
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill={VALENTINE_COLORS.white}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {option.length > 10 ? option.slice(0, 8) + "..." : option}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center hub */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            background: `linear-gradient(135deg, ${VALENTINE_COLORS.gold} 0%, ${VALENTINE_COLORS.champagne} 100%)`,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
        >
          <Heart className="w-1/2 h-1/2" style={{ color: VALENTINE_COLORS.rose }} fill={VALENTINE_COLORS.rose} />
        </div>

        {/* Pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: -15 }}
        >
          <motion.div
            animate={isSpinning ? { y: [0, 3, 0] } : {}}
            transition={{ duration: 0.1, repeat: isSpinning ? Infinity : 0 }}
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <polygon
                points="15,30 0,0 30,0"
                fill={VALENTINE_COLORS.wine}
                stroke={VALENTINE_COLORS.gold}
                strokeWidth="2"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Result display */}
      <AnimatePresence>
        {result && !isSpinning && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center p-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <p
                className="font-bold text-white"
                style={{
                  fontFamily: FONTS.script,
                  fontSize: size * 0.15,
                  textShadow: `0 2px 10px ${VALENTINE_COLORS.rose}`,
                }}
              >
                {result}
              </p>
              <p className="text-white/80 text-sm mt-1">🎉 Winner! 🎉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// SPIN BUTTON
// ============================================
const SpinButton = ({
  pos,
  onClick,
  isSpinning,
}: {
  pos: { left: number; top: number; width: number; height: number; transform: string; adjustedLeft: number; adjustedTop: number };
  onClick: () => void;
  isSpinning: boolean;
}) => {
  return (
    <motion.button
      className="absolute cursor-pointer"
      style={{ left: pos.adjustedLeft, top: pos.adjustedTop, width: pos.width, height: pos.height }}
      onClick={onClick}
      whileHover={!isSpinning ? { scale: 1.05 } : {}}
      whileTap={!isSpinning ? { scale: 0.95 } : {}}
      disabled={isSpinning}
    >
      <motion.div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold relative overflow-hidden"
        style={{
          background: isSpinning
            ? `linear-gradient(135deg, ${VALENTINE_COLORS.textMuted} 0%, #4B5563 100%)`
            : `linear-gradient(135deg, ${VALENTINE_COLORS.gold} 0%, ${VALENTINE_COLORS.champagne} 50%, ${VALENTINE_COLORS.gold} 100%)`,
          boxShadow: `0 4px 20px ${VALENTINE_COLORS.gold}50`,
          fontFamily: FONTS.sans,
          fontSize: Math.min(pos.width, pos.height) * 0.3,
          color: isSpinning ? VALENTINE_COLORS.white : VALENTINE_COLORS.wine,
        }}
        animate={isSpinning ? { rotate: 360 } : {}}
        transition={isSpinning ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
      >
        {isSpinning ? "🎰" : "Spin! 🎲"}
      </motion.div>
    </motion.button>
  );
};

// ============================================
// SUCCESS CELEBRATION
// ============================================
const SuccessCelebration = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `${VALENTINE_COLORS.wine}CC` }}
      onClick={onClose}
    >
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -50,
            }}
            animate={{
              y: -800,
              x: (Math.random() - 0.5) * 100,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 0.5,
              ease: "easeOut",
            }}
          >
            {["💕", "💖", "💗", "💝", "❤️", "✨"][i % 6]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative rounded-3xl p-10 text-center mx-4"
        style={{
          background: `linear-gradient(145deg, ${VALENTINE_COLORS.cream} 0%, ${VALENTINE_COLORS.blush} 100%)`,
          boxShadow: `0 25px 60px rgba(0,0,0,0.4), 0 0 100px ${VALENTINE_COLORS.rose}40`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 text-2xl opacity-50">✨</div>
        <div className="absolute top-4 right-4 text-2xl opacity-50">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-50">✨</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-50">✨</div>

        {/* Pulsing heart */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <Heart
            className="w-20 h-20 mx-auto mb-4"
            style={{ color: VALENTINE_COLORS.rose }}
            fill={VALENTINE_COLORS.rose}
          />
        </motion.div>

        <motion.h2
          className="mb-3"
          style={{
            fontFamily: FONTS.script,
            fontSize: "3rem",
            color: VALENTINE_COLORS.rose,
            textShadow: `0 2px 10px ${VALENTINE_COLORS.rose}30`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Yay!
        </motion.h2>

        <motion.p
          style={{
            fontFamily: FONTS.serif,
            fontSize: "1.25rem",
            color: VALENTINE_COLORS.text,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Thank you for saying yes! 💕
        </motion.p>

        <motion.p
          className="mt-4"
          style={{
            fontFamily: FONTS.sans,
            fontSize: "0.875rem",
            color: VALENTINE_COLORS.textMuted,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Tap anywhere to close
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// MAIN PREVIEW RENDERER
// ============================================
export function PreviewRenderer() {
  const router = useRouter();
  const [design, setDesign] = useState<FabricDesign | null>(null);
  const [state, setState] = useState<InteractionState>({
    noButtonScale: {},
    noButtonPosition: {},
    noButtonAttempts: {},
    scratchRevealed: {},
    scratchProgress: {},
    wheelSpinning: {},
    wheelRotation: {},
    wheelResult: {},
    showSuccessMessage: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@400;600;700&family=Lato:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  useEffect(() => {
    const savedDesign = localStorage.getItem("invitation-design");
    if (savedDesign) {
      try {
        const parsed = JSON.parse(savedDesign);
        console.log("Loaded design from localStorage:", parsed);
        console.log("Objects in design:", parsed.objects?.map((o: FabricObject) => ({
          type: o.type,
          text: o.text,
          data: o.data,
          left: o.left,
          top: o.top,
        })));
        setDesign(parsed);
      } catch (e) {
        console.error("Failed to parse design:", e);
      }
    } else {
      console.log("No saved design found in localStorage");
    }
  }, []);

  const triggerConfetti = useCallback(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = [VALENTINE_COLORS.rose, VALENTINE_COLORS.roseLight, VALENTINE_COLORS.gold, "#FF6B9D"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const handleYesClick = useCallback(() => {
    triggerConfetti();
    setState((prev) => ({ ...prev, showSuccessMessage: true }));
  }, [triggerConfetti]);

  const handleNoButtonHover = useCallback(
    (interactionId: string, obj: FabricObject) => {
      if (obj.data?.interactionType !== "yes-no-runaway") return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const objWidth = (obj.width || 100) * (obj.scaleX || 1);
      const objHeight = (obj.height || 44) * (obj.scaleY || 1);
      const maxX = rect.width - objWidth - 10;
      const maxY = rect.height - objHeight - 10;

      // Calculate initial position adjusted for origin
      let initialX = obj.left || 0;
      let initialY = obj.top || 0;
      if (obj.originX === "center") initialX -= objWidth / 2;
      if (obj.originY === "center") initialY -= objHeight / 2;

      const currentPos = state.noButtonPosition[interactionId] || { x: initialX, y: initialY };
      let newX = Math.random() * maxX;
      let newY = Math.random() * maxY;

      const minDistance = 100;
      let attempts = 0;
      while (
        Math.abs(newX - currentPos.x) < minDistance &&
        Math.abs(newY - currentPos.y) < minDistance &&
        attempts < 15
      ) {
        newX = Math.random() * maxX;
        newY = Math.random() * maxY;
        attempts++;
      }

      setState((prev) => ({
        ...prev,
        noButtonPosition: { ...prev.noButtonPosition, [interactionId]: { x: newX, y: newY } },
        noButtonAttempts: {
          ...prev.noButtonAttempts,
          [interactionId]: (prev.noButtonAttempts[interactionId] || 0) + 1
        },
      }));
    },
    [state.noButtonPosition]
  );

  const handleNoButtonClick = useCallback(
    (interactionId: string, obj: FabricObject) => {
      if (obj.data?.interactionType !== "yes-no-shrinking") return;

      const currentScale = state.noButtonScale[interactionId] ?? 1;
      const newScale = currentScale * 0.7;

      if (newScale < 0.15) {
        handleYesClick();
        return;
      }

      setState((prev) => ({
        ...prev,
        noButtonScale: { ...prev.noButtonScale, [interactionId]: newScale },
      }));
    },
    [state.noButtonScale, handleYesClick]
  );

  const handleScratchProgress = useCallback((interactionId: string, progress: number) => {
    setState((prev) => ({
      ...prev,
      scratchProgress: { ...prev.scratchProgress, [interactionId]: progress },
    }));
  }, []);

  const handleScratchReveal = useCallback((interactionId: string) => {
    triggerConfetti();
    setState((prev) => ({
      ...prev,
      scratchRevealed: { ...prev.scratchRevealed, [interactionId]: true },
    }));
  }, [triggerConfetti]);

  const handleSpinWheel = useCallback(
    (interactionId: string, options: string[]) => {
      if (state.wheelSpinning[interactionId]) return;

      const currentRotation = state.wheelRotation[interactionId] || 0;
      const spins = 5 + Math.random() * 3;
      const segmentAngle = 360 / options.length;
      const resultIndex = Math.floor(Math.random() * options.length);
      const finalRotation = currentRotation + spins * 360 + (360 - resultIndex * segmentAngle - segmentAngle / 2);

      setState((prev) => ({
        ...prev,
        wheelSpinning: { ...prev.wheelSpinning, [interactionId]: true },
        wheelRotation: { ...prev.wheelRotation, [interactionId]: finalRotation },
        wheelResult: { ...prev.wheelResult, [interactionId]: "" },
      }));

      setTimeout(() => {
        triggerConfetti();
        setState((prev) => ({
          ...prev,
          wheelSpinning: { ...prev.wheelSpinning, [interactionId]: false },
          wheelResult: { ...prev.wheelResult, [interactionId]: options[resultIndex] },
        }));
      }, 4000);
    },
    [state.wheelSpinning, state.wheelRotation, triggerConfetti]
  );

  const getObjectPosition = (obj: FabricObject) => {
    const left = obj.left || 0;
    const top = obj.top || 0;
    const scaleX = obj.scaleX || 1;
    const scaleY = obj.scaleY || 1;
    const width = (obj.width || 100) * scaleX;
    const height = (obj.height || 40) * scaleY;

    // Calculate CSS transform based on origin
    const isCenteredX = obj.originX === "center";
    const isCenteredY = obj.originY === "center";
    const transformX = isCenteredX ? "-50%" : obj.originX === "right" ? "-100%" : "0";
    const transformY = isCenteredY ? "-50%" : obj.originY === "bottom" ? "-100%" : "0";
    const transform = `translate(${transformX}, ${transformY})`;

    // Calculate adjusted coordinates (top-left corner) for animated elements
    let adjustedLeft = left;
    let adjustedTop = top;
    if (isCenteredX) adjustedLeft -= width / 2;
    else if (obj.originX === "right") adjustedLeft -= width;
    if (isCenteredY) adjustedTop -= height / 2;
    else if (obj.originY === "bottom") adjustedTop -= height;

    // Debug logging
    console.log("Object position:", {
      type: obj.type,
      role: obj.data?.role,
      left,
      top,
      adjustedLeft,
      adjustedTop,
      width,
      height,
      originX: obj.originX,
      originY: obj.originY,
      transform,
    });

    return { left, top, adjustedLeft, adjustedTop, width, height, transform, isCenteredX, isCenteredY };
  };

  const renderObject = (obj: FabricObject, index: number) => {
    const { data } = obj;
    const interactionId = data?.interactionId || `obj_${index}`;
    const role = data?.role;
    const interactionType = data?.interactionType;
    const pos = getObjectPosition(obj);

    // Handle Yes button
    if (role === "yes-button" && interactionType !== "spin-wheel") {
      return <YesButton key={index} pos={pos} onClick={handleYesClick} />;
    }

    // Handle Spin button
    if (role === "yes-button" && interactionType === "spin-wheel") {
      const isSpinning = state.wheelSpinning[interactionId] || false;
      const wheelOptions = data?.wheelOptions || ["Option 1", "Option 2", "Option 3"];
      return (
        <SpinButton
          key={index}
          pos={pos}
          onClick={() => handleSpinWheel(interactionId, wheelOptions)}
          isSpinning={isSpinning}
        />
      );
    }

    // Handle No button (Runaway)
    if (role === "no-button" && interactionType === "yes-no-runaway") {
      // Use adjusted coordinates for animated position (top-left based)
      const position = state.noButtonPosition[interactionId] || { x: pos.adjustedLeft, y: pos.adjustedTop };
      const attempts = state.noButtonAttempts[interactionId] || 0;
      return (
        <RunawayNoButton
          key={index}
          pos={pos}
          position={position}
          attempts={attempts}
          onHover={() => handleNoButtonHover(interactionId, obj)}
        />
      );
    }

    // Handle No button (Shrinking)
    if (role === "no-button" && interactionType === "yes-no-shrinking") {
      const scale = state.noButtonScale[interactionId] ?? 1;
      return (
        <ShrinkingNoButton
          key={index}
          pos={pos}
          scale={scale}
          onClick={() => handleNoButtonClick(interactionId, obj)}
        />
      );
    }

    // Handle Scratch Reveal
    if (role === "reveal-area" && interactionType === "scratch-reveal") {
      const isRevealed = state.scratchRevealed[interactionId] || false;
      const progress = state.scratchProgress[interactionId] || 0;
      const revealContent = data?.revealContent || "I Love You! 💝";

      return (
        <GoldenScratchReveal
          key={index}
          pos={pos}
          isRevealed={isRevealed}
          revealContent={revealContent}
          progress={progress}
          onScratch={(p) => handleScratchProgress(interactionId, p)}
          onReveal={() => handleScratchReveal(interactionId)}
        />
      );
    }

    // Handle Spin Wheel
    if (role === "wheel" && interactionType === "spin-wheel") {
      const isSpinning = state.wheelSpinning[interactionId] || false;
      const rotation = state.wheelRotation[interactionId] || 0;
      const result = state.wheelResult[interactionId] || null;
      const options = data?.wheelOptions || ["Date Night", "Movie", "Dinner", "Adventure"];

      return (
        <CasinoSpinWheel
          key={index}
          pos={pos}
          options={options}
          isSpinning={isSpinning}
          rotation={rotation}
          result={result}
          onSpin={() => handleSpinWheel(interactionId, options)}
        />
      );
    }

    // Handle Groups
    if (obj.type === "group" && obj.objects) {
      if (data?.role) return null;
      return (
        <div
          key={index}
          className="absolute"
          style={{ left: pos.left, top: pos.top, width: pos.width, height: pos.height, transform: pos.transform }}
        >
          {obj.objects.map((child, i) => renderObject({ ...child, left: child.left || 0, top: child.top || 0 }, i))}
        </div>
      );
    }

    // Handle Animated Stickers with distinct animations
    if (data?.role === "sticker" && data?.stickerAnimation) {
      const fontSize = obj.fontSize || 56;
      const stickerType = data?.stickerType || "";
      const anim = data.stickerAnimation as Record<string, number[]>;

      // Create distinct transitions for different animation types
      const getTransitionForKey = (key: string) => {
        // Full rotation (spinning) should loop, not reverse
        const isFullSpin = key === "rotate" && anim[key]?.[1] === 360;
        // Beating heart has unique rhythm
        const isBeatingHeart = stickerType === "beating-heart";
        // Twinkle stars fade in/out
        const isTwinkle = stickerType === "twinkle-stars";
        // Flying cupid moves in both directions
        const isFlyingCupid = stickerType === "flying-cupid";

        if (isFullSpin) {
          return { duration: 2.5, repeat: Infinity, ease: "linear" };
        }
        if (isBeatingHeart && key === "scale") {
          return { duration: 0.8, repeat: Infinity, ease: [0.4, 0, 0.2, 1] };
        }
        if (isTwinkle) {
          return { duration: 1.2, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" };
        }
        if (isFlyingCupid) {
          return { duration: 2.5, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" };
        }
        // Different durations for different motion types
        const durations: Record<string, number> = {
          y: 1.8,
          x: 2.2,
          rotate: 2.0,
          scale: 1.2,
          opacity: 1.5,
        };
        return {
          duration: durations[key] || 1.5,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut",
        };
      };

      return (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: pos.adjustedLeft,
            top: pos.adjustedTop,
            fontSize,
            lineHeight: 1,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...anim,
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.5, type: "spring", stiffness: 200 },
            ...Object.keys(anim).reduce((acc, key) => {
              acc[key] = getTransitionForKey(key);
              return acc;
            }, {} as Record<string, object>),
          }}
        >
          {obj.text}
        </motion.div>
      );
    }

    // Handle Textbox with fonts - check for all Fabric.js text types
    const textTypes = ["textbox", "text", "i-text", "itext"];
    const isTextObject = textTypes.includes(obj.type?.toLowerCase() || "");

    if (isTextObject) {
      // Skip if it's a button role
      if (data?.role === "yes-button" || data?.role === "no-button") return null;

      // Determine font based on content or explicit fontFamily
      let fontFamily = obj.fontFamily || FONTS.serif;
      const fontSize = obj.fontSize || 16;

      // Use script font for short romantic text, serif for longer text
      if (!obj.fontFamily) {
        const text = obj.text || "";
        const lowerText = text.toLowerCase();
        if (text.length < 30 && (lowerText.includes("love") || lowerText.includes("heart") || lowerText.includes("valentine"))) {
          fontFamily = FONTS.script;
        }
      }

      // Use adjusted coordinates (pre-calculated top-left position)
      // This properly handles originX/originY from Fabric.js
      return (
        <motion.div
          key={index}
          className="absolute pointer-events-none"
          style={{
            left: pos.adjustedLeft,
            top: pos.adjustedTop,
            width: pos.width,
            fontSize,
            fontFamily,
            color: (obj.fill as string) || VALENTINE_COLORS.text,
            textAlign: (obj.textAlign as React.CSSProperties["textAlign"]) || "center",
            lineHeight: 1.4,
            textShadow: fontFamily === FONTS.script ? `0 2px 8px ${VALENTINE_COLORS.rose}20` : undefined,
            zIndex: 10,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {obj.text}
        </motion.div>
      );
    }

    // Handle Rect
    if (obj.type === "rect") {
      if (data?.role) return null;
      return (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: pos.adjustedLeft,
            top: pos.adjustedTop,
            width: pos.width,
            height: pos.height,
            backgroundColor: obj.fill as string,
            borderRadius: obj.rx || 0,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        />
      );
    }

    // Handle Circle
    if (obj.type === "circle") {
      if (data?.role === "wheel") return null;
      const size = (obj.radius || 50) * 2 * (obj.scaleX || 1);
      return (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: pos.adjustedLeft,
            top: pos.adjustedTop,
            width: size,
            height: size,
            backgroundColor: obj.fill as string,
            border: obj.stroke ? `${obj.strokeWidth}px solid ${obj.stroke}` : undefined,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, type: "spring" }}
        />
      );
    }

    return null;
  };

  if (!design) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{ background: `linear-gradient(135deg, ${VALENTINE_COLORS.blush} 0%, ${VALENTINE_COLORS.cream} 100%)` }}
      >
        <FloatingHearts />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart className="w-20 h-20 mx-auto mb-6" style={{ color: VALENTINE_COLORS.roseLight }} />
          </motion.div>
          <h2
            className="text-2xl mb-3"
            style={{ fontFamily: FONTS.script, color: VALENTINE_COLORS.rose }}
          >
            No Design Found
          </h2>
          <p
            className="mb-8"
            style={{ fontFamily: FONTS.serif, color: VALENTINE_COLORS.textMuted }}
          >
            Create a beautiful Valentine invitation first!
          </p>
          <motion.button
            onClick={() => router.push("/create")}
            className="px-8 py-4 text-white rounded-full font-semibold"
            style={{
              background: `linear-gradient(135deg, ${VALENTINE_COLORS.rose} 0%, ${VALENTINE_COLORS.roseDark} 100%)`,
              fontFamily: FONTS.sans,
              boxShadow: `0 4px 20px ${VALENTINE_COLORS.rose}40`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Invitation
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(135deg, ${VALENTINE_COLORS.blush} 0%, ${VALENTINE_COLORS.cream} 100%)` }}
    >
      <FloatingHearts />

      {/* Header */}
      <header
        className="flex items-center justify-between p-4 relative z-10"
        style={{
          background: `${VALENTINE_COLORS.white}E6`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${VALENTINE_COLORS.roseLight}30`,
        }}
      >
        <motion.button
          onClick={() => router.push("/create?type=custom")}
          className="flex items-center gap-2 transition-colors"
          style={{ color: VALENTINE_COLORS.textMuted, fontFamily: FONTS.sans }}
          whileHover={{ x: -3 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Editor</span>
        </motion.button>
        <motion.button
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-full font-medium"
          style={{
            background: `linear-gradient(135deg, ${VALENTINE_COLORS.rose} 0%, ${VALENTINE_COLORS.roseDark} 100%)`,
            fontFamily: FONTS.sans,
            boxShadow: `0 4px 15px ${VALENTINE_COLORS.rose}30`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </motion.button>
      </header>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{
              width: design.width || 750,
              height: design.height || 500,
              backgroundColor: design.backgroundColor || design.background || "#FFFFFF",
              borderRadius: 24,
              boxShadow: `
                0 25px 60px rgba(0,0,0,0.15),
                0 0 0 1px ${VALENTINE_COLORS.roseLight}20,
                0 0 100px ${VALENTINE_COLORS.rose}10
              `,
            }}
          >
            {design.objects?.map((obj, index) => renderObject(obj, index))}

            {/* Success Message Overlay */}
            <AnimatePresence>
              {state.showSuccessMessage && (
                <SuccessCelebration onClose={() => setState((prev) => ({ ...prev, showSuccessMessage: false }))} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

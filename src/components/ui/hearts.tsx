"use client";

import { motion } from "framer-motion";

// ============================================
// BEAUTIFUL CUSTOM SVG HEARTS
// Consistent across all devices
// ============================================

interface HeartProps {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: "filled" | "outline" | "gradient" | "double" | "sparkle";
  color?: "pink" | "rose" | "red" | "gold" | "white";
}

// Color palettes
const colors = {
  pink: { primary: "#ec4899", secondary: "#f472b6", glow: "rgba(236, 72, 153, 0.4)" },
  rose: { primary: "#f43f5e", secondary: "#fb7185", glow: "rgba(244, 63, 94, 0.4)" },
  red: { primary: "#ef4444", secondary: "#f87171", glow: "rgba(239, 68, 68, 0.4)" },
  gold: { primary: "#f59e0b", secondary: "#fbbf24", glow: "rgba(245, 158, 11, 0.4)" },
  white: { primary: "#ffffff", secondary: "#fce7f3", glow: "rgba(255, 255, 255, 0.4)" },
};

// Filled Heart - Classic solid heart
export function HeartFilled({ size = 24, className = "", animate = false, color = "pink" }: HeartProps) {
  const c = colors[color];

  const heart = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 4px ${c.glow})` }}
    >
      <defs>
        <linearGradient id={`heartGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.secondary} />
          <stop offset="100%" stopColor={c.primary} />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={`url(#heartGrad-${color})`}
      />
      {/* Shine highlight */}
      <ellipse
        cx="8"
        cy="7.5"
        rx="2"
        ry="1.5"
        fill="white"
        opacity="0.4"
        transform="rotate(-30 8 7.5)"
      />
    </svg>
  );

  if (animate) {
    return (
      <motion.span
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-flex" }}
      >
        {heart}
      </motion.span>
    );
  }

  return heart;
}

// Outline Heart - Elegant stroke heart
export function HeartOutline({ size = 24, className = "", animate = false, color = "pink" }: HeartProps) {
  const c = colors[color];

  const heart = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke={c.primary}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );

  if (animate) {
    return (
      <motion.span
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-flex" }}
      >
        {heart}
      </motion.span>
    );
  }

  return heart;
}

// Double Hearts - Two overlapping hearts (replaces 💕)
export function HeartDouble({ size = 24, className = "", animate = false, color = "pink" }: HeartProps) {
  const c = colors[color];

  const hearts = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 24"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
    >
      <defs>
        <linearGradient id={`doubleGrad1-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.secondary} />
          <stop offset="100%" stopColor={c.primary} />
        </linearGradient>
        <linearGradient id={`doubleGrad2-${color}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.secondary} />
        </linearGradient>
      </defs>
      {/* Back heart */}
      <path
        d="M10 18.35l-1.09-1C4.05 13.02 1.5 10.69 1.5 7.88 1.5 5.56 3.36 3.75 5.63 3.75c1.3 0 2.56.61 3.37 1.57.81-.96 2.07-1.57 3.37-1.57 2.27 0 4.13 1.81 4.13 4.13 0 2.81-2.55 5.14-7.41 9.47L10 18.35z"
        fill={`url(#doubleGrad1-${color})`}
        opacity="0.7"
      />
      {/* Front heart */}
      <path
        d="M18 20.35l-1.09-1C12.05 15.02 9.5 12.69 9.5 9.88 9.5 7.56 11.36 5.75 13.63 5.75c1.3 0 2.56.61 3.37 1.57.81-.96 2.07-1.57 3.37-1.57 2.27 0 4.13 1.81 4.13 4.13 0 2.81-2.55 5.14-7.41 9.47L18 20.35z"
        fill={`url(#doubleGrad2-${color})`}
      />
      {/* Shine */}
      <ellipse cx="15" cy="9" rx="1.5" ry="1" fill="white" opacity="0.5" transform="rotate(-30 15 9)" />
    </svg>
  );

  if (animate) {
    return (
      <motion.span
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-flex" }}
      >
        {hearts}
      </motion.span>
    );
  }

  return hearts;
}

// Sparkle Heart - Heart with sparkles (replaces 💗)
export function HeartSparkle({ size = 24, className = "", animate = false, color = "pink" }: HeartProps) {
  const c = colors[color];

  const heart = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
    >
      <defs>
        <linearGradient id={`sparkleGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.secondary} />
          <stop offset="50%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.secondary} />
        </linearGradient>
      </defs>
      {/* Main heart */}
      <path
        d="M14 24.35l-1.45-1.32C7.4 18.36 4 15.28 4 11.5 4 8.42 6.42 6 9.5 6c1.74 0 3.41.81 4.5 2.09C15.09 6.81 16.76 6 18.5 6 21.58 6 24 8.42 24 11.5c0 3.78-3.4 6.86-8.55 11.54L14 24.35z"
        fill={`url(#sparkleGrad-${color})`}
      />
      {/* Shine */}
      <ellipse cx="10" cy="10.5" rx="2" ry="1.5" fill="white" opacity="0.4" transform="rotate(-30 10 10.5)" />
      {/* Sparkles */}
      <g fill={c.primary}>
        {/* Top right sparkle */}
        <path d="M24 4l.5 1.5L26 6l-1.5.5L24 8l-.5-1.5L22 6l1.5-.5L24 4z" />
        {/* Top left sparkle */}
        <path d="M5 2l.35 1L6.5 3.35l-1.15.35L5 5l-.35-1.15L3.5 3.35l1.15-.35L5 2z" opacity="0.7" />
        {/* Bottom sparkle */}
        <path d="M25 14l.25.75.75.25-.75.25L25 16l-.25-.75L24 15l.75-.25L25 14z" opacity="0.5" />
      </g>
    </svg>
  );

  if (animate) {
    return (
      <motion.span style={{ display: "inline-flex", position: "relative" }}>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          {heart}
        </motion.span>
      </motion.span>
    );
  }

  return heart;
}

// Glowing Heart - Heart with outer glow (replaces ❤️)
export function HeartGlow({ size = 24, className = "", animate = false, color = "rose" }: HeartProps) {
  const c = colors[color];

  const heart = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id={`glowGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.secondary} />
          <stop offset="100%" stopColor={c.primary} />
        </linearGradient>
        <filter id={`heartGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor={c.primary} floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={`url(#glowGrad-${color})`}
        filter={`url(#heartGlow-${color})`}
      />
      {/* Shine */}
      <ellipse cx="8" cy="7.5" rx="2" ry="1.5" fill="white" opacity="0.5" transform="rotate(-30 8 7.5)" />
    </svg>
  );

  if (animate) {
    return (
      <motion.span
        animate={{
          scale: [1, 1.15, 1],
          filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ display: "inline-flex" }}
      >
        {heart}
      </motion.span>
    );
  }

  return heart;
}

// Mini Heart - Small decorative heart (replaces ♥ and ♡)
export function HeartMini({ size = 12, className = "", filled = true, color = "pink" }: HeartProps & { filled?: boolean }) {
  const c = colors[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <path
        d="M6 10.5l-.72-.66C2.7 7.68 1 6.14 1 4.25 1 2.71 2.21 1.5 3.75 1.5c.87 0 1.7.4 2.25 1.04A3.02 3.02 0 018.25 1.5C9.79 1.5 11 2.71 11 4.25c0 1.89-1.7 3.43-4.28 5.6L6 10.5z"
        fill={filled ? c.primary : "none"}
        stroke={filled ? "none" : c.primary}
        strokeWidth="1"
      />
    </svg>
  );
}

// Floating Hearts Animation - Multiple hearts floating up
export function FloatingHearts({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + (i * 70 / count)}%`,
            bottom: "-20px",
          }}
          animate={{
            y: [0, -400],
            x: [0, (i % 2 === 0 ? 20 : -20)],
            opacity: [0, 1, 1, 0],
            rotate: [0, (i % 2 === 0 ? 15 : -15)],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        >
          <HeartFilled
            size={14 + (i % 3) * 4}
            color={["pink", "rose", "red"][i % 3] as "pink" | "rose" | "red"}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Heart with Text - Heart icon next to text (utility component)
export function HeartText({
  children,
  variant = "double",
  color = "pink",
  size = 16,
  position = "after",
  className = "",
  animate = false,
}: {
  children: React.ReactNode;
  variant?: "filled" | "double" | "sparkle" | "glow" | "mini";
  color?: "pink" | "rose" | "red" | "gold" | "white";
  size?: number;
  position?: "before" | "after" | "both";
  className?: string;
  animate?: boolean;
}) {
  const HeartComponent = {
    filled: HeartFilled,
    double: HeartDouble,
    sparkle: HeartSparkle,
    glow: HeartGlow,
    mini: HeartMini,
  }[variant];

  const heart = <HeartComponent size={size} color={color} animate={animate} />;

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {(position === "before" || position === "both") && heart}
      {children}
      {(position === "after" || position === "both") && heart}
    </span>
  );
}

// Export all components
export const Hearts = {
  Filled: HeartFilled,
  Outline: HeartOutline,
  Double: HeartDouble,
  Sparkle: HeartSparkle,
  Glow: HeartGlow,
  Mini: HeartMini,
  Floating: FloatingHearts,
  Text: HeartText,
};

export default Hearts;

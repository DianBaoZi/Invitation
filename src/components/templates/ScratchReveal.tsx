"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ScratchRevealProps {
  message: string;
}

// --- Particle types ---
interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface DriftingPetal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
}

// --- Stage helpers ---
function getStage(progress: number): number {
  if (progress < 20) return 0;
  if (progress < 40) return 1;
  if (progress < 60) return 2;
  if (progress < 80) return 3;
  return 4;
}

function getStageText(stage: number): string {
  switch (stage) {
    case 0:
      return "Something is growing...";
    case 1:
      return "A feeling takes root...";
    case 2:
      return "It\u2019s blooming...";
    case 3:
      return "Almost there...";
    case 4:
      return "";
    default:
      return "";
  }
}

// --- Floating dust particles ---
function generateParticles(count: number): FloatingParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: Math.random() * 3 + 1,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
  }));
}

// --- Drifting petals after bloom ---
function generateDriftingPetals(count: number): DriftingPetal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,
    delay: i * 2.5 + Math.random() * 2,
    duration: 4 + Math.random() * 3,
    rotation: Math.random() * 360,
  }));
}

// --- Progress Ring Component ---
function ProgressRing({
  progress,
  radius = 52,
  stroke = 3,
}: {
  progress: number;
  radius?: number;
  stroke?: number;
}) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={(radius + stroke) * 2}
      height={(radius + stroke) * 2}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none"
    >
      {/* Track */}
      <circle
        cx={radius + stroke}
        cy={radius + stroke}
        r={radius}
        fill="none"
        stroke="rgba(212, 175, 55, 0.15)"
        strokeWidth={stroke}
      />
      {/* Fill */}
      <circle
        cx={radius + stroke}
        cy={radius + stroke}
        r={radius}
        fill="none"
        stroke="#D4AF37"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.05s linear" }}
      />
    </svg>
  );
}

// --- Roots Component ---
function Roots({ progress }: { progress: number }) {
  const visibility = Math.min(progress / 20, 1);

  const rootPaths = [
    "M50 55 Q45 70 40 85 Q38 92 35 100",
    "M50 55 Q55 68 58 80 Q60 90 65 100",
    "M50 55 Q48 65 42 75 Q38 82 30 95",
    "M50 55 Q53 63 60 72 Q65 80 70 95",
  ];

  return (
    <svg
      className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {rootPaths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke="#8B6914"
          strokeWidth={1.2 - i * 0.15}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: visibility,
            opacity: visibility > 0 ? 0.7 + i * 0.05 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// --- Stem Component ---
function Stem({ progress }: { progress: number }) {
  const visibility = Math.max(0, Math.min((progress - 20) / 20, 1));

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 origin-bottom"
      style={{
        bottom: "40%",
        width: 4,
        height: 100,
        borderRadius: 2,
        background: "linear-gradient(to top, #4CAF50, #66BB6A)",
      }}
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: visibility, opacity: visibility > 0 ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
}

// --- Leaves Component ---
function Leaves({ progress }: { progress: number }) {
  const visibility = Math.max(0, Math.min((progress - 40) / 20, 1));

  return (
    <>
      {/* Left leaf */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "calc(50% - 28px)",
          bottom: "58%",
          width: 24,
          height: 14,
          borderRadius: "50% 0 50% 0",
          background: "linear-gradient(135deg, #66BB6A, #4CAF50)",
          transformOrigin: "right center",
        }}
        initial={{ scale: 0, rotate: 30, opacity: 0 }}
        animate={{
          scale: visibility,
          rotate: visibility > 0 ? -15 : 30,
          opacity: visibility,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      />
      {/* Right leaf */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "calc(50% + 4px)",
          bottom: "62%",
          width: 24,
          height: 14,
          borderRadius: "0 50% 0 50%",
          background: "linear-gradient(225deg, #66BB6A, #4CAF50)",
          transformOrigin: "left center",
        }}
        initial={{ scale: 0, rotate: -30, opacity: 0 }}
        animate={{
          scale: visibility,
          rotate: visibility > 0 ? 15 : -30,
          opacity: visibility,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
      />
    </>
  );
}

// --- Flower Component ---
function Flower({
  progress,
  completed,
  message,
}: {
  progress: number;
  completed: boolean;
  message: string;
}) {
  const budVisibility = Math.max(0, Math.min((progress - 60) / 20, 1));
  const bloomVisibility = Math.max(0, Math.min((progress - 80) / 20, 1));
  const petalCount = 6;
  const petalAngles = Array.from(
    { length: petalCount },
    (_, i) => (360 / petalCount) * i
  );

  // Bud color interpolates from green to pink
  const budGreen = Math.round(175 - budVisibility * 100);
  const budRed = Math.round(100 + budVisibility * 136);
  const budColor = `rgb(${budRed}, ${budGreen}, ${Math.round(80 + budVisibility * 73)})`;

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ bottom: "68%" }}
      animate={
        completed
          ? { rotate: [0, 2, -2, 1, -1, 0], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } }
          : {}
      }
    >
      {/* Bud / Flower center */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 40, height: 40, marginLeft: -20 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: budVisibility > 0 ? 0.6 + budVisibility * 0.4 : 0,
          opacity: budVisibility,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Petals */}
        {petalAngles.map((angle, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 18,
              height: 28,
              borderRadius: "50%",
              background: `linear-gradient(to top, #ec4899, #f472b6)`,
              left: "50%",
              top: "50%",
              marginLeft: -9,
              marginTop: -14,
              transformOrigin: "center bottom",
            }}
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{
              scale: bloomVisibility,
              rotate: angle,
              opacity: bloomVisibility,
              y: bloomVisibility * -14,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 8,
              delay: i * 0.06,
            }}
          />
        ))}

        {/* Center circle */}
        <motion.div
          className="relative z-10 rounded-full flex items-center justify-center"
          style={{
            width: 24,
            height: 24,
            background: completed
              ? "radial-gradient(circle, #fbbf24, #D4AF37)"
              : `radial-gradient(circle, ${budColor}, ${budColor})`,
          }}
          animate={{ scale: completed ? [1, 1.05, 1] : 1 }}
          transition={
            completed
              ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
              : {}
          }
        />
      </motion.div>

      {/* Message in bloom (only when completed, shows above flower) */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center"
            style={{ width: 40, height: 40 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Tiny heart in the center of the flower */}
            <span className="text-xs text-red-400 select-none" aria-hidden>
              &hearts;
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// Main Component
// =============================================================================
export function ScratchReveal({ message }: ScratchRevealProps) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const growthRef = useRef<number | null>(null);
  const decayRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const holdingRef = useRef(false);
  const completedRef = useRef(false);

  const particles = useRef(generateParticles(14));
  const driftingPetals = useRef(generateDriftingPetals(5));

  const currentStage = getStage(progress);
  const stageText = getStageText(currentStage);

  // Show instruction text after 1s
  useEffect(() => {
    const timeout = setTimeout(() => setShowInstruction(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Cleanup animation frames on unmount
  useEffect(() => {
    return () => {
      if (growthRef.current !== null) cancelAnimationFrame(growthRef.current);
      if (decayRef.current !== null) cancelAnimationFrame(decayRef.current);
    };
  }, []);

  // Fire confetti when completed
  useEffect(() => {
    if (completed) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.45 },
        colors: ["#ec4899", "#4CAF50", "#D4AF37", "#f472b6", "#66BB6A"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 90,
          origin: { y: 0.5 },
          colors: ["#ec4899", "#D4AF37", "#f472b6"],
        });
      }, 300);
    }
  }, [completed]);

  // --- Growth loop ---
  const startGrowth = useCallback(() => {
    if (completedRef.current) return;
    holdingRef.current = true;

    // Cancel any running decay
    if (decayRef.current !== null) {
      cancelAnimationFrame(decayRef.current);
      decayRef.current = null;
    }

    const tick = () => {
      if (!holdingRef.current || completedRef.current) return;

      // ~3 seconds total = 100% / (60fps * 3s) ~ 0.56 per frame
      progressRef.current = Math.min(progressRef.current + 0.56, 100);
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        completedRef.current = true;
        setCompleted(true);
        return;
      }

      growthRef.current = requestAnimationFrame(tick);
    };

    growthRef.current = requestAnimationFrame(tick);
  }, []);

  // --- Decay loop ---
  const startDecay = useCallback(() => {
    if (completedRef.current) return;

    const tick = () => {
      if (holdingRef.current || completedRef.current) return;

      progressRef.current = Math.max(progressRef.current - 0.5, 0);
      setProgress(progressRef.current);

      if (progressRef.current <= 0) return;

      decayRef.current = requestAnimationFrame(tick);
    };

    decayRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      startGrowth();
    },
    [startGrowth]
  );

  const handlePointerUp = useCallback(() => {
    holdingRef.current = false;
    if (growthRef.current !== null) {
      cancelAnimationFrame(growthRef.current);
      growthRef.current = null;
    }
    startDecay();
  }, [startDecay]);

  const handlePointerLeave = useCallback(() => {
    holdingRef.current = false;
    if (growthRef.current !== null) {
      cancelAnimationFrame(growthRef.current);
      growthRef.current = null;
    }
    startDecay();
  }, [startDecay]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-[280px] md:max-w-md w-full mx-auto rounded-3xl shadow-2xl overflow-hidden select-none"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #fff1f2, #fce7f3)",
        touchAction: "none",
      }}
    >
      {/* ---- Floating golden dust particles ---- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.current.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: "radial-gradient(circle, #D4AF37, transparent)",
            }}
            animate={{
              y: [0, -120 - Math.random() * 80],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* ---- Main card content ---- */}
      <div className="relative px-4 md:px-8 pt-10 pb-10" style={{ minHeight: 460 }}>
        {/* ---- Soil / garden gradient at bottom third ---- */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "38%",
            background:
              "linear-gradient(to bottom, transparent, #5D4037 30%, #4E342E 60%, #3E2723)",
            borderRadius: "0 0 1.5rem 1.5rem",
          }}
        />

        {/* ---- Plant area ---- */}
        <div
          className="relative mx-auto"
          style={{ width: 200, height: 260, marginTop: 20 }}
        >
          {/* Roots */}
          <Roots progress={progress} />

          {/* Stem */}
          <Stem progress={progress} />

          {/* Leaves */}
          <Leaves progress={progress} />

          {/* Flower / Bud */}
          <Flower progress={progress} completed={completed} message={message} />

          {/* ---- Seed / bulb button ---- */}
          {!completed && (
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center justify-center cursor-pointer"
              style={{
                bottom: "33%",
                width: 80,
                height: 80,
              }}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerUp}
              whileTap={{ scale: 0.95 }}
            >
              {/* Progress ring */}
              <ProgressRing progress={progress} radius={36} stroke={3} />

              {/* Seed icon */}
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 48,
                  height: 48,
                  background:
                    progress > 0
                      ? "radial-gradient(circle, #66BB6A, #4CAF50)"
                      : "radial-gradient(circle, #A1887F, #8B6914)",
                  boxShadow:
                    "0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)",
                }}
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)",
                    "0 0 28px rgba(212,175,55,0.5), 0 0 56px rgba(212,175,55,0.2)",
                    "0 0 20px rgba(212,175,55,0.3), 0 0 40px rgba(212,175,55,0.1)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c4-4 8-7.5 8-12A8 8 0 0 0 4 10c0 4.5 4 8 8 12z" />
                  <path d="M12 10v4" />
                  <path d="M10 12h4" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* ---- Stage text ---- */}
        <AnimatePresence mode="wait">
          {!completed && progress > 0 && stageText && (
            <motion.p
              key={currentStage}
              className="text-center text-sm font-medium italic mt-2 relative z-10"
              style={{ color: "#8B6914" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              {stageText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ---- Instruction text ---- */}
        <AnimatePresence>
          {showInstruction && !completed && progress === 0 && (
            <motion.p
              className="text-center text-sm mt-4 relative z-10"
              style={{ color: "#9ca3af" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Press and hold to grow
            </motion.p>
          )}
        </AnimatePresence>

        {/* ---- Revealed message card ---- */}
        <AnimatePresence>
          {completed && (
            <motion.div
              className="relative z-10 mt-6 mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="rounded-2xl px-6 py-5 mx-auto"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(252,231,243,0.9))",
                  boxShadow:
                    "0 4px 24px rgba(236, 72, 153, 0.12), 0 1px 4px rgba(0,0,0,0.04)",
                  maxWidth: 320,
                }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 150, damping: 14 }}
              >
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', 'Noto Serif', serif",
                    color: "#831843",
                  }}
                >
                  {message}
                </p>
                <motion.p
                  className="mt-3 text-sm"
                  style={{ color: "#ec4899" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Now you know!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Drifting petals (ambient, post-bloom) ---- */}
        {completed && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {driftingPetals.current.map((p) => (
              <motion.div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: "20%",
                  width: 8,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(to bottom, #f9a8d4, #f472b6)",
                  opacity: 0,
                }}
                animate={{
                  y: [0, 200],
                  x: [0, 30, -20, 40],
                  rotate: [p.rotation, p.rotation + 360],
                  opacity: [0, 0.6, 0.4, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

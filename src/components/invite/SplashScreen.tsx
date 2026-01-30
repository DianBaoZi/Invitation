"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { getAppName } from "@/lib/supabase/utils";

interface SplashScreenProps {
  creatorName?: string | null;
  isPaid: boolean;
  onComplete: () => void;
  templateId?: string;
  photoUrl1?: string; // For templates that show a photo on splash (e.g., cozy-scrapbook)
}

export function SplashScreen({ creatorName, isPaid, onComplete, templateId, photoUrl1 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const appName = getAppName();

  // Templates that require a tap to continue (no auto-dismiss)
  const requiresTapToContinue = templateId === "cozy-scrapbook";

  useEffect(() => {
    // Skip auto-dismiss for templates that require tap to continue
    if (requiresTapToContinue) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [requiresTapToContinue]);

  const handleAnimationComplete = () => {
    if (!isVisible) {
      onComplete();
    }
  };

  const splashProps = {
    creatorName,
    isPaid,
    appName,
    onTap: () => setIsVisible(false),
    photoUrl1,
  };

  // Template-specific splash screens
  const splashMap: Record<string, React.ReactNode> = {
    stargazer: <StargazerSplash {...splashProps} />,
    premiere: <PremiereSplash {...splashProps} />,
    "y2k-digital-crush": <Y2KSplash {...splashProps} />,
    "cozy-scrapbook": <ScrapbookSplash {...splashProps} />,
    "forest-adventure": <ForestAdventureSplash {...splashProps} />,
    "love-letter-mailbox": <LoveLetterSplash {...splashProps} />,
    "elegant-invitation": <ElegantInvitationSplash {...splashProps} />,
  };

  const customSplash = templateId && splashMap[templateId];

  if (customSplash) {
    return (
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isVisible && customSplash}
      </AnimatePresence>
    );
  }

  // Default splash - Forest RPG themed
  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #1a3a1a 0%, #0d260d 50%, #0a1f0a 100%)",
          }}
          onClick={() => setIsVisible(false)}
        >
          {/* Twinkling stars/fireflies */}
          {Array.from({ length: 25 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                width: 2 + (i % 2),
                height: 2 + (i % 2),
                background: i % 4 === 0 ? "#fbbf24" : i % 3 === 0 ? "#86efac" : "#fff",
                boxShadow: i % 4 === 0 ? "0 0 8px #fbbf24" : "none",
              }}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + (i % 3),
                delay: (i * 0.3) % 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Forest silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <svg viewBox="0 0 400 120" className="w-full h-auto opacity-30" preserveAspectRatio="none">
              <path
                d="M0,120 L0,80 L20,80 L30,40 L40,80 L60,80 L75,30 L90,80 L110,80 L120,50 L130,80 L150,80 L170,20 L190,80 L210,80 L225,45 L240,80 L260,80 L280,25 L300,80 L320,80 L335,55 L350,80 L370,80 L385,35 L400,80 L400,120 Z"
                fill="#0f2a0f"
              />
            </svg>
          </div>

          {/* Hanging vines from top */}
          <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="text-green-800/40"
                style={{ fontSize: 30 + (i % 3) * 10 }}
                animate={{ y: [0, 5, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                🌿
              </motion.div>
            ))}
          </div>

          {/* Central content - Wooden sign style */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
            className="relative z-10"
          >
            {/* Wooden sign frame */}
            <div
              className="relative px-8 py-6 mx-4"
              style={{
                background: "linear-gradient(180deg, #8b6914 0%, #6b4f0f 50%, #5c4a0e 100%)",
                borderRadius: 8,
                border: "4px solid #3d2e08",
                boxShadow: "0 8px 0 #3d2e08, 0 12px 30px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Wood grain texture lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute h-px bg-amber-900"
                    style={{
                      top: `${20 + i * 18}%`,
                      left: 0,
                      right: 0,
                      opacity: 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Corner bolts */}
              <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-amber-800 border border-amber-900" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }} />
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-amber-800 border border-amber-900" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }} />
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-amber-800 border border-amber-900" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }} />
              <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-amber-800 border border-amber-900" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }} />

              {/* Heart icon */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-center mb-4"
              >
                <span
                  className="text-4xl"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                >
                  💝
                </span>
              </motion.div>

              {isPaid && creatorName ? (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-1"
                    style={{
                      fontFamily: "'Press Start 2P', 'Courier New', monospace",
                      fontSize: "8px",
                      color: "#fef3c7",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    CRAFTED WITH LOVE BY
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                    style={{
                      fontFamily: "'Press Start 2P', 'Courier New', monospace",
                      fontSize: "clamp(14px, 4vw, 20px)",
                      color: "#fef3c7",
                      textShadow: "2px 2px 0 rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.3)",
                    }}
                  >
                    {creatorName}
                  </motion.h1>
                </>
              ) : (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mb-1"
                    style={{
                      fontFamily: "'Press Start 2P', 'Courier New', monospace",
                      fontSize: "8px",
                      color: "#fef3c7",
                      textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    MADE WITH
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                    style={{
                      fontFamily: "'Press Start 2P', 'Courier New', monospace",
                      fontSize: "clamp(14px, 4vw, 20px)",
                      color: "#fef3c7",
                      textShadow: "2px 2px 0 rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.3)",
                    }}
                  >
                    {appName}
                  </motion.h1>
                </>
              )}

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span style={{ color: "#86efac", fontSize: 8 }}>✦</span>
                <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, transparent, #86efac, transparent)" }} />
                <span style={{ color: "#86efac", fontSize: 8 }}>✦</span>
              </div>
            </div>

            {/* Hanging chains */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-20">
              <div className="w-2 h-10 bg-amber-900 rounded-full" style={{ boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)" }} />
              <div className="w-2 h-10 bg-amber-900 rounded-full" style={{ boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)" }} />
            </div>

            {/* Tap hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4, 0.8] }}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
              className="text-center mt-6"
              style={{
                fontFamily: "'Press Start 2P', 'Courier New', monospace",
                fontSize: "8px",
                color: "#86efac",
                textShadow: "0 0 10px rgba(134,239,172,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              [ TAP TO CONTINUE ]
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// SHARED SPLASH PROP TYPE
// ============================================

interface ThemedSplashProps {
  creatorName?: string | null;
  isPaid: boolean;
  appName: string;
  onTap: () => void;
  photoUrl1?: string; // Optional photo for splash screens that support it
}

// ============================================
// Y2K / SYSTEM CRUSH — BIOS BOOT SPLASH
// ============================================

function Y2KSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "Programmed with love by" : "Powered by";

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);

  const lines = useMemo(() => [
    "BIOS v2.14 — Heart Edition",
    "Checking memory... 64KB OK",
    "Loading crush.sys...........",
    `Initializing ${displayName} OS`,
    "STATUS: READY ♥",
  ], [displayName]);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => {
          setBootLines((prev) => [...prev, line]);
          if (i === lines.length - 1) {
            timeouts.push(setTimeout(() => setBootDone(true), 400));
          }
        }, 300 + i * 450)
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, [lines]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "#000080" }}
      onClick={onTap}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* CRT flicker */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
        style={{ background: "white" }}
      />

      {/* Boot text */}
      <div className="relative z-10 w-full max-w-md px-8">
        {bootLines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "13px",
              color: i === bootLines.length - 1 && line.includes("READY") ? "#00ff00" : "#c0c0c0",
              lineHeight: 1.8,
              textShadow: i === bootLines.length - 1 && line.includes("READY")
                ? "0 0 10px rgba(0,255,0,0.5)"
                : "none",
            }}
          >
            {line}
          </motion.p>
        ))}

        {/* Blinking cursor */}
        {!bootDone && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              color: "#c0c0c0",
            }}
          >
            _
          </motion.span>
        )}

        {/* After boot — show name */}
        <AnimatePresence>
          {bootDone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px",
                  color: "#808080",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {tagline}
              </p>
              <p
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(1.4rem, 6vw, 2rem)",
                  fontWeight: 700,
                  color: "#00ff00",
                  textShadow: "0 0 20px rgba(0,255,0,0.4), 0 0 40px rgba(0,255,0,0.2)",
                }}
              >
                {displayName}
              </p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
                transition={{ delay: 0.5, duration: 2, repeat: Infinity }}
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px",
                  color: "#808080",
                  marginTop: 16,
                  letterSpacing: "0.1em",
                }}
              >
                press any key to continue_
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================
// SCRATCH REVEAL — GARDEN / SEED SPLASH
// ============================================

function GardenSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "planted with love by" : "a gift from";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #fdf2e9 0%, #fce7d6 30%, #e8d5b7 70%, #8B6914 100%)",
      }}
      onClick={onTap}
    >
      {/* Floating golden dust particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            background: i % 4 === 0 ? "#D4AF37" : "rgba(139,105,20,0.3)",
          }}
          animate={{
            y: [0, -30 - (i % 20), 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: (i * 0.3) % 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
        className="relative text-center px-8 z-10"
      >
        {/* Seed icon with pulse glow */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div
              className="text-4xl"
              style={{
                filter: "drop-shadow(0 0 12px rgba(212,175,55,0.4))",
              }}
            >
              🌱
            </div>
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
                width: 60,
                height: 60,
                top: -10,
                left: -12,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "#8B6914",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(1.8rem, 7vw, 3rem)",
            fontWeight: 700,
            color: "#5C4A1E",
            textShadow: "0 2px 8px rgba(139,105,20,0.2)",
            letterSpacing: "0.02em",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Decorative vine */}
        <motion.div
          className="mx-auto mt-5 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <span style={{ color: "#8B6914", fontSize: 12 }}>🌿</span>
          <div style={{ width: 50, height: 1, background: "linear-gradient(90deg, transparent, #8B6914, transparent)" }} />
          <span style={{ color: "#8B6914", fontSize: 12 }}>🌿</span>
        </motion.div>

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.25, 0.5] }}
          transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: "#8B6914",
            letterSpacing: "0.1em",
          }}
        >
          tap to begin
        </motion.p>
      </motion.div>
    </motion.div>
  );
}


// ============================================
// COZY SCRAPBOOK — CRAFT PAPER SPLASH
// ============================================

function ScrapbookSplash({ creatorName, isPaid, appName, onTap, photoUrl1 }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "lovingly crafted by" : "a little something from";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "#f5ebe0",
      }}
      onClick={onTap}
    >
      {/* Paper texture noise */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: "multiply",
        }}
      />

      {/* Scattered pressed flower decorations */}
      {[
        { emoji: "🌿", x: 12, y: 15, rotate: -30, delay: 0.3 },
        { emoji: "🍂", x: 82, y: 20, rotate: 20, delay: 0.5 },
        { emoji: "🌸", x: 18, y: 78, rotate: 15, delay: 0.7 },
        { emoji: "🌿", x: 75, y: 80, rotate: -15, delay: 0.4 },
        { emoji: "🍂", x: 50, y: 10, rotate: 40, delay: 0.6 },
        { emoji: "🌸", x: 88, y: 55, rotate: -25, delay: 0.8 },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: 18,
            transform: `rotate(${item.rotate}deg)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ delay: item.delay, duration: 0.6, type: "spring" }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Central content */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
        className="relative text-center px-8 z-10"
      >
        {/* Polaroid photo frame - always shown */}
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="mx-auto mb-6"
          style={{
            width: 140,
            padding: "8px 8px 28px 8px",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(92,58,33,0.2), 0 1px 3px rgba(92,58,33,0.1)",
            transform: "rotate(-3deg)",
          }}
        >
          {/* Photo inside polaroid - or placeholder */}
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              background: photoUrl1
                ? `url(${photoUrl1}) center/cover no-repeat`
                : "linear-gradient(135deg, #f5ebe0 0%, #e8ddd0 100%)",
              backgroundColor: "#e8ddd0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Placeholder text when no photo */}
            {!photoUrl1 && (
              <motion.span
                style={{
                  fontSize: 11,
                  color: "#a08060",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "8px",
                  opacity: 0.6,
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                upload photo
              </motion.span>
            )}
          </div>
          {/* Washi tape on corner */}
          <div
            style={{
              position: "absolute",
              top: -6,
              right: -10,
              width: 40,
              height: 14,
              background: "linear-gradient(90deg, #d4a574, #e8c9a8)",
              opacity: 0.7,
              transform: "rotate(25deg)",
              borderRadius: 2,
            }}
          />
        </motion.div>

        {/* Envelope / letter icon */}
        <motion.div
          className="mb-5 flex items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: photoUrl1 ? 0.6 : 0.4, type: "spring" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl"
            style={{
              filter: "drop-shadow(0 2px 6px rgba(194,114,86,0.3))",
            }}
          >
            ✉️
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: photoUrl1 ? 0.8 : 0.6, duration: 0.8 }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "16px",
            color: "#c27256",
            marginBottom: 6,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: photoUrl1 ? 1.0 : 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(2rem, 8vw, 3.5rem)",
            fontWeight: 700,
            color: "#5c3a21",
            textShadow: "0 2px 8px rgba(92,58,33,0.15)",
            letterSpacing: "0.01em",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Decorative line with flowers */}
        <motion.div
          className="mx-auto mt-5 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: photoUrl1 ? 1.3 : 1.1, duration: 0.8 }}
        >
          <span style={{ fontSize: 10 }}>🌸</span>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #c27256, transparent)" }} />
          <span style={{ fontSize: 10 }}>🌸</span>
        </motion.div>

        {/* Second washi tape */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: photoUrl1 ? 1.5 : 1.3, duration: 0.6 }}
          className="mx-auto mt-4"
          style={{
            width: 60,
            height: 10,
            background: "linear-gradient(90deg, #8b9e6b, #a3b88c)",
            borderRadius: 2,
            opacity: 0.3,
            transform: "rotate(2deg)",
          }}
        />

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.25, 0.5] }}
          transition={{ delay: photoUrl1 ? 1.7 : 1.5, duration: 2.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "15px",
            color: "#8b9e6b",
          }}
        >
          tap to unfold
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// LOVE LETTER MAILBOX — VINTAGE AIRMAIL SPLASH
// ============================================

function LoveLetterSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "Sealed with love by" : "A special delivery from";

  const [stampLanded, setStampLanded] = useState(false);
  const [sealRevealed, setSealRevealed] = useState(false);

  useEffect(() => {
    const stampTimer = setTimeout(() => setStampLanded(true), 500);
    const sealTimer = setTimeout(() => setSealRevealed(true), 1100);
    return () => {
      clearTimeout(stampTimer);
      clearTimeout(sealTimer);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "#f5f0e8",
      }}
      onClick={onTap}
    >
      {/* Aged paper texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.4) 0%, transparent 60%)",
        }}
      />

      {/* Airmail border stripes - top */}
      <div className="absolute top-0 left-0 right-0 h-6 flex">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`top-${i}`}
            className="flex-1 h-full"
            style={{
              background: i % 2 === 0 ? "#c62828" : "#1565c0",
            }}
          />
        ))}
      </div>

      {/* Airmail border stripes - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 flex">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`bottom-${i}`}
            className="flex-1 h-full"
            style={{
              background: i % 2 === 0 ? "#1565c0" : "#c62828",
            }}
          />
        ))}
      </div>

      {/* Decorative corner stamps */}
      <motion.div
        className="absolute top-10 right-6 pointer-events-none"
        initial={{ y: -100, rotate: -20, opacity: 0 }}
        animate={stampLanded ? { y: 0, rotate: 8, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <div
          className="relative p-2"
          style={{
            width: 70,
            height: 85,
            background: "#fff",
            border: "2px dashed #ccc",
            boxShadow: "2px 3px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(180deg, #ffcdd2 0%, #ef9a9a 100%)",
            }}
          >
            <span className="text-2xl mb-1">💌</span>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 7, color: "#880e4f", fontWeight: 600 }}>LOVE</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 6, color: "#880e4f" }}>MAIL</p>
          </div>
          {/* Postmark overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: 0.3 }}
          >
            <div
              className="rounded-full border-2 border-gray-600 px-2 py-1"
              style={{ transform: "rotate(-15deg)" }}
            >
              <p style={{ fontFamily: "monospace", fontSize: 6, color: "#333" }}>FEB 14</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Small decorative stamp - left side */}
      <motion.div
        className="absolute top-14 left-8 pointer-events-none"
        initial={{ scale: 0, rotate: 15 }}
        animate={stampLanded ? { scale: 1, rotate: -5 } : {}}
        transition={{ delay: 0.2, type: "spring", stiffness: 250, damping: 18 }}
      >
        <div
          className="p-1.5"
          style={{
            width: 45,
            height: 55,
            background: "#fff",
            border: "2px dashed #ccc",
            boxShadow: "1px 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #bbdefb 0%, #90caf9 100%)" }}
          >
            <span className="text-lg">✈️</span>
          </div>
        </div>
      </motion.div>

      {/* Main content - Wax seal focus */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Large wax seal */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={sealRevealed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 12 }}
        >
          {/* Seal shadow */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2"
            style={{
              width: 100,
              height: 15,
              borderRadius: "50%",
              background: "rgba(127,0,0,0.15)",
              filter: "blur(8px)",
            }}
          />

          {/* Main seal */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #ef5350 0%, #c62828 35%, #8b0000 70%, #5d0000 100%)",
              boxShadow: "0 8px 25px rgba(139,0,0,0.4), inset 0 -4px 10px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,200,200,0.15)",
            }}
          >
            {/* Wax texture ring */}
            <div
              className="absolute inset-2 rounded-full"
              style={{
                border: "2px solid rgba(255,200,200,0.1)",
              }}
            />

            {/* Heart emboss */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={sealRevealed ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <svg width="50" height="50" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,205,210,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,205,210,0.15)" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="url(#heartGrad)"
                  stroke="rgba(255,200,200,0.25)"
                  strokeWidth="0.5"
                />
              </svg>
            </motion.div>

            {/* Wax drips */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2"
              style={{
                width: 14,
                height: 10,
                background: "linear-gradient(180deg, #a82020 0%, #8b0000 100%)",
                borderRadius: "0 0 50% 50%",
              }}
            />
            <div
              className="absolute -bottom-1 left-1/4"
              style={{
                width: 8,
                height: 6,
                background: "#9a1c1c",
                borderRadius: "0 0 50% 50%",
              }}
            />
            <div
              className="absolute -bottom-1.5 right-1/4"
              style={{
                width: 10,
                height: 8,
                background: "#a02020",
                borderRadius: "0 0 50% 50%",
              }}
            />
          </div>

          {/* Pulse glow */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(198,40,40,0)",
                "0 0 0 20px rgba(198,40,40,0.1)",
                "0 0 0 0px rgba(198,40,40,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={sealRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "13px",
            color: "#6d4c41",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={sealRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center px-4"
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: "clamp(2rem, 8vw, 3rem)",
            fontWeight: 700,
            color: "#880e4f",
            textShadow: "0 2px 8px rgba(136,14,79,0.1)",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Decorative flourish */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={sealRevealed ? { width: 80, opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-4"
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #c62828, transparent)",
          }}
        />

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
          transition={{ delay: 1.8, duration: 2.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: "#8d6e63",
            letterSpacing: "0.1em",
          }}
        >
          tap to open
        </motion.p>
      </motion.div>

      {/* Vintage postmark in corner */}
      <div
        className="absolute bottom-12 left-8 pointer-events-none opacity-20"
        style={{ transform: "rotate(-12deg)" }}
      >
        <div className="border-2 border-gray-500 rounded-full px-3 py-1">
          <p style={{ fontFamily: "monospace", fontSize: 10, color: "#333", letterSpacing: "0.1em" }}>
            PRIORITY MAIL
          </p>
        </div>
      </div>

      {/* PAR AVION text */}
      <motion.div
        className="absolute bottom-12 right-8 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#1565c0",
            letterSpacing: "0.3em",
            fontWeight: 700,
          }}
        >
          PAR AVION
        </p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// STARGAZER CELESTIAL SPLASH
// ============================================

function StargazerSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "written in the stars by" : "crafted among the stars by";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(12px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "#050514" }}
      onClick={onTap}
    >
      {/* Star field background */}
      <SplashStarField />

      {/* Nebula glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(124,58,237,0.12), transparent),
            radial-gradient(ellipse 60% 80% at 70% 60%, rgba(236,72,153,0.08), transparent)
          `,
        }}
      />

      {/* Central content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
        className="relative text-center px-8 z-10"
      >
        {/* Pulsing star icon */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#fbbf24",
              boxShadow: "0 0 30px #fbbf24, 0 0 60px rgba(124,58,237,0.5), 0 0 100px rgba(251,191,36,0.3)",
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#e8e4ff",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 8vw, 3.5rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#e8e4ff",
            textShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.3), 0 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "0.02em",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-6"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 0.3 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #fbbf24, transparent)",
          }}
        />

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.25, 0.5] }}
          transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "12px",
            color: "#fbbf24",
            letterSpacing: "0.2em",
          }}
        >
          tap to begin
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// PREMIERE CINEMATIC SPLASH
// ============================================

function PremiereSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "a film by" : "presented by";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "#0a0a0a" }}
      onClick={onTap}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: "overlay" as const,
        }}
      />

      {/* Spotlight beam from top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "80%",
          height: "100%",
          background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Velvet red edge glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 100% at 0% 50%, rgba(139,26,43,0.15), transparent),
            radial-gradient(ellipse 40% 100% at 100% 50%, rgba(139,26,43,0.15), transparent)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Central content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
        className="relative text-center px-8 z-10"
      >
        {/* Clapperboard icon */}
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl"
          >
            🎬
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
            fontSize: "14px",
            color: "#d4a017",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(2rem, 8vw, 3.5rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: "#f5e6d0",
            textShadow: "0 0 40px rgba(212,160,23,0.4), 0 0 80px rgba(196,30,58,0.2), 0 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "0.03em",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Gold decorative line */}
        <motion.div
          className="mx-auto mt-6"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 80, opacity: 0.4 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #d4a017, transparent)",
          }}
        />

        {/* Tap hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
          transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
            fontSize: "13px",
            color: "#c41e3a",
            letterSpacing: "0.25em",
          }}
        >
          tap to begin
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// FOREST ADVENTURE — RETRO JRPG SPLASH
// ============================================

function ForestAdventureSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "A quest from" : "An adventure by";

  const [textIndex, setTextIndex] = useState(0);
  const [showName, setShowName] = useState(false);
  const fullText = "A mysterious letter has arrived...";

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timer = setTimeout(() => setTextIndex(textIndex + 1), 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowName(true), 400);
      return () => clearTimeout(timer);
    }
  }, [textIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "#0c1445",
        imageRendering: "pixelated",
      }}
      onClick={onTap}
    >
      {/* Pixel art night sky gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #0c1445 0%, #1a237e 40%, #283593 70%, #3949ab 100%)",
        }}
      />

      {/* Pixel stars - larger, blocky */}
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${(i * 41 + 7) % 100}%`,
            top: `${(i * 31 + 3) % 60}%`,
            width: i % 4 === 0 ? 4 : 2,
            height: i % 4 === 0 ? 4 : 2,
            background: i % 5 === 0 ? "#ffd54f" : "#fff",
            boxShadow: i % 5 === 0 ? "0 0 4px #ffd54f" : "none",
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 1.5 + (i % 2),
            delay: (i * 0.2) % 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Pixel art forest silhouette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        {/* Trees layer - pixelated triangles */}
        <svg viewBox="0 0 320 80" className="w-full h-auto" preserveAspectRatio="none" style={{ imageRendering: "pixelated" }}>
          {/* Back trees - darker */}
          <path d="M0,80 L0,50 L10,50 L15,30 L20,50 L30,50 L35,25 L40,50 L50,50 L55,35 L60,50 L70,50 L75,20 L80,50 L90,50 L95,30 L100,50 L110,50 L115,25 L120,50 L130,50 L140,35 L150,50 L155,25 L160,50 L170,50 L175,30 L180,50 L190,50 L200,20 L210,50 L220,50 L225,35 L230,50 L240,50 L245,25 L250,50 L260,50 L270,30 L280,50 L285,25 L290,50 L300,50 L305,35 L310,50 L320,50 L320,80 Z" fill="#0d1f0d"/>
          {/* Front trees - lighter */}
          <path d="M0,80 L0,60 L15,60 L20,45 L25,60 L45,60 L50,40 L55,60 L80,60 L90,50 L100,60 L115,60 L120,42 L125,60 L150,60 L160,48 L170,60 L190,60 L195,45 L200,60 L220,60 L230,38 L240,60 L260,60 L265,50 L270,60 L290,60 L300,45 L310,60 L320,60 L320,80 Z" fill="#1a3d1a"/>
        </svg>
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{ background: "#2d5a2d" }} />
      </div>

      {/* Fireflies */}
      {[
        { x: 15, y: 65 }, { x: 30, y: 70 }, { x: 50, y: 68 },
        { x: 70, y: 72 }, { x: 85, y: 66 }, { x: 45, y: 75 }
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: 4,
            height: 4,
            background: "#ffe082",
            boxShadow: "0 0 8px 2px rgba(255,224,130,0.6)",
            borderRadius: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -10, 0],
            x: [0, (i % 2 === 0 ? 5 : -5), 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Main RPG dialogue box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3, ease: "linear" }}
        className="relative z-10 mx-4"
        style={{ maxWidth: 340 }}
      >
        {/* Classic RPG wooden frame */}
        <div
          className="relative"
          style={{
            background: "linear-gradient(180deg, #8b5a2b 0%, #6b4423 50%, #5c3a1d 100%)",
            padding: 6,
            border: "4px solid #3d2314",
            boxShadow: "inset 0 0 0 2px #a0522d, 4px 4px 0 #1a0f0a",
          }}
        >
          {/* Inner blue RPG box */}
          <div
            style={{
              background: "linear-gradient(180deg, #1a237e 0%, #0d1445 100%)",
              border: "3px solid #3949ab",
              padding: "20px 24px",
              boxShadow: "inset 0 0 0 2px #1a237e",
            }}
          >
            {/* Corner decorations - pixel style */}
            <div className="absolute top-3 left-3 w-2 h-2" style={{ background: "#ffd54f" }} />
            <div className="absolute top-3 right-3 w-2 h-2" style={{ background: "#ffd54f" }} />
            <div className="absolute bottom-3 left-3 w-2 h-2" style={{ background: "#ffd54f" }} />
            <div className="absolute bottom-3 right-3 w-2 h-2" style={{ background: "#ffd54f" }} />

            {/* Quest icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center mb-4"
            >
              <motion.span
                className="inline-block text-3xl"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ filter: "drop-shadow(0 2px 0 #1a0f0a)" }}
              >
                💌
              </motion.span>
            </motion.div>

            {/* Typewriter text */}
            <div className="text-center mb-4 min-h-[24px]">
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "10px",
                  color: "#fff",
                  textShadow: "2px 2px 0 #0d1445",
                  lineHeight: 1.8,
                }}
              >
                {fullText.substring(0, textIndex)}
                {textIndex < fullText.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    ▌
                  </motion.span>
                )}
              </p>
            </div>

            {/* Name reveal */}
            <AnimatePresence>
              {showName && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Divider */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div style={{ width: 8, height: 2, background: "#ffd54f" }} />
                    <span style={{ color: "#ffd54f", fontSize: 8 }}>◆</span>
                    <div style={{ width: 20, height: 2, background: "#ffd54f" }} />
                    <span style={{ color: "#ffd54f", fontSize: 8 }}>◆</span>
                    <div style={{ width: 8, height: 2, background: "#ffd54f" }} />
                  </div>

                  <p
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "7px",
                      color: "#90caf9",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    {tagline.toUpperCase()}
                  </p>

                  <motion.h1
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "clamp(14px, 4vw, 18px)",
                      color: "#ffd54f",
                      textShadow: "2px 2px 0 #5d4037, 0 0 10px rgba(255,213,79,0.4)",
                    }}
                  >
                    {displayName}
                  </motion.h1>

                  {/* Blinking arrow indicator */}
                  <motion.div
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="mt-4"
                  >
                    <span style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "10px",
                      color: "#fff",
                    }}>
                      ▼
                    </span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 1] }}
                    transition={{ delay: 0.5, duration: 1, repeat: Infinity }}
                    className="mt-2"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: "7px",
                      color: "#90caf9",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PRESS START
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Scan lines overlay for CRT effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          opacity: 0.3,
        }}
      />
    </motion.div>
  );
}

// ============================================
// SPLASH STAR FIELD (lightweight version)
// ============================================

function SplashStarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (i * 37 + 13) % 100,
      y: (i * 53 + 7) % 100,
      size: 1 + (i % 3),
      delay: (i * 0.7) % 5,
      duration: 2 + (i % 4),
      brightness: 0.3 + ((i * 17) % 70) / 100,
      isGold: i % 7 === 0,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.isGold ? "#fbbf24" : "#e8e4ff",
            boxShadow: star.isGold
              ? `0 0 ${star.size * 3}px rgba(251,191,36,0.4)`
              : `0 0 ${star.size * 2}px rgba(232,228,255,0.3)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.brightness, star.brightness * 0.3, star.brightness],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// FLOATING HEARTS ANIMATION (default splash)
// ============================================

function FloatingHearts() {
  const hearts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: (i * 37 + 13) % 100,
      top: (i * 53 + 7) % 100,
      fontSize: 20 + (i * 5) % 30,
      xOffset: ((i * 7) % 20) - 10,
      duration: 4 + (i % 4),
      delay: (i * 0.4) % 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute text-pink-300/30"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            fontSize: `${h.fontSize}px`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, h.xOffset, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// ELEGANT INVITATION SPLASH
// ============================================

function ElegantInvitationSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f5ebe0 0%, #e8d5c4 100%)",
      }}
      onClick={onTap}
    >
      {/* Subtle paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Envelope visual */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ perspective: "1000px" }}
      >
        {/* Envelope body */}
        <div
          className="relative w-72 md:w-80"
          style={{
            aspectRatio: "4/3",
            background: "linear-gradient(180deg, #fdfbf7 0%, #f8f4f0 100%)",
            borderRadius: 8,
            boxShadow: "0 20px 60px rgba(139, 90, 90, 0.2), 0 8px 20px rgba(139, 90, 90, 0.1)",
            border: "1px solid rgba(183, 110, 121, 0.15)",
          }}
        >
          {/* Envelope flap (decorative triangle) */}
          <div
            className="absolute -top-1 left-0 right-0"
            style={{
              height: "50%",
              background: "linear-gradient(180deg, #f8e8e4 0%, #fdfbf7 100%)",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          {/* Wax seal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "20%" }}
          >
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 30%, #c9787e 0%, #b76e79 50%, #9a5a63 100%)",
                boxShadow: "0 4px 12px rgba(183, 110, 121, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Heart embossed on seal */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="rgba(255, 255, 255, 0.85)"
                />
              </svg>
            </div>
          </motion.div>

          {/* Name on envelope */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "11px",
                color: "#9a8a8a",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              sealed with love by
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.4rem, 6vw, 1.8rem)",
                fontStyle: "italic",
                color: "#b76e79",
                letterSpacing: "0.02em",
              }}
            >
              {displayName}
            </p>
          </motion.div>
        </div>

        {/* Tap to open hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.4, 0.7] }}
          transition={{ delay: 1.8, duration: 2.5, repeat: Infinity }}
          className="text-center mt-8"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px",
            color: "#b76e79",
            letterSpacing: "0.15em",
          }}
        >
          tap to open
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

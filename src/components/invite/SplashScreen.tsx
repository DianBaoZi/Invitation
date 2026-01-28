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
}

export function SplashScreen({ creatorName, isPaid, onComplete, templateId }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const appName = getAppName();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
  };

  // Template-specific splash screens
  const splashMap: Record<string, React.ReactNode> = {
    stargazer: <StargazerSplash {...splashProps} />,
    premiere: <PremiereSplash {...splashProps} />,
    "y2k-digital-crush": <Y2KSplash {...splashProps} />,
    "scratch-reveal": <GardenSplash {...splashProps} />,
    "neon-arcade": <ArcadeSplash {...splashProps} />,
    "cozy-scrapbook": <ScrapbookSplash {...splashProps} />,
  };

  const customSplash = templateId && splashMap[templateId];

  if (customSplash) {
    return (
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isVisible && customSplash}
      </AnimatePresence>
    );
  }

  // Default splash for all other templates
  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100"
          onClick={() => setIsVisible(false)}
        >
          <FloatingHearts />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative text-center px-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mb-6"
            >
              <Heart className="w-16 h-16 mx-auto text-pink-500 fill-pink-500" />
            </motion.div>

            {isPaid && creatorName ? (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl text-gray-600 mb-2"
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: 700,
                    color: "#880e4f",
                  }}
                >
                  Wholeheartedly made by
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  {creatorName}
                </motion.h1>
              </>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-2"
                >
                  Made with
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                >
                  {appName}
                </motion.h1>
              </>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
              className="mt-8 text-sm text-gray-400"
            >
              Tap anywhere to continue
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
// NEON ARCADE — INSERT COIN SPLASH
// ============================================

function ArcadeSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
  const displayName = isPaid && creatorName ? creatorName : appName;
  const tagline = isPaid && creatorName ? "CHALLENGE FROM" : "POWERED BY";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: "#0a0a1a" }}
      onClick={onTap}
    >
      {/* Animated neon rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${15 + i * 18}%`,
              left: "-100%",
              width: "300%",
              height: 1,
              background: `linear-gradient(90deg, transparent 20%, ${
                ["#ff00ff", "#00ffff", "#00ff88", "#7c3aed", "#ff00ff"][i]
              }22 50%, transparent 80%)`,
              transform: `rotate(${-20 + i * 10}deg)`,
            }}
            animate={{ x: ["-20%", "20%"] }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating neon particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            width: 2,
            height: 2,
            background: ["#ff00ff", "#00ffff", "#00ff88", "#7c3aed"][i % 4],
            boxShadow: `0 0 6px ${["#ff00ff", "#00ffff", "#00ff88", "#7c3aed"][i % 4]}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3),
            delay: (i * 0.4) % 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
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
        {/* Arcade joystick / coin icon */}
        <motion.div
          className="mb-6 flex items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-4xl"
            style={{
              filter: "drop-shadow(0 0 15px rgba(255,0,255,0.5))",
            }}
          >
            🕹️
          </motion.div>
        </motion.div>

        {/* "PLAYER 2" header */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ delay: 0.4, duration: 0.6, times: [0, 0.3, 0.6, 1] }}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#00ffff",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,255,255,0.6), 0 0 20px rgba(0,255,255,0.3)",
            marginBottom: 4,
          }}
        >
          PLAYER 2 DETECTED
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "10px",
            color: "#ff00ff",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {tagline}
        </motion.p>

        {/* Name — neon glow */}
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "clamp(1.6rem, 7vw, 2.8rem)",
            fontWeight: 700,
            color: "#ffffff",
            textShadow: `
              0 0 10px #ff00ff,
              0 0 20px #ff00ff,
              0 0 40px rgba(255,0,255,0.5),
              0 0 80px rgba(255,0,255,0.2)
            `,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          {displayName}
        </motion.h1>

        {/* Neon underline */}
        <motion.div
          className="mx-auto mt-4"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 100, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            height: 2,
            background: "linear-gradient(90deg, transparent, #00ffff, #ff00ff, transparent)",
            boxShadow: "0 0 10px rgba(0,255,255,0.5)",
          }}
        />

        {/* INSERT COIN hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.3, 0.8] }}
          transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
          className="mt-8"
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "12px",
            fontWeight: 700,
            color: "#00ff88",
            letterSpacing: "0.2em",
            textShadow: "0 0 8px rgba(0,255,136,0.5)",
            textTransform: "uppercase",
          }}
        >
          INSERT COIN TO START
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// COZY SCRAPBOOK — CRAFT PAPER SPLASH
// ============================================

function ScrapbookSplash({ creatorName, isPaid, appName, onTap }: ThemedSplashProps) {
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
        {/* Washi tape decorative strip */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto mb-6"
          style={{
            width: 80,
            height: 12,
            background: "linear-gradient(90deg, #c27256, #d4a574)",
            borderRadius: 2,
            opacity: 0.4,
            transform: "rotate(-3deg)",
          }}
        />

        {/* Envelope / letter icon */}
        <motion.div
          className="mb-5 flex items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
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
          transition={{ delay: 0.6, duration: 0.8 }}
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
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span style={{ fontSize: 10 }}>🌸</span>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #c27256, transparent)" }} />
          <span style={{ fontSize: 10 }}>🌸</span>
        </motion.div>

        {/* Second washi tape */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
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
          transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
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

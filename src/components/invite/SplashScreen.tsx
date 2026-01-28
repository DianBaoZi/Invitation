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

  // Stargazer gets its own celestial splash
  if (templateId === "stargazer") {
    return (
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isVisible && (
          <StargazerSplash
            creatorName={creatorName}
            isPaid={isPaid}
            appName={appName}
            onTap={() => setIsVisible(false)}
          />
        )}
      </AnimatePresence>
    );
  }

  // Premiere gets its own cinematic splash
  if (templateId === "premiere") {
    return (
      <AnimatePresence onExitComplete={handleAnimationComplete}>
        {isVisible && (
          <PremiereSplash
            creatorName={creatorName}
            isPaid={isPaid}
            appName={appName}
            onTap={() => setIsVisible(false)}
          />
        )}
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
// STARGAZER CELESTIAL SPLASH
// ============================================

function StargazerSplash({
  creatorName,
  isPaid,
  appName,
  onTap,
}: {
  creatorName?: string | null;
  isPaid: boolean;
  appName: string;
  onTap: () => void;
}) {
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

function PremiereSplash({
  creatorName,
  isPaid,
  appName,
  onTap,
}: {
  creatorName?: string | null;
  isPaid: boolean;
  appName: string;
  onTap: () => void;
}) {
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

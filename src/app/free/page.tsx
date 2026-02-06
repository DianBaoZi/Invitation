"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

export default function FreePage() {
  const [showSplash, setShowSplash] = useState(true);

  // Auto-dismiss splash after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating hearts background */}
      <FloatingHearts />

      {/* Splash screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      {/* Main content (visible after splash) */}
      <AnimatePresence>
        {!showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex items-center justify-center p-4"
          >
            <RunawayButtonTemplate />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SPLASH SCREEN - Premium luxurious aesthetic
// ============================================

function SplashScreen() {
  const particles = [
    { left: 10, top: 15, size: 4, delay: 0 },
    { left: 85, top: 20, size: 3, delay: 0.5 },
    { left: 20, top: 70, size: 5, delay: 1 },
    { left: 75, top: 75, size: 3, delay: 1.5 },
    { left: 50, top: 10, size: 4, delay: 2 },
    { left: 90, top: 50, size: 3, delay: 2.5 },
    { left: 5, top: 45, size: 4, delay: 3 },
    { left: 60, top: 85, size: 5, delay: 3.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Deep luxurious gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(190,18,60,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 50%, rgba(157,23,77,0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 50%, rgba(190,18,60,0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 100%, rgba(136,19,55,0.2) 0%, transparent 50%),
            linear-gradient(180deg, #1a0a0a 0%, #2d0a0a 30%, #1f0505 70%, #0d0303 100%)
          `,
        }}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Elegant glow orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 60%)",
          left: "30%",
          top: "20%",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(190,18,60,0.12) 0%, transparent 60%)",
          right: "20%",
          bottom: "30%",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating gold particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            boxShadow: "0 0 12px 2px rgba(251,191,36,0.4)",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Center heart with premium glow */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer glow ring */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "200px",
            height: "200px",
            background: "radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Heart icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.08, 1], opacity: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart
            className="w-28 h-28"
            style={{
              fill: "url(#splashHeartGradient)",
              stroke: "url(#splashStrokeGradient)",
              strokeWidth: "1",
              filter: "drop-shadow(0 0 30px rgba(225,29,72,0.5)) drop-shadow(0 0 60px rgba(225,29,72,0.3))",
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="splashHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="splashStrokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fda4af" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Bottom branding */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 pb-12 pt-24 text-center z-20"
        style={{
          background: "linear-gradient(to top, rgba(13,3,3,0.95) 0%, transparent 100%)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <p
          className="text-rose-100/50 text-sm tracking-widest uppercase mb-3"
          style={{ letterSpacing: "0.3em" }}
        >
          Crafted with love by
        </p>
        <p
          className="text-3xl md:text-4xl font-semibold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #fda4af 0%, #fb7185 50%, #f43f5e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
          }}
        >
          YoursInvite.com
        </p>
      </motion.div>

      {/* Elegant corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-rose-500/20 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-rose-500/20 rounded-tr-lg pointer-events-none" />
    </motion.div>
  );
}

// ============================================
// RUNAWAY BUTTON TEMPLATE
// ============================================

function RunawayButtonTemplate() {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hoverCount, setHoverCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNoHover = () => {
    const maxX = 150;
    const maxY = 100;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setNoPosition({ x: newX, y: newY });
    setHoverCount((c) => c + 1);
  };

  const handleYesClick = () => {
    setShowSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Yay! You made my day! 💕
        </h2>
        <p className="text-gray-600">
          Can't wait to see you!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md w-full"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Will you go out with me?
      </h2>

      <div className="flex items-center justify-center gap-6 min-h-[100px] relative">
        {/* Yes Button */}
        <motion.button
          onClick={handleYesClick}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💕
        </motion.button>

        {/* No Button (runs away) */}
        <motion.button
          className="px-8 py-4 rounded-xl bg-gray-200 text-gray-700 text-lg font-semibold"
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          style={{ position: "relative" }}
        >
          No
        </motion.button>
      </div>

      {hoverCount > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-sm text-gray-500"
        >
          Looks like "No" isn't an option 😉
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================

function FloatingHearts() {
  const hearts = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${25 + Math.random() * 35}px`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

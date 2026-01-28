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
// SPLASH SCREEN
// ============================================

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        {/* Heart icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4"
        >
          <Heart className="w-16 h-16 mx-auto text-pink-500 fill-pink-500" />
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-2xl md:text-3xl font-medium text-gray-700"
        >
          Made with <span className="text-pink-500">❤️</span>
        </motion.p>
      </motion.div>
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

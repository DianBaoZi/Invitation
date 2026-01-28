"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const AVOCADO_IMAGES = [
  "/templates/kawaii/avocado-img1.png",
  "/templates/kawaii/avocado-img2.png",
  "/templates/kawaii/avocado-img3.png",
  "/templates/kawaii/avocado-img4.png",
  "/templates/kawaii/avocado-img5.png",
];

export function AvocadoValentine({
  senderName = "Someone",
}: {
  senderName?: string;
}) {
  const [screen, setScreen] = useState<"splash" | "main" | "success">("splash");
  const [noCount, setNoCount] = useState(0);

  // Auto-advance splash after 2.5 seconds
  useEffect(() => {
    if (screen === "splash") {
      const timer = setTimeout(() => setScreen("main"), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleNo = () => {
    if (noCount < 4) {
      setNoCount((c) => c + 1);
    }
  };

  const handleYes = () => {
    setScreen("success");
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 } });
    }, 300);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "#FFFFFF",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Floating hearts background */}
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {screen === "splash" && (
          <SplashScreen key="splash" onTap={() => setScreen("main")} />
        )}
        {screen === "main" && (
          <MainScreen
            key="main"
            noCount={noCount}
            onNo={handleNo}
            onYes={handleYes}
          />
        )}
        {screen === "success" && <SuccessScreen key="success" />}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SPLASH SCREEN
// ============================================

function SplashScreen({ onTap }: { onTap: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)", scale: 0.9 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer"
      onClick={onTap}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20, filter: "blur(10px)" }}
        animate={{ scale: 1, rotate: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
        className="mb-6"
      >
        <img
          src="/templates/kawaii/avocado-img1.png"
          alt="Avocado"
          className="w-40 h-40 object-contain"
        />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-gray-800 text-center px-6"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Someone has a crush on you...
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
        transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
        className="mt-8 text-gray-400 text-sm"
      >
        Tap to continue
      </motion.p>
    </motion.div>
  );
}

// ============================================
// MAIN SCREEN (Reveal + Interaction)
// ============================================

function MainScreen({
  noCount,
  onNo,
  onYes,
}: {
  noCount: number;
  onNo: () => void;
  onYes: () => void;
}) {
  const currentImage = AVOCADO_IMAGES[Math.min(noCount, 4)];
  const noHidden = noCount >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center z-10 w-full max-w-[400px] px-6"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Avo you want for Valentine is you
      </motion.h2>

      {/* Avocado image */}
      <motion.div
        className="relative w-64 h-64 mb-8"
        key={`shake-${noCount}`}
        animate={
          noCount > 0
            ? { x: [0, -12, 14, -10, 10, -5, 5, 0], rotate: [0, -3, 3, -2, 2, 0] }
            : {}
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.img
            key={noCount}
            src={currentImage}
            alt="Avocado Valentine"
            className="w-full h-full object-contain absolute inset-0"
            initial={{ opacity: 0, scale: 1.15, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Buttons */}
      <div className="flex items-center gap-4 w-full justify-center">
        {/* Yes button */}
        <motion.button
          onClick={onYes}
          className="px-8 py-4 rounded-2xl text-white text-lg font-bold shadow-lg"
          style={{
            background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
            fontFamily: "'Nunito', sans-serif",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            noHidden
              ? {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 4px 15px rgba(76,175,80,0.3)",
                    "0 4px 30px rgba(76,175,80,0.6)",
                    "0 4px 15px rgba(76,175,80,0.3)",
                  ],
                }
              : {}
          }
          transition={
            noHidden
              ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          Yes! <span className="ml-1">💚</span>
        </motion.button>

        {/* No button */}
        <AnimatePresence>
          {!noHidden && (
            <motion.button
              onClick={onNo}
              className="px-6 py-4 rounded-2xl text-gray-600 text-base font-semibold shadow-md"
              style={{
                background: "#e8e8e8",
                fontFamily: "'Nunito', sans-serif",
              }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
            >
              No
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Hint after some clicks */}
      {noCount >= 3 && !noHidden && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-gray-400 text-center"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          You&apos;re running out of avocado...
        </motion.p>
      )}

      {noHidden && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-gray-500 text-center"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          There&apos;s only one option left...
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================
// SUCCESS SCREEN
// ============================================

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="flex flex-col items-center z-10 text-center px-6"
    >
      <motion.img
        src="/templates/kawaii/avocado-img1.png"
        alt="Happy Avocado"
        className="w-48 h-48 object-contain mb-6"
        animate={{
          y: [0, -12, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        It&apos;s a date!
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 text-2xl"
      >
        <span>🥑</span>
        <span>💚</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 text-gray-500 text-base"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        You&apos;re all I avo wanted
      </motion.p>
    </motion.div>
  );
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================

function FloatingHearts() {
  const hearts = Array.from({ length: 10 }, (_, i) => i);
  const emojis = ["💚", "🥑", "💚", "🥑", "💚", "🥑", "💚", "💚", "🥑", "💚"];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${8 + (i * 9.5) % 85}%`,
            top: `${5 + (i * 11) % 80}%`,
            fontSize: `${18 + (i * 4) % 20}px`,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeInOut",
          }}
        >
          {emojis[i]}
        </motion.div>
      ))}
    </div>
  );
}

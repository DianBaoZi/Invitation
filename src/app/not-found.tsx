"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

// Floating hearts background
function FloatingHearts() {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 7,
    size: 16 + Math.random() * 24,
    opacity: 0.1 + Math.random() * 0.2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-pink-300"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: "110vh", rotate: -20 }}
          animate={{
            y: "-10vh",
            rotate: 20,
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {["💌", "💕", "✨", "💗", "🌸"][heart.id % 5]}
        </motion.div>
      ))}
    </div>
  );
}

// Confetti explosion
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    rotation: Math.random() * 720 - 360,
    scale: 0.5 + Math.random() * 0.5,
    color: ["#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"][i % 7],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotation,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function NotFound() {
  const router = useRouter();
  const [runawayPos, setRunawayPos] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState(0);
  const [surrendered, setSurrendered] = useState(false);

  const MESSAGES = [
    "Oops! This page ran away...",
    "Maybe it went to get coffee?",
    "It's definitely not hiding from you.",
    "Perhaps it's on vacation?",
    "404: Page is playing hide and seek!",
  ];

  const ESCAPE_MESSAGES = [
    "Nice try!",
    "Too slow!",
    "Can't catch me!",
    "Hehe, missed!",
    "I'm too fast!",
    "Almost!",
    "Nope!",
    "Keep trying!",
  ];

  const SURRENDER_MESSAGES = [
    "Okay okay, you win!",
    "Fine, I give up!",
    "Alright, let's go home...",
  ];

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessage((m) => (m + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Runaway button logic
  const handleRunaway = useCallback(() => {
    if (surrendered) return;

    const newCount = escapeCount + 1;
    setEscapeCount(newCount);

    // After 8 escapes, surrender
    if (newCount >= 8) {
      setSurrendered(true);
      return;
    }

    // Random escape direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;
    const newX = Math.cos(angle) * distance;
    const newY = Math.sin(angle) * distance;

    // Keep within bounds
    const boundedX = Math.max(-150, Math.min(150, runawayPos.x + newX));
    const boundedY = Math.max(-100, Math.min(100, runawayPos.y + newY));

    setRunawayPos({ x: boundedX, y: boundedY });
  }, [escapeCount, runawayPos, surrendered]);

  const handleGoHome = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 overflow-hidden">
      <FloatingHearts />
      <Confetti active={showConfetti} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Animated 404 with envelope */}
        <motion.div className="relative inline-block mb-6">
          <motion.span
            className="text-[120px] sm:text-[150px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            404
          </motion.span>

          {/* Floating envelope */}
          <motion.div
            className="absolute -top-4 -right-4 text-5xl"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💌
          </motion.div>

          {/* Sparkles */}
          <motion.div
            className="absolute top-0 left-0 text-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-0 text-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Changing message */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={message}
            className="text-xl sm:text-2xl text-stone-600 mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {MESSAGES[message]}
          </motion.h2>
        </AnimatePresence>

        <p
          className="text-stone-500 mb-8"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
        >
          Don&apos;t worry, we&apos;ll help you find your way back!
        </p>

        {/* Interactive buttons */}
        <div className="flex flex-col items-center gap-4 relative h-32">
          {/* Escape count indicator */}
          {escapeCount > 0 && !surrendered && (
            <motion.p
              key={escapeCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-8 text-sm font-medium text-pink-500"
            >
              {ESCAPE_MESSAGES[(escapeCount - 1) % ESCAPE_MESSAGES.length]}
            </motion.p>
          )}

          {surrendered && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-8 text-sm font-medium text-green-500"
            >
              {SURRENDER_MESSAGES[Math.floor(Math.random() * SURRENDER_MESSAGES.length)]}
            </motion.p>
          )}

          <div className="flex gap-4 items-center justify-center relative">
            {/* Runaway "Stay Lost" button */}
            <motion.button
              animate={{
                x: surrendered ? 0 : runawayPos.x,
                y: surrendered ? 0 : runawayPos.y,
                scale: surrendered ? 0.8 : 1,
                opacity: surrendered ? 0.5 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onMouseEnter={handleRunaway}
              onTouchStart={handleRunaway}
              onClick={surrendered ? handleGoHome : undefined}
              className={`px-6 py-3 rounded-full border-2 transition-colors ${
                surrendered
                  ? "border-green-300 text-green-600 bg-green-50 cursor-pointer"
                  : "border-pink-200 text-pink-600 bg-white hover:bg-pink-50"
              }`}
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {surrendered ? "Take me home" : "Stay Lost"}
            </motion.button>

            {/* Growing "Go Home" button */}
            <motion.button
              onClick={handleGoHome}
              animate={{
                scale: 1 + escapeCount * 0.05,
              }}
              whileHover={{ scale: 1.1 + escapeCount * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
              {escapeCount >= 3 && (
                <Sparkles className="w-4 h-4 animate-pulse" />
              )}
            </motion.button>
          </div>

          {/* Hint text */}
          {escapeCount === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2 }}
              className="text-xs text-stone-400 mt-4"
            >
              Hint: Try to catch the &quot;Stay Lost&quot; button 😉
            </motion.p>
          )}

          {escapeCount > 0 && escapeCount < 8 && !surrendered && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-xs text-stone-400 mt-4"
            >
              {8 - escapeCount} more tries until it gives up...
            </motion.p>
          )}
        </div>

        {/* Footer link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-sm text-stone-400"
        >
          Or create your own{" "}
          <button
            onClick={() => router.push("/")}
            className="text-pink-500 hover:text-pink-600 underline"
          >
            interactive invitation
          </button>
          !
        </motion.div>
      </motion.div>
    </div>
  );
}

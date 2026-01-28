"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface NeonArcadeProps {
  message: string;
  senderName?: string;
  imageUrl?: string;
}

interface NoButtonCopy {
  id: number;
  x: number;
  y: number;
}

export function NeonArcade({ message, senderName = "Someone Special", imageUrl }: NeonArcadeProps) {
  const [noButtons, setNoButtons] = useState<NoButtonCopy[]>([{ id: 0, x: 0, y: 0 }]);
  const [nextId, setNextId] = useState(1);
  const [allGone, setAllGone] = useState(false);
  const [yesPulse, setYesPulse] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNoApproach = useCallback((buttonId: number) => {
    if (allGone) return;

    setYesPulse(true);
    setTimeout(() => setYesPulse(false), 500);

    setNoButtons((prev) => {
      // Remove the approached button
      const remaining = prev.filter((b) => b.id !== buttonId);

      // If we already have too many, start removing
      if (prev.length >= 12) {
        setAllGone(true);
        return [];
      }

      // Split into 2-3 new copies
      const splitCount = Math.min(3, 15 - remaining.length);
      const newButtons: NoButtonCopy[] = [];
      for (let i = 0; i < splitCount; i++) {
        const angle = (Math.PI * 2 * i) / splitCount + Math.random() * 0.5;
        const distance = 80 + Math.random() * 120;
        newButtons.push({
          id: nextId + i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }

      setNextId((n) => n + splitCount);
      return [...remaining, ...newButtons];
    });
  }, [allGone, nextId]);

  const handleYesClick = () => {
    setShowSuccess(true);
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ff00ff", "#00ffff", "#ff69b4", "#7c3aed", "#00ff88"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ["#ff00ff", "#00ffff", "#7c3aed"],
      });
    }, 300);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: "#0a0a1a" }}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <NeonRays />
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-10 relative z-10 rounded-lg"
          style={{
            background: "rgba(10,10,26,0.9)",
            border: "2px solid #00ffff",
            boxShadow: "0 0 30px rgba(0,255,255,0.3), 0 0 60px rgba(255,0,255,0.15), inset 0 0 30px rgba(0,255,255,0.05)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🏆
          </motion.div>
          <h2
            className="text-3xl font-bold mb-2 uppercase tracking-widest"
            style={{
              color: "#00ffff",
              textShadow: "0 0 10px #00ffff, 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.5)",
            }}
          >
            HIGH SCORE!
          </h2>
          <p className="text-lg" style={{ color: "#ff69b4", textShadow: "0 0 10px #ff69b4" }}>
            YOU WIN: A Date! 💕
          </p>
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.4)" }}>
            INSERT COIN TO PLAY AGAIN
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#0a0a1a" }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeonRays />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Title */}
        <motion.h1
          className="text-center text-3xl font-bold uppercase tracking-[0.2em] mb-6"
          style={{
            color: "#ff00ff",
            textShadow: "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
            fontFamily: "'Courier New', monospace",
          }}
          animate={{
            textShadow: [
              "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
              "0 0 10px #ff00ff, 0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.7)",
              "0 0 5px #ff00ff, 0 0 15px #ff00ff, 0 0 30px rgba(255,0,255,0.3)",
              "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Neon Arcade
        </motion.h1>

        {/* HIGH-SCORE label */}
        <div className="text-center mb-2">
          <span
            className="text-xs uppercase tracking-[0.3em] font-bold"
            style={{
              color: "#00ffff",
              textShadow: "0 0 5px #00ffff",
            }}
          >
            — HIGH-SCORE —
          </span>
        </div>

        {/* Photo frame */}
        <div className="flex justify-center mb-6">
          <div
            className="p-1 rounded-md"
            style={{
              border: "2px solid #00ffff",
              boxShadow: "0 0 15px rgba(0,255,255,0.4), inset 0 0 15px rgba(0,255,255,0.1)",
            }}
          >
            <div className="w-40 h-40 flex items-center justify-center" style={{ background: "#0f0f2a" }}>
              {imageUrl ? (
                <img src={imageUrl} alt="Player 2" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <span className="text-5xl block mb-1">🕹️</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "#00ffff" }}>
                    Player 2
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sender */}
        <p
          className="text-center text-sm mb-2"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Courier New', monospace",
          }}
        >
          from {senderName}
        </p>

        {/* Message */}
        <p
          className="text-center text-xl font-bold mb-8"
          style={{
            color: "#fff",
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {message}
        </p>

        {/* Buttons area */}
        <div className="relative min-h-[120px] flex flex-col items-center" style={{ zIndex: 20 }}>
          {/* YES button */}
          <motion.button
            onClick={handleYesClick}
            animate={yesPulse ? {
              boxShadow: [
                "0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.3)",
                "0 0 30px rgba(0,255,136,0.8), 0 0 60px rgba(0,255,136,0.5)",
                "0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,255,136,0.3)",
              ],
            } : {
              boxShadow: [
                "0 0 10px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.15)",
                "0 0 15px rgba(0,255,136,0.5), 0 0 30px rgba(0,255,136,0.25)",
                "0 0 10px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.15)",
              ],
            }}
            transition={{ duration: yesPulse ? 0.3 : 2, repeat: Infinity }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 rounded-md font-bold text-lg uppercase tracking-widest mb-4"
            style={{
              background: "transparent",
              border: "2px solid #00ff88",
              color: "#00ff88",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 10px #00ff88",
            }}
          >
            PRESS START (YES)
          </motion.button>

          {/* No buttons */}
          <div className="relative h-16 w-full flex items-center justify-center">
            <AnimatePresence>
              {!allGone && noButtons.map((btn) => (
                <motion.button
                  key={btn.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    x: btn.x,
                    y: btn.y,
                  }}
                  exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => handleNoApproach(btn.id)}
                  onTouchStart={() => handleNoApproach(btn.id)}
                  className="absolute px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,0,255,0.5)",
                    color: "rgba(255,0,255,0.7)",
                    fontFamily: "'Courier New', monospace",
                    textShadow: "0 0 5px rgba(255,0,255,0.5)",
                  }}
                >
                  No
                </motion.button>
              ))}
            </AnimatePresence>

            {allGone && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs uppercase tracking-wider"
                style={{
                  fontFamily: "'Courier New', monospace",
                  color: "#ff00ff",
                  textShadow: "0 0 5px #ff00ff",
                }}
              >
                GAME OVER — "No" has been defeated
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom coin slot text */}
        <motion.p
          className="text-center mt-8 text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Courier New', monospace" }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Insert ♥ to continue
        </motion.p>
      </motion.div>
    </div>
  );
}

// Neon light rays background
function NeonRays() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, rgba(255,0,255,0.03) 30%, transparent 70%)",
        }}
      />

      {/* Light rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 origin-bottom-left"
          style={{
            width: "2px",
            height: "500px",
            background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? "rgba(255,0,255,0.06)" : "rgba(0,255,255,0.04)"}, transparent)`,
            transform: `rotate(${i * 45}deg)`,
            transformOrigin: "bottom center",
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: i % 3 === 0 ? "#ff00ff" : i % 3 === 1 ? "#00ffff" : "#7c3aed",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

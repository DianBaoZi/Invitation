"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Invite,
  RunawayButtonConfig,
  ScratchRevealConfig,
  SpinWheelConfig,
} from "@/lib/supabase/types";

interface InviteViewerProps {
  invite: Invite;
}

export function InviteViewer({ invite }: InviteViewerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <FloatingHearts />
      <div className="relative z-10 w-full max-w-md">
        {invite.template_id === "runaway-button" && (
          <RunawayButtonInteraction
            config={invite.configuration as RunawayButtonConfig}
          />
        )}
        {invite.template_id === "scratch-reveal" && (
          <ScratchRevealInteraction
            config={invite.configuration as ScratchRevealConfig}
          />
        )}
        {invite.template_id === "spin-wheel" && (
          <SpinWheelInteraction
            config={invite.configuration as SpinWheelConfig}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// RUNAWAY BUTTON INTERACTION
// ============================================

function RunawayButtonInteraction({ config }: { config: RunawayButtonConfig }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNoHover = () => {
    // Random position within bounds
    const maxX = 150;
    const maxY = 100;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setNoPosition({ x: newX, y: newY });
    setClickCount((c) => c + 1);
  };

  const handleYesClick = () => {
    setShowSuccess(true);
    // Fire confetti
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
        className="text-center p-8 bg-white rounded-3xl shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {config.successMessage}
        </h2>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        {config.questionText}
      </h2>

      <div className="flex items-center justify-center gap-6 min-h-[100px] relative">
        {/* Yes Button */}
        <motion.button
          onClick={handleYesClick}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {config.yesButtonText}
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
          {config.noButtonText}
        </motion.button>
      </div>

      {clickCount > 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-sm text-gray-500"
        >
          Looks like {`"No"`} isn't an option 😉
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================
// SCRATCH REVEAL INTERACTION
// ============================================

function ScratchRevealInteraction({ config }: { config: ScratchRevealConfig }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const handleScratch = () => {
    // Increment scratch progress
    setScratchProgress((p) => {
      const newProgress = Math.min(p + 10, 100);
      if (newProgress >= 70 && !isRevealed) {
        setIsRevealed(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      return newProgress;
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl"
    >
      <p className="text-lg text-gray-600 mb-6">{config.instructionText}</p>

      <div
        className="relative w-full h-40 rounded-2xl overflow-hidden cursor-pointer select-none"
        onMouseMove={handleScratch}
        onTouchMove={handleScratch}
        onClick={handleScratch}
      >
        {/* Hidden content */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-center">
          {config.revealContent}
        </div>

        {/* Scratch overlay */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 50%, #D4AF37 100%)",
                opacity: 1 - scratchProgress / 100,
              }}
            >
              <div className="text-center">
                <span className="text-amber-900 font-bold text-lg">
                  ✨ Scratch Here ✨
                </span>
                <p className="text-amber-800/60 text-sm mt-2">
                  Move your finger or mouse
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isRevealed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-gray-500"
        >
          🎉 Surprise revealed!
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================
// SPIN WHEEL INTERACTION
// ============================================

function SpinWheelInteraction({ config }: { config: SpinWheelConfig }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  const colors = [
    "#7C3AED",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
  ];
  const segmentAngle = 360 / config.wheelOptions.length;

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Random spins (3-5 full rotations) plus random segment
    const spins = 3 + Math.random() * 2;
    const randomSegment = Math.floor(Math.random() * config.wheelOptions.length);
    const finalRotation = spins * 360 + randomSegment * segmentAngle;

    setRotation((prev) => prev + finalRotation);

    // Show result after spin
    setTimeout(() => {
      setIsSpinning(false);
      const winningIndex =
        (config.wheelOptions.length -
          Math.floor(((rotation + finalRotation) % 360) / segmentAngle)) %
        config.wheelOptions.length;
      setResult(config.wheelOptions[winningIndex] || config.wheelOptions[0]);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 4000);
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {config.titleText}
      </h2>

      <div className="relative w-64 h-64 mx-auto mb-6">
        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full border-4 border-gray-200 shadow-xl overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
        >
          {config.wheelOptions.map((option, i) => {
            const angle = segmentAngle * i;
            return (
              <div
                key={i}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(from ${angle}deg, ${colors[i % colors.length]} 0deg, ${colors[i % colors.length]} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                }}
              />
            );
          })}
          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-lg" />
          </div>
        </motion.div>

        {/* Pointer */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "25px solid #1F2937",
          }}
        />
      </div>

      {/* Spin button */}
      <motion.button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`px-8 py-4 rounded-xl text-white text-lg font-bold shadow-lg ${
          isSpinning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl"
        }`}
        whileHover={!isSpinning ? { scale: 1.05 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
      >
        {isSpinning ? "Spinning..." : "🎯 SPIN!"}
      </motion.button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl"
          >
            <p className="text-sm text-gray-600">You got:</p>
            <p className="text-xl font-bold text-gray-900">{result}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================

function FloatingHearts() {
  const hearts = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${30 + Math.random() * 40}px`,
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Invite,
  RunawayButtonConfig,
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

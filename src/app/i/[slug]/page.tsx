"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { Y2KDigitalCrush } from "@/components/templates/Y2KDigitalCrush";
import { CozyScrapbook } from "@/components/templates/CozyScrapbook";
import { NeonArcade } from "@/components/templates/NeonArcade";
import { LoveLetterMailbox } from "@/components/templates/LoveLetterMailbox";
import { ScratchReveal } from "@/components/templates/ScratchReveal";

function InvitePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug as string;
  const name = searchParams.get("name") || "Someone Special";
  const message = searchParams.get("message") || "Will you be my Valentine?";
  const template = searchParams.get("template") || "runaway-button";

  // Mock expired state - check URL param for testing
  const isExpired = searchParams.get("expired") === "true";

  const [showSplash, setShowSplash] = useState(true);
  const [splashPhase, setSplashPhase] = useState<"enter" | "hold" | "exit">("enter");

  // Splash screen timing (skip if expired)
  useEffect(() => {
    if (isExpired) {
      setShowSplash(false);
      return;
    }

    // Phase 1: Enter animation (1s)
    const holdTimer = setTimeout(() => {
      setSplashPhase("hold");
    }, 1000);

    // Phase 2: Hold (2s)
    const exitTimer = setTimeout(() => {
      setSplashPhase("exit");
    }, 3000);

    // Phase 3: Exit and show content
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3800);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, [isExpired]);

  // Show expired state
  if (isExpired) {
    return <ExpiredState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 relative overflow-hidden">
      {/* Floating hearts background (visible after splash) */}
      {!showSplash && <FloatingHearts />}

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen name={name} phase={splashPhase} />
        )}
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
            <InteractiveTemplate template={template} message={message} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// EXPIRED STATE
// ============================================

function ExpiredState() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
      {/* Soft floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-gray-200"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
              fontSize: `${30 + Math.random() * 20}px`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative z-10 bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center"
      >
        {/* Broken heart icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-slate-100 rounded-full flex items-center justify-center">
            <HeartCrack className="w-10 h-10 text-gray-400" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-semibold text-gray-700 mb-3"
        >
          This link has expired 💔
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 mb-8"
        >
          Links are only valid for 1 month
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg"
          >
            <Heart className="w-4 h-4 mr-2" />
            Create your own invite
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================
// PREMIUM SPLASH SCREEN
// ============================================

function SplashScreen({ name, phase }: { name: string; phase: "enter" | "hold" | "exit" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: phase === "exit" ? 0.8 : 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Subtle sparkle effects */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="text-center relative z-10">
        {/* Heart icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 12 }}
          className="mb-8"
        >
          <div className="relative">
            <Heart className="w-16 h-16 mx-auto text-pink-500 fill-pink-500" />
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart className="w-16 h-16 mx-auto text-pink-500/30 fill-pink-500/30" />
            </motion.div>
          </div>
        </motion.div>

        {/* "Made wholeheartedly by" text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-400 mb-3 tracking-wide"
        >
          Made wholeheartedly by
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent"
        >
          {name}
        </motion.h1>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"
        />
      </div>
    </motion.div>
  );
}

// ============================================
// INTERACTIVE TEMPLATES
// ============================================

function InteractiveTemplate({ template, message }: { template: string; message: string }) {
  switch (template) {
    case "scratch-reveal":
      return <ScratchRevealTemplate message={message} />;
    case "y2k-digital-crush":
      return <Y2KDigitalCrushTemplate message={message} />;
    case "cozy-scrapbook":
      return <CozyScrapbookTemplate message={message} />;
    case "neon-arcade":
      return <NeonArcadeTemplate message={message} />;
    case "love-letter-mailbox":
      return <LoveLetterMailboxTemplate message={message} />;
    default:
      return <RunawayButtonTemplate message={message} />;
  }
}

// ============================================
// RUNAWAY BUTTON TEMPLATE
// ============================================

function RunawayButtonTemplate({ message }: { message: string }) {
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
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    }, 200);
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
        {message}
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
// SCRATCH REVEAL TEMPLATE
// ============================================

function ScratchRevealTemplate({ message }: { message: string }) {
  return <ScratchReveal message={message} />;
}

// ============================================
// FLOATING HEARTS BACKGROUND
// ============================================

function FloatingHearts() {
  const hearts = Array.from({ length: 12 }, (_, i) => i);

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

// ============================================
// NEW TEMPLATE WRAPPERS
// ============================================

function Y2KDigitalCrushTemplate({ message }: { message: string }) {
  return <Y2KDigitalCrush message={message} />;
}

function CozyScrapbookTemplate({ message }: { message: string }) {
  return <CozyScrapbook message={message} />;
}

function NeonArcadeTemplate({ message }: { message: string }) {
  return <NeonArcade message={message} />;
}

function LoveLetterMailboxTemplate({ message }: { message: string }) {
  return <LoveLetterMailbox message={message} />;
}

// ============================================
// MAIN EXPORT WITH SUSPENSE
// ============================================

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-pink-500 fill-pink-500" />
          </motion.div>
        </div>
      }
    >
      <InvitePageContent />
    </Suspense>
  );
}

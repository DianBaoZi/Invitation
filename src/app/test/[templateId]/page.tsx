"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Y2KDigitalCrush } from "@/components/templates/Y2KDigitalCrush";
import { CozyScrapbook } from "@/components/templates/CozyScrapbook";
import { NeonArcade } from "@/components/templates/NeonArcade";
import { LoveLetterMailbox } from "@/components/templates/LoveLetterMailbox";
import { ScratchReveal } from "@/components/templates/ScratchReveal";
import { AvocadoValentine } from "@/components/templates/AvocadoValentine";
import { Stargazer } from "@/components/templates/Stargazer";
import { Premiere } from "@/components/templates/Premiere";
import { SplashScreen } from "@/components/invite/SplashScreen";

// Templates that manage their own full-screen layout
const FULLSCREEN_TEMPLATES = ["y2k-digital-crush", "cozy-scrapbook", "neon-arcade", "love-letter-mailbox", "avocado-valentine", "stargazer", "premiere"];

export default function TestTemplatePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const templateId = params.templateId as string;
  const skipSplash = searchParams.get("nosplash") === "true";
  const [showSplash, setShowSplash] = useState(!skipSplash);

  // Customization overrides from query params
  const overrides: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== "nosplash" && value) {
      overrides[key] = value;
    }
  });

  const renderTemplate = () => {
    if (FULLSCREEN_TEMPLATES.includes(templateId)) {
      return <TemplateRenderer templateId={templateId} overrides={overrides} />;
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col items-center justify-center relative overflow-hidden">
        <FloatingHearts />
        <div className="relative z-10 w-full flex items-center justify-center p-4">
          <TemplateRenderer templateId={templateId} overrides={overrides} />
        </div>
      </div>
    );
  };

  return (
    <>
      {showSplash && (
        <SplashScreen
          creatorName={overrides.name || "Daniel"}
          isPaid={templateId !== "runaway-button"}
          onComplete={() => setShowSplash(false)}
          templateId={templateId}
        />
      )}
      {!showSplash && renderTemplate()}
    </>
  );
}

function TemplateRenderer({ templateId, overrides = {} }: { templateId: string; overrides?: Record<string, string> }) {
  const message = "Will you be my Valentine?";

  switch (templateId) {
    case "runaway-button":
      return <RunawayButtonTemplate message={message} />;
    case "scratch-reveal":
      return <ScratchRevealTemplate message={message} />;
    case "y2k-digital-crush":
      return <Y2KDigitalCrush message={message} senderName="Daniel" />;
    case "cozy-scrapbook":
      return (
        <CozyScrapbook
          message={message}
          senderName="Daniel"
          {...(overrides.eventDate && { eventDate: overrides.eventDate })}
          {...(overrides.eventTime && { eventTime: overrides.eventTime })}
          {...(overrides.eventLocation && { eventLocation: overrides.eventLocation })}
        />
      );
    case "neon-arcade":
      return <NeonArcade message={message} senderName="Daniel" />;
    case "love-letter-mailbox":
      return (
        <LoveLetterMailbox
          senderName="Daniel"
          {...(overrides.date && { date: overrides.date })}
          {...(overrides.location && { location: overrides.location })}
          {...(overrides.personalMessage && { personalMessage: overrides.personalMessage })}
        />
      );
    case "avocado-valentine":
      return <AvocadoValentine senderName={overrides.name || "Daniel"} />;
    case "stargazer":
      return (
        <Stargazer
          senderName={overrides.name || "Daniel"}
          {...(overrides.message && { message: overrides.message })}
          {...(overrides.personalMessage && { personalMessage: overrides.personalMessage })}
          {...(overrides.date && { date: overrides.date })}
          {...(overrides.time && { time: overrides.time })}
          {...(overrides.location && { location: overrides.location })}
        />
      );
    case "premiere":
      return (
        <Premiere
          senderName={overrides.name || "Daniel"}
          {...(overrides.message && { message: overrides.message })}
          {...(overrides.personalMessage && { personalMessage: overrides.personalMessage })}
          {...(overrides.date && { date: overrides.date })}
          {...(overrides.time && { time: overrides.time })}
          {...(overrides.location && { location: overrides.location })}
        />
      );
    default:
      return (
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Template not found</h2>
          <p className="text-gray-500">Unknown template: {templateId}</p>
        </div>
      );
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
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yay! You made my day! 💕</h2>
        <p className="text-gray-600">Can&apos;t wait to see you!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md w-full"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{message}</h2>
      <div className="flex items-center justify-center gap-6 min-h-[100px] relative">
        <motion.button
          onClick={handleYesClick}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💕
        </motion.button>
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-sm text-gray-500">
          Looks like &quot;No&quot; isn&apos;t an option 😉
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
            left: `${10 + (i * 7.5) % 90}%`,
            top: `${5 + (i * 13) % 85}%`,
            fontSize: `${25 + (i * 5) % 35}px`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

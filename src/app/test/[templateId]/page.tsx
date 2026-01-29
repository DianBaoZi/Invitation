"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Y2KDigitalCrush } from "@/components/templates/Y2KDigitalCrush";
import { CozyScrapbook } from "@/components/templates/CozyScrapbook";
import { LoveLetterMailbox } from "@/components/templates/LoveLetterMailbox";
import { AvocadoValentine } from "@/components/templates/AvocadoValentine";
import { Stargazer } from "@/components/templates/Stargazer";
import { Premiere } from "@/components/templates/Premiere";
import { ForestAdventure } from "@/components/templates/ForestAdventure";
import { OceanDreams } from "@/components/templates/OceanDreams";
import { SplashScreen } from "@/components/invite/SplashScreen";

// Templates that manage their own full-screen layout
const FULLSCREEN_TEMPLATES = ["y2k-digital-crush", "cozy-scrapbook", "love-letter-mailbox", "avocado-valentine", "stargazer", "premiere", "forest-adventure", "ocean-dreams"];

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
          photoUrl1={overrides.photoUrl1}
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
    case "y2k-digital-crush":
      return (
        <Y2KDigitalCrush
          message={overrides.message || message}
          senderName="Daniel"
          personalMessage={overrides.personalMessage || "You've always been my favorite error message 💾"}
          date={overrides.date || "February 14th"}
          time={overrides.time || "7:00 PM"}
          location={overrides.location || "Our favorite spot"}
        />
      );
    case "cozy-scrapbook":
      return (
        <CozyScrapbook
          message={overrides.message || message}
          senderName={overrides.name || "Daniel"}
          {...(overrides.eventDate && { eventDate: overrides.eventDate })}
          {...(overrides.eventTime && { eventTime: overrides.eventTime })}
          {...(overrides.eventLocation && { eventLocation: overrides.eventLocation })}
          {...(overrides.photoUrl1 && { photoUrl1: overrides.photoUrl1 })}
          {...(overrides.photoUrl2 && { photoUrl2: overrides.photoUrl2 })}
        />
      );
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
    case "forest-adventure":
      return (
        <ForestAdventure
          senderName={overrides.name || "Daniel"}
          {...(overrides.message && { message: overrides.message })}
          {...(overrides.personalMessage && { personalMessage: overrides.personalMessage })}
          {...(overrides.date && { date: overrides.date })}
          {...(overrides.time && { time: overrides.time })}
          {...(overrides.location && { location: overrides.location })}
        />
      );
    case "ocean-dreams":
      return (
        <OceanDreams
          senderName={overrides.name || "Daniel"}
          {...(overrides.message && { message: overrides.message })}
          {...(overrides.personalMessage && { personalMessage: overrides.personalMessage })}
          {...(overrides.date && { date: overrides.date })}
          {...(overrides.time && { time: overrides.time })}
          {...(overrides.location && { location: overrides.location })}
          {...(overrides.photo1Url && { photo1Url: overrides.photo1Url })}
          {...(overrides.photo2Url && { photo2Url: overrides.photo2Url })}
          {...(overrides.photo3Url && { photo3Url: overrides.photo3Url })}
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
    // Pink heart burst - simple but themed
    const heartColors = ["#ec4899", "#f472b6", "#fb7185", "#fda4af"];
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: heartColors,
      shapes: ["circle"],
      scalar: 1.2,
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 90,
        origin: { y: 0.5 },
        colors: heartColors,
        shapes: ["circle"],
        scalar: 1.1,
      });
    }, 150);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8 rounded-3xl max-w-md relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #fff 0%, #fef7f7 100%)",
          boxShadow: "0 20px 50px rgba(236,72,153,0.15), 0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Subtle corner accent */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 80,
            height: 80,
            background: "radial-gradient(circle, rgba(251,113,133,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h2
          className="text-2xl font-bold mb-2"
          style={{ color: "#be185d" }}
        >
          Yay! You made my day!
        </h2>
        <p className="text-gray-600">Can&apos;t wait to see you! 💕</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="text-center p-8 rounded-3xl max-w-md w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #fefcfd 50%, #fdf2f8 100%)",
        boxShadow: "0 20px 50px rgba(236,72,153,0.12), 0 8px 20px rgba(0,0,0,0.06)",
        border: "1px solid rgba(251,113,133,0.1)",
      }}
    >
      {/* Subtle decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: -40,
          width: 100,
          height: 100,
          background: "radial-gradient(circle, rgba(251,113,133,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          right: -30,
          width: 80,
          height: 80,
          background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Small heart accent */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontSize: 14,
          opacity: 0.4,
        }}
      >
        ♥
      </motion.div>

      <h2
        className="text-2xl md:text-3xl font-bold mb-8 relative z-10"
        style={{
          color: "#1f2937",
          fontFamily: "'Playfair Display', Georgia, serif",
        }}
      >
        {message}
      </h2>
      <div className="flex items-center justify-center gap-6 min-h-[100px] relative z-10">
        <motion.button
          onClick={handleYesClick}
          className="px-8 py-4 rounded-xl text-white text-lg font-bold"
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            boxShadow: "0 8px 20px rgba(236,72,153,0.3)",
          }}
          whileHover={{ scale: 1.05, boxShadow: "0 12px 28px rgba(236,72,153,0.4)" }}
          whileTap={{ scale: 0.95 }}
        >
          Yes! 💕
        </motion.button>
        <motion.button
          className="px-8 py-4 rounded-xl bg-gray-100 text-gray-500 text-lg font-medium border border-gray-200"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm relative z-10"
          style={{ color: "#9ca3af" }}
        >
          Looks like &quot;No&quot; isn&apos;t an option 😉
        </motion.p>
      )}
    </motion.div>
  );
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

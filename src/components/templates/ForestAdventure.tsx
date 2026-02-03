"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { saveResponse } from "@/lib/api/saveResponse";

// ============================================
// TYPES
// ============================================

type GameScreen =
  | "start"
  | "fork"
  | "dark_path"
  | "sunny_path"
  | "river"
  | "drowning"
  | "bridge"
  | "bear_encounter"
  | "bear_attack"
  | "bear_happy"
  | "magic_clearing"
  | "invitation"
  | "happy_ending"
  | "guilt_trip";

interface ForestAdventureProps {
  senderName?: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
  slug?: string;
}

// ============================================
// ASSET PATHS
// ============================================

const BACKGROUNDS = {
  start: "/templates/game/Start Screen.png",
  fork: "/templates/game/Fork in road.png",
  dark_path: "/templates/game/Dark Path (Dead End).png",
  sunny_path: "/templates/game/Sunny Path.png",
  river: "/templates/game/River Scene.png",
  drowning: "/templates/game/Drowning Scene.png",
  bridge: "/templates/game/Bridge Crossing.png",
  bear_encounter: "/templates/game/Bear Encounter.png",
  bear_attack: "/templates/game/Bear Attack.png",
  bear_happy: "/templates/game/Bear Happy.png",
  magic_clearing: "/templates/game/Magic Clearing.png",
  happy_ending: "/templates/game/Happy Ending.png",
  guilt_trip: "/templates/game/SadGuilt Trip Ending.png",
};

// ============================================
// SCREEN DATA
// ============================================

interface ScreenData {
  background: string;
  title?: string;
  dialogue: string[];
  choices?: { text: string; next: GameScreen; variant?: "primary" | "secondary" | "danger" | "success" }[];
  continueButton?: { text: string; next: GameScreen };
  mood?: "neutral" | "magical" | "danger" | "happy" | "sad";
}

const getScreenData = (screen: GameScreen, senderName: string): ScreenData => {
  const screens: Record<GameScreen, ScreenData> = {
    start: {
      background: BACKGROUNDS.start,
      title: "The Enchanted Forest",
      dialogue: [
        `${senderName} has sent you on a quest...`,
        "Deep within the Enchanted Forest lies something special.",
        "Are you brave enough to find it?",
      ],
      choices: [{ text: "Begin the Journey", next: "fork", variant: "primary" }],
      mood: "magical",
    },
    fork: {
      background: BACKGROUNDS.fork,
      title: "A Fork in the Road",
      dialogue: [
        "Two paths stretch before you...",
        "One shrouded in shadow, the other bathed in golden light.",
      ],
      choices: [
        { text: "Into the Shadows", next: "dark_path", variant: "secondary" },
        { text: "Follow the Light", next: "sunny_path", variant: "primary" },
      ],
      mood: "neutral",
    },
    dark_path: {
      background: BACKGROUNDS.dark_path,
      title: "Dead End",
      dialogue: [
        "The shadows close in around you...",
        "This path leads nowhere but back.",
      ],
      continueButton: { text: "Turn Back", next: "fork" },
      mood: "danger",
    },
    sunny_path: {
      background: BACKGROUNDS.sunny_path,
      title: "The Sunny Path",
      dialogue: [
        "Warmth embraces you as you walk.",
        "Birds sing overhead, flowers bloom at your feet.",
      ],
      continueButton: { text: "Continue Forward", next: "river" },
      mood: "happy",
    },
    river: {
      background: BACKGROUNDS.bridge,
      title: "The Rushing River",
      dialogue: [
        "A mighty river blocks your path.",
        "An old wooden bridge sways in the wind...",
      ],
      choices: [
        { text: "Swim Across", next: "drowning", variant: "danger" },
        { text: "Trust the Bridge", next: "bridge", variant: "primary" },
      ],
      mood: "neutral",
    },
    drowning: {
      background: BACKGROUNDS.drowning,
      title: "Too Strong!",
      dialogue: [
        "The current pulls you under!",
        "You barely make it back to shore...",
      ],
      continueButton: { text: "Try Again", next: "river" },
      mood: "danger",
    },
    bridge: {
      background: BACKGROUNDS.bridge,
      title: "Crossing Over",
      dialogue: [
        "Each step creaks beneath you...",
        "But the bridge holds true.",
      ],
      continueButton: { text: "Onward", next: "bear_encounter" },
      mood: "neutral",
    },
    bear_encounter: {
      background: BACKGROUNDS.bear_encounter,
      title: "A Guardian Appears",
      dialogue: [
        "A great bear blocks the forest path!",
        "Its eyes study you carefully...",
        "You notice wild berries growing nearby.",
      ],
      choices: [
        { text: "Run Away!", next: "bear_attack", variant: "danger" },
        { text: "Offer the Berries", next: "bear_happy", variant: "success" },
      ],
      mood: "danger",
    },
    bear_attack: {
      background: BACKGROUNDS.bear_attack,
      title: "Wrong Move!",
      dialogue: [
        "The bear gives chase!",
        "It just wanted to play... but you're too scared to notice.",
      ],
      continueButton: { text: "Try Again", next: "bear_encounter" },
      mood: "danger",
    },
    bear_happy: {
      background: BACKGROUNDS.bear_happy,
      title: "A New Friend",
      dialogue: [
        "The bear accepts your gift with gentle paws.",
        "It steps aside, revealing a hidden path...",
      ],
      continueButton: { text: "Enter the Clearing", next: "magic_clearing" },
      mood: "happy",
    },
    magic_clearing: {
      background: BACKGROUNDS.magic_clearing,
      title: "The Magic Clearing",
      dialogue: [
        "Sparkles dance through the air...",
        "In the center, a glowing envelope awaits.",
        "It has your name written upon it.",
      ],
      choices: [{ text: "Open the Letter", next: "invitation", variant: "primary" }],
      mood: "magical",
    },
    invitation: {
      background: BACKGROUNDS.magic_clearing,
      dialogue: [],
      mood: "magical",
    },
    happy_ending: {
      background: BACKGROUNDS.happy_ending,
      dialogue: [
        "The forest erupts in celebration!",
        "Fireworks paint the sky with color.",
      ],
      mood: "happy",
    },
    guilt_trip: {
      background: BACKGROUNDS.guilt_trip,
      dialogue: [],
      mood: "sad",
    },
  };

  return screens[screen];
};

// Guilt trip messages
const GUILT_MESSAGES = [
  "Are you sure...?",
  "But... I planned this whole adventure for you...",
  "The forest creatures will be so sad...",
  "Even the bear is crying now...",
  "Please? Pretty please?",
  "I'll give you extra berries!",
  "The happy ending is SO much better...",
  "You're breaking my heart...",
  "One more chance?",
  "I believe in us!",
];

// ============================================
// COMPONENTS
// ============================================

// Floating particles for atmosphere
function FloatingParticles({ mood }: { mood?: string }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
  }));

  const getColor = () => {
    switch (mood) {
      case "magical": return "rgba(168, 85, 247, 0.6)";
      case "happy": return "rgba(251, 191, 36, 0.6)";
      case "danger": return "rgba(239, 68, 68, 0.4)";
      case "sad": return "rgba(148, 163, 184, 0.5)";
      default: return "rgba(255, 255, 255, 0.4)";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            backgroundColor: getColor(),
            boxShadow: `0 0 ${p.size * 2}px ${getColor()}`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// Typewriter effect for dialogue
function TypewriterText({
  text,
  onComplete,
  speed = 35,
}: {
  text: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-white/80 ml-1 align-middle"
        />
      )}
    </span>
  );
}

// Dialogue display with elegant styling
function DialogueOverlay({
  title,
  messages,
  onComplete,
}: {
  title?: string;
  messages: string[];
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        if (currentIndex < messages.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsTyping(true);
        } else {
          onComplete?.();
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentIndex, messages.length, onComplete]);

  const handleClick = () => {
    if (isTyping) {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 cursor-pointer"
      onClick={handleClick}
    >
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {title && (
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Cinzel', serif",
              textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(168, 85, 247, 0.3)",
            }}
          >
            {title}
          </motion.h2>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <p
            className="text-lg md:text-xl text-white/90 leading-relaxed"
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {isTyping ? (
              <TypewriterText
                text={messages[currentIndex]}
                onComplete={() => setIsTyping(false)}
              />
            ) : (
              messages[currentIndex]
            )}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {messages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-white scale-125"
                    : i < currentIndex
                    ? "bg-white/60"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Choice buttons
function ChoiceButtons({
  choices,
  onChoice,
}: {
  choices: { text: string; next: GameScreen; variant?: string }[];
  onChoice: (next: GameScreen) => void;
}) {
  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case "success":
        return "from-emerald-500/90 to-green-600/90 border-emerald-400/50 hover:from-emerald-400 hover:to-green-500";
      case "danger":
        return "from-red-500/90 to-rose-600/90 border-red-400/50 hover:from-red-400 hover:to-rose-500";
      case "secondary":
        return "from-slate-500/90 to-slate-600/90 border-slate-400/50 hover:from-slate-400 hover:to-slate-500";
      default:
        return "from-violet-500/90 to-purple-600/90 border-violet-400/50 hover:from-violet-400 hover:to-purple-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 flex flex-col sm:flex-row gap-4 px-4">
        {choices.map((choice, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChoice(choice.next)}
            className={`
              px-8 py-4 rounded-xl
              bg-gradient-to-br ${getVariantStyles(choice.variant)}
              border backdrop-blur-sm
              text-white font-semibold text-lg
              shadow-lg shadow-black/30
              transition-all duration-200
            `}
            style={{
              fontFamily: "'Cinzel', serif",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {choice.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Invitation reveal card
function InvitationReveal({
  senderName,
  message,
  personalMessage,
  date,
  time,
  location,
  onYes,
  onNo,
}: {
  senderName: string;
  message: string;
  personalMessage: string;
  date?: string;
  time?: string;
  location?: string;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative z-10 max-w-md w-full"
      >
        <div
          className="bg-gradient-to-br from-violet-900/90 to-purple-950/90 p-8 rounded-2xl border border-violet-400/30 backdrop-blur-md"
          style={{
            boxShadow: "0 0 60px rgba(139, 92, 246, 0.3), 0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Decorative sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 text-4xl"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-4 -left-4 text-3xl"
          >
            ✨
          </motion.div>

          {/* Envelope icon */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center mb-6"
          >
            <span className="text-6xl">💌</span>
          </motion.div>

          <h2
            className="text-2xl md:text-3xl text-center text-white mb-4"
            style={{
              fontFamily: "'Cinzel', serif",
              textShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
            }}
          >
            {message}
          </h2>

          <p
            className="text-center text-violet-200/90 mb-6 leading-relaxed"
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              fontSize: "1.1rem",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {personalMessage}
          </p>

          {(date || time || location) && (
            <div
              className="bg-white/10 rounded-xl p-4 mb-6 space-y-2"
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {date && <p className="text-violet-200">📅 {date}</p>}
              {time && <p className="text-violet-200">🕐 {time}</p>}
              {location && <p className="text-violet-200">📍 {location}</p>}
            </div>
          )}

          <p
            className="text-center text-violet-300/80 mb-8 italic"
            style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
          >
            — {senderName}
          </p>

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onYes}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-emerald-500/30"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Yes! ✨
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNo}
              className="px-8 py-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl text-white font-semibold text-lg shadow-lg shadow-slate-500/30"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              No...
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Guilt trip screen
function GuiltTripScreen({
  guiltIndex,
  onYes,
  onNoAgain,
}: {
  guiltIndex: number;
  onYes: () => void;
  onNoAgain: () => void;
}) {
  const message = GUILT_MESSAGES[guiltIndex % GUILT_MESSAGES.length];
  const yesScale = Math.pow(1.5, guiltIndex);
  const isOverwhelming = guiltIndex >= 5;

  if (isOverwhelming) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600"
      >
        <motion.button
          onClick={onYes}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white font-bold cursor-pointer"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "min(20vw, 120px)",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          YES! ✨
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 max-w-md w-full text-center">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          🥺
        </motion.div>

        <motion.p
          key={guiltIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl text-white mb-8"
          style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {message}
        </motion.p>

        <div className="flex justify-center items-center gap-4">
          <motion.button
            animate={{ scale: [yesScale, yesScale * 1.05, yesScale] }}
            transition={{ duration: 1, repeat: Infinity }}
            onClick={onYes}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl text-white font-semibold shadow-lg shadow-emerald-500/30"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: `${Math.min(24, 16 + guiltIndex * 2)}px`,
            }}
          >
            Okay, YES! ✨
          </motion.button>

          <motion.button
            animate={{
              opacity: Math.max(0.3, 1 - guiltIndex * 0.15),
              scale: Math.max(0.6, 1 - guiltIndex * 0.08),
            }}
            onClick={onNoAgain}
            className="px-6 py-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl text-white font-semibold shadow-lg"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Still no...
          </motion.button>
        </div>

        {guiltIndex >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="mt-6 text-white/60 text-sm italic"
          >
            {guiltIndex >= 4
              ? "(The YES button grows stronger...)"
              : "(Something is happening...)"}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// Happy ending celebration
function HappyEnding() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-6 relative z-10"
      >
        🎉
      </motion.div>

      <motion.h2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
        className="text-4xl md:text-5xl text-white text-center px-4 relative z-10"
        style={{
          fontFamily: "'Cinzel', serif",
          textShadow: "0 0 40px rgba(168, 85, 247, 0.8), 0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        Adventure Complete!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-xl text-white/80 mt-4 relative z-10"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        Thank you for saying yes 💕
      </motion.p>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ForestAdventure({
  senderName = "Someone Special",
  message = "Will you be my Valentine?",
  personalMessage = "I planned this whole adventure just for you!",
  date,
  time,
  location,
  slug,
}: ForestAdventureProps) {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("start");
  const [dialogueComplete, setDialogueComplete] = useState(false);
  const [guiltIndex, setGuiltIndex] = useState(0);

  const screenData = getScreenData(currentScreen, senderName);

  const handleChoice = (next: GameScreen) => {
    setCurrentScreen(next);
    setDialogueComplete(false);
  };

  const handleYes = useCallback(() => {
    setCurrentScreen("happy_ending");
    setDialogueComplete(false);

    if (slug) {
      saveResponse(slug, "Yes");
    }

    // Magical celebration
    const colors = ["#a855f7", "#22c55e", "#fbbf24", "#ec4899", "#3b82f6"];

    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors,
      scalar: 1.5,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3, x: 0.2 },
        colors: ["#fbbf24", "#fef08a"],
        gravity: 0.5,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3, x: 0.8 },
        colors: ["#fbbf24", "#fef08a"],
        gravity: 0.5,
      });
    }, 300);
  }, [slug]);

  const handleNo = () => {
    setCurrentScreen("guilt_trip");
    setGuiltIndex(0);
  };

  const handleNoAgain = () => {
    setGuiltIndex((prev) => prev + 1);
  };

  const restartGame = () => {
    setCurrentScreen("start");
    setDialogueComplete(false);
    setGuiltIndex(0);
  };

  const getBackground = () => {
    if (currentScreen === "invitation") return BACKGROUNDS.magic_clearing;
    if (currentScreen === "guilt_trip") return BACKGROUNDS.guilt_trip;
    return screenData.background;
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Load fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>

      {/* Background with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={getBackground()}
            alt="Scene"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric particles */}
      <FloatingParticles mood={screenData.mood} />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Dialogue for normal screens */}
      {screenData.dialogue.length > 0 &&
        currentScreen !== "invitation" &&
        currentScreen !== "guilt_trip" &&
        currentScreen !== "happy_ending" && (
          <DialogueOverlay
            key={currentScreen}
            title={screenData.title}
            messages={screenData.dialogue}
            onComplete={() => setDialogueComplete(true)}
          />
        )}

      {/* Choice buttons */}
      {dialogueComplete && screenData.choices && (
        <ChoiceButtons choices={screenData.choices} onChoice={handleChoice} />
      )}

      {/* Continue button */}
      {dialogueComplete && screenData.continueButton && !screenData.choices && (
        <ChoiceButtons
          choices={[{ ...screenData.continueButton, variant: "primary" }]}
          onChoice={handleChoice}
        />
      )}

      {/* Invitation screen */}
      {currentScreen === "invitation" && (
        <InvitationReveal
          senderName={senderName}
          message={message}
          personalMessage={personalMessage}
          date={date}
          time={time}
          location={location}
          onYes={handleYes}
          onNo={handleNo}
        />
      )}

      {/* Guilt trip */}
      {currentScreen === "guilt_trip" && (
        <GuiltTripScreen
          guiltIndex={guiltIndex}
          onYes={handleYes}
          onNoAgain={handleNoAgain}
        />
      )}

      {/* Happy ending */}
      {currentScreen === "happy_ending" && <HappyEnding />}

      {/* Restart button */}
      {currentScreen !== "start" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          onClick={restartGame}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-30 border border-white/20"
        >
          ↺
        </motion.button>
      )}
    </div>
  );
}

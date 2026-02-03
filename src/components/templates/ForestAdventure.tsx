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
  dialogue: string[];
  choices?: { text: string; next: GameScreen; variant?: "primary" | "secondary" | "yes" | "no" | "dark" | "sunny" }[];
  continueButton?: { text: string; next: GameScreen };
  mood?: "neutral" | "magical" | "danger" | "happy" | "sad";
}

const getScreenData = (screen: GameScreen, senderName: string): ScreenData => {
  const screens: Record<GameScreen, ScreenData> = {
    start: {
      background: BACKGROUNDS.start,
      dialogue: [
        "Welcome, brave adventurer!",
        `${senderName} has sent you on a quest...`,
        "A quest to find something special in the Enchanted Forest!",
        "Are you ready to begin?",
      ],
      choices: [{ text: "Begin Adventure!", next: "fork", variant: "primary" }],
      mood: "magical",
    },
    fork: {
      background: BACKGROUNDS.fork,
      dialogue: [
        "You come to a fork in the road...",
        "The left path looks dark and mysterious.",
        "The right path is sunny and inviting.",
        "Which way will you go?",
      ],
      choices: [
        { text: "Take the Dark Path", next: "dark_path", variant: "dark" },
        { text: "Take the Sunny Path", next: "sunny_path", variant: "sunny" },
      ],
      mood: "neutral",
    },
    dark_path: {
      background: BACKGROUNDS.dark_path,
      dialogue: [
        "Oh no! The path leads to a dead end!",
        "Spooky shadows surround you...",
      ],
      continueButton: { text: "Run Back!", next: "fork" },
      mood: "danger",
    },
    sunny_path: {
      background: BACKGROUNDS.sunny_path,
      dialogue: [
        "The sunny path is beautiful!",
        "Birds are singing, flowers are blooming...",
      ],
      continueButton: { text: "Keep Going!", next: "river" },
      mood: "happy",
    },
    river: {
      background: BACKGROUNDS.bridge,
      dialogue: [
        "You arrive at a rushing river!",
        "The water looks deep and fast...",
        "There's a rickety bridge ahead. Do you trust it?",
      ],
      choices: [
        { text: "Try to Swim", next: "drowning", variant: "secondary" },
        { text: "Cross the Bridge", next: "bridge", variant: "primary" },
      ],
      mood: "neutral",
    },
    drowning: {
      background: BACKGROUNDS.drowning,
      dialogue: [
        "SPLASH! The current is too strong!",
        "You're swept downstream...",
        "Luckily, you grab onto a log and float back to shore!",
      ],
      continueButton: { text: "Try Again", next: "river" },
      mood: "danger",
    },
    bridge: {
      background: BACKGROUNDS.bridge,
      dialogue: [
        "You carefully cross the old bridge...",
        "CREAK... CREAK...",
        "Made it! The bridge holds!",
      ],
      continueButton: { text: "Continue", next: "bear_encounter" },
      mood: "neutral",
    },
    bear_encounter: {
      background: BACKGROUNDS.bear_encounter,
      dialogue: [
        "ROARRR!!!",
        "A hungry bear blocks your path!",
        "It looks angry... but also hungry.",
        "You notice some berries nearby...",
      ],
      choices: [
        { text: "Run Away!", next: "bear_attack", variant: "no" },
        { text: "Offer Berries", next: "bear_happy", variant: "yes" },
      ],
      mood: "danger",
    },
    bear_attack: {
      background: BACKGROUNDS.bear_attack,
      dialogue: [
        "The bear chases you!",
        "You trip and fall...",
        "But wait! The bear just wanted to play tag!",
      ],
      continueButton: { text: "Try Again", next: "bear_encounter" },
      mood: "danger",
    },
    bear_happy: {
      background: BACKGROUNDS.bear_happy,
      dialogue: [
        "You offer the berries to the bear...",
        "NOM NOM NOM!",
        "The bear is happy and lets you pass!",
      ],
      continueButton: { text: "Continue", next: "magic_clearing" },
      mood: "happy",
    },
    magic_clearing: {
      background: BACKGROUNDS.magic_clearing,
      dialogue: [
        "You enter a magical clearing...",
        "Sparkles float through the air!",
        "In the center, you see a glowing letter...",
        "It has your name on it!",
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
        "YAYYY!!!",
        "Fireworks light up the sky!",
        "The forest creatures celebrate with you!",
        "This is the best adventure ever!",
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
  "But... but I planned this whole adventure for you...",
  "The forest creatures will be so sad...",
  "Even the bear is crying now...",
  "Please? Pretty please?",
  "I'll give you extra berries!",
  "The happy ending is SO much better...",
  "You're breaking my pixelated heart...",
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
  speed = 40,
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
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// Original pixel-art dialogue box
function DialogueBox({
  messages,
  onComplete,
}: {
  messages: string[];
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [skipTyping, setSkipTyping] = useState(false);

  // Reset skip flag when moving to next message
  useEffect(() => {
    setSkipTyping(false);
    setIsTyping(true);
  }, [currentIndex]);

  // Auto-advance to next message after typing completes
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        if (currentIndex < messages.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onComplete?.();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentIndex, messages.length, onComplete]);

  // Click to skip typing and show full message
  const handleClick = () => {
    if (isTyping) {
      setSkipTyping(true);
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-4 left-4 right-4 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className="relative p-4 rounded-lg bg-white/95 border-4 border-amber-800"
        style={{
          boxShadow: "4px 4px 0 #5c4033",
          imageRendering: "pixelated",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />

        <p
          className="text-lg md:text-xl leading-relaxed text-amber-900"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", lineHeight: "1.8", wordBreak: "break-word", overflowWrap: "break-word" }}
        >
          {isTyping && !skipTyping ? (
            <TypewriterText
              text={messages[currentIndex]}
              onComplete={() => setIsTyping(false)}
            />
          ) : (
            messages[currentIndex]
          )}
        </p>

        {/* Continue indicator */}
        {!isTyping && currentIndex < messages.length - 1 && (
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="absolute bottom-2 right-4 text-amber-600"
          >
            ▼
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Original pixel-art choice button
function ChoiceButton({
  text,
  onClick,
  variant = "primary",
}: {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "yes" | "no" | "dark" | "sunny";
}) {
  const colors = {
    primary: "from-amber-400 to-amber-500 border-amber-700 hover:from-amber-300",
    secondary: "from-gray-400 to-gray-500 border-gray-700 hover:from-gray-300",
    yes: "from-green-400 to-green-500 border-green-700 hover:from-green-300",
    no: "from-red-400 to-red-500 border-red-700 hover:from-red-300",
    dark: "from-gray-600 to-gray-700 border-gray-900 hover:from-gray-500",
    sunny: "from-yellow-400 to-amber-400 border-amber-600 hover:from-yellow-300",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        px-6 py-3 bg-gradient-to-b ${colors[variant]}
        border-4 rounded-lg text-white font-bold
        transition-all
      `}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: "12px",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
        textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
      }}
    >
      {text}
    </motion.button>
  );
}

// Original pixel-art invitation reveal
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
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute inset-4 md:inset-8 flex items-center justify-center z-10"
    >
      <div
        className="bg-gradient-to-br from-pink-100 to-rose-200 p-6 rounded-xl max-w-md w-full"
        style={{
          border: "4px solid #ec4899",
          boxShadow: "8px 8px 0 rgba(236, 72, 153, 0.3), 0 0 30px rgba(236, 72, 153, 0.4)",
        }}
      >
        {/* Letter emoji */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6"
        >
          <span className="text-7xl">💌</span>
        </motion.div>

        <h2
          className="text-xl md:text-2xl text-center text-pink-700 mb-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            textShadow: "2px 2px 0 rgba(236, 72, 153, 0.3)",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {message}
        </h2>

        <p
          className="text-center text-pink-600 mb-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            lineHeight: "1.8",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {personalMessage}
        </p>

        {(date || time || location) && (
          <div
            className="bg-white/50 rounded-lg p-3 mb-4"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "10px",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {date && <p className="text-pink-700">📅 {date}</p>}
            {time && <p className="text-pink-700">⏰ {time}</p>}
            {location && <p className="text-pink-700">📍 {location}</p>}
          </div>
        )}

        <p
          className="text-center text-pink-500 mb-6"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          - {senderName}
        </p>

        <div className="flex justify-center gap-4">
          <ChoiceButton text="YES!" onClick={onYes} variant="yes" />
          <ChoiceButton text="No..." onClick={onNo} variant="no" />
        </div>
      </div>
    </motion.div>
  );
}

// Guilt trip screen with pixel styling
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
  const yesScale = Math.pow(1.6, guiltIndex);
  const isOverwhelming = guiltIndex >= 5;

  if (isOverwhelming) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-50 flex items-center justify-center"
      >
        <motion.button
          onClick={onYes}
          initial={{ scale: yesScale * 0.8 }}
          animate={{ scale: [yesScale, yesScale * 1.05, yesScale] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="bg-gradient-to-b from-green-400 to-green-500 border-8 border-green-700 rounded-3xl text-white font-bold cursor-pointer"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: `${Math.min(120, 20 * yesScale)}px`,
            padding: `${Math.min(200, 30 * yesScale)}px ${Math.min(400, 60 * yesScale)}px`,
            boxShadow: "8px 8px 0 rgba(0,0,0,0.4)",
            textShadow: "4px 4px 0 rgba(0,0,0,0.3)",
            minWidth: "100vw",
            minHeight: "100vh",
          }}
          whileHover={{ filter: "brightness(1.1)" }}
          whileTap={{ scale: yesScale * 0.95 }}
        >
          YES!
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-4 md:inset-8 flex items-center justify-center z-10 overflow-visible"
    >
      <div
        className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-xl max-w-md w-full text-center relative overflow-visible"
        style={{
          border: "4px solid #6b7280",
          boxShadow: "8px 8px 0 rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Sad emoji */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4"
        >
          <span className="text-6xl">😢</span>
        </motion.div>

        <motion.p
          key={guiltIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700 mb-6"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "12px",
            lineHeight: "1.8",
          }}
        >
          {message}
        </motion.p>

        <div className="flex justify-center gap-4 items-center overflow-visible">
          <motion.div
            key={`yes-${guiltIndex}`}
            initial={{ scale: yesScale * 0.8 }}
            animate={{ scale: [yesScale, yesScale * 1.05, yesScale] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="z-20"
            style={{ transformOrigin: "center center" }}
          >
            <motion.button
              onClick={onYes}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-b from-green-400 to-green-500 border-4 border-green-700 rounded-lg text-white font-bold"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: `${Math.min(24, 12 + guiltIndex * 2)}px`,
                boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
                textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
                padding: `${12 + guiltIndex * 4}px ${24 + guiltIndex * 8}px`,
              }}
            >
              OK, YES!
            </motion.button>
          </motion.div>

          <motion.div
            animate={{
              opacity: Math.max(0.3, 1 - guiltIndex * 0.15),
              scale: Math.max(0.5, 1 - guiltIndex * 0.1),
            }}
          >
            <ChoiceButton text="Still no..." onClick={onNoAgain} variant="no" />
          </motion.div>
        </div>

        {guiltIndex >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-gray-500"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
            }}
          >
            {guiltIndex >= 4
              ? "(THE YES BUTTON IS INEVITABLE...)"
              : "(the YES button is getting bigger...)"}
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
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
    >
      <h2
        className="text-2xl md:text-4xl text-white text-center px-4"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          textShadow: "4px 4px 0 #ec4899, -2px -2px 0 #fbbf24",
        }}
      >
        ADVENTURE COMPLETE!
      </h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white mt-4"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "10px",
        }}
      >
        Thank you for saying YES! 💕
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

    // Magical forest celebration
    const forestColors = ["#22c55e", "#86efac", "#fbbf24", "#f472b6", "#a855f7"];

    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: forestColors,
      shapes: ["circle", "square"],
      scalar: 1.5,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3, x: 0.2 },
        colors: ["#fbbf24", "#fef08a"],
        shapes: ["circle"],
        scalar: 1,
        gravity: 0.5,
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3, x: 0.8 },
        colors: ["#fbbf24", "#fef08a"],
        shapes: ["circle"],
        scalar: 1,
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
      {/* Load pixel font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
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

      {/* Dialogue box for normal screens */}
      {screenData.dialogue.length > 0 &&
        currentScreen !== "invitation" &&
        currentScreen !== "guilt_trip" &&
        currentScreen !== "happy_ending" && (
          <DialogueBox
            key={currentScreen}
            messages={screenData.dialogue}
            onComplete={() => setDialogueComplete(true)}
          />
        )}

      {/* Choice buttons */}
      {dialogueComplete && screenData.choices && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {screenData.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                text={choice.text}
                onClick={() => handleChoice(choice.next)}
                variant={choice.variant || (index === 0 ? "primary" : "secondary")}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Continue button */}
      {dialogueComplete && screenData.continueButton && !screenData.choices && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ChoiceButton
            text={screenData.continueButton.text}
            onClick={() => handleChoice(screenData.continueButton!.next)}
            variant="primary"
          />
        </motion.div>
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
          animate={{ opacity: 0.7 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          onClick={restartGame}
          className="absolute top-4 left-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white z-30"
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
        >
          ↺
        </motion.button>
      )}
    </div>
  );
}

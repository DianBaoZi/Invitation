"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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

type CharacterEmotion = "neutral" | "happy" | "scared" | "crying";

interface ForestAdventureProps {
  senderName?: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
}

// ============================================
// ASSET PATHS
// ============================================

const ASSETS = {
  backgrounds: {
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
  },
  characters: {
    neutral: "/templates/game/CHAR-1_Neutral.png",
    happy: "/templates/game/CHAR-2_Happy.png",
    scared: "/templates/game/CHAR-3_Scared.png",
    crying: "/templates/game/CHAR-4_Crying.png",
  },
  npcs: {
    bear_angry: "/templates/game/BEAR-1 Angry.png",
    bear_happy: "/templates/game/BEAR-2 Happy.png",
  },
  items: {
    letter: "/templates/game/ITEM-1 Letter.png",
    berries: "/templates/game/ITEM-2 Berries.png",
  },
};

// ============================================
// SCREEN DATA
// ============================================

type CharacterPosition = "left" | "center" | "right" | "far-left" | "far-right";

interface ScreenData {
  background: string;
  dialogue?: string[];
  choices?: { text: string; next: GameScreen; variant?: "primary" | "secondary" | "yes" | "no" | "dark" | "sunny" }[];
  showCharacter?: boolean;
  characterEmotion?: CharacterEmotion;
  characterPosition?: CharacterPosition;
  showBear?: "angry" | "happy";
  showItem?: "letter" | "berries";
  isGameOver?: boolean;
  gameOverText?: string;
  continueButton?: { text: string; next: GameScreen };
}

const getScreenData = (
  screen: GameScreen,
  senderName: string
): ScreenData => {
  const screens: Record<GameScreen, ScreenData> = {
    start: {
      background: ASSETS.backgrounds.start,
      dialogue: [
        "Welcome, brave adventurer!",
        `${senderName} has sent you on a quest...`,
        "A quest to find something special in the Enchanted Forest!",
        "Are you ready to begin?",
      ],
      choices: [
        { text: "Begin Adventure!", next: "fork" },
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "center",
    },
    fork: {
      background: ASSETS.backgrounds.fork,
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
      showCharacter: true,
      characterEmotion: "neutral",
      characterPosition: "center",
    },
    dark_path: {
      background: ASSETS.backgrounds.dark_path,
      dialogue: [
        "Oh no! The path leads to a dead end!",
        "Spooky shadows surround you...",
      ],
      showCharacter: true,
      characterEmotion: "scared",
      characterPosition: "left",
      continueButton: { text: "Run Back!", next: "fork" },
    },
    sunny_path: {
      background: ASSETS.backgrounds.sunny_path,
      dialogue: [
        "The sunny path is beautiful!",
        "Birds are singing, flowers are blooming...",
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "right",
      continueButton: { text: "Keep Going!", next: "river" },
    },
    river: {
      background: ASSETS.backgrounds.bridge,
      dialogue: [
        "You arrive at a rushing river!",
        "The water looks deep and fast...",
        "There's a rickety bridge ahead. Do you trust it?",
      ],
      choices: [
        { text: "Try to Swim", next: "drowning", variant: "secondary" },
        { text: "Cross the Bridge", next: "bridge", variant: "primary" },
      ],
      showCharacter: true,
      characterEmotion: "neutral",
      characterPosition: "left",
    },
    drowning: {
      background: ASSETS.backgrounds.drowning,
      dialogue: [
        "SPLASH! The current is too strong!",
        "You're swept downstream...",
        "Luckily, you grab onto a log and float back to shore!",
      ],
      showCharacter: false,
      characterEmotion: "scared",
      continueButton: { text: "Try Again", next: "river" },
    },
    bridge: {
      background: ASSETS.backgrounds.bridge,
      dialogue: [
        "You carefully cross the old bridge...",
        "CREAK... CREAK...",
        "Made it! The bridge holds!",
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "center",
      continueButton: { text: "Continue", next: "bear_encounter" },
    },
    bear_encounter: {
      background: ASSETS.backgrounds.bear_encounter,
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
      showCharacter: true,
      characterEmotion: "scared",
      characterPosition: "far-left",
    },
    bear_attack: {
      background: ASSETS.backgrounds.bear_attack,
      dialogue: [
        "The bear chases you!",
        "You trip and fall...",
        "But wait! The bear just wanted to play tag!",
      ],
      showCharacter: false,
      characterEmotion: "scared",
      continueButton: { text: "Try Again", next: "bear_encounter" },
    },
    bear_happy: {
      background: ASSETS.backgrounds.bear_happy,
      dialogue: [
        "You offer the berries to the bear...",
        "NOM NOM NOM!",
        "The bear is happy and lets you pass!",
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "left",
      continueButton: { text: "Continue", next: "magic_clearing" },
    },
    magic_clearing: {
      background: ASSETS.backgrounds.magic_clearing,
      dialogue: [
        "You enter a magical clearing...",
        "Sparkles float through the air!",
        "In the center, you see a glowing letter...",
        "It has your name on it!",
      ],
      choices: [
        { text: "Open the Letter", next: "invitation" },
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "left",
      showItem: "letter",
    },
    invitation: {
      background: ASSETS.backgrounds.magic_clearing,
      dialogue: [], // Will be handled specially
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "center",
    },
    happy_ending: {
      background: ASSETS.backgrounds.happy_ending,
      dialogue: [
        "YAYYY!!!",
        "Fireworks light up the sky!",
        "The forest creatures celebrate with you!",
        "This is the best adventure ever!",
      ],
      showCharacter: true,
      characterEmotion: "happy",
      characterPosition: "center",
    },
    guilt_trip: {
      background: ASSETS.backgrounds.guilt_trip,
      dialogue: [], // Will be handled specially with guilt trip messages
      showCharacter: true,
      characterEmotion: "crying",
      characterPosition: "center",
    },
  };

  return screens[screen];
};

// Guilt trip messages that cycle
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

function DialogueBox({
  messages,
  onComplete,
  style,
}: {
  messages: string[];
  onComplete?: () => void;
  style?: "default" | "invitation";
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Auto-advance after typing completes
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        if (currentIndex < messages.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsTyping(true);
        } else {
          onComplete?.();
        }
      }, 800); // 800ms delay before auto-advancing
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentIndex, messages.length, onComplete]);

  // Click to skip typing or advance immediately
  const handleClick = () => {
    if (isTyping) {
      setIsTyping(false);
    }
  };

  const isInvitation = style === "invitation";

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute bottom-4 left-4 right-4 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className={`
          relative p-4 rounded-lg
          ${isInvitation
            ? "bg-gradient-to-br from-pink-100 to-rose-200 border-4 border-pink-400"
            : "bg-white/95 border-4 border-amber-800"
          }
        `}
        style={{
          boxShadow: isInvitation
            ? "0 0 20px rgba(236, 72, 153, 0.5), inset 0 0 10px rgba(255,255,255,0.5)"
            : "4px 4px 0 #5c4033",
          imageRendering: "pixelated",
        }}
      >
        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-600 rounded-sm" style={{ boxShadow: "2px 2px 0 #5c4033" }} />

        <p
          className={`text-lg md:text-xl leading-relaxed ${isInvitation ? "text-pink-800" : "text-amber-900"}`}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px", lineHeight: "1.8" }}
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

        {/* Continue indicator - shows briefly before auto-advance */}
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

function Character({
  emotion,
  animation = "idle",
  position = "center",
}: {
  emotion: CharacterEmotion;
  animation?: "idle" | "bounce" | "shake" | "tremble" | "celebrate";
  position?: CharacterPosition;
}) {
  const getAnimation = () => {
    switch (animation) {
      case "bounce":
        return { y: [0, -20, 0] };
      case "shake":
        return { x: [-5, 5, -5, 5, 0] };
      case "tremble":
        return { x: [-2, 2, -2, 2, -2, 2, 0], y: [0, -2, 0, -2, 0] };
      case "celebrate":
        return { y: [0, -30, 0], rotate: [-10, 10, -10, 10, 0] };
      default:
        return { y: [0, -5, 0] };
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case "far-left":
        return "left-4 md:left-8";
      case "left":
        return "left-1/4 -translate-x-1/2";
      case "right":
        return "left-3/4 -translate-x-1/2";
      case "far-right":
        return "right-4 md:right-8";
      case "center":
      default:
        return "left-1/2 -translate-x-1/2";
    }
  };

  return (
    <motion.div
      key={position} // Re-animate when position changes
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...getAnimation()
      }}
      transition={{
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        y: { duration: animation === "idle" ? 2 : 0.5, repeat: animation === "idle" ? Infinity : 0, ease: "easeInOut" },
        x: { duration: animation === "idle" ? 2 : 0.5, repeat: animation === "idle" ? Infinity : 0, ease: "easeInOut" },
        rotate: { duration: animation === "idle" ? 2 : 0.5, repeat: animation === "idle" ? Infinity : 0, ease: "easeInOut" },
      }}
      className={`absolute bottom-32 ${getPositionClass()}`}
    >
      <img
        src={ASSETS.characters[emotion]}
        alt="Character"
        className="w-48 h-48 md:w-64 md:h-64"
        style={{ imageRendering: "pixelated" }}
      />
    </motion.div>
  );
}

function GameOverOverlay({
  text,
  onRestart,
}: {
  text: string;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"
    >
      <motion.h2
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-red-500 text-2xl md:text-4xl mb-8"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          textShadow: "4px 4px 0 #7f1d1d",
        }}
      >
        GAME OVER
      </motion.h2>
      <p
        className="text-white text-center mb-8 px-4"
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px" }}
      >
        {text}
      </p>
      <ChoiceButton text="Try Again" onClick={onRestart} variant="primary" />
    </motion.div>
  );
}

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
        {/* Letter icon */}
        <motion.div
          animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mb-6"
        >
          <img
            src={ASSETS.items.letter}
            alt="Letter"
            className="w-28 h-28 md:w-32 md:h-32 mx-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>

        <h2
          className="text-xl md:text-2xl text-center text-pink-700 mb-4"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            textShadow: "2px 2px 0 rgba(236, 72, 153, 0.3)",
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

  // YES button grows exponentially with each "No" click
  // After ~6 clicks it should fill the entire screen
  const yesScale = Math.pow(1.6, guiltIndex);
  const isOverwhelming = guiltIndex >= 5; // At this point, YES takes over

  // When YES is overwhelming, render fullscreen button
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
          animate={{
            scale: [yesScale, yesScale * 1.05, yesScale],
          }}
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
        {/* Crying character */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4"
        >
          <img
            src={ASSETS.characters.crying}
            alt="Sad"
            className="w-24 h-24 mx-auto"
            style={{ imageRendering: "pixelated" }}
          />
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
            animate={{
              scale: [yesScale, yesScale * 1.05, yesScale],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="z-20"
            style={{
              transformOrigin: "center center",
            }}
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

          {/* No button shrinks as Yes grows */}
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

    // Magical forest celebration!
    const forestColors = ["#22c55e", "#86efac", "#fbbf24", "#f472b6", "#a855f7"];

    // Main burst
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.5 },
      colors: forestColors,
      shapes: ["circle", "square"],
      scalar: 1.5,
    });

    // Delayed sparkles
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
  }, []);

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

  // Get background for current screen
  const getBackground = () => {
    if (currentScreen === "invitation") {
      return ASSETS.backgrounds.magic_clearing;
    }
    if (currentScreen === "guilt_trip") {
      return ASSETS.backgrounds.guilt_trip;
    }
    return screenData.background;
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Load pixel font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>

      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={getBackground()}
            alt="Background"
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Character */}
      {screenData.showCharacter && currentScreen !== "invitation" && currentScreen !== "guilt_trip" && (
        <Character
          emotion={screenData.characterEmotion || "neutral"}
          animation={
            screenData.characterEmotion === "scared" ? "tremble" :
            screenData.characterEmotion === "happy" ? "bounce" :
            "idle"
          }
          position={screenData.characterPosition || "center"}
        />
      )}

      {/* Bear NPC */}
      {screenData.showBear && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-32 right-8 md:right-16"
        >
          <motion.img
            animate={screenData.showBear === "angry" ? { x: [-3, 3, -3] } : { y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            src={screenData.showBear === "angry" ? ASSETS.npcs.bear_angry : ASSETS.npcs.bear_happy}
            alt="Bear"
            className="w-24 h-24 md:w-32 md:h-32"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      )}

      {/* Floating item */}
      {screenData.showItem && (
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-1/4 right-1/4"
        >
          <img
            src={screenData.showItem === "letter" ? ASSETS.items.letter : ASSETS.items.berries}
            alt="Item"
            className="w-24 h-24 md:w-32 md:h-32"
            style={{ imageRendering: "pixelated" }}
          />
        </motion.div>
      )}

      {/* Invitation Screen */}
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

      {/* Guilt Trip Screen */}
      {currentScreen === "guilt_trip" && (
        <GuiltTripScreen
          guiltIndex={guiltIndex}
          onYes={handleYes}
          onNoAgain={handleNoAgain}
        />
      )}

      {/* Dialogue box */}
      {screenData.dialogue && screenData.dialogue.length > 0 && currentScreen !== "invitation" && currentScreen !== "guilt_trip" && (
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

      {/* Continue button for transitional screens */}
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

      {/* Happy ending celebration */}
      {currentScreen === "happy_ending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl md:text-8xl mb-4"
          >
            🎉
          </motion.div>
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
      )}

      {/* Game Over overlay */}
      {screenData.isGameOver && (
        <GameOverOverlay
          text={screenData.gameOverText || "Try again!"}
          onRestart={restartGame}
        />
      )}

      {/* Restart button (always visible in corner) */}
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

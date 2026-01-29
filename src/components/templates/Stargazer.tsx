"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

type Scene = "splash" | "ask" | "details" | "letter" | "finale";

const SCENES: Scene[] = ["splash", "ask", "details", "letter", "finale"];

const PALETTE = {
  void: "#050514",
  deepSpace: "#0a0a2e",
  navy: "#121240",
  purple: "#7c3aed",
  pink: "#ec4899",
  gold: "#fbbf24",
  starWhite: "#e8e4ff",
  nebulaPink: "rgba(236, 72, 153, 0.15)",
  nebulaPurple: "rgba(124, 58, 237, 0.12)",
  glass: "rgba(255, 255, 255, 0.06)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function Stargazer({
  senderName = "Someone",
  message = "Will you be my Valentine?",
  personalMessage = "Every moment with you feels like stargazing — infinite, breathtaking, and full of wonder.",
  date = "February 14th",
  time = "7:00 PM",
  location = "Under the stars",
}: {
  senderName?: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
}) {
  const [scene, setScene] = useState<Scene>("splash");
  const [accepted, setAccepted] = useState(false);
  const sceneIndex = SCENES.indexOf(scene);

  const goNext = useCallback(() => {
    const idx = SCENES.indexOf(scene);
    if (idx < SCENES.length - 1) {
      setScene(SCENES[idx + 1]);
    }
  }, [scene]);

  const handleAccept = () => {
    setAccepted(true);
    // Shooting stars effect - diagonal streaks across the sky
    const starColors = ["#fbbf24", "#e8e4ff", "#f5f3ff"];
    const nebulaColors = ["#7c3aed", "#ec4899"];

    // Central starburst (supernova effect)
    confetti({
      particleCount: 100,
      spread: 360,
      origin: { y: 0.5, x: 0.5 },
      colors: starColors,
      shapes: ["star"],
      scalar: 2,
      gravity: 0.4,
      drift: 0,
      ticks: 200,
    });

    // Shooting stars from top corners
    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 225,
        spread: 20,
        origin: { x: 1, y: 0 },
        colors: ["#fbbf24", "#e8e4ff"],
        shapes: ["star"],
        scalar: 1.5,
        gravity: 1.5,
        drift: 2,
      });
      confetti({
        particleCount: 25,
        angle: 315,
        spread: 20,
        origin: { x: 0, y: 0 },
        colors: ["#fbbf24", "#e8e4ff"],
        shapes: ["star"],
        scalar: 1.5,
        gravity: 1.5,
        drift: -2,
      });
    }, 200);

    // Nebula sparkle (purple/pink mist)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 120,
        origin: { y: 0.6 },
        colors: nebulaColors,
        shapes: ["circle"],
        scalar: 0.8,
        gravity: 0.3,
        ticks: 150,
      });
    }, 400);

    // Final golden shimmer
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 160,
        origin: { y: 0.4 },
        colors: ["#fbbf24", "#f5f3ff"],
        shapes: ["star"],
        scalar: 1.2,
        gravity: 0.5,
      });
    }, 600);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: PALETTE.void }}
    >
      {/* Persistent star field */}
      <StarField count={80} />

      {/* Nebula ambient glow — intensifies as scenes progress */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: sceneIndex * 0.25,
        }}
        transition={{ duration: 1.5 }}
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(124,58,237,0.15), transparent),
            radial-gradient(ellipse 60% 80% at 70% 60%, rgba(236,72,153,0.1), transparent),
            radial-gradient(ellipse 50% 50% at 50% 50%, rgba(251,191,36,0.05), transparent)
          `,
        }}
      />

      <AnimatePresence mode="wait">
        {scene === "splash" && (
          <SplashScene
            key="splash"
            senderName={senderName}
            onAdvance={goNext}
          />
        )}
        {scene === "ask" && (
          <AskScene key="ask" message={message} onAdvance={goNext} />
        )}
        {scene === "details" && (
          <DetailsScene
            key="details"
            date={date}
            time={time}
            location={location}
            onAdvance={goNext}
          />
        )}
        {scene === "letter" && (
          <LetterScene
            key="letter"
            personalMessage={personalMessage}
            onAdvance={goNext}
          />
        )}
        {scene === "finale" && (
          <FinaleScene
            key="finale"
            accepted={accepted}
            onAccept={handleAccept}
            senderName={senderName}
          />
        )}
      </AnimatePresence>

      {/* Scene progress dots */}
      {!accepted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {SCENES.map((s, i) => (
            <motion.div
              key={s}
              className="rounded-full"
              animate={{
                width: scene === s ? 24 : 6,
                height: 6,
                backgroundColor:
                  scene === s ? PALETTE.gold : "rgba(255,255,255,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SCENE 1: SPLASH
// ─────────────────────────────────────────────

function SplashScene({
  senderName,
  onAdvance,
}: {
  senderName: string;
  onAdvance: () => void;
}) {
  const [phase, setPhase] = useState(0); // 0=stars, 1=name, 2=ready

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 cursor-pointer"
      onClick={phase >= 2 ? onAdvance : undefined}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Constellation lines around name */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Orbiting constellation dots */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 120 + (i % 2) * 30;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4 + (i % 3),
                height: 4 + (i % 3),
                background: i % 2 === 0 ? PALETTE.gold : PALETTE.starWhite,
                left: "50%",
                top: "50%",
                boxShadow: `0 0 ${6 + i * 2}px ${i % 2 === 0 ? PALETTE.gold : PALETTE.starWhite}`,
              }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0.4, 0.8],
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
              }}
              transition={{
                opacity: { duration: 3, repeat: Infinity, delay: i * 0.3 },
                x: { duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" },
                y: { duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" },
              }}
            />
          );
        })}

        {/* Constellation connecting lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            width: 300,
            height: 300,
            marginLeft: -150,
            marginTop: -150,
          }}
        >
          <motion.line
            x1="30" y1="80" x2="150" y2="40"
            stroke={PALETTE.starWhite}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <motion.line
            x1="150" y1="40" x2="270" y2="90"
            stroke={PALETTE.starWhite}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1.3 }}
          />
          <motion.line
            x1="270" y1="90" x2="220" y2="220"
            stroke={PALETTE.starWhite}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1.6 }}
          />
          <motion.line
            x1="220" y1="220" x2="80" y2="210"
            stroke={PALETTE.starWhite}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1.9 }}
          />
          <motion.line
            x1="80" y1="210" x2="30" y2="80"
            stroke={PALETTE.starWhite}
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 2.2 }}
          />
        </svg>

        {/* Sender name — the star of the show */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={
            phase >= 1
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : {}
          }
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center relative z-10"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 8vw, 4rem)",
            fontWeight: 600,
            fontStyle: "italic",
            color: PALETTE.starWhite,
            textShadow: `0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.3), 0 2px 4px rgba(0,0,0,0.5)`,
            letterSpacing: "0.02em",
          }}
        >
          {senderName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 1 ? { opacity: 0.5 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-2"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: PALETTE.starWhite,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          has a message for you
        </motion.p>
      </motion.div>

      {/* Tap to begin */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={
          phase >= 2
            ? { opacity: [0, 0.6, 0.3, 0.6] }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-20"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px",
          color: PALETTE.gold,
          letterSpacing: "0.2em",
        }}
      >
        tap to begin
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 2: THE ASK — Typewriter message
// ─────────────────────────────────────────────

function AskScene({
  message,
  onAdvance,
}: {
  message: string;
  onAdvance: () => void;
}) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    if (displayedChars < message.length) {
      const speed = message[displayedChars] === " " ? 40 : 70;
      const timer = setTimeout(() => setDisplayedChars((c) => c + 1), speed);
      return () => clearTimeout(timer);
    } else {
      const t = setTimeout(() => setShowContinue(true), 600);
      return () => clearTimeout(t);
    }
  }, [displayedChars, message]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 cursor-pointer px-4 md:px-8"
      onClick={showContinue ? onAdvance : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Nebula bloom behind text */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.2), transparent 70%),
            radial-gradient(ellipse 50% 70% at 40% 55%, rgba(236,72,153,0.12), transparent 60%)
          `,
        }}
      />

      {/* Decorative star burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.15, scale: 1, rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute"
        style={{
          width: 400,
          height: 400,
          background: `conic-gradient(from 0deg, transparent, ${PALETTE.purple}22, transparent, ${PALETTE.pink}15, transparent, ${PALETTE.gold}10, transparent)`,
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 max-w-[280px] md:max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: PALETTE.gold,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          — a question —
        </motion.div>

        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 7vw, 3.2rem)",
            fontWeight: 500,
            fontStyle: "italic",
            color: PALETTE.starWhite,
            lineHeight: 1.3,
            textShadow: "0 0 30px rgba(124,58,237,0.4), 0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {message.slice(0, displayedChars)}
          {displayedChars < message.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ color: PALETTE.gold }}
            >
              |
            </motion.span>
          )}
        </h2>

        {/* Decorative line */}
        <motion.div
          className="mx-auto mt-8"
          initial={{ width: 0, opacity: 0 }}
          animate={
            displayedChars >= message.length
              ? { width: 80, opacity: 0.3 }
              : {}
          }
          transition={{ duration: 0.8 }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${PALETTE.gold}, transparent)`,
          }}
        />
      </div>

      {/* Continue hint */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-20"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              color: PALETTE.gold,
              letterSpacing: "0.2em",
            }}
          >
            continue →
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 3: THE DETAILS — Glass star cards
// ─────────────────────────────────────────────

function DetailsScene({
  date,
  time,
  location,
  onAdvance,
}: {
  date: string;
  time: string;
  location: string;
  onAdvance: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(t);
  }, []);

  const details = [
    { label: "DATE", value: date, icon: "✦", delay: 0.3 },
    { label: "TIME", value: time, icon: "◆", delay: 0.6 },
    { label: "PLACE", value: location, icon: "★", delay: 0.9 },
  ];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 cursor-pointer px-6"
      onClick={ready ? onAdvance : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="mb-10"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: PALETTE.gold,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        — the details —
      </motion.div>

      {/* Star cards */}
      <div className="flex flex-col gap-5 w-full max-w-[260px] md:max-w-sm">
        {details.map((d, i) => (
          <motion.div
            key={d.label}
            initial={{
              opacity: 0,
              y: 40 + i * 20,
              x: i % 2 === 0 ? -30 : 30,
              rotateZ: i % 2 === 0 ? -3 : 3,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              rotateZ: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1,
              delay: d.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-2xl p-5 overflow-hidden"
            style={{
              background: PALETTE.glass,
              border: `1px solid ${PALETTE.glassBorder}`,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Glass shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, delay: d.delay + 0.8, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              }}
            />

            {/* Corner star decoration */}
            <div
              className="absolute top-3 right-4"
              style={{
                color: PALETTE.gold,
                opacity: 0.4,
                fontSize: "14px",
              }}
            >
              {d.icon}
            </div>

            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "10px",
                color: PALETTE.gold,
                letterSpacing: "0.25em",
                marginBottom: 6,
              }}
            >
              {d.label}
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.1rem, 5vw, 1.5rem)",
                fontWeight: 500,
                color: PALETTE.starWhite,
                textShadow: "0 0 20px rgba(124,58,237,0.3)",
              }}
            >
              {d.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Continue */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-20"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              color: PALETTE.gold,
              letterSpacing: "0.2em",
            }}
          >
            continue →
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 4: PERSONAL MESSAGE — Shooting star + stardust text
// ─────────────────────────────────────────────

function LetterScene({
  personalMessage,
  onAdvance,
}: {
  personalMessage: string;
  onAdvance: () => void;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowMessage(true), 1200);
    const t2 = setTimeout(() => setReady(true), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 cursor-pointer px-4 md:px-8"
      onClick={ready ? onAdvance : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.7 }}
    >
      {/* Shooting star */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ x: "-10%", y: "15%", opacity: 0 }}
        animate={{
          x: ["−10%", "110%"],
          y: ["15%", "35%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeIn" }}
      >
        {/* Star head */}
        <div
          className="relative"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: PALETTE.starWhite,
            boxShadow: `0 0 12px ${PALETTE.starWhite}, 0 0 30px ${PALETTE.gold}, 0 0 60px ${PALETTE.purple}`,
          }}
        />
        {/* Trail */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            right: 6,
            width: 120,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${PALETTE.gold}40, ${PALETTE.starWhite}80)`,
            borderRadius: 2,
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      {/* Second shooting star */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ x: "110%", y: "60%", opacity: 0 }}
        animate={{
          x: ["110%", "-10%"],
          y: ["60%", "45%"],
          opacity: [0, 0.6, 0.6, 0],
        }}
        transition={{ duration: 1.8, delay: 0.8, ease: "easeIn" }}
      >
        <div
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: PALETTE.gold,
            boxShadow: `0 0 8px ${PALETTE.gold}, 0 0 20px ${PALETTE.purple}`,
          }}
        />
      </motion.div>

      {/* Personal message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-[280px] md:max-w-md text-center"
          >
            {/* Decorative quotes */}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "4rem",
                color: PALETTE.purple,
                lineHeight: 0.5,
              }}
            >
              &ldquo;
            </motion.span>

            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)",
                fontWeight: 400,
                color: PALETTE.starWhite,
                lineHeight: 1.8,
                textShadow: "0 0 30px rgba(124,58,237,0.3), 0 1px 3px rgba(0,0,0,0.5)",
              }}
            >
              {personalMessage}
            </p>

            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="block mt-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "4rem",
                color: PALETTE.purple,
                lineHeight: 0.5,
                textAlign: "right",
              }}
            >
              &rdquo;
            </motion.span>

            {/* Decorative line */}
            <motion.div
              className="mx-auto mt-6"
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${PALETTE.gold}80, transparent)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-20"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "12px",
              color: PALETTE.gold,
              letterSpacing: "0.2em",
            }}
          >
            continue →
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 5: FINALE — Supernova accept
// ─────────────────────────────────────────────

function FinaleScene({
  accepted,
  onAccept,
  senderName,
}: {
  accepted: boolean;
  onAccept: () => void;
  senderName: string;
}) {
  const [noCount, setNoCount] = useState(0);
  const noHidden = noCount >= 4;

  const NO_MESSAGES = [
    "The stars disagree...",
    "A black hole swallowed that answer",
    "The universe rejected your input",
    "The cosmos says try again",
  ];

  const handleNo = () => {
    if (noCount < 4) setNoCount((c) => c + 1);
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Supernova burst on accept */}
      <AnimatePresence>
        {accepted && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PALETTE.gold}, ${PALETTE.purple}, transparent)`,
              filter: "blur(20px)",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="buttons"
            className="flex flex-col items-center gap-4 md:gap-8 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "11px",
                color: PALETTE.gold,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.2 }}
            >
              — your answer —
            </motion.p>

            <motion.h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.4rem, 6vw, 2rem)",
                fontWeight: 500,
                fontStyle: "italic",
                color: PALETTE.starWhite,
                textAlign: "center",
                textShadow: "0 0 30px rgba(124,58,237,0.4)",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              So, what do you say?
            </motion.h3>

            {/* Button row */}
            <div className="flex items-center gap-5">
              <motion.button
                onClick={onAccept}
                className="relative overflow-hidden rounded-full px-6 md:px-12 py-4"
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.purple}, ${PALETTE.pink})`,
                  border: `1px solid rgba(255,255,255,0.2)`,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "white",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: `0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(236,72,153,0.2)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(236,72,153,0.3)`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
                  }}
                />
                <span className="relative z-10">Yes, among the stars ✨</span>
              </motion.button>

              {/* No button — gets sucked into a black hole */}
              <AnimatePresence>
                {!noHidden && (
                  <motion.button
                    key={`no-${noCount}`}
                    onClick={handleNo}
                    className="relative overflow-hidden rounded-full px-4 md:px-8 py-4"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.4)",
                      letterSpacing: "0.05em",
                      cursor: "pointer",
                    }}
                    initial={noCount > 0 ? { scale: 0, rotate: 180, opacity: 0, filter: "blur(8px)" } : { opacity: 0, y: 20 }}
                    animate={{ scale: 1 - noCount * 0.15, rotate: 0, opacity: 1 - noCount * 0.2, y: 0, filter: "blur(0px)" }}
                    exit={{
                      scale: 0,
                      rotate: -360,
                      opacity: 0,
                      filter: "blur(12px)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    whileHover={{ scale: Math.max(0.5, 1 - noCount * 0.15 - 0.05) }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <span className="relative z-10">No</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Cosmic rejection message */}
            <AnimatePresence mode="wait">
              {noCount > 0 && noCount <= 4 && (
                <motion.p
                  key={`msg-${noCount}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "12px",
                    color: PALETTE.starWhite,
                    letterSpacing: "0.1em",
                    textAlign: "center",
                  }}
                >
                  {NO_MESSAGES[noCount - 1]}
                </motion.p>
              )}
            </AnimatePresence>

            {/* After No disappears */}
            {noHidden && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "12px",
                  color: PALETTE.gold,
                  letterSpacing: "0.1em",
                }}
              >
                the stars have spoken ✦
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="flex flex-col items-center gap-6 relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
              delay: 0.3,
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Orbiting stars */}
            <motion.div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute"
                  style={{
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: PALETTE.gold,
                    boxShadow: `0 0 15px ${PALETTE.gold}, 0 0 30px ${PALETTE.gold}`,
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute"
                  style={{
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: PALETTE.pink,
                    boxShadow: `0 0 12px ${PALETTE.pink}, 0 0 25px ${PALETTE.pink}`,
                  }}
                />
              </motion.div>
              {/* Center glow */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: PALETTE.starWhite,
                    boxShadow: `0 0 20px ${PALETTE.starWhite}, 0 0 40px ${PALETTE.purple}`,
                  }}
                />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 7vw, 3rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: PALETTE.starWhite,
                textShadow: `0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(236,72,153,0.3)`,
              }}
            >
              It&apos;s written in the stars
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px",
                color: PALETTE.starWhite,
                letterSpacing: "0.15em",
              }}
            >
              see you there ♡
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// STAR FIELD — Living, breathing night sky
// ─────────────────────────────────────────────

function StarField({ count }: { count: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
      brightness: 0.3 + Math.random() * 0.7,
      isGold: Math.random() > 0.85,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.isGold ? PALETTE.gold : PALETTE.starWhite,
            boxShadow: star.isGold
              ? `0 0 ${star.size * 3}px ${PALETTE.gold}60`
              : `0 0 ${star.size * 2}px rgba(232,228,255,0.3)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.brightness, star.brightness * 0.3, star.brightness],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

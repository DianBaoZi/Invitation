"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

type Scene = "countdown" | "feature" | "ticket" | "credits" | "finale";

const SCENES: Scene[] = ["countdown", "feature", "ticket", "credits", "finale"];

const P = {
  theater: "#0a0a0a",
  velvet: "#8b1a2b",
  crimson: "#c41e3a",
  gold: "#d4a017",
  goldLight: "#f5c842",
  cream: "#f5e6d0",
  spotlight: "#fff8e7",
  dimText: "rgba(255,255,255,0.3)",
  glass: "rgba(255,255,255,0.05)",
  glassBorder: "rgba(255,255,255,0.1)",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function Premiere({
  senderName = "Someone",
  message = "Will you be my Valentine?",
  personalMessage = "Every scene of my life is better with you in it.",
  date = "February 14th",
  time = "7:00 PM",
  location = "The usual spot",
}: {
  senderName?: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
}) {
  const [scene, setScene] = useState<Scene>("countdown");
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
    const colors = ["#d4a017", "#c41e3a", "#f5c842", "#f5e6d0"];
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.55 }, colors });
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 140, origin: { y: 0.45 }, colors });
    }, 250);
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 160, origin: { y: 0.5, x: 0.3 }, colors });
      confetti({ particleCount: 60, spread: 160, origin: { y: 0.5, x: 0.7 }, colors });
    }, 500);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: P.theater }}
    >
      {/* Film grain overlay — persistent */}
      <FilmGrain />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Ambient spotlight glow — intensifies with scenes */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: sceneIndex * 0.15 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `
            radial-gradient(ellipse 40% 60% at 50% 20%, rgba(245,200,66,0.08), transparent),
            radial-gradient(ellipse 60% 40% at 50% 80%, rgba(196,30,58,0.06), transparent)
          `,
        }}
      />

      <AnimatePresence mode="wait">
        {scene === "countdown" && (
          <CountdownScene key="countdown" senderName={senderName} onAdvance={goNext} />
        )}
        {scene === "feature" && (
          <FeatureScene key="feature" message={message} onAdvance={goNext} />
        )}
        {scene === "ticket" && (
          <TicketScene key="ticket" date={date} time={time} location={location} onAdvance={goNext} />
        )}
        {scene === "credits" && (
          <CreditsScene key="credits" personalMessage={personalMessage} onAdvance={goNext} />
        )}
        {scene === "finale" && (
          <FinaleScene key="finale" accepted={accepted} onAccept={handleAccept} senderName={senderName} />
        )}
      </AnimatePresence>

      {/* Scene progress dots */}
      {!accepted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          {SCENES.map((s) => (
            <motion.div
              key={s}
              className="rounded-full"
              animate={{
                width: scene === s ? 24 : 6,
                height: 6,
                backgroundColor: scene === s ? P.gold : "rgba(255,255,255,0.2)",
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
// SCENE 1: COUNTDOWN
// ─────────────────────────────────────────────

function CountdownScene({
  senderName,
  onAdvance,
}: {
  senderName: string;
  onAdvance: () => void;
}) {
  const [count, setCount] = useState(3);
  const [showTitle, setShowTitle] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCount(2), 800);
    const t2 = setTimeout(() => setCount(1), 1600);
    const t3 = setTimeout(() => setCount(0), 2400);
    const t4 = setTimeout(() => setShowTitle(true), 3000);
    const t5 = setTimeout(() => setReady(true), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 cursor-pointer"
      onClick={ready ? onAdvance : undefined}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      {/* Film leader circle */}
      {count > 0 && (
        <div className="relative">
          {/* Outer circle */}
          <motion.div
            className="w-48 h-48 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: P.cream }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          >
            {/* Cross hairs */}
            <div
              className="absolute w-full h-px"
              style={{ background: `linear-gradient(90deg, transparent 10%, ${P.cream}40 30%, ${P.cream}40 70%, transparent 90%)` }}
            />
            <div
              className="absolute h-full w-px"
              style={{ background: `linear-gradient(180deg, transparent 10%, ${P.cream}40 30%, ${P.cream}40 70%, transparent 90%)` }}
            />
          </motion.div>

          {/* Countdown number */}
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 2, opacity: 0, filter: "blur(8px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.5, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  fontFamily: "'Bebas Neue', 'Arial Narrow', sans-serif",
                  fontSize: "clamp(5rem, 15vw, 8rem)",
                  fontWeight: 400,
                  color: P.cream,
                  textShadow: `0 0 40px rgba(245,200,66,0.3)`,
                  lineHeight: 1,
                }}
              >
                {count}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Spinning arc — countdown timer visual */}
          <motion.svg
            className="absolute inset-0"
            viewBox="0 0 192 192"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
          >
            <circle
              cx="96" cy="96" r="90"
              fill="none"
              stroke={P.gold}
              strokeWidth="1.5"
              strokeDasharray="40 525"
              opacity={0.5}
            />
          </motion.svg>
        </div>
      )}

      {/* Title card: "A [name] Production" */}
      {count === 0 && (
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: showTitle ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)` }}
          />

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: P.gold,
              opacity: 0.7,
            }}
          >
            a film by
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 8vw, 3.5rem)",
              fontWeight: 600,
              fontStyle: "italic",
              color: P.cream,
              textShadow: `0 0 40px rgba(212,160,23,0.4), 0 2px 4px rgba(0,0,0,0.5)`,
              letterSpacing: "0.03em",
            }}
          >
            {senderName}
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)` }}
          />

          {/* Tap hint */}
          {ready && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.25, 0.5] }}
              transition={{ delay: 0.3, duration: 2.5, repeat: Infinity }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: P.gold,
                letterSpacing: "0.2em",
                marginTop: 24,
              }}
            >
              tap to begin
            </motion.p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 2: THE FEATURE (Curtain Reveal)
// ─────────────────────────────────────────────

function FeatureScene({
  message,
  onAdvance,
}: {
  message: string;
  onAdvance: () => void;
}) {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [showTap, setShowTap] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true), 400);
    return () => clearTimeout(t1);
  }, []);

  // Typewriter effect after curtains open
  useEffect(() => {
    if (!curtainsOpen) return;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedChars((c) => {
          if (c >= message.length) {
            clearInterval(interval);
            setTimeout(() => setShowTap(true), 600);
            return c;
          }
          return c + 1;
        });
      }, 70);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(delay);
  }, [curtainsOpen, message.length]);

  return (
    <motion.div
      className="fixed inset-0 z-10 cursor-pointer"
      onClick={showTap ? onAdvance : undefined}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      {/* Spotlight beam from top */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: curtainsOpen ? 0.15 : 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{
          width: "60%",
          height: "100%",
          background: `linear-gradient(180deg, ${P.spotlight}30 0%, transparent 70%)`,
          clipPath: "polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)",
        }}
      />

      {/* Left curtain */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 z-20"
        style={{
          width: "52%",
          background: `linear-gradient(135deg, #4a0e1a 0%, ${P.velvet} 30%, #6b1525 60%, ${P.velvet} 100%)`,
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.4)",
        }}
        initial={{ x: 0 }}
        animate={{ x: curtainsOpen ? "-100%" : 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        {/* Curtain fold lines */}
        <div className="absolute inset-0 opacity-20" style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 25%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 26%, transparent 26%, transparent 50%)`,
        }} />
        {/* Gold fringe at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{
          background: `repeating-linear-gradient(90deg, ${P.gold}60, ${P.gold}60 3px, transparent 3px, transparent 8px)`,
        }} />
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 z-20"
        style={{
          width: "52%",
          background: `linear-gradient(225deg, #4a0e1a 0%, ${P.velvet} 30%, #6b1525 60%, ${P.velvet} 100%)`,
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.4)",
        }}
        initial={{ x: 0 }}
        animate={{ x: curtainsOpen ? "100%" : 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 25%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 26%, transparent 26%, transparent 50%)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{
          background: `repeating-linear-gradient(90deg, ${P.gold}60, ${P.gold}60 3px, transparent 3px, transparent 8px)`,
        }} />
      </motion.div>

      {/* Gold curtain rod */}
      <div
        className="absolute top-0 left-0 right-0 h-3 z-30"
        style={{
          background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold}, #8b6914)`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Center content — message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: curtainsOpen ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center max-w-md"
        >
          {/* Decorative top ornament */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: curtainsOpen ? 0.6 : 0, scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <span style={{ color: P.gold, fontSize: "24px" }}>✦</span>
          </motion.div>

          {/* Typewritten message */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              fontWeight: 500,
              fontStyle: "italic",
              color: P.cream,
              lineHeight: 1.3,
              textShadow: `0 0 30px rgba(212,160,23,0.3), 0 2px 4px rgba(0,0,0,0.5)`,
              minHeight: "3.6em",
            }}
          >
            {message.substring(0, typedChars)}
            {typedChars < message.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ color: P.gold }}
              >
                |
              </motion.span>
            )}
          </h2>

          {/* Decorative bottom ornament */}
          <motion.div
            className="mt-8 flex justify-center gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: typedChars >= message.length ? 0.5 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${P.gold})` }} />
            <span style={{ color: P.gold, fontSize: "10px" }}>✦</span>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${P.gold}, transparent)` }} />
          </motion.div>
        </motion.div>

        {/* Tap hint */}
        {showTap && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-16"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: P.gold,
              letterSpacing: "0.2em",
            }}
          >
            tap to continue
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 3: THE TICKET
// ─────────────────────────────────────────────

function TicketScene({
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
  const [showTap, setShowTap] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTap(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 px-6 cursor-pointer"
      onClick={showTap ? onAdvance : undefined}
      exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      {/* Ticket */}
      <motion.div
        className="relative w-full max-w-[340px]"
        initial={{ y: 200, opacity: 0, rotateX: 30, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ perspective: "600px" }}
      >
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: `linear-gradient(160deg, #1a1218 0%, #1f1520 40%, #1a1218 100%)`,
            border: `1px solid ${P.gold}30`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,160,23,0.1)`,
          }}
        >
          {/* Gold border inner glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: `1px solid ${P.gold}15`,
              boxShadow: `inset 0 0 30px rgba(212,160,23,0.05)`,
            }}
          />

          {/* Ticket header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: P.gold,
                opacity: 0.6,
              }}
            >
              admit one
            </p>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                fontWeight: 600,
                color: P.cream,
                marginTop: 8,
                textShadow: `0 0 20px rgba(212,160,23,0.3)`,
              }}
            >
              Valentine&apos;s Premiere
            </motion.h3>
          </div>

          {/* Perforated line — tear-off effect */}
          <div className="relative mx-4 my-2">
            <div
              style={{
                height: 1,
                backgroundImage: `repeating-linear-gradient(90deg, ${P.gold}40 0px, ${P.gold}40 6px, transparent 6px, transparent 12px)`,
              }}
            />
            {/* Circle cutouts at edges */}
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ background: P.theater }}
            />
            <div
              className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ background: P.theater }}
            />
          </div>

          {/* Ticket details */}
          <div className="px-6 py-5 space-y-5">
            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: P.gold,
                  opacity: 0.5,
                  marginBottom: 4,
                }}
              >
                date
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: P.cream,
                }}
              >
                {date}
              </p>
            </motion.div>

            {/* Time */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: P.gold,
                  opacity: 0.5,
                  marginBottom: 4,
                }}
              >
                showtime
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: P.cream,
                }}
              >
                {time}
              </p>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: P.gold,
                  opacity: 0.5,
                  marginBottom: 4,
                }}
              >
                venue
              </p>
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  color: P.cream,
                }}
              >
                {location}
              </p>
            </motion.div>
          </div>

          {/* Ticket footer — barcode-style decoration */}
          <div className="px-6 pb-5 pt-2">
            <div className="flex items-center justify-center gap-[2px] opacity-20">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: i % 3 === 0 ? 3 : 1.5,
                    height: 20,
                    background: P.cream,
                    opacity: 0.4 + (i % 5) * 0.12,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glow pulse */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              `0 0 0px rgba(212,160,23,0)`,
              `0 0 40px rgba(212,160,23,0.15), 0 0 80px rgba(212,160,23,0.05)`,
              `0 0 0px rgba(212,160,23,0)`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Tap hint */}
      {showTap && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="mt-10"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: P.gold,
            letterSpacing: "0.2em",
          }}
        >
          tap to continue
        </motion.p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 4: CREDITS (Personal Message)
// ─────────────────────────────────────────────

function CreditsScene({
  personalMessage,
  onAdvance,
}: {
  personalMessage: string;
  onAdvance: () => void;
}) {
  const [showTap, setShowTap] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowTap(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 px-8 cursor-pointer"
      onClick={showTap ? onAdvance : undefined}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md text-center overflow-hidden" style={{ maxHeight: "70vh" }}>
        {/* Credits scroll container */}
        <motion.div
          initial={{ y: "50%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* "From the heart of" label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: P.gold,
              marginBottom: 20,
            }}
          >
            from the heart
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}80, transparent)` }}
          />

          {/* Personal message — credits style */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
              fontWeight: 400,
              fontStyle: "italic",
              color: P.cream,
              lineHeight: 1.8,
              textShadow: `0 0 20px rgba(212,160,23,0.15)`,
            }}
          >
            &ldquo;{personalMessage}&rdquo;
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mx-auto mt-8"
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 2, duration: 1 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}80, transparent)` }}
          />

          {/* Small star ornament */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: 2.5, type: "spring" }}
          >
            <span style={{ color: P.gold, fontSize: "16px" }}>✦</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Tap hint */}
      {showTap && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-16"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            color: P.gold,
            letterSpacing: "0.2em",
          }}
        >
          tap to continue
        </motion.p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// SCENE 5: FINALE
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

  const CUT_MESSAGES = [
    "CUT! Try that again...",
    "The director says no",
    "That take was rejected",
    "Not in the script!",
  ];

  const handleNo = () => {
    if (noCount < 4) setNoCount((c) => c + 1);
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Spotlight burst on accept */}
      {accepted && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.15] }}
          transition={{ duration: 1.5 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${P.goldLight}40, transparent 60%)`,
          }}
        />
      )}

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="ask"
            className="flex flex-col items-center gap-6 relative z-10"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
          >
            {/* Clapperboard icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2"
            >
              <div
                className="relative"
                style={{ width: 64, height: 52 }}
              >
                {/* Clapper top */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 16,
                    background: `repeating-linear-gradient(135deg, ${P.cream} 0px, ${P.cream} 8px, ${P.theater} 8px, ${P.theater} 16px)`,
                    borderRadius: "4px 4px 0 0",
                    transformOrigin: "left bottom",
                  }}
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Clapper body */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: P.cream,
                    borderRadius: "0 0 4px 4px",
                  }}
                />
                {/* Text on clapper */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: 18,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "7px",
                    fontWeight: 700,
                    color: P.theater,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}>
                    scene v
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.h3
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                fontWeight: 500,
                fontStyle: "italic",
                color: P.cream,
                textShadow: `0 0 20px rgba(212,160,23,0.3)`,
                textAlign: "center",
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
                className="relative overflow-hidden rounded-full px-10 py-4"
                style={{
                  background: `linear-gradient(135deg, ${P.crimson}, ${P.velvet})`,
                  border: `1px solid rgba(212,160,23,0.3)`,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: P.cream,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: `0 0 30px rgba(196,30,58,0.3), 0 0 60px rgba(212,160,23,0.1)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 40px rgba(196,30,58,0.5), 0 0 80px rgba(212,160,23,0.2)`,
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
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                  }}
                />
                <span className="relative z-10">Yes, I&apos;ll be there</span>
              </motion.button>

              {/* No button — gets "CUT!" */}
              <AnimatePresence>
                {!noHidden && (
                  <motion.button
                    key={`no-${noCount}`}
                    onClick={handleNo}
                    className="relative overflow-hidden rounded-full px-8 py-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.3)",
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

            {/* CUT! rejection message */}
            <AnimatePresence mode="wait">
              {noCount > 0 && noCount <= 4 && (
                <motion.p
                  key={`msg-${noCount}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 0.6, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: P.crimson,
                    letterSpacing: "0.1em",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {CUT_MESSAGES[noCount - 1]}
                </motion.p>
              )}
            </AnimatePresence>

            {/* After No disappears */}
            {noHidden && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: P.gold,
                  letterSpacing: "0.1em",
                }}
              >
                that&apos;s not in the script ✦
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="flex flex-col items-center gap-6 relative z-10 text-center"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: P.gold,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
            >
              and that&apos;s a wrap
            </motion.p>

            <motion.h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2rem, 7vw, 3rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: P.cream,
                textShadow: `0 0 40px rgba(212,160,23,0.4)`,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              See you on set
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)` }}
            />

            <motion.p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: P.cream,
                opacity: 0.7,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2 }}
            >
              — {senderName}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FILM GRAIN OVERLAY
// ─────────────────────────────────────────────

function FilmGrain() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
      }}
      animate={{
        opacity: [0.3, 0.5, 0.3, 0.4, 0.3],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

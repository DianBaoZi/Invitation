"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────

type Phase = "countdown" | "curtain" | "content";

const P = {
  theater: "#0a0a0a",
  velvet: "#8b1a2b",
  crimson: "#c41e3a",
  gold: "#d4a017",
  goldLight: "#f5c842",
  cream: "#f5e6d0",
  spotlight: "#fff8e7",
  dimText: "rgba(255,255,255,0.3)",
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
  const [phase, setPhase] = useState<Phase>("countdown");
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    // Hollywood premiere - gold stars rain down like an award show

    // Initial spotlight burst (gold explosion)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#d4a017", "#f5c842", "#fff8e7"],
      shapes: ["star"],
      scalar: 2,
      gravity: 0.6,
    });

    // Red carpet side flourishes
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 45,
        origin: { x: 0, y: 0.7 },
        colors: ["#c41e3a", "#8b1a2b", "#d4a017"],
        shapes: ["circle"],
        scalar: 1.2,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 45,
        origin: { x: 1, y: 0.7 },
        colors: ["#c41e3a", "#8b1a2b", "#d4a017"],
        shapes: ["circle"],
        scalar: 1.2,
      });
    }, 200);

    // Gold star rain from top (like Oscar confetti)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 270,
        spread: 100,
        origin: { y: 0, x: 0.5 },
        colors: ["#d4a017", "#f5c842"],
        shapes: ["star"],
        scalar: 1.8,
        gravity: 1,
        ticks: 200,
      });
    }, 350);

    // Final cream/gold shimmer
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 140,
        origin: { y: 0.4 },
        colors: ["#f5e6d0", "#d4a017", "#f5c842"],
        shapes: ["star", "circle"],
        scalar: 1.3,
        gravity: 0.7,
      });
    }, 550);
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ background: P.theater }}
    >
      {/* Film grain overlay — persistent */}
      <FilmGrain />

      {/* Vignette — persistent */}
      <div
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Phase 1: Auto countdown (3 seconds) */}
      <AnimatePresence>
        {phase === "countdown" && (
          <CountdownScene
            key="countdown"
            senderName={senderName}
            onComplete={() => setPhase("curtain")}
          />
        )}
      </AnimatePresence>

      {/* Phase 2: Curtain drag interaction */}
      <AnimatePresence>
        {phase === "curtain" && (
          <CurtainScene
            key="curtain"
            message={message}
            onRevealed={() => setPhase("content")}
          />
        )}
      </AnimatePresence>

      {/* Phase 3: Scroll-driven content (ticket, credits, RSVP) */}
      {phase === "content" && (
        <ScrollContent
          date={date}
          time={time}
          location={location}
          personalMessage={personalMessage}
          accepted={accepted}
          onAccept={handleAccept}
          senderName={senderName}
          message={message}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PHASE 1: COUNTDOWN (auto 3-2-1, then title)
// ─────────────────────────────────────────────

function CountdownScene({
  senderName,
  onComplete,
}: {
  senderName: string;
  onComplete: () => void;
}) {
  const [count, setCount] = useState(3);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setCount(2), 800);
    const t2 = setTimeout(() => setCount(1), 1600);
    const t3 = setTimeout(() => setCount(0), 2400);
    const t4 = setTimeout(() => setShowTitle(true), 3000);
    const t5 = setTimeout(() => onComplete(), 4800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-10"
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      {/* Film leader circle */}
      {count > 0 && (
        <div className="relative">
          <motion.div
            className="w-48 h-48 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: P.cream }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
          >
            <div
              className="absolute w-full h-px"
              style={{ background: `linear-gradient(90deg, transparent 10%, ${P.cream}40 30%, ${P.cream}40 70%, transparent 90%)` }}
            />
            <div
              className="absolute h-full w-px"
              style={{ background: `linear-gradient(180deg, transparent 10%, ${P.cream}40 30%, ${P.cream}40 70%, transparent 90%)` }}
            />
          </motion.div>

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

      {/* Title card */}
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
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHASE 2: CURTAIN DRAG (physical interaction)
// ─────────────────────────────────────────────

function CurtainScene({
  message,
  onRevealed,
}: {
  message: string;
  onRevealed: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Track drag progress (0 = closed, 1 = fully open)
  const dragProgress = useMotionValue(0);
  const leftX = useTransform(dragProgress, [0, 1], ["0%", "-100%"]);
  const rightX = useTransform(dragProgress, [0, 1], ["0%", "100%"]);
  const spotlightOpacity = useTransform(dragProgress, [0, 0.5, 1], [0, 0.05, 0.15]);
  const contentOpacity = useTransform(dragProgress, [0.3, 0.8], [0, 1]);

  // Drag state
  const dragStartX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (revealed) return;
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setShowHint(false);
  }, [revealed]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || dragStartX.current === null || revealed) return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const dx = Math.abs(e.clientX - dragStartX.current);
    const progress = Math.min(dx / (width * 0.35), 1);
    dragProgress.set(progress);

    // Snap open if dragged past threshold
    if (progress > 0.6) {
      setRevealed(true);
      setIsDragging(false);
      dragStartX.current = null;
    }
  }, [isDragging, revealed, dragProgress]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartX.current = null;

    // If not past threshold, snap back
    if (!revealed && dragProgress.get() <= 0.6) {
      // Animate back to closed
      const current = dragProgress.get();
      const snap = () => {
        const val = dragProgress.get();
        if (val > 0.01) {
          dragProgress.set(val * 0.85);
          requestAnimationFrame(snap);
        } else {
          dragProgress.set(0);
          setShowHint(true);
        }
      };
      if (current > 0) requestAnimationFrame(snap);
    }
  }, [isDragging, revealed, dragProgress]);

  // When revealed, animate to fully open
  useEffect(() => {
    if (!revealed) return;
    const animate = () => {
      const val = dragProgress.get();
      if (val < 0.99) {
        dragProgress.set(val + (1 - val) * 0.12);
        requestAnimationFrame(animate);
      } else {
        dragProgress.set(1);
      }
    };
    requestAnimationFrame(animate);
  }, [revealed, dragProgress]);

  // Typewriter effect after curtains revealed
  useEffect(() => {
    if (!revealed) return;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedChars((c) => {
          if (c >= message.length) {
            clearInterval(interval);
            // Auto-advance to content after reading time
            setTimeout(() => onRevealed(), 1800);
            return c;
          }
          return c + 1;
        });
      }, 70);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(delay);
  }, [revealed, message.length, onRevealed]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-10 select-none"
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6 }}
    >
      {/* Spotlight beam — intensifies with curtain opening */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          opacity: spotlightOpacity,
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
          x: leftX,
          width: "52%",
          background: `linear-gradient(135deg, #4a0e1a 0%, ${P.velvet} 30%, #6b1525 60%, ${P.velvet} 100%)`,
          boxShadow: "inset -20px 0 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Curtain fold lines */}
        <div className="absolute inset-0 opacity-20" style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 25%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 26%, transparent 26%, transparent 50%)`,
        }} />
        {/* Gold fringe */}
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{
          background: `repeating-linear-gradient(90deg, ${P.gold}60, ${P.gold}60 3px, transparent 3px, transparent 8px)`,
        }} />
        {/* Grip indicator on inner edge */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
        </div>
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 z-20"
        style={{
          x: rightX,
          width: "52%",
          background: `linear-gradient(225deg, #4a0e1a 0%, ${P.velvet} 30%, #6b1525 60%, ${P.velvet} 100%)`,
          boxShadow: "inset 20px 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute inset-0 opacity-20" style={{
          background: `repeating-linear-gradient(90deg, transparent, transparent 25%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.15) 26%, transparent 26%, transparent 50%)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-4" style={{
          background: `repeating-linear-gradient(90deg, ${P.gold}60, ${P.gold}60 3px, transparent 3px, transparent 8px)`,
        }} />
        {/* Grip indicator on inner edge */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 opacity-40">
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
          <div className="w-1 h-6 rounded-full" style={{ background: P.gold }} />
        </div>
      </motion.div>

      {/* Gold curtain rod */}
      <div
        className="absolute top-0 left-0 right-0 h-3 z-30"
        style={{
          background: `linear-gradient(180deg, ${P.goldLight}, ${P.gold}, #8b6914)`,
          boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
        }}
      />

      {/* Center content — behind curtains */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 z-10"
        style={{ opacity: contentOpacity }}
      >
        <div className="text-center max-w-[280px] md:max-w-md">
          {/* Decorative ornament */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={revealed ? { opacity: 0.6, scale: 1 } : {}}
            transition={{ delay: 0.3, type: "spring" }}
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
            {revealed ? (
              <>
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
              </>
            ) : null}
          </h2>

          {/* Bottom ornament */}
          {typedChars >= message.length && revealed && (
            <motion.div
              className="mt-8 flex justify-center gap-3 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${P.gold})` }} />
              <span style={{ color: P.gold, fontSize: "10px" }}>✦</span>
              <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${P.gold}, transparent)` }} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Drag hint */}
      <AnimatePresence>
        {showHint && !revealed && (
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Animated drag arrows */}
            <div className="flex items-center gap-8">
              <motion.span
                animate={{ x: [-4, -12, -4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: P.gold, fontSize: "18px", opacity: 0.6 }}
              >
                ‹
              </motion.span>
              <motion.span
                animate={{ x: [4, 12, 4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ color: P.gold, fontSize: "18px", opacity: 0.6 }}
              >
                ›
              </motion.span>
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12px",
                color: P.gold,
                letterSpacing: "0.2em",
                opacity: 0.6,
              }}
            >
              drag to open curtains
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PHASE 3: SCROLL-DRIVEN CONTENT
// ─────────────────────────────────────────────

function ScrollContent({
  date,
  time,
  location,
  personalMessage,
  accepted,
  onAccept,
  senderName,
  message,
}: {
  date: string;
  time: string;
  location: string;
  personalMessage: string;
  accepted: boolean;
  onAccept: () => void;
  senderName: string;
  message: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative z-10"
    >
      {/* Opening spotlight glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60%",
          height: "100%",
          background: `linear-gradient(180deg, ${P.spotlight}15 0%, transparent 60%)`,
          clipPath: "polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)",
        }}
      />

      {/* Section 1: Feature message (visible on load) */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center max-w-[280px] md:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <span style={{ color: P.gold, fontSize: "20px" }}>✦</span>
          </motion.div>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
              fontWeight: 500,
              fontStyle: "italic",
              color: P.cream,
              lineHeight: 1.3,
              textShadow: `0 0 30px rgba(212,160,23,0.3), 0 2px 4px rgba(0,0,0,0.5)`,
            }}
          >
            {message}
          </h2>

          <motion.div
            className="mt-6 flex justify-center gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.8 }}
          >
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${P.gold})` }} />
            <span style={{ color: P.gold, fontSize: "10px" }}>✦</span>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, ${P.gold}, transparent)` }} />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-16"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                color: P.gold,
                letterSpacing: "0.2em",
                opacity: 0.4,
              }}
            >
              scroll down
            </p>
            <motion.div
              className="mx-auto mt-2"
              style={{
                width: 1,
                height: 24,
                background: `linear-gradient(180deg, ${P.gold}60, transparent)`,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Section 2: Movie Ticket */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          className="relative w-full max-w-[340px]"
          initial={{ y: 100, opacity: 0, rotateX: 20 }}
          whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                border: `1px solid ${P.gold}15`,
                boxShadow: `inset 0 0 30px rgba(212,160,23,0.05)`,
              }}
            />

            {/* Header */}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
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

            {/* Perforated line */}
            <div className="relative mx-4 my-2">
              <div
                style={{
                  height: 1,
                  backgroundImage: `repeating-linear-gradient(90deg, ${P.gold}40 0px, ${P.gold}40 6px, transparent 6px, transparent 12px)`,
                }}
              />
              <div
                className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                style={{ background: P.theater }}
              />
              <div
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                style={{ background: P.theater }}
              />
            </div>

            {/* Details */}
            <div className="px-6 py-5 space-y-5">
              {[
                { label: "date", value: date, delay: 0.4 },
                { label: "showtime", value: time, delay: 0.6 },
                { label: "venue", value: location, delay: 0.8 },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.6 }}
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
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      color: P.cream,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Barcode decoration */}
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
            initial={{ opacity: 0 }}
            whileInView={{
              opacity: [0, 1, 0],
              boxShadow: [
                `0 0 0px rgba(212,160,23,0)`,
                `0 0 40px rgba(212,160,23,0.2), 0 0 80px rgba(212,160,23,0.08)`,
                `0 0 0px rgba(212,160,23,0)`,
              ],
            }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Section 3: Credits / Personal Message */}
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 md:px-8 py-20">
        <motion.div
          className="max-w-[280px] md:max-w-md text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
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

          <motion.div
            className="mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}80, transparent)` }}
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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

          <motion.div
            className="mx-auto mt-8"
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 1 }}
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${P.gold}80, transparent)` }}
          />

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.5, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <span style={{ color: P.gold, fontSize: "16px" }}>✦</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Section 4: RSVP */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 md:px-8 py-20">
        <RSVPSection accepted={accepted} onAccept={onAccept} senderName={senderName} />
      </div>

      {/* Bottom padding */}
      <div className="h-20" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// RSVP SECTION
// ─────────────────────────────────────────────

function RSVPSection({
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
    >
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="ask"
            className="flex flex-col items-center gap-6"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
          >
            {/* Clapperboard icon */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-2"
            >
              <div className="relative" style={{ width: 64, height: 52 }}>
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0, height: 16,
                    background: `repeating-linear-gradient(135deg, ${P.cream} 0px, ${P.cream} 8px, ${P.theater} 8px, ${P.theater} 16px)`,
                    borderRadius: "4px 4px 0 0",
                    transformOrigin: "left bottom",
                  }}
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 14, left: 0, right: 0, bottom: 0,
                    background: P.cream,
                    borderRadius: "0 0 4px 4px",
                  }}
                />
                <div
                  className="absolute flex items-center justify-center"
                  style={{ top: 18, left: 0, right: 0, bottom: 0 }}
                >
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "7px", fontWeight: 700,
                    color: P.theater, letterSpacing: "0.15em", textTransform: "uppercase",
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
                fontWeight: 500, fontStyle: "italic",
                color: P.cream,
                textShadow: `0 0 20px rgba(212,160,23,0.3)`,
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              So, what do you say?
            </motion.h3>

            {/* Buttons */}
            <div className="flex items-center gap-5">
              <motion.button
                onClick={onAccept}
                className="relative overflow-hidden rounded-full px-6 md:px-10 py-4"
                style={{
                  background: `linear-gradient(135deg, ${P.crimson}, ${P.velvet})`,
                  border: `1px solid rgba(212,160,23,0.3)`,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.1rem", fontWeight: 600,
                  color: P.cream, letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: `0 0 30px rgba(196,30,58,0.3), 0 0 60px rgba(212,160,23,0.1)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 40px rgba(196,30,58,0.5), 0 0 80px rgba(212,160,23,0.2)`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                  }}
                />
                <span className="relative z-10">Yes, I&apos;ll be there</span>
              </motion.button>

              <AnimatePresence>
                {!noHidden && (
                  <motion.button
                    key={`no-${noCount}`}
                    onClick={handleNo}
                    className="relative overflow-hidden rounded-full px-4 md:px-8 py-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem", fontWeight: 400,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.05em", cursor: "pointer",
                    }}
                    initial={noCount > 0 ? { scale: 0, rotate: 180, opacity: 0, filter: "blur(8px)" } : { opacity: 0, y: 20 }}
                    animate={{ scale: 1 - noCount * 0.15, rotate: 0, opacity: 1 - noCount * 0.2, y: 0, filter: "blur(0px)" }}
                    exit={{ scale: 0, rotate: -360, opacity: 0, filter: "blur(12px)" }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    whileHover={{ scale: Math.max(0.5, 1 - noCount * 0.15 - 0.05) }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <span className="relative z-10">No</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* CUT! messages */}
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
                    fontSize: "12px", color: P.crimson,
                    letterSpacing: "0.1em", textAlign: "center", fontWeight: 600,
                  }}
                >
                  {CUT_MESSAGES[noCount - 1]}
                </motion.p>
              )}
            </AnimatePresence>

            {noHidden && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.5, y: 0 }}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px", color: P.gold, letterSpacing: "0.1em",
                }}
              >
                that&apos;s not in the script ✦
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px", letterSpacing: "0.4em",
                textTransform: "uppercase", color: P.gold,
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
                fontWeight: 600, fontStyle: "italic",
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
                fontSize: "1.1rem", fontStyle: "italic",
                color: P.cream, opacity: 0.7,
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

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface LoveLetterMailboxProps {
  message?: string;
  plan?: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  senderName?: string;
  personalMessage?: string;
}

type Screen = "mailbox" | "reveal";

export function LoveLetterMailbox({
  message = "I've been wanting to ask you this...",
  plan = "Valentine's Dinner",
  date = "Feb 14th @ 7:30 PM",
  location = "The Little Italian Place",
  imageUrl,
  senderName = "Someone Special",
  personalMessage = "You make every moment feel like a fairytale. I can't imagine spending this day with anyone else.",
}: LoveLetterMailboxProps) {
  const [screen, setScreen] = useState<Screen>("mailbox");
  const [mailboxOpen, setMailboxOpen] = useState(false);

  const handleMailboxTap = () => {
    if (mailboxOpen) return;
    setMailboxOpen(true);
    setTimeout(() => setScreen("reveal"), 800);
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 30%, #f5d6d6 100%)" }}
    >
      {/* Scattered hearts bg */}
      <ScatteredHearts />

      <AnimatePresence mode="wait">
        {screen === "mailbox" && (
          <MailboxScreen key="mailbox" isOpen={mailboxOpen} onTap={handleMailboxTap} />
        )}
        {screen === "reveal" && (
          <RevealScreen
            key="reveal"
            message={message}
            plan={plan}
            date={date}
            location={location}
            imageUrl={imageUrl}
            senderName={senderName}
            personalMessage={personalMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAILBOX SCREEN
// ============================================

function MailboxScreen({ isOpen, onTap }: { isOpen: boolean; onTap: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
      onClick={onTap}
    >
      <FallingPetals />

      {/* Soft ambient glow */}
      <motion.div
        className="absolute"
        style={{
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(233,30,99,0.12) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Envelope with wax seal */}
      <motion.div
        animate={isOpen ? { scale: 1.05 } : { y: [0, -8, 0] }}
        transition={isOpen ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-10"
      >
        {/* Ground shadow */}
        <motion.div
          className="absolute -bottom-8 left-1/2"
          style={{
            width: "180px",
            height: "14px",
            borderRadius: "50%",
            background: "rgba(136,14,79,0.08)",
            transform: "translateX(-50%)",
            filter: "blur(6px)",
          }}
          animate={isOpen ? {} : { scaleX: [1, 0.8, 1], opacity: [0.25, 0.1, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative" style={{ width: "220px", height: "160px" }}>
          {/* Envelope body */}
          <div
            className="absolute inset-0 rounded-xl"
            style={{
              background: "linear-gradient(160deg, #fffafa 0%, #fff0f3 30%, #fce4ec 100%)",
              boxShadow: "0 20px 60px rgba(136,14,79,0.12), 0 8px 20px rgba(0,0,0,0.06)",
              border: "1px solid rgba(244,143,177,0.2)",
            }}
          />

          {/* Inner envelope texture */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(244,143,177,0.06) 28px,
                rgba(244,143,177,0.06) 29px
              )`,
            }}
          />

          {/* Envelope flap with opening animation */}
          <motion.div
            className="absolute -top-px left-0 right-0 origin-top"
            style={{
              height: "80px",
              background: "linear-gradient(180deg, #f8bbd0 0%, #fce4ec 80%)",
              clipPath: "polygon(0 0, 50% 90%, 100% 0)",
              filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.04))",
              zIndex: isOpen ? 0 : 2,
            }}
            animate={isOpen ? { rotateX: 180, opacity: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Wax seal */}
          <motion.div
            className="absolute left-1/2 flex items-center justify-center"
            style={{
              top: "42px",
              transform: "translateX(-50%)",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #ef5350 0%, #c62828 50%, #7f0000 100%)",
              boxShadow: "0 4px 14px rgba(127,0,0,0.35), inset 0 -2px 5px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.12)",
              zIndex: 3,
            }}
            animate={
              isOpen
                ? { scale: 0, opacity: 0, rotate: 45 }
                : { scale: [1, 1.08, 1] }
            }
            transition={
              isOpen
                ? { duration: 0.4, ease: "easeIn" }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span style={{ fontSize: "22px", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))", color: "#ffcdd2" }}>♥</span>
          </motion.div>

          {/* Peeking letter when opening */}
          <motion.div
            className="absolute left-3 right-3 rounded-t-lg"
            style={{
              bottom: "20px",
              height: "80px",
              background: "linear-gradient(180deg, #fff 0%, #fff5f5 100%)",
              boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
              borderTop: "1px solid rgba(244,143,177,0.15)",
              zIndex: 1,
            }}
            initial={{ y: 0 }}
            animate={isOpen ? { y: -60 } : { y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            {/* Letter lines */}
            <div className="pt-4 px-4 space-y-2">
              <div className="h-1 rounded-full bg-rose-100 w-3/4" />
              <div className="h-1 rounded-full bg-rose-100 w-1/2" />
              <div className="h-1 rounded-full bg-rose-100 w-2/3" />
            </div>
          </motion.div>

          {/* Decorative bottom corner flourish */}
          <div
            className="absolute bottom-3 right-4 opacity-10"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: "12px", color: "#880e4f" }}
          >
            xoxo
          </div>
        </div>

        {/* Pulse ring when not opened */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ top: "0", left: "0", width: "220px", height: "160px" }}
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(233,30,99,0)",
                "0 0 0 15px rgba(233,30,99,0.08)",
                "0 0 0 0px rgba(233,30,99,0)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {/* Text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-3xl mb-2 text-center"
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontWeight: 700,
          color: "#880e4f",
          textShadow: "0 1px 8px rgba(136,14,79,0.1)",
        }}
      >
        {isOpen ? "Opening your letter..." : "You've got mail"}
      </motion.h1>

      {!isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-sm"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: "#ad1457",
            letterSpacing: "0.02em",
          }}
        >
          Tap to break the seal
        </motion.p>
      )}

      {!isOpen && (
        <motion.div
          className="mt-5"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c2185b"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================
// SCREEN 3: REVEAL & SCROLL
// ============================================

function RevealScreen({
  message,
  plan,
  date,
  location,
  imageUrl,
  senderName,
  personalMessage,
}: {
  message: string;
  plan: string;
  date: string;
  location: string;
  imageUrl?: string;
  senderName: string;
  personalMessage: string;
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRSVP = () => {
    setShowSuccess(true);
    // Rose petals falling - soft romantic pinks like flower petals
    const petalColors = ["#f8bbd0", "#f48fb1", "#f06292", "#ec407a", "#fff0f5"];

    // Initial soft burst (like petals scattering)
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: petalColors,
      shapes: ["circle"],
      scalar: 1.8,
      gravity: 0.4,
      drift: 1,
      ticks: 200,
    });

    // Rose petals falling from top
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 270,
        spread: 120,
        origin: { y: 0, x: 0.3 },
        colors: petalColors,
        shapes: ["circle"],
        scalar: 1.5,
        gravity: 0.5,
        drift: 0.5,
        ticks: 250,
      });
      confetti({
        particleCount: 40,
        angle: 270,
        spread: 120,
        origin: { y: 0, x: 0.7 },
        colors: petalColors,
        shapes: ["circle"],
        scalar: 1.5,
        gravity: 0.5,
        drift: -0.5,
        ticks: 250,
      });
    }, 200);

    // Final gentle shimmer
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 160,
        origin: { y: 0.3 },
        colors: ["#fff0f5", "#fce4ec", "#f8bbd0"],
        shapes: ["circle"],
        scalar: 1.2,
        gravity: 0.35,
        ticks: 180,
      });
    }, 450);
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center px-6 relative z-10"
      >
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl md:text-7xl mb-6"
          >
            💕
          </motion.div>
          <h2
            className="text-3xl font-bold text-rose-800 mb-3"
            style={{ fontFamily: "Georgia, serif" }}
          >
            It's a date!
          </h2>
          <p className="text-rose-500" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            Can't wait to see you there...
          </p>
        </div>
      </motion.div>
    );
  }

  // Card 1: Drops in from above with a bounce
  const cardDramaticDrop = {
    hidden: { opacity: 0, y: -150, scale: 0.5, rotate: 12, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.3,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        scale: { type: "spring", stiffness: 180, damping: 14, delay: 0.05 },
        rotate: { type: "spring", stiffness: 120, damping: 10 },
      },
    },
  };

  // Card 2: Sweeps in from the right with spin
  const cardDramaticSweep = {
    hidden: { opacity: 0, x: 200, scale: 0.5, rotate: 15, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        scale: { type: "spring", stiffness: 200, damping: 15, delay: 0.1 },
        rotate: { type: "spring", stiffness: 140, damping: 11 },
      },
    },
  };

  // Card 4: Scales up from tiny with dramatic blur-to-sharp
  const cardDramaticReveal = {
    hidden: { opacity: 0, y: 120, scale: 0.6, rotate: -8, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        scale: { type: "spring", stiffness: 200, damping: 15, delay: 0.1 },
        rotate: { type: "spring", stiffness: 150, damping: 12 },
      },
    },
  };

  // Card 5: Flips in from below with 3D rotation
  const cardDramaticFlip = {
    hidden: { opacity: 0, y: 160, scale: 0.4, rotateX: 40, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        scale: { type: "spring", stiffness: 160, damping: 13, delay: 0.1 },
        rotateX: { type: "spring", stiffness: 100, damping: 12 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10"
      style={{ perspective: "1000px" }}
    >
      {/* Ribbon trail connecting cards */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 z-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #f48fb1 10%, #f48fb1 90%, transparent 100%)",
          opacity: 0.3,
        }}
      />

      <div className="max-w-[280px] md:max-w-sm mx-auto relative z-10">
        {/* Card 1: Valentine Header — takes full viewport to force scroll */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-12">
          <motion.div
            variants={cardDramaticDrop}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="rounded-2xl overflow-hidden w-full relative"
            style={{ boxShadow: "0 8px 30px rgba(233,30,99,0.12)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [0, 0.6, 0],
                boxShadow: [
                  "0 0 0px rgba(233,30,99,0)",
                  "0 0 40px rgba(233,30,99,0.4), 0 0 80px rgba(233,30,99,0.2)",
                  "0 0 0px rgba(233,30,99,0)",
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
            />
            <img
              src="/images/valentine-header.png"
              alt="Happy Valentine's Day"
              className="w-full h-auto object-cover"
            />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-8"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c2185b" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 10l5 5 5-5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Ribbon connector */}
        <div className="px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <RibbonDot />
          </motion.div>
        </div>

        {/* Card 2: Details Card — full viewport */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-12">
          <motion.div
            variants={cardDramaticSweep}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl overflow-hidden relative w-full"
            style={{ boxShadow: "0 8px 30px rgba(233,30,99,0.12)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [0, 0.6, 0],
                boxShadow: [
                  "0 0 0px rgba(233,30,99,0)",
                  "0 0 40px rgba(233,30,99,0.4), 0 0 80px rgba(233,30,99,0.2)",
                  "0 0 0px rgba(233,30,99,0)",
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
            />
            <img
              src="/images/valentine-card2.png"
              alt="Valentine's Card"
              className="w-full h-auto"
            />
            {/* Overlay dynamic fields on the card image */}
            <div className="absolute inset-0">
              <p
                className="absolute truncate"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(7px, 2vw, 11px)",
                  color: "#c62828",
                  bottom: "31%",
                  left: "35%",
                  right: "10%",
                }}
              >
                {date}
              </p>
              <p
                className="absolute truncate"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(7px, 2vw, 11px)",
                  color: "#c62828",
                  bottom: "18%",
                  left: "30%",
                  right: "10%",
                }}
              >
                {location}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <RibbonDot />
          </motion.div>
        </div>

        {/* Card 4: Personal Message — full viewport */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-12">
          <motion.div
            variants={cardDramaticReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl overflow-hidden relative w-full"
            style={{ boxShadow: "0 8px 30px rgba(233,30,99,0.12)" }}
          >
            {/* Glow pulse after reveal */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [0, 0.6, 0],
                boxShadow: [
                  "0 0 0px rgba(233,30,99,0)",
                  "0 0 40px rgba(233,30,99,0.4), 0 0 80px rgba(233,30,99,0.2)",
                  "0 0 0px rgba(233,30,99,0)",
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
            />
            <img
              src="/images/fourth-card.png"
              alt="Personal Message Card"
              className="w-full h-auto"
            />
            {/* Personal message overlay — positioned below the hearts, can overflow card */}
            <div
              className="absolute"
              style={{
                top: "38%",
                left: "18%",
                right: "15%",
                bottom: "10%",
              }}
            >
              <p
                className="whitespace-pre-line break-words overflow-hidden"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(11px, 3vw, 16px)",
                  color: "#fff0f3",
                  lineHeight: 1.7,
                  textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                {personalMessage}
              </p>
            </div>
          </motion.div>
        </div>

        <div className="px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <RibbonDot />
          </motion.div>
        </div>

        {/* Card 5: RSVP — full viewport */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-12">
          <motion.div
            variants={cardDramaticFlip}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl overflow-hidden relative w-full"
            style={{ boxShadow: "0 8px 30px rgba(233,30,99,0.15)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              initial={{ opacity: 0 }}
              whileInView={{
                opacity: [0, 0.6, 0],
                boxShadow: [
                  "0 0 0px rgba(233,30,99,0)",
                  "0 0 40px rgba(233,30,99,0.4), 0 0 80px rgba(233,30,99,0.2)",
                  "0 0 0px rgba(233,30,99,0)",
                ],
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
            />
            {/* Decorative background */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(165deg, #fff5f7 0%, #fff 40%, #fff5f7 100%)",
              }}
            />

            {/* Subtle floral corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 opacity-[0.06]"
              style={{
                background: "radial-gradient(ellipse at top left, #e91e63, transparent 70%)",
              }}
            />
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-[0.06]"
              style={{
                background: "radial-gradient(ellipse at bottom right, #e91e63, transparent 70%)",
              }}
            />

            <div className="relative px-7 py-10 text-center">
              {/* Decorative divider top */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-rose-200" />
                <span className="text-rose-300 text-xs">♥</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-rose-200" />
              </div>

              <p
                className="text-lg mb-1"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 700,
                  color: "#880e4f",
                }}
              >
                So, what do you say?
              </p>
              <p
                className="text-xs mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: "#c2185b",
                  opacity: 0.6,
                }}
              >
                Your presence would mean the world
              </p>

              {/* Hold-to-confirm RSVP button */}
              <HoldToConfirmButton onConfirm={handleRSVP} />

              {/* Shy decline */}
              <RSVPDeclineButton />

              {/* Decorative divider bottom */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-rose-200" />
                <span className="text-rose-300 text-xs">♥</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-rose-200" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </motion.div>
  );
}

// ============================================
// RSVP BUTTONS (shy "Can't Make It")
// ============================================

function HoldToConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [completed, setCompleted] = useState(false);
  const holdingRef = useRef(false);
  const completedRef = useRef(false);

  const holdDuration = 1500;
  const intervalMs = 30;

  const startHold = useCallback(() => {
    if (completedRef.current) return;
    holdingRef.current = true;
    setIsHolding(true);
  }, []);

  const endHold = useCallback(() => {
    if (completedRef.current) return;
    holdingRef.current = false;
    setIsHolding(false);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (completedRef.current) return;
      setProgress((prev) => {
        if (holdingRef.current) {
          const next = Math.min(prev + (intervalMs / holdDuration) * 100, 100);
          if (next >= 100) {
            completedRef.current = true;
            holdingRef.current = false;
            setCompleted(true);
            setIsHolding(false);
            setTimeout(() => onConfirm(), 300);
            return 100;
          }
          return next;
        }
        return Math.max(0, prev - 0.8);
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [onConfirm]);

  const heartScale = 1 + progress * 0.005;
  const glowIntensity = progress * 0.4;
  const circumference = 2 * Math.PI * 42;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Heart button */}
      <motion.button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        className="relative w-24 h-24 flex items-center justify-center select-none"
        animate={{
          scale: completed ? [1.3, 1] : isHolding ? 0.92 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(233,30,99,${glowIntensity * 0.15}) 0%, transparent 70%)`,
            transform: `scale(${1 + progress * 0.01})`,
          }}
        />

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48" cy="48" r="42"
            fill="none"
            stroke="rgba(233,30,99,0.1)"
            strokeWidth="3"
          />
          <circle
            cx="48" cy="48" r="42"
            fill="none"
            stroke="#e91e63"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 50ms linear" }}
          />
        </svg>

        {/* Heart emoji */}
        <motion.span
          className="text-4xl relative z-10"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity * 12}px rgba(233,30,99,0.5))`,
          }}
          animate={{
            scale: completed ? [1.5, 1] : heartScale,
            rotate: completed ? [0, -10, 10, 0] : 0,
          }}
          transition={completed ? { duration: 0.5 } : { type: "spring", stiffness: 300 }}
        >
          {completed ? "💕" : progress > 50 ? "❤️" : "🤍"}
        </motion.span>
      </motion.button>

      {/* Dynamic label */}
      <motion.p
        className="text-sm"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          color: progress > 0 ? "#e91e63" : "#880e4f",
          letterSpacing: "0.05em",
        }}
        animate={{ opacity: completed ? 0 : 1 }}
      >
        {progress > 70
          ? "Almost there..."
          : progress > 30
            ? "Keep holding!"
            : isHolding
              ? "Filling with love..."
              : "Hold to say yes"}
      </motion.p>
    </div>
  );
}

function RSVPDeclineButton() {
  const [attempts, setAttempts] = useState(0);
  const [fallingHearts, setFallingHearts] = useState<{ id: number; x: number; delay: number }[]>([]);
  const [sealed, setSealed] = useState(false);

  const handleDeclineApproach = () => {
    if (sealed) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Add falling hearts each attempt
    const newHearts = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: -30 + Math.random() * 60, // spread around center
      delay: i * 0.1,
    }));
    setFallingHearts((prev) => [...prev, ...newHearts]);

    // After 4 attempts, seal it with a kiss
    if (newAttempts >= 4) {
      setSealed(true);
    }
  };

  return (
    <div className="relative h-12 mt-4 flex items-center justify-center">
      {/* The button */}
      <motion.button
        className="relative px-5 py-2 rounded-full text-xs whitespace-nowrap z-10"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          color: "#e0a0b0",
          letterSpacing: "0.03em",
          background: "rgba(255,245,247,0.8)",
          border: "1px dashed rgba(233,30,99,0.2)",
        }}
        animate={{
          opacity: sealed ? 0 : Math.max(0.4, 1 - attempts * 0.15),
          scale: sealed ? 0.8 : 1,
          y: sealed ? 10 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onMouseEnter={handleDeclineApproach}
        onTouchStart={handleDeclineApproach}
      >
        Can&apos;t make it...
      </motion.button>

      {/* Falling paper hearts that pile up */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {fallingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: -20, x: heart.x, opacity: 0, rotate: -20 + Math.random() * 40 }}
            animate={{
              y: 25 + Math.random() * 10,
              opacity: [0, 1, 1],
              rotate: -10 + Math.random() * 20,
            }}
            transition={{
              duration: 0.6,
              delay: heart.delay,
              ease: "easeOut",
            }}
            className="absolute left-1/2 text-sm"
            style={{ color: ["#ffb6c1", "#ff69b4", "#e91e63", "#f8bbd9"][Math.floor(Math.random() * 4)] }}
          >
            {["♥", "♡", "❤"][Math.floor(Math.random() * 3)]}
          </motion.div>
        ))}
      </div>

      {/* Lipstick kiss seal */}
      <AnimatePresence>
        {sealed && (
          <motion.div
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: -8, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="absolute z-20"
            style={{
              fontSize: 32,
              filter: "drop-shadow(0 2px 4px rgba(233,30,99,0.3))",
            }}
          >
            💋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message after sealed */}
      <AnimatePresence>
        {sealed && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#e91e63",
            }}
          >
            sealed with love 💕
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// DECORATIVE ELEMENTS
// ============================================

function FallingPetals() {
  const petals = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: `${5 + (i * 8) % 90}%`,
    delay: i * 0.4,
    duration: 6 + (i % 4) * 1.5,
    size: 8 + (i % 3) * 4,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 10),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: p.left,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50% 0 50% 50%",
            background: `linear-gradient(135deg, rgba(244,143,177,${0.3 + (p.id % 3) * 0.1}) 0%, rgba(233,30,99,${0.15 + (p.id % 3) * 0.08}) 100%)`,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, p.drift, -p.drift / 2, p.drift / 3],
            rotate: [0, 180, 360],
            opacity: [0, 0.6, 0.5, 0],
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

function RibbonDot() {
  return (
    <div className="flex justify-center py-1">
      <div className="w-3 h-3 rounded-full bg-rose-200 border-2 border-white shadow-sm" />
    </div>
  );
}

function ScatteredHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200/30"
          style={{
            left: `${8 + Math.random() * 84}%`,
            top: `${5 + Math.random() * 90}%`,
            fontSize: `${14 + Math.random() * 16}px`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 8, -8, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

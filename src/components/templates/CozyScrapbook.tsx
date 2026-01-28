"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface CozyScrapbookProps {
  message: string;
  senderName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
}

export function CozyScrapbook({
  message,
  senderName = "Someone Special",
  eventDate = "Valentine's Day",
  eventTime = "7:30 PM",
  eventLocation = "Somewhere romantic",
}: CozyScrapbookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [showSuccess, setShowSuccess] = useState(false);
  const [noScale, setNoScale] = useState(1);
  const [noGone, setNoGone] = useState(false);

  const totalPages = 4; // cover + 3 inside pages

  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  }, [currentPage]);

  const goBack = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  }, [currentPage]);

  const handleYes = () => {
    setShowSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#c27256", "#8b9e6b", "#d4a574", "#e8c9a0"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#c27256", "#8b9e6b", "#d4a574"],
      });
    }, 300);
  };

  const handleNoInteract = () => {
    if (noGone) return;
    const newScale = noScale - 0.25;
    if (newScale <= 0.05) {
      setNoGone(true);
    } else {
      setNoScale(newScale);
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#f5ebe0" }}
      >
        <PaperTexture />
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          className="text-center p-10 relative z-10 max-w-sm rounded-lg"
          style={{
            background: "#fdf8f0",
            boxShadow: "0 4px 20px rgba(139,115,85,0.15)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-4"
          >
            💕
          </motion.div>
          <h2
            className="text-2xl mb-2"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#8b6f47",
            }}
          >
            You said yes!
          </h2>
          <p
            className="text-sm"
            style={{ color: "#a08060", fontStyle: "italic" }}
          >
            This is the beginning of something beautiful...
          </p>
        </motion.div>
      </div>
    );
  }

  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#f5ebe0" }}
    >
      <PaperTexture />

      {/* Decorative corner doodles */}
      <div
        className="absolute top-8 left-8 text-4xl opacity-[0.08] select-none"
        style={{ transform: "rotate(-15deg)" }}
      >
        🌿
      </div>
      <div
        className="absolute bottom-8 right-8 text-4xl opacity-[0.08] select-none"
        style={{ transform: "rotate(20deg)" }}
      >
        🌸
      </div>

      {/* Page counter */}
      <motion.div
        className="relative z-20 mb-4 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              width: i === currentPage ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background:
                i === currentPage
                  ? "#c27256"
                  : i < currentPage
                    ? "#d4a574"
                    : "#ddd0c0",
            }}
          />
        ))}
      </motion.div>

      {/* Scrapbook container */}
      <div
        className="relative z-10 w-full max-w-sm"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { type: "spring", stiffness: 200, damping: 30 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.3 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {currentPage === 0 && (
              <CoverPage onOpen={goNext} senderName={senderName} />
            )}
            {currentPage === 1 && <MessagePage message={message} />}
            {currentPage === 2 && (
              <DetailsPage
                senderName={senderName}
                eventDate={eventDate}
                eventTime={eventTime}
                eventLocation={eventLocation}
              />
            )}
            {currentPage === 3 && (
              <RSVPPage
                onYes={handleYes}
                noScale={noScale}
                noGone={noGone}
                onNoInteract={handleNoInteract}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="relative z-20 mt-6 flex items-center gap-6">
        {currentPage > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={goBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#a08060",
              background: "rgba(253,248,240,0.7)",
              border: "1px solid #e8ddd0",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </motion.button>
        )}

        {currentPage < totalPages - 1 && currentPage > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={goNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#fff",
              background: "linear-gradient(135deg, #c27256, #d4856a)",
              boxShadow: "0 3px 10px rgba(194,114,86,0.25)",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Next page
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ============================================
// PAGE: COVER
// ============================================

function CoverPage({
  onOpen,
  senderName,
}: {
  onOpen: () => void;
  senderName: string;
}) {
  return (
    <div className="relative">
      {/* Torn top */}
      <TornEdge position="top" />

      <div
        className="px-8 py-12 text-center"
        style={{ background: "#fdf8f0" }}
      >
        {/* Washi tape */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-20 h-5 opacity-50 z-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, #8b9e6b, #8b9e6b 4px, #9aad7a 4px, #9aad7a 8px)",
            transform: "translateX(-50%) rotate(-2deg)",
          }}
        />

        {/* Pressed flower cluster */}
        <motion.div
          className="mb-6 flex justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span
            className="text-3xl opacity-70"
            style={{ transform: "rotate(-20deg)" }}
          >
            🌿
          </span>
          <span className="text-4xl opacity-80">🌸</span>
          <span
            className="text-3xl opacity-70"
            style={{ transform: "rotate(15deg)" }}
          >
            🍃
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl mb-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "#6b5240",
          }}
        >
          A Little Something
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm mb-1"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#a08060",
            fontStyle: "italic",
          }}
        >
          made just for you
        </motion.p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="w-10 h-px" style={{ background: "#d4c4b0" }} />
          <span style={{ color: "#c27256", fontSize: "12px" }}>♥</span>
          <div className="w-10 h-px" style={{ background: "#d4c4b0" }} />
        </div>

        {/* From label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs mb-8"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#b09878",
          }}
        >
          from {senderName}
        </motion.p>

        {/* Open button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onOpen}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 rounded-full text-white text-sm font-medium"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            background: "linear-gradient(135deg, #c27256, #d4856a)",
            boxShadow:
              "0 4px 15px rgba(194,114,86,0.3), 0 2px 6px rgba(194,114,86,0.2)",
            letterSpacing: "0.05em",
          }}
        >
          Open the scrapbook
        </motion.button>

        {/* Sticker accent */}
        <div
          className="absolute bottom-4 right-6 text-2xl opacity-30 select-none"
          style={{ transform: "rotate(12deg)" }}
        >
          ✿
        </div>
      </div>

      <TornEdge position="bottom" />
    </div>
  );
}

// ============================================
// PAGE: MESSAGE
// ============================================

function MessagePage({ message }: { message: string }) {
  return (
    <div className="relative">
      <TornEdge position="top" />

      <div
        className="px-8 py-10 text-center relative"
        style={{ background: "#fdf8f0" }}
      >
        {/* Corner washi tape */}
        <div
          className="absolute top-2 right-2 w-14 h-4 opacity-40"
          style={{
            background:
              "repeating-linear-gradient(-45deg, #c27256, #c27256 3px, #d4856a 3px, #d4856a 6px)",
            transform: "rotate(35deg)",
          }}
        />

        {/* Decorative quote marks */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl leading-none mb-2 select-none"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "#c27256",
          }}
        >
          &ldquo;
        </motion.div>

        {/* Message on lined paper effect */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative mx-auto max-w-xs mb-6"
        >
          {/* Lined paper background */}
          <div
            className="absolute inset-0 -mx-4 -my-2 rounded-md opacity-30"
            style={{
              background: `repeating-linear-gradient(
                transparent,
                transparent 27px,
                #d4c4b0 27px,
                #d4c4b0 28px
              )`,
              backgroundPositionY: "14px",
            }}
          />

          <p
            className="relative text-xl leading-[28px] py-2"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: "#6b5240",
              lineHeight: "28px",
            }}
          >
            {message}
          </p>
        </motion.div>

        {/* Closing quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl leading-none select-none"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "#c27256",
            transform: "rotate(180deg)",
          }}
        >
          &ldquo;
        </motion.div>

        {/* Pressed leaf */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-6 text-xl select-none"
          style={{ transform: "rotate(-30deg)" }}
        >
          🍂
        </motion.div>
      </div>

      <TornEdge position="bottom" />
    </div>
  );
}

// ============================================
// PAGE: DETAILS (DATE / PLAN)
// ============================================

function DetailsPage({
  senderName,
  eventDate,
  eventTime,
  eventLocation,
}: {
  senderName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}) {
  return (
    <div className="relative">
      <TornEdge position="top" />

      <div
        className="px-8 py-10 text-center relative"
        style={{ background: "#fdf8f0" }}
      >
        {/* Washi tape strip across top */}
        <div
          className="absolute top-3 left-4 right-4 h-4 opacity-30"
          style={{
            background:
              "repeating-linear-gradient(90deg, #8b9e6b, #8b9e6b 8px, transparent 8px, transparent 12px)",
          }}
        />

        {/* Ticket stub style */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 mx-auto max-w-xs relative"
        >
          {/* Ticket */}
          <div
            className="rounded-lg px-6 py-6 relative overflow-hidden"
            style={{
              background: "#fff",
              border: "2px dashed #e0d4c4",
            }}
          >
            {/* Ticket punch holes */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full"
              style={{ background: "#fdf8f0" }}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full"
              style={{ background: "#fdf8f0" }}
            />

            <p
              className="text-xs uppercase tracking-[0.2em] mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#b09878",
                fontWeight: 600,
              }}
            >
              You&apos;re invited to
            </p>

            <h2
              className="text-2xl mb-4"
              style={{
                fontFamily: "'Dancing Script', cursive",
                color: "#c27256",
              }}
            >
              A Special Date
            </h2>

            <div className="space-y-3">
              <DetailRow icon="📅" label="When" value={eventDate} />
              <DetailRow icon="⏰" label="Time" value={eventTime} />
              <DetailRow icon="📍" label="Where" value={eventLocation} />
            </div>

            {/* Stamp */}
            <motion.div
              initial={{ scale: 1.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 0.12, rotate: -12 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="absolute top-3 right-3 text-3xl select-none"
            >
              💌
            </motion.div>
          </div>
        </motion.div>

        {/* Sender note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-xs"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#b09878",
            fontStyle: "italic",
          }}
        >
          — prepared with love by {senderName}
        </motion.p>

        {/* Flower doodle */}
        <div
          className="absolute bottom-3 right-5 text-lg opacity-25 select-none"
          style={{ transform: "rotate(25deg)" }}
        >
          🌼
        </div>
      </div>

      <TornEdge position="bottom" />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-left">
      <span className="text-lg">{icon}</span>
      <div>
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#b09878",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
        <p
          className="text-sm"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "#6b5240",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================
// PAGE: RSVP
// ============================================

function RSVPPage({
  onYes,
  noScale,
  noGone,
  onNoInteract,
}: {
  onYes: () => void;
  noScale: number;
  noGone: boolean;
  onNoInteract: () => void;
}) {
  return (
    <div className="relative">
      <TornEdge position="top" />

      <div
        className="px-8 py-10 text-center relative"
        style={{ background: "#fdf8f0" }}
      >
        {/* Heart garland */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-6 text-sm select-none"
          style={{ color: "#c27256", opacity: 0.4 }}
        >
          ♥ · ♥ · ♥ · ♥ · ♥
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl mb-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: "#6b5240",
          }}
        >
          So, what do you say?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs mb-8"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "#b09878",
            fontStyle: "italic",
          }}
        >
          Your answer means the world to me
        </motion.p>

        {/* Yes button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={onYes}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-3.5 rounded-full text-white text-base font-medium"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              background: "linear-gradient(135deg, #c27256, #d4856a)",
              boxShadow:
                "0 4px 15px rgba(194,114,86,0.3), 0 2px 6px rgba(194,114,86,0.2)",
              letterSpacing: "0.03em",
            }}
          >
            Absolutely ♥
          </motion.button>
        </motion.div>

        {/* No button — shrinks on hover */}
        {!noGone && (
          <motion.button
            animate={{ scale: noScale, opacity: noScale }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onMouseEnter={onNoInteract}
            onTouchStart={onNoInteract}
            className="mt-4 text-sm cursor-pointer bg-transparent border-none block mx-auto"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#c4b5a4",
              fontStyle: "italic",
            }}
          >
            no thanks...
          </motion.button>
        )}

        {/* Corner stickers */}
        <div
          className="absolute bottom-4 left-5 text-xl opacity-25 select-none"
          style={{ transform: "rotate(-10deg)" }}
        >
          🌿
        </div>
        <div
          className="absolute top-4 right-5 text-xl opacity-25 select-none"
          style={{ transform: "rotate(15deg)" }}
        >
          🌸
        </div>
      </div>

      <TornEdge position="bottom" />
    </div>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================

function TornEdge({ position }: { position: "top" | "bottom" }) {
  if (position === "top") {
    return (
      <svg viewBox="0 0 400 20" className="w-full block" preserveAspectRatio="none">
        <path
          d="M0,20 L0,8 Q10,12 20,6 Q30,0 40,4 Q50,10 60,6 Q70,2 80,8 Q90,14 100,6 Q110,0 120,4 Q130,10 140,8 Q150,4 160,6 Q170,12 180,4 Q190,0 200,6 Q210,10 220,4 Q230,0 240,8 Q250,14 260,6 Q270,2 280,8 Q290,12 300,4 Q310,0 320,6 Q330,10 340,8 Q350,4 360,6 Q370,12 380,4 Q390,8 400,6 L400,20 Z"
          fill="#fdf8f0"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 20" className="w-full block" preserveAspectRatio="none">
      <path
        d="M0,0 L0,12 Q10,8 20,14 Q30,20 40,16 Q50,10 60,14 Q70,18 80,12 Q90,6 100,14 Q110,20 120,16 Q130,10 140,12 Q150,16 160,14 Q170,8 180,16 Q190,20 200,14 Q210,10 220,16 Q230,20 240,12 Q250,6 260,14 Q270,18 280,12 Q290,8 300,16 Q310,20 320,14 Q330,10 340,12 Q350,16 360,14 Q370,8 380,16 Q390,12 400,14 L400,0 Z"
        fill="#fdf8f0"
      />
    </svg>
  );
}

function PaperTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

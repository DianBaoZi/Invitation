"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { saveResponse } from "@/lib/api/saveResponse";

// ─────────────────────────────────────────────
// TYPES & PALETTE
// ─────────────────────────────────────────────

const PALETTE = {
  // Blush & Rose Gold
  cream: "#fdfbf7",
  blush: "#f8e8e4",
  blushDark: "#e8c4bc",
  roseGold: "#b76e79",
  roseGoldLight: "#d4a5a5",
  gold: "#c9a962",
  textDark: "#3d3d3d",
  textMuted: "#7a6f6f",
  white: "#ffffff",
};

interface PhotoFrame {
  id: number;
  imageUrl: string | null;
  caption: string;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function ElegantInvitation({
  senderName = "Daniel",
  message = "Will you be my Valentine?",
  personalMessage = "Every moment with you feels like a beautiful story unfolding.",
  date = "February 14th",
  time = "7:00 PM",
  location = "Our special place",
  photo1Url = "",
  photo1Caption = "Where it all began",
  photo2Url = "",
  photo2Caption = "A moment I'll never forget",
  photo3Url = "",
  photo3Caption = "Here's to many more",
  slug,
}: {
  senderName?: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
  photo1Url?: string;
  photo1Caption?: string;
  photo2Url?: string;
  photo2Caption?: string;
  photo3Url?: string;
  photo3Caption?: string;
  slug?: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const photos: PhotoFrame[] = [
    { id: 1, imageUrl: photo1Url || null, caption: photo1Caption },
    { id: 2, imageUrl: photo2Url || null, caption: photo2Caption },
    { id: 3, imageUrl: photo3Url || null, caption: photo3Caption },
  ];

  const handleAccept = () => {
    setAccepted(true);

    // Save RSVP response
    if (slug) {
      saveResponse(slug, "Yes");
    }

    // Elegant rose gold confetti
    const colors = [PALETTE.roseGold, PALETTE.roseGoldLight, PALETTE.gold, PALETTE.blushDark];

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      shapes: ["circle"],
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full"
      style={{ background: PALETTE.cream }}
    >
      {/* Subtle floral texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b76e79' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating decorative elements */}
      <FloatingDecorations />

      {/* Hero Section */}
      <HeroSection senderName={senderName} scrollProgress={scrollYProgress} />

      {/* Personal Message Card */}
      <MessageCard personalMessage={personalMessage} />

      {/* Photo Gallery Section */}
      <PhotoGallery photos={photos} />

      {/* The Question Card */}
      <QuestionCard message={message} />

      {/* Event Details Card */}
      <DetailsCard date={date} time={time} location={location} />

      {/* RSVP Section */}
      <RSVPSection
        accepted={accepted}
        onAccept={handleAccept}
        senderName={senderName}
      />

      {/* Footer Flourish */}
      <FooterSection />
    </div>
  );
}

// ─────────────────────────────────────────────
// FLORAL DECORATIONS (SVG)
// ─────────────────────────────────────────────

function FloralCorner({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M5 75C5 75 15 55 25 45C35 35 45 30 55 25C50 35 45 45 35 55C25 65 5 75 5 75Z"
        fill={PALETTE.blushDark}
        opacity="0.4"
      />
      <path
        d="M10 70C10 70 20 55 30 45C40 35 50 32 58 28"
        stroke={PALETTE.roseGold}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="25" cy="50" r="4" fill={PALETTE.roseGoldLight} opacity="0.6" />
      <circle cx="40" cy="38" r="3" fill={PALETTE.roseGold} opacity="0.5" />
      <circle cx="52" cy="30" r="2.5" fill={PALETTE.blushDark} opacity="0.7" />
      {/* Small leaves */}
      <ellipse cx="18" cy="58" rx="6" ry="3" fill={PALETTE.roseGoldLight} opacity="0.3" transform="rotate(-30 18 58)" />
      <ellipse cx="32" cy="45" rx="5" ry="2.5" fill={PALETTE.roseGoldLight} opacity="0.3" transform="rotate(-40 32 45)" />
    </svg>
  );
}

function FloralDivider() {
  return (
    <motion.div
      className="flex items-center justify-center gap-4 my-8"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="h-px flex-1 max-w-[80px]"
        style={{ background: `linear-gradient(90deg, transparent, ${PALETTE.roseGoldLight})` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="12" cy="12" r="3" fill={PALETTE.roseGold} opacity="0.6" />
        <circle cx="12" cy="12" r="6" stroke={PALETTE.roseGoldLight} strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M12 4C12 4 14 8 12 12C10 8 12 4 12 4Z" fill={PALETTE.blushDark} opacity="0.5" />
        <path d="M12 20C12 20 10 16 12 12C14 16 12 20 12 20Z" fill={PALETTE.blushDark} opacity="0.5" />
        <path d="M4 12C4 12 8 10 12 12C8 14 4 12 4 12Z" fill={PALETTE.blushDark} opacity="0.5" />
        <path d="M20 12C20 12 16 14 12 12C16 10 20 12 20 12Z" fill={PALETTE.blushDark} opacity="0.5" />
      </motion.svg>
      <motion.div
        className="h-px flex-1 max-w-[80px]"
        style={{ background: `linear-gradient(90deg, ${PALETTE.roseGoldLight}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// FLOATING DECORATIONS
// ─────────────────────────────────────────────

function FloatingDecorations() {
  const decorations = [
    { emoji: "✦", x: 8, y: 15, size: 12 },
    { emoji: "✦", x: 92, y: 25, size: 10 },
    { emoji: "❀", x: 5, y: 45, size: 16 },
    { emoji: "✦", x: 88, y: 55, size: 8 },
    { emoji: "❀", x: 12, y: 75, size: 14 },
    { emoji: "✦", x: 95, y: 80, size: 11 },
    { emoji: "❀", x: 3, y: 90, size: 12 },
    { emoji: "✦", x: 90, y: 10, size: 9 },
  ];

  // Synchronized duration for all decorations
  const syncDuration = 5;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {decorations.map((dec, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${dec.x}%`,
            top: `${dec.y}%`,
            fontSize: dec.size,
            color: PALETTE.roseGoldLight,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            y: [0, -30, -60],
            x: [0, i % 2 === 0 ? 8 : -8, i % 2 === 0 ? 15 : -15],
            rotate: [0, i % 2 === 0 ? 10 : -10, i % 2 === 0 ? 20 : -20],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: syncDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {dec.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────

function HeroSection({
  senderName,
  scrollProgress,
}: {
  senderName: string;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(scrollProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollProgress, [0, 0.15], [1, 0.95]);

  return (
    <motion.section
      style={{ opacity, scale }}
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
    >
      {/* Animated corner flourishes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FloralCorner className="absolute top-8 left-4" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <FloralCorner className="absolute top-8 right-4" flip />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <FloralCorner className="absolute bottom-8 left-4 rotate-180" flip />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <FloralCorner className="absolute bottom-8 right-4 rotate-180" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-center"
      >
        {/* Decorative line above */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-6"
          style={{
            width: 60,
            height: 1,
            background: PALETTE.roseGold,
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "14px",
            color: PALETTE.textMuted,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          A Special Invitation From
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.5rem, 10vw, 4.5rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: PALETTE.roseGold,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {senderName}
        </motion.h1>

        {/* Decorative line below */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mx-auto mt-6"
          style={{
            width: 60,
            height: 1,
            background: PALETTE.roseGold,
          }}
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "12px",
                color: PALETTE.textMuted,
                letterSpacing: "0.15em",
              }}
            >
              scroll to discover
            </p>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4L10 16M10 16L5 11M10 16L15 11"
                stroke={PALETTE.roseGoldLight}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────
// MESSAGE CARD
// ─────────────────────────────────────────────

function MessageCard({ personalMessage }: { personalMessage: string }) {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto"
      >
        <div
          className="relative p-8 md:p-12"
          style={{
            background: PALETTE.white,
            borderRadius: 4,
            boxShadow: "0 4px 30px rgba(183, 110, 121, 0.1)",
            border: `1px solid ${PALETTE.blush}`,
          }}
        >
          {/* Quote mark */}
          <div
            className="absolute -top-4 left-8"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "64px",
              color: PALETTE.blushDark,
              opacity: 0.3,
              lineHeight: 1,
            }}
          >
            "
          </div>

          <p
            className="text-center relative z-10"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
              fontStyle: "italic",
              color: PALETTE.textDark,
              lineHeight: 1.8,
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {personalMessage}
          </p>

          <FloralDivider />
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// PHOTO GALLERY
// ─────────────────────────────────────────────

function PhotoGallery({ photos }: { photos: PhotoFrame[] }) {
  return (
    <section className="py-10 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto space-y-16"
      >
        {photos.map((photo, index) => (
          <PhotoFrameCard
            key={photo.id}
            photo={photo}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
}

function PhotoFrameCard({ photo, index }: { photo: PhotoFrame; index: number }) {
  const isEven = index % 2 === 0;

  // Render placeholder content
  const renderPlaceholder = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.4 }}>
        <rect x="6" y="10" width="36" height="28" rx="2" stroke={PALETTE.roseGoldLight} strokeWidth="2" />
        <circle cx="16" cy="20" r="4" fill={PALETTE.roseGoldLight} />
        <path d="M6 32L16 24L24 30L34 22L42 28V36C42 37.1 41.1 38 40 38H8C6.9 38 6 37.1 6 36V32Z" fill={PALETTE.blushDark} opacity="0.5" />
      </svg>
      <p className="mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "14px", color: PALETTE.textMuted }}>
        Your photo here
      </p>
    </div>
  );

  // Frame Style 1: Classic Double Border Frame
  if (index === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div
          className="relative mx-auto"
          style={{
            maxWidth: 300,
            padding: 16,
            background: PALETTE.white,
            borderRadius: 4,
            boxShadow: "0 12px 50px rgba(183, 110, 121, 0.15)",
            border: `2px solid ${PALETTE.gold}`,
          }}
        >
          {/* Inner gold border */}
          <div style={{ border: `1px solid ${PALETTE.gold}`, padding: 8, borderColor: `${PALETTE.gold}99` }}>
            <div
              className="relative overflow-hidden"
              style={{
                aspectRatio: "1/1",
                background: photo.imageUrl ? `url(${photo.imageUrl}) center/cover` : `linear-gradient(135deg, ${PALETTE.blush} 0%, ${PALETTE.cream} 100%)`,
              }}
            >
              {!photo.imageUrl && renderPlaceholder()}
            </div>
          </div>
          <div className="mt-5 text-center">
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", fontStyle: "italic", color: PALETTE.roseGold, wordBreak: "break-word" }}>
              {photo.caption}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Frame Style 2: Polaroid Style
  if (index === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, rotate: -3 }}
        whileInView={{ opacity: 1, rotate: 2 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="relative"
      >
        <div
          className="relative mx-auto"
          style={{
            maxWidth: 280,
            padding: "12px 12px 50px 12px",
            background: PALETTE.white,
            borderRadius: 2,
            boxShadow: "0 15px 45px rgba(139, 90, 90, 0.2), 0 5px 15px rgba(139, 90, 90, 0.1)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "1/1",
              background: photo.imageUrl ? `url(${photo.imageUrl}) center/cover` : `linear-gradient(135deg, ${PALETTE.blush} 0%, ${PALETTE.cream} 100%)`,
            }}
          >
            {!photo.imageUrl && renderPlaceholder()}
          </div>
          {/* Polaroid caption area */}
          <div className="absolute bottom-3 left-0 right-0 text-center px-4">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", color: PALETTE.textDark, wordBreak: "break-word" }}>
              {photo.caption}
            </p>
          </div>
        </div>
        {/* Tape effect */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          style={{
            width: 60,
            height: 20,
            background: "linear-gradient(180deg, rgba(248, 232, 228, 0.9) 0%, rgba(232, 196, 188, 0.7) 100%)",
            transform: "rotate(-2deg)",
            borderRadius: 2,
          }}
        />
      </motion.div>
    );
  }

  // Frame Style 3: Ornate Frame with Corner Decorations (tilted opposite direction)
  return (
    <motion.div
      initial={{ opacity: 0, rotate: 3 }}
      whileInView={{ opacity: 1, rotate: -2 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      className="relative"
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: 320,
          padding: 20,
          background: `linear-gradient(135deg, ${PALETTE.white} 0%, ${PALETTE.cream} 100%)`,
          borderRadius: 8,
          boxShadow: "0 10px 40px rgba(183, 110, 121, 0.12)",
          border: `1px solid ${PALETTE.blushDark}`,
        }}
      >
        {/* Corner decorations */}
        {["-top-2 -left-2", "-top-2 -right-2 rotate-90", "-bottom-2 -right-2 rotate-180", "-bottom-2 -left-2 -rotate-90"].map((pos, i) => (
          <svg key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`} viewBox="0 0 32 32" fill="none">
            <path d="M4 28V16C4 9.4 9.4 4 16 4H28" stroke={PALETTE.roseGold} strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="8" cy="24" r="2" fill={PALETTE.roseGoldLight} />
          </svg>
        ))}

        {/* Photo with ornate inner border */}
        <div style={{ border: `3px solid ${PALETTE.blush}`, borderRadius: 4, padding: 6, background: PALETTE.white }}>
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "3/4",
              background: photo.imageUrl ? `url(${photo.imageUrl}) center/cover` : `linear-gradient(135deg, ${PALETTE.blush} 0%, ${PALETTE.cream} 100%)`,
              borderRadius: 2,
            }}
          >
            {!photo.imageUrl && renderPlaceholder()}
          </div>
        </div>

        {/* Caption with flourish */}
        <div className="mt-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div style={{ width: 20, height: 1, background: PALETTE.roseGoldLight }} />
            <span style={{ color: PALETTE.roseGold, fontSize: 10 }}>✦</span>
            <div style={{ width: 20, height: 1, background: PALETTE.roseGoldLight }} />
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "15px", fontStyle: "italic", color: PALETTE.textMuted, wordBreak: "break-word" }}>
            {photo.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// QUESTION CARD
// ─────────────────────────────────────────────

function QuestionCard({ message }: { message: string }) {
  return (
    <section className="py-20 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <FloralDivider />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.8rem, 7vw, 2.5rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: PALETTE.roseGold,
            lineHeight: 1.3,
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 0px rgba(183, 110, 121, 0)",
                "0 0 20px rgba(183, 110, 121, 0.3)",
                "0 0 0px rgba(183, 110, 121, 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {message}
          </motion.span>
        </motion.h2>

        <FloralDivider />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// DETAILS CARD
// ─────────────────────────────────────────────

function DetailsCard({
  date,
  time,
  location,
}: {
  date: string;
  time: string;
  location: string;
}) {
  return (
    <section className="py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="max-w-sm mx-auto"
      >
        <motion.div
          className="p-8 text-center"
          style={{
            background: PALETTE.white,
            borderRadius: 4,
            boxShadow: "0 4px 30px rgba(183, 110, 121, 0.1)",
            border: `1px solid ${PALETTE.blush}`,
          }}
          whileHover={{ boxShadow: "0 8px 40px rgba(183, 110, 121, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.p
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "12px",
              color: PALETTE.textMuted,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            The Details
          </motion.p>

          {/* Date & Time */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                color: PALETTE.textDark,
                marginBottom: 4,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {date}
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "18px",
                color: PALETTE.textMuted,
              }}
            >
              at {time}
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="mx-auto my-6"
            style={{
              width: 40,
              height: 1,
              background: PALETTE.blushDark,
              opacity: 0.5,
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p
              className="mb-1"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "12px",
                color: PALETTE.textMuted,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Location
            </p>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "20px",
                fontStyle: "italic",
                color: PALETTE.textDark,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {location}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// RSVP SECTION
// ─────────────────────────────────────────────

// Elegant petal colors matching the rose gold theme
const PETAL_COLORS = [
  PALETTE.roseGold,
  PALETTE.roseGoldLight,
  PALETTE.blushDark,
  PALETTE.gold,
  "#e8b4b8", // soft pink
  "#d4a5a5", // dusty rose
];

// Poetic messages as the button becomes shy (3 clicks to disappear)
const SHY_MESSAGES = [
  "I think I'm feeling a bit shy...",
  "My resolve is weakening...",
  "I'm almost convinced...",
  "One more try and I might vanish...",
  "Perhaps love always wins?",
];

// Floating Petal Component
function FloatingPetal({ x, y, color, delay = 0 }: { x: number; y: number; color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "50%",
        zIndex: 15,
      }}
      initial={{
        x: x - 8,
        y: y - 8,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.5],
        y: [y - 8, y - 60 - Math.random() * 40],
        x: [x - 8, x - 8 + (Math.random() - 0.5) * 80],
        rotate: [Math.random() * 360, Math.random() * 720],
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: "easeOut"
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <ellipse
          cx="8"
          cy="8"
          rx="6"
          ry="3"
          fill={color}
          opacity="0.8"
          transform="rotate(-30 8 8)"
        />
        <ellipse
          cx="8"
          cy="8"
          rx="3"
          ry="6"
          fill={color}
          opacity="0.6"
          transform="rotate(15 8 8)"
        />
      </svg>
    </motion.div>
  );
}

// Sparkle Star Component
function SparkleStarEffect({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: "50%",
        top: "50%",
        zIndex: 20,
      }}
      initial={{ x: x - 6, y: y - 6, opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        rotate: [0, 180],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 0L7 4.5L12 6L7 7.5L6 12L5 7.5L0 6L5 4.5L6 0Z"
          fill={color}
        />
      </svg>
    </motion.div>
  );
}

function RSVPSection({
  accepted,
  onAccept,
  senderName,
}: {
  accepted: boolean;
  onAccept: () => void;
  senderName: string;
}) {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [showNoMessage, setShowNoMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [bloomPetals, setBloomPetals] = useState<Array<{ id: number; angle: number; color: string }>>([]);
  const [isBloomingAway, setIsBloomingAway] = useState(false);
  const effectIdRef = useRef(0);

  // Calculate button opacity and scale based on hover count
  const buttonOpacity = Math.max(0.3, 1 - noHoverCount * 0.12);
  const buttonScale = Math.max(0.6, 1 - noHoverCount * 0.06);
  const buttonRotation = noHoverCount * (noHoverCount % 2 === 0 ? 3 : -3);
  const buttonBlur = noHoverCount > 3 ? (noHoverCount - 3) * 0.5 : 0;

  const handleNoClick = () => {
    if (isBloomingAway) return;

    const count = noHoverCount + 1;
    setNoHoverCount(count);

    // Show a poetic message
    setCurrentMessage(SHY_MESSAGES[Math.min(count - 1, SHY_MESSAGES.length - 1)]);

    if (count >= 3) {
      // Transform into blooming flower petals and float away
      setIsBloomingAway(true);

      // Create petals that bloom outward
      const newPetals: Array<{ id: number; angle: number; color: string }> = [];
      for (let i = 0; i < 12; i++) {
        newPetals.push({
          id: effectIdRef.current++,
          angle: (i / 12) * 360,
          color: PETAL_COLORS[i % PETAL_COLORS.length],
        });
      }
      setBloomPetals(newPetals);

      setTimeout(() => {
        setShowNoMessage(true);
      }, 1200);
    }
  };

  if (accepted) {
    return (
      <section className="py-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-8 flex justify-center"
          >
            <img
              src="/heart.png"
              alt="Heart"
              style={{ width: 240, height: 240, objectFit: "contain" }}
            />
          </motion.div>

          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 6vw, 2rem)",
              fontStyle: "italic",
              color: PALETTE.roseGold,
              marginBottom: 12,
            }}
          >
            It&apos;s a date!
          </h3>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px",
              color: PALETTE.textMuted,
            }}
          >
            {senderName} can&apos;t wait to see you
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-10 px-6" style={{ overflow: "visible" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
        style={{ overflow: "visible" }}
      >
        <motion.h2
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 8vw, 3.5rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: PALETTE.roseGold,
            lineHeight: 1.2,
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 0px rgba(183, 110, 121, 0)",
                "0 0 30px rgba(183, 110, 121, 0.4)",
                "0 0 0px rgba(183, 110, 121, 0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Will you join me?
          </motion.span>
        </motion.h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[220px]" style={{ overflow: "visible" }}>
          {/* Yes Button - Enhanced elegance */}
          <motion.button
            onClick={onAccept}
            className="px-12 py-5 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.roseGold} 0%, ${PALETTE.roseGoldLight} 100%)`,
              color: PALETTE.white,
              fontFamily: "'Playfair Display', serif",
              fontSize: "18px",
              fontStyle: "italic",
              letterSpacing: "0.1em",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              boxShadow: `0 8px 32px rgba(183, 110, 121, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 12px 40px rgba(183, 110, 121, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
            whileTap={{ scale: 0.98 }}
          >
            Yes, I&apos;ll Be There

            {/* Elegant shimmer effect */}
            <motion.div
              className="absolute inset-0"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
          </motion.button>

          {/* No Button - Shy fading effect with bloom transformation */}
          {!showNoMessage ? (
            <div className="relative" style={{ overflow: "visible", minWidth: 140, minHeight: 60 }}>
              {/* Blooming petals animation when button transforms */}
              {isBloomingAway && bloomPetals.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: 20,
                    height: 20,
                    zIndex: 10,
                  }}
                  initial={{
                    x: -10,
                    y: -10,
                    opacity: 1,
                    scale: 0,
                    rotate: p.angle,
                  }}
                  animate={{
                    x: Math.cos((p.angle * Math.PI) / 180) * 80 - 10,
                    y: Math.sin((p.angle * Math.PI) / 180) * 80 - 60,
                    opacity: 0,
                    scale: 1.5,
                    rotate: p.angle + 180,
                  }}
                  transition={{
                    duration: 1.2,
                    ease: "easeOut",
                    delay: Math.random() * 0.2,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <ellipse cx="10" cy="10" rx="8" ry="4" fill={p.color} opacity="0.85" transform="rotate(-30 10 10)" />
                    <ellipse cx="10" cy="10" rx="4" ry="8" fill={p.color} opacity="0.6" transform="rotate(15 10 10)" />
                  </svg>
                </motion.div>
              ))}

              <motion.button
                className="px-8 py-3 relative"
                style={{
                  background: PALETTE.cream,
                  color: PALETTE.textMuted,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "15px",
                  fontStyle: "italic",
                  letterSpacing: "0.08em",
                  borderRadius: 50,
                  border: `1px solid ${PALETTE.blushDark}`,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(183, 110, 121, 0.15)",
                  filter: buttonBlur > 0 ? `blur(${buttonBlur}px)` : "none",
                }}
                animate={{
                  scale: isBloomingAway ? 0 : buttonScale,
                  opacity: isBloomingAway ? 0 : buttonOpacity,
                  rotate: isBloomingAway ? 360 : buttonRotation,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                onClick={handleNoClick}
                whileHover={{
                  borderColor: PALETTE.roseGoldLight,
                  backgroundColor: PALETTE.blush,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {noHoverCount === 0 ? "Perhaps Not" : noHoverCount < 4 ? "Maybe..." : noHoverCount < 6 ? "Well..." : "..."}

                {/* Pulsing glow effect as button fades */}
                {noHoverCount > 0 && !isBloomingAway && (
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${PALETTE.roseGold}30 0%, transparent 70%)`,
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Fade trail sparkles */}
              {noHoverCount > 2 && !isBloomingAway && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${40 + i * 20}%`,
                        top: `${20 + i * 25}%`,
                        color: PALETTE.roseGoldLight,
                        fontSize: 10,
                      }}
                      animate={{
                        opacity: [0, 0.6, 0],
                        y: [0, -20],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    >
                      ✦
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                className="mb-3"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span style={{ fontSize: 24, color: PALETTE.roseGold }}>❀</span>
              </motion.div>
              <motion.p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "16px",
                  fontStyle: "italic",
                  color: PALETTE.roseGold,
                  marginBottom: 8,
                }}
                animate={{
                  textShadow: [
                    "0 0 0px rgba(183, 110, 121, 0)",
                    "0 0 12px rgba(183, 110, 121, 0.3)",
                    "0 0 0px rgba(183, 110, 121, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                It bloomed into something beautiful...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "14px",
                  color: PALETTE.textMuted,
                }}
              >
                Perhaps &ldquo;Yes&rdquo; was the only answer all along ✨
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Elegant playful messages */}
        {noHoverCount > 0 && noHoverCount < 7 && currentMessage && (
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <motion.p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "15px",
                fontStyle: "italic",
                color: PALETTE.roseGoldLight,
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentMessage}
            </motion.p>

            {/* Progress dots showing how close to giving up */}
            <motion.div
              className="flex justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: i < noHoverCount ? PALETTE.roseGold : PALETTE.blush,
                  }}
                  animate={i < noHoverCount ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────

function FooterSection() {
  return (
    <section className="py-8 px-6">
      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <FloralDivider />

        <motion.p
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "14px",
            color: PALETTE.textMuted,
            letterSpacing: "0.1em",
          }}
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Made with love
          </motion.span>
        </motion.p>

        {/* Floating hearts at bottom */}
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ fontSize: 16, color: PALETTE.roseGoldLight }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ♥
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

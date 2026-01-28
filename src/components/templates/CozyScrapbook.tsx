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
  const [foldStep, setFoldStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [noScale, setNoScale] = useState(1);
  const [noClicks, setNoClicks] = useState(0);
  const [noGone, setNoGone] = useState(false);

  const handleUnfold = useCallback(() => {
    if (foldStep < 4) {
      setFoldStep((s) => s + 1);
    }
  }, [foldStep]);

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
    const clicks = noClicks + 1;
    setNoClicks(clicks);
    const newScale = noScale * 0.7;
    if (clicks >= 3) {
      setNoGone(true);
    } else {
      setNoScale(newScale);
    }
  };

  // Compute container dimensions based on fold step
  const getContainerSize = () => {
    switch (foldStep) {
      case 0:
        return { width: 160, height: 160 };
      case 1:
        return { width: 160, height: 320 };
      case 2:
        return { width: 320, height: 320 };
      case 3:
        return { width: 480, height: 320 };
      case 4:
        return { width: 480, height: 480 };
      default:
        return { width: 160, height: 160 };
    }
  };

  const containerSize = getContainerSize();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 100%)",
      }}
    >
      {/* Paper texture overlay */}
      <PaperTexture />

      {/* Scattered background decorations */}
      <BackgroundDecorations />

      {/* Main content area */}
      <div
        className="relative z-10"
        style={{ perspective: "1000px" }}
      >
        {showSuccess ? (
          <SuccessState />
        ) : (
          <>
            {/* Origami paper container — grows with layout animation */}
            <motion.div
              layout
              transition={{
                layout: { type: "spring", stiffness: 180, damping: 24 },
              }}
              style={{
                width: Math.min(containerSize.width, typeof window !== "undefined" ? window.innerWidth - 32 : 480),
                height: containerSize.height,
                transformStyle: "preserve-3d",
                position: "relative",
              }}
            >
              {/* Base paper (always visible, the folded square) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, #f5ebe0 0%, #ede0d4 50%, #e6d5c3 100%)",
                  borderRadius: 4,
                  boxShadow: "0 8px 32px rgba(107,82,64,0.15), 0 2px 8px rgba(107,82,64,0.1)",
                }}
              />

              {/* === STEP 0: Folded square with "Unfold me" === */}
              {foldStep === 0 && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={handleUnfold}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #f0e4d6 0%, #e8d9c8 100%)",
                    borderRadius: 4,
                    userSelect: "none",
                  }}
                >
                  {/* Fold crease lines */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "50%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent 5%, rgba(107,82,64,0.12) 20%, rgba(107,82,64,0.15) 50%, rgba(107,82,64,0.12) 80%, transparent 95%)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.3)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "50%",
                      width: 1,
                      background: "linear-gradient(180deg, transparent 5%, rgba(107,82,64,0.12) 20%, rgba(107,82,64,0.15) 50%, rgba(107,82,64,0.12) 80%, transparent 95%)",
                      boxShadow: "1px 0 0 rgba(255,255,255,0.3)",
                    }}
                  />

                  <span
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 22,
                      color: "#6b5240",
                    }}
                  >
                    Unfold me ♥
                  </span>

                  <motion.span
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 11,
                      color: "#a08060",
                      marginTop: 8,
                      fontStyle: "italic",
                    }}
                  >
                    Tap to unfold
                  </motion.span>
                </motion.div>
              )}

              {/* === STEP 1: Bottom unfolds down — Cover page === */}
              <AnimatePresence>
                {foldStep >= 1 && (
                  <motion.div
                    onClick={foldStep === 1 ? handleUnfold : undefined}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 160,
                      height: 320,
                      transformStyle: "preserve-3d",
                      cursor: foldStep === 1 ? "pointer" : "default",
                      zIndex: 4,
                    }}
                  >
                    {/* Top half (was visible before) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 160,
                        height: 160,
                        background: "linear-gradient(135deg, #f0e4d6 0%, #e8d9c8 100%)",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />

                    {/* Bottom half — flips in */}
                    <motion.div
                      initial={{ rotateX: 180 }}
                      animate={{ rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
                      style={{
                        position: "absolute",
                        top: 160,
                        left: 0,
                        width: 160,
                        height: 160,
                        transformOrigin: "top center",
                        backfaceVisibility: "hidden",
                        background: "#fdf8f0",
                        borderRadius: "0 0 4px 4px",
                      }}
                    />

                    {/* Fold crease between halves */}
                    <div
                      style={{
                        position: "absolute",
                        top: 159,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "rgba(107,82,64,0.08)",
                        boxShadow: "0 1px 2px rgba(107,82,64,0.06)",
                        zIndex: 5,
                      }}
                    />

                    {/* Cover page content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                      }}
                    >
                      {/* Washi tape strips */}
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 20,
                          width: 50,
                          height: 10,
                          background: "rgba(139,158,107,0.35)",
                          borderRadius: 2,
                          transform: "rotate(-3deg)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 30,
                          right: 15,
                          width: 40,
                          height: 8,
                          background: "rgba(194,114,86,0.3)",
                          borderRadius: 2,
                          transform: "rotate(5deg)",
                        }}
                      />

                      <span
                        style={{ fontSize: 28, marginBottom: 12, opacity: 0.8 }}
                      >
                        🌸
                      </span>

                      <span
                        style={{
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: 18,
                          color: "#6b5240",
                          textAlign: "center",
                          lineHeight: 1.4,
                        }}
                      >
                        A Little Something
                        <br />
                        For You
                      </span>

                      <div
                        style={{
                          width: 30,
                          height: 1,
                          background: "#d4c4b0",
                          margin: "12px 0",
                        }}
                      />

                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 10,
                          color: "#a08060",
                          fontStyle: "italic",
                        }}
                      >
                        from {senderName}
                      </span>

                      {foldStep === 1 && (
                        <motion.span
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 10,
                            color: "#b09878",
                            marginTop: 16,
                            fontStyle: "italic",
                          }}
                        >
                          Tap to continue...
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === STEP 2: Right side unfolds right — Message page === */}
              <AnimatePresence>
                {foldStep >= 2 && (
                  <motion.div
                    onClick={foldStep === 2 ? handleUnfold : undefined}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 160,
                      width: 160,
                      height: 320,
                      transformStyle: "preserve-3d",
                      cursor: foldStep === 2 ? "pointer" : "default",
                      zIndex: 3,
                    }}
                  >
                    {/* The panel that flips in from left */}
                    <motion.div
                      initial={{ rotateY: -180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "left center",
                        backfaceVisibility: "hidden",
                        background: "#fdf8f0",
                        borderRadius: "0 4px 4px 0",
                      }}
                    />

                    {/* Fold crease */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: 2,
                        background: "rgba(107,82,64,0.08)",
                        boxShadow: "1px 0 2px rgba(107,82,64,0.06)",
                        zIndex: 5,
                      }}
                    />

                    {/* Message page content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Washi tape holding the message */}
                      <div
                        style={{
                          position: "absolute",
                          top: 18,
                          left: "50%",
                          transform: "translateX(-50%) rotate(-2deg)",
                          width: 60,
                          height: 10,
                          background: "rgba(212,165,116,0.4)",
                          borderRadius: 2,
                          zIndex: 2,
                        }}
                      />

                      {/* Lined paper background */}
                      <div
                        style={{
                          position: "absolute",
                          top: 30,
                          left: 12,
                          right: 12,
                          bottom: 30,
                          borderRadius: 4,
                          background: `repeating-linear-gradient(
                            transparent,
                            transparent 23px,
                            rgba(212,196,176,0.3) 23px,
                            rgba(212,196,176,0.3) 24px
                          )`,
                          backgroundPositionY: 10,
                        }}
                      />

                      {/* Message text */}
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 13,
                          color: "#6b5240",
                          fontStyle: "italic",
                          lineHeight: "24px",
                          textAlign: "center",
                          position: "relative",
                          zIndex: 1,
                          padding: "0 4px",
                          maxHeight: 240,
                          overflow: "hidden",
                        }}
                      >
                        {message}
                      </p>

                      {/* Sketchy heart doodles */}
                      <div style={{ position: "absolute", bottom: 14, right: 14 }}>
                        <SketchyHeart size={14} color="rgba(194,114,86,0.25)" />
                      </div>
                      <div style={{ position: "absolute", bottom: 28, right: 30 }}>
                        <SketchyStar size={10} color="rgba(139,158,107,0.25)" />
                      </div>
                      <div style={{ position: "absolute", top: 40, left: 10 }}>
                        <SketchyHeart size={10} color="rgba(194,114,86,0.2)" />
                      </div>

                      {foldStep === 2 && (
                        <motion.span
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 10,
                            color: "#b09878",
                            marginTop: 8,
                            fontStyle: "italic",
                            position: "absolute",
                            bottom: 8,
                          }}
                        >
                          Tap to continue...
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === STEP 3: Left side unfolds left — Details page === */}
              <AnimatePresence>
                {foldStep >= 3 && (
                  <motion.div
                    onClick={foldStep === 3 ? handleUnfold : undefined}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: -160,
                      width: 160,
                      height: 320,
                      transformStyle: "preserve-3d",
                      cursor: foldStep === 3 ? "pointer" : "default",
                      zIndex: 2,
                    }}
                  >
                    {/* Panel flips in from right */}
                    <motion.div
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: 0 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "right center",
                        backfaceVisibility: "hidden",
                        background: "#fdf8f0",
                        borderRadius: "4px 0 0 4px",
                      }}
                    />

                    {/* Fold crease */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: 2,
                        background: "rgba(107,82,64,0.08)",
                        boxShadow: "-1px 0 2px rgba(107,82,64,0.06)",
                        zIndex: 5,
                      }}
                    />

                    {/* Details page content — Vintage ticket stub */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Ticket stub */}
                      <div
                        style={{
                          width: "100%",
                          background: "#fff",
                          border: "2px dashed #e0d4c4",
                          borderRadius: 8,
                          padding: "16px 12px",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Punch holes */}
                        <div
                          style={{
                            position: "absolute",
                            left: -6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "#fdf8f0",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: -6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: "#fdf8f0",
                          }}
                        />

                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 8,
                            textTransform: "uppercase",
                            letterSpacing: "0.15em",
                            color: "#b09878",
                            fontWeight: 600,
                            textAlign: "center",
                            marginBottom: 8,
                          }}
                        >
                          You&apos;re invited
                        </p>

                        <h3
                          style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: 16,
                            color: "#c27256",
                            textAlign: "center",
                            marginBottom: 12,
                          }}
                        >
                          A Special Date
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <TicketDetailRow icon="📅" label="When" value={eventDate} />
                          <TicketDetailRow icon="⏰" label="Time" value={eventTime} />
                          <TicketDetailRow icon="📍" label="Where" value={eventLocation} />
                        </div>

                        {/* Stamp */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 4,
                            right: 8,
                            fontSize: 18,
                            opacity: 0.1,
                            transform: "rotate(-12deg)",
                          }}
                        >
                          💌
                        </div>
                      </div>

                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 9,
                          color: "#b09878",
                          fontStyle: "italic",
                          marginTop: 10,
                          textAlign: "center",
                        }}
                      >
                        — with love, {senderName}
                      </p>

                      {foldStep === 3 && (
                        <motion.span
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 10,
                            color: "#b09878",
                            marginTop: 8,
                            fontStyle: "italic",
                          }}
                        >
                          One more tap...
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* === STEP 4: Top unfolds up — RSVP page === */}
              <AnimatePresence>
                {foldStep >= 4 && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: -160,
                      left: -160,
                      width: 480,
                      height: 160,
                      transformStyle: "preserve-3d",
                      zIndex: 1,
                    }}
                  >
                    {/* Panel flips in from bottom */}
                    <motion.div
                      initial={{ rotateX: 180 }}
                      animate={{ rotateX: 0 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        transformOrigin: "bottom center",
                        backfaceVisibility: "hidden",
                        background: "#fdf8f0",
                        borderRadius: "4px 4px 0 0",
                      }}
                    />

                    {/* Fold crease */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "rgba(107,82,64,0.08)",
                        boxShadow: "0 -1px 2px rgba(107,82,64,0.06)",
                        zIndex: 5,
                      }}
                    />

                    {/* RSVP content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 16,
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: 20,
                          color: "#6b5240",
                          marginBottom: 4,
                        }}
                      >
                        So, what do you say?
                      </h2>

                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 11,
                          color: "#b09878",
                          fontStyle: "italic",
                          marginBottom: 16,
                        }}
                      >
                        Your answer means the world
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Yes button */}
                        <motion.button
                          onClick={handleYes}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: 14,
                            color: "#fff",
                            background: "#8b9e6b",
                            border: "2px solid #7a8d5c",
                            borderRadius: 24,
                            padding: "8px 24px",
                            cursor: "pointer",
                            boxShadow: "0 3px 12px rgba(139,158,107,0.3)",
                            minWidth: 44,
                            minHeight: 44,
                            // Hand-drawn border effect using border-radius variation
                            borderTopLeftRadius: 22,
                            borderTopRightRadius: 26,
                            borderBottomLeftRadius: 26,
                            borderBottomRightRadius: 20,
                          }}
                        >
                          Absolutely ♥
                        </motion.button>

                        {/* No button — shrinks on click */}
                        {!noGone ? (
                          <motion.button
                            onClick={handleNoInteract}
                            animate={{ scale: noScale, opacity: noScale }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 12,
                              color: "#c4b5a4",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontStyle: "italic",
                              padding: 8,
                              minWidth: 44,
                              minHeight: 44,
                            }}
                          >
                            no thanks...
                          </motion.button>
                        ) : (
                          <motion.span
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 12,
                              color: "#c4b5a4",
                              fontStyle: "italic",
                            }}
                          >
                            no thanks...
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// SUCCESS STATE — after saying YES
// ============================================

function SuccessState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Falling petal animations */}
      {[0, 1, 2, 3, 4].map((i) => (
        <FallingPetal key={i} index={i} />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: 1,
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.6 },
        }}
        style={{
          background: "#fdf8f0",
          borderRadius: 12,
          padding: "40px 32px",
          textAlign: "center",
          maxWidth: 320,
          boxShadow: "0 8px 32px rgba(107,82,64,0.12)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: 40, marginBottom: 16 }}
        >
          🌿
        </motion.div>

        <h2
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 28,
            color: "#6b5240",
            marginBottom: 8,
          }}
        >
          You said yes!
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 14,
            color: "#a08060",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          This is the beginning of something beautiful...
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// FALLING PETALS (post-RSVP decoration)
// ============================================

function FallingPetal({ index }: { index: number }) {
  const petals = ["🌸", "🍃", "🌿", "🌷", "🍂"];
  const startX = -60 + index * 35;
  const delay = index * 0.8;

  return (
    <motion.div
      initial={{ y: -80, x: startX, opacity: 0, rotate: 0 }}
      animate={{
        y: ["-80px", "400px"],
        x: [startX + "px", (startX + (index % 2 === 0 ? 30 : -30)) + "px"],
        opacity: [0, 0.7, 0.7, 0],
        rotate: [0, 180 + index * 45],
      }}
      transition={{
        duration: 4 + index * 0.5,
        delay: delay,
        repeat: Infinity,
        ease: "easeIn",
      }}
      style={{
        position: "absolute",
        top: -40,
        fontSize: 18,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {petals[index]}
    </motion.div>
  );
}

// ============================================
// TICKET DETAIL ROW
// ============================================

function TicketDetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 12 }}>{icon}</span>
      <div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 8,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#8b9e6b",
            fontWeight: 600,
            margin: 0,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 12,
            color: "#6b5240",
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================
// SKETCHY DOODLE SHAPES (CSS-based)
// ============================================

function SketchyHeart({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size * 0.9,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: half / 2,
          width: half,
          height: half,
          borderRadius: `${half}px ${half}px 0 0`,
          background: color,
          transform: "rotate(-45deg)",
          transformOrigin: "0 100%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: half,
          height: half,
          borderRadius: `${half}px ${half}px 0 0`,
          background: color,
          transform: "rotate(45deg)",
          transformOrigin: "100% 100%",
        }}
      />
    </div>
  );
}

function SketchyStar({ size, color }: { size: number; color: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 2,
          background: color,
          transform: "translateY(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 2,
          height: "100%",
          background: color,
          transform: "translateX(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 2,
          background: color,
          transform: "translateY(-50%) rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "100%",
          height: 2,
          background: color,
          transform: "translateY(-50%) rotate(-45deg)",
        }}
      />
    </div>
  );
}

// ============================================
// BACKGROUND DECORATIONS
// ============================================

function BackgroundDecorations() {
  const items = [
    { emoji: "🌿", top: "8%", left: "6%", rotate: -15, size: 28 },
    { emoji: "🍂", top: "15%", right: "10%", rotate: 25, size: 24 },
    { emoji: "🌸", bottom: "12%", left: "8%", rotate: 10, size: 26 },
    { emoji: "🌿", bottom: "20%", right: "6%", rotate: -20, size: 22 },
    { emoji: "🍂", top: "45%", left: "3%", rotate: 30, size: 20 },
    { emoji: "🌸", top: "70%", right: "4%", rotate: -8, size: 24 },
    { emoji: "🍃", top: "30%", right: "15%", rotate: 45, size: 18 },
    { emoji: "🌼", bottom: "35%", left: "12%", rotate: -25, size: 20 },
  ];

  return (
    <>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: item.top,
            left: item.left,
            right: (item as Record<string, unknown>).right as string | undefined,
            bottom: item.bottom,
            fontSize: item.size,
            opacity: 0.06,
            transform: `rotate(${item.rotate}deg)`,
            userSelect: "none" as const,
            pointerEvents: "none" as const,
            zIndex: 0,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </>
  );
}

// ============================================
// PAPER TEXTURE (warm-toned noise)
// ============================================

function PaperTexture() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

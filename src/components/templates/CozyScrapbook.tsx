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
    if (foldStep < 3) {
      setFoldStep((s) => s + 1);
    }
  }, [foldStep]);

  const handleYes = () => {
    setShowSuccess(true);
    // Scrapbook style - autumn leaves + pressed flowers falling
    const scrapbookColors = ["#c27256", "#8b9e6b", "#d4a574", "#e8c9a0", "#a08060"];

    // Gentle center burst (like opening a treasure)
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.5 },
      colors: scrapbookColors,
      shapes: ["circle"],
      scalar: 1.4,
      gravity: 0.5,
      drift: 0,
    });

    // Falling leaves/petals from corners (like pages fluttering)
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 315,
        spread: 50,
        origin: { x: 0, y: 0.2 },
        colors: ["#c27256", "#d4a574"],
        shapes: ["circle"],
        scalar: 1.6,
        gravity: 0.6,
        drift: 1,
        ticks: 180,
      });
      confetti({
        particleCount: 30,
        angle: 225,
        spread: 50,
        origin: { x: 1, y: 0.2 },
        colors: ["#8b9e6b", "#a08060"],
        shapes: ["circle"],
        scalar: 1.6,
        gravity: 0.6,
        drift: -1,
        ticks: 180,
      });
    }, 200);

    // Soft cream/beige shimmer (like old paper)
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#e8c9a0", "#f5ebe0", "#ede0d4"],
        shapes: ["circle"],
        scalar: 1.2,
        gravity: 0.4,
        ticks: 150,
      });
    }, 400);
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

  // Smaller panels to fit in one screen
  const PANEL_SIZE = 140; // Square panels
  const GAP = 8;

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
      <div className="relative z-10" style={{ perspective: "1000px" }}>
        {showSuccess ? (
          <SuccessState />
        ) : (
          <motion.div
            layout
            transition={{ layout: { type: "spring", stiffness: 200, damping: 25 } }}
            className="relative"
            style={{
              // Container grows based on unfold step
              width: foldStep >= 2 ? PANEL_SIZE * 2 + GAP : PANEL_SIZE,
              height: foldStep >= 3 ? PANEL_SIZE * 2 + GAP : PANEL_SIZE,
            }}
          >
            {/* === PANEL 0: Initial folded card (top-left position) === */}
            <motion.div
              layout
              onClick={foldStep === 0 ? handleUnfold : undefined}
              className="absolute"
              style={{
                top: 0,
                left: 0,
                width: PANEL_SIZE,
                height: PANEL_SIZE,
                cursor: foldStep === 0 ? "pointer" : "default",
                background: "linear-gradient(135deg, #f0e4d6 0%, #e8d9c8 100%)",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(107,82,64,0.15), 0 2px 8px rgba(107,82,64,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              {foldStep === 0 ? (
                <>
                  {/* Fold crease lines */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: "50%",
                      height: 1,
                      background: "linear-gradient(90deg, transparent 5%, rgba(107,82,64,0.12) 20%, rgba(107,82,64,0.15) 50%, rgba(107,82,64,0.12) 80%, transparent 95%)",
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
                    }}
                  />
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 20, color: "#6b5240" }}>
                      Unfold me
                    </span>
                    <motion.p
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 10, color: "#a08060", marginTop: 6, fontStyle: "italic" }}
                    >
                      Tap to unfold
                    </motion.p>
                  </motion.div>
                </>
              ) : (
                // After unfolding - show washi tape decoration
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ position: "absolute", top: 8, left: 12, width: 35, height: 7, background: "rgba(139,158,107,0.35)", borderRadius: 2, transform: "rotate(-3deg)" }} />
                  <span style={{ fontSize: 24, opacity: 0.6 }}>🌸</span>
                </motion.div>
              )}
            </motion.div>

            {/* === PANEL 1: Cover - unfolds DOWN from panel 0 === */}
            <AnimatePresence>
              {foldStep >= 1 && (
                <motion.div
                  initial={{ rotateX: -180, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -180, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  onClick={foldStep === 1 ? handleUnfold : undefined}
                  className="absolute"
                  style={{
                    top: 0,
                    left: 0,
                    width: PANEL_SIZE,
                    height: PANEL_SIZE,
                    transformOrigin: "top center",
                    cursor: foldStep === 1 ? "pointer" : "default",
                    background: "#fdf8f0",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(107,82,64,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    zIndex: 3,
                  }}
                >
                  {/* Washi tape */}
                  <div style={{ position: "absolute", top: 10, right: 16, width: 40, height: 7, background: "rgba(194,114,86,0.3)", borderRadius: 2, transform: "rotate(5deg)" }} />

                  <span style={{ fontSize: 24, marginBottom: 6, opacity: 0.8 }}>🌸</span>
                  <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#6b5240", textAlign: "center", lineHeight: 1.3 }}>
                    A Little Something
                    <br />
                    For You
                  </span>
                  <div style={{ width: 25, height: 1, background: "#d4c4b0", margin: "8px 0" }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 10, color: "#a08060", fontStyle: "italic" }}>
                    from {senderName}
                  </span>

                  {foldStep === 1 && (
                    <motion.span
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 9, color: "#b09878", marginTop: 8, fontStyle: "italic" }}
                    >
                      Tap to continue...
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* === PANEL 2: Message - unfolds RIGHT from panel 1 === */}
            <AnimatePresence>
              {foldStep >= 2 && (
                <motion.div
                  initial={{ rotateY: -180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -180, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  onClick={foldStep === 2 ? handleUnfold : undefined}
                  className="absolute"
                  style={{
                    top: 0,
                    left: PANEL_SIZE + GAP,
                    width: PANEL_SIZE,
                    height: PANEL_SIZE,
                    transformOrigin: "left center",
                    cursor: foldStep === 2 ? "pointer" : "default",
                    background: "#fdf8f0",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(107,82,64,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 12,
                    zIndex: 2,
                  }}
                >
                  {/* Washi tape */}
                  <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%) rotate(-2deg)", width: 45, height: 7, background: "rgba(212,165,116,0.4)", borderRadius: 2, zIndex: 2 }} />

                  {/* Lined paper background */}
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      left: 10,
                      right: 10,
                      bottom: 20,
                      borderRadius: 4,
                      background: `repeating-linear-gradient(transparent, transparent 17px, rgba(212,196,176,0.3) 17px, rgba(212,196,176,0.3) 18px)`,
                      backgroundPositionY: 6,
                    }}
                  />

                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 11,
                      color: "#6b5240",
                      fontStyle: "italic",
                      lineHeight: "18px",
                      textAlign: "center",
                      position: "relative",
                      zIndex: 1,
                      padding: "0 4px",
                      maxHeight: 90,
                      overflow: "hidden",
                    }}
                  >
                    {message}
                  </p>

                  {/* Doodles */}
                  <div style={{ position: "absolute", bottom: 10, right: 12 }}>
                    <SketchyHeart size={10} color="rgba(194,114,86,0.25)" />
                  </div>

                  {foldStep === 2 && (
                    <motion.span
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 9, color: "#b09878", fontStyle: "italic", position: "absolute", bottom: 6 }}
                    >
                      Tap to continue...
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* === PANEL 3: Ticket + RSVP - unfolds DOWN spanning both columns === */}
            <AnimatePresence>
              {foldStep >= 3 && (
                <motion.div
                  initial={{ rotateX: -180, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -180, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  className="absolute"
                  style={{
                    top: PANEL_SIZE + GAP,
                    left: 0,
                    width: PANEL_SIZE * 2 + GAP,
                    height: PANEL_SIZE,
                    transformOrigin: "top center",
                    background: "#fdf8f0",
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(107,82,64,0.1)",
                    display: "flex",
                    padding: 12,
                    gap: 12,
                    zIndex: 1,
                  }}
                >
                  {/* Left: Ticket stub */}
                  <div
                    style={{
                      flex: 1,
                      background: "#fff",
                      border: "2px dashed #e0d4c4",
                      borderRadius: 8,
                      padding: "10px 14px",
                      position: "relative",
                    }}
                  >
                    {/* Punch holes */}
                    <div style={{ position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#fdf8f0" }} />
                    <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 10, height: 10, borderRadius: "50%", background: "#fdf8f0" }} />

                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b09878", fontWeight: 600, textAlign: "center", marginBottom: 4 }}>
                      You&apos;re invited
                    </p>

                    <h3 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 13, color: "#c27256", textAlign: "center", marginBottom: 8 }}>
                      A Special Date
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <TicketDetailRow icon="📅" value={eventDate} />
                      <TicketDetailRow icon="⏰" value={eventTime} />
                      <TicketDetailRow icon="📍" value={eventLocation} />
                    </div>
                  </div>

                  {/* Right: RSVP */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#6b5240", marginBottom: 4 }}>
                      What do you say?
                    </h2>
                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 9, color: "#b09878", fontStyle: "italic", marginBottom: 12 }}>
                      Your answer means the world
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <motion.button
                        onClick={handleYes}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 12,
                          color: "#fff",
                          background: "#8b9e6b",
                          border: "2px solid #7a8d5c",
                          borderRadius: 20,
                          padding: "6px 16px",
                          cursor: "pointer",
                          boxShadow: "0 3px 10px rgba(139,158,107,0.3)",
                        }}
                      >
                        Yes!
                      </motion.button>

                      {/* Scrapbook-style "no" - gets crossed out and covered by sticker */}
                      <div style={{ position: "relative", minWidth: 40 }}>
                        {!noGone ? (
                          <motion.button
                            onClick={handleNoInteract}
                            style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: 10,
                              color: "#c4b5a4",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontStyle: "italic",
                              padding: 6,
                              position: "relative",
                            }}
                          >
                            no...
                            {/* Pen strikethrough lines - appear on clicks */}
                            {noClicks >= 1 && (
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: 0,
                                  right: 0,
                                  height: 2,
                                  background: "#c27256",
                                  transformOrigin: "left",
                                  transform: "rotate(-5deg)",
                                }}
                              />
                            )}
                            {noClicks >= 2 && (
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                style={{
                                  position: "absolute",
                                  top: "45%",
                                  left: -2,
                                  right: -2,
                                  height: 2,
                                  background: "#8b9e6b",
                                  transformOrigin: "right",
                                  transform: "rotate(3deg)",
                                }}
                              />
                            )}
                          </motion.button>
                        ) : (
                          // Sticker covers the crossed-out "no"
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            style={{
                              fontSize: 20,
                              filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.15))",
                            }}
                          >
                            🌸
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SUCCESS STATE
// ============================================

function SuccessState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <FallingPetal key={i} index={i} />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: [1, 1.02, 1], opacity: 1, rotate: [0, 1, -1, 0] }}
        transition={{ scale: { duration: 4, repeat: Infinity }, rotate: { duration: 6, repeat: Infinity }, opacity: { duration: 0.6 } }}
        style={{
          background: "#fdf8f0",
          borderRadius: 12,
          padding: "32px 24px",
          textAlign: "center",
          maxWidth: 240,
          boxShadow: "0 8px 32px rgba(107,82,64,0.12)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 36, marginBottom: 12 }}>
          🌿
        </motion.div>
        <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: "#6b5240", marginBottom: 6 }}>
          You said yes!
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 12, color: "#a08060", fontStyle: "italic", lineHeight: 1.5 }}>
          This is the beginning of something beautiful...
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// FALLING PETALS
// ============================================

function FallingPetal({ index }: { index: number }) {
  const petals = ["🌸", "🍃", "🌿", "🌷", "🍂"];
  const startX = -50 + index * 28;
  const delay = index * 0.8;

  return (
    <motion.div
      initial={{ y: -60, x: startX, opacity: 0, rotate: 0 }}
      animate={{
        y: ["-60px", "300px"],
        x: [startX + "px", (startX + (index % 2 === 0 ? 25 : -25)) + "px"],
        opacity: [0, 0.7, 0.7, 0],
        rotate: [0, 180 + index * 45],
      }}
      transition={{ duration: 4 + index * 0.5, delay, repeat: Infinity, ease: "easeIn" }}
      style={{ position: "absolute", top: -30, fontSize: 16, zIndex: 1, pointerEvents: "none" }}
    >
      {petals[index]}
    </motion.div>
  );
}

// ============================================
// TICKET DETAIL ROW
// ============================================

function TicketDetailRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 10 }}>{icon}</span>
      <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 10, color: "#6b5240", margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

// ============================================
// SKETCHY HEART
// ============================================

function SketchyHeart({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.9 }}>
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
            userSelect: "none",
            pointerEvents: "none",
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
// PAPER TEXTURE
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

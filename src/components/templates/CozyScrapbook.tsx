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
  photoUrl1?: string; // First photo - shown on cover
  photoUrl2?: string; // Second photo - shown inside the scrapbook
}

export function CozyScrapbook({
  message,
  senderName = "Someone Special",
  eventDate = "Valentine's Day",
  eventTime = "7:30 PM",
  eventLocation = "Somewhere romantic",
  photoUrl1,
  photoUrl2,
}: CozyScrapbookProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1 = inside page 1, 2 = inside page 2
  const [showSuccess, setShowSuccess] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noGone, setNoGone] = useState(false);

  const handleNextPage = useCallback(() => {
    if (currentPage < 2) {
      setCurrentPage((p) => p + 1);
    }
  }, [currentPage]);

  const handleYes = () => {
    setShowSuccess(true);
    const scrapbookColors = ["#c27256", "#8b9e6b", "#d4a574", "#e8c9a0", "#a08060"];

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: scrapbookColors,
      shapes: ["circle"],
      scalar: 1.4,
      gravity: 0.5,
    });

    setTimeout(() => {
      confetti({
        particleCount: 35,
        angle: 315,
        spread: 55,
        origin: { x: 0, y: 0.2 },
        colors: ["#c27256", "#d4a574"],
        shapes: ["circle"],
        scalar: 1.5,
        gravity: 0.6,
        drift: 1,
      });
      confetti({
        particleCount: 35,
        angle: 225,
        spread: 55,
        origin: { x: 1, y: 0.2 },
        colors: ["#8b9e6b", "#a08060"],
        shapes: ["circle"],
        scalar: 1.5,
        gravity: 0.6,
        drift: -1,
      });
    }, 200);
  };

  const handleNoInteract = () => {
    if (noGone) return;
    const clicks = noClicks + 1;
    setNoClicks(clicks);
    if (clicks >= 3) {
      setNoGone(true);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 50%, #e6d5c3 100%)",
      }}
    >
      <PaperTexture />
      <BackgroundDecorations />

      <div className="relative z-10" style={{ perspective: "1500px" }}>
        {showSuccess ? (
          <SuccessState senderName={senderName} />
        ) : (
          <div className="relative" style={{ width: 340, height: 440 }}>
            {/* Book spine shadow */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 10,
                bottom: 10,
                width: 8,
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg, rgba(107,82,64,0.15), transparent, rgba(107,82,64,0.15))",
                borderRadius: 4,
                zIndex: 0,
              }}
            />

            {/* === COVER PAGE === */}
            <motion.div
              onClick={currentPage === 0 ? handleNextPage : undefined}
              animate={{
                rotateY: currentPage >= 1 ? -160 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 45,
                damping: 18,
                mass: 1,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                transformOrigin: "right center",
                transformStyle: "preserve-3d",
                cursor: currentPage === 0 ? "pointer" : "default",
                zIndex: currentPage === 0 ? 10 : 1,
              }}
            >
              {/* Front of cover */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  background: "linear-gradient(145deg, #d4a574 0%, #c29366 50%, #b8845a 100%)",
                  borderRadius: "12px 4px 4px 12px",
                  boxShadow: "4px 0 20px rgba(107,82,64,0.25), inset -2px 0 8px rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                  overflow: "hidden",
                }}
              >
                {/* Leather texture pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.08,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />

                {/* Decorative border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 10,
                    border: "2px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    pointerEvents: "none",
                  }}
                />

                {/* Polaroid photo on cover */}
                {photoUrl1 ? (
                  <motion.div
                    initial={{ scale: 0.9, rotate: -3 }}
                    animate={{ scale: 1, rotate: -3 }}
                    style={{
                      background: "#fff",
                      padding: "6px 6px 24px 6px",
                      borderRadius: 2,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                      marginBottom: 16,
                    }}
                  >
                    <img
                      src={photoUrl1}
                      alt="Memory"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 11,
                        color: "#8b7355",
                        textAlign: "center",
                        marginTop: 6,
                      }}
                    >
                      our memory ♡
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ fontSize: 48, marginBottom: 12 }}
                  >
                    📖
                  </motion.div>
                )}

                {/* Title */}
                <div
                  style={{
                    background: "rgba(253,248,240,0.95)",
                    padding: "12px 20px",
                    borderRadius: 8,
                    boxShadow: "0 3px 12px rgba(107,82,64,0.2)",
                    textAlign: "center",
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: 22,
                      color: "#5c3a21",
                      marginBottom: 4,
                      fontWeight: 700,
                    }}
                  >
                    A Scrapbook
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 12,
                      color: "#8b7355",
                      fontStyle: "italic",
                    }}
                  >
                    just for you
                  </p>
                </div>

                {/* Tap hint */}
                <motion.p
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 20,
                    fontStyle: "italic",
                  }}
                >
                  tap to open →
                </motion.p>

                {/* Washi tape decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: -8,
                    width: 50,
                    height: 14,
                    background: "linear-gradient(90deg, #8b9e6b, #a3b88c)",
                    opacity: 0.7,
                    transform: "rotate(45deg)",
                    borderRadius: 2,
                  }}
                />
              </div>

              {/* Back of cover (inside cover) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "linear-gradient(145deg, #fdf8f0 0%, #f5ebe0 100%)",
                  borderRadius: "4px 12px 12px 4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              >
                {/* Decorative pattern */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.03,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
                <div style={{ transform: "scaleX(-1)" }}>
                  <span style={{ fontSize: 24, opacity: 0.3 }}>🌸</span>
                </div>
              </div>
            </motion.div>

            {/* === PAGE 1 (Photo2 + Message) === */}
            <motion.div
              onClick={currentPage === 1 ? handleNextPage : undefined}
              animate={{
                rotateY: currentPage >= 2 ? -160 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 45,
                damping: 18,
                mass: 1,
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                transformOrigin: "right center",
                transformStyle: "preserve-3d",
                cursor: currentPage === 1 ? "pointer" : "default",
                zIndex: currentPage === 1 ? 9 : 2,
              }}
            >
              {/* Front of page 1 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  background: "#fdf8f0",
                  borderRadius: "4px 2px 2px 4px",
                  boxShadow: "2px 0 10px rgba(107,82,64,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 20,
                  overflow: "hidden",
                }}
              >
                {/* Washi tape top */}
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    left: 20,
                    width: 60,
                    height: 16,
                    background: "linear-gradient(90deg, #c27256, #d4a574)",
                    opacity: 0.5,
                    transform: "rotate(-2deg)",
                    borderRadius: 2,
                  }}
                />

                {/* Photo2 as polaroid */}
                {photoUrl2 ? (
                  <div
                    style={{
                      background: "#fff",
                      padding: "6px 6px 26px 6px",
                      borderRadius: 2,
                      boxShadow: "0 4px 14px rgba(107,82,64,0.2)",
                      transform: "rotate(2deg)",
                      marginTop: 20,
                      marginBottom: 16,
                    }}
                  >
                    <img
                      src={photoUrl2}
                      alt="Our moment"
                      style={{
                        width: 110,
                        height: 110,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 11,
                        color: "#8b7355",
                        textAlign: "center",
                        marginTop: 8,
                      }}
                    >
                      us ♡
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 30,
                      marginBottom: 20,
                      fontSize: 50,
                      opacity: 0.6,
                    }}
                  >
                    💝
                  </div>
                )}

                {/* Message title */}
                <h3
                  style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 20,
                    color: "#5c3a21",
                    marginBottom: 8,
                  }}
                >
                  A Little Something
                </h3>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    color: "#8b7355",
                    fontStyle: "italic",
                    marginBottom: 12,
                  }}
                >
                  from {senderName}
                </p>

                {/* Decorative line */}
                <div
                  style={{
                    width: 50,
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #c27256, transparent)",
                    marginBottom: 12,
                  }}
                />

                {/* Message snippet */}
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 13,
                    color: "#6b5240",
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: 1.6,
                    padding: "0 8px",
                    maxHeight: 80,
                    overflow: "hidden",
                  }}
                >
                  {message.length > 80 ? message.slice(0, 80) + "..." : message}
                </p>

                {currentPage === 1 && (
                  <motion.p
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 11,
                      color: "#b09878",
                      fontStyle: "italic",
                      position: "absolute",
                      bottom: 16,
                    }}
                  >
                    tap to continue →
                  </motion.p>
                )}

                {/* Doodle heart */}
                <div style={{ position: "absolute", bottom: 30, right: 16, opacity: 0.2 }}>
                  <SketchyHeart size={16} color="#c27256" />
                </div>
              </div>

              {/* Back of page 1 */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  background: "#fdf8f0",
                  borderRadius: "2px 4px 4px 2px",
                }}
              />
            </motion.div>

            {/* === RIGHT SIDE - Final Page (Event Details + RSVP) === */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "50%",
                height: "100%",
                background: "#fdf8f0",
                borderRadius: "2px 12px 12px 2px",
                boxShadow: "-2px 0 10px rgba(107,82,64,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 20,
                overflow: "hidden",
              }}
            >
              {/* Lined paper effect */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `repeating-linear-gradient(
                    transparent,
                    transparent 26px,
                    rgba(212,196,176,0.25) 26px,
                    rgba(212,196,176,0.25) 27px
                  )`,
                  backgroundPositionY: 20,
                  pointerEvents: "none",
                }}
              />

              {/* Washi tape */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 55,
                  height: 14,
                  background: "linear-gradient(90deg, #8b9e6b, #a3b88c)",
                  opacity: 0.45,
                  transform: "rotate(8deg)",
                  borderRadius: 2,
                }}
              />

              <AnimatePresence mode="wait">
                {currentPage >= 1 && (
                  <motion.div
                    key="final-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {/* Header */}
                    <span style={{ fontSize: 32, marginTop: 10, marginBottom: 8 }}>✨</span>
                    <h3
                      style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: 22,
                        color: "#5c3a21",
                        marginBottom: 16,
                      }}
                    >
                      Save the Date!
                    </h3>

                    {/* Event details */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 20,
                        padding: "12px 16px",
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: 8,
                        border: "1px dashed #d4c4b0",
                      }}
                    >
                      <EventDetailRow icon="📅" label="When" value={eventDate} />
                      <EventDetailRow icon="⏰" label="Time" value={eventTime} />
                      <EventDetailRow icon="📍" label="Where" value={eventLocation} />
                    </div>

                    {/* RSVP Section */}
                    <div
                      style={{
                        marginTop: "auto",
                        marginBottom: 20,
                        textAlign: "center",
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "'Dancing Script', cursive",
                          fontSize: 18,
                          color: "#5c3a21",
                          marginBottom: 4,
                        }}
                      >
                        What do you say?
                      </h4>
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: 11,
                          color: "#a08060",
                          fontStyle: "italic",
                          marginBottom: 14,
                        }}
                      >
                        Your answer means the world
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
                        <motion.button
                          onClick={handleYes}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            fontFamily: "'Dancing Script', cursive",
                            fontSize: 16,
                            color: "#fff",
                            background: "linear-gradient(135deg, #8b9e6b 0%, #7a8d5c 100%)",
                            border: "none",
                            borderRadius: 20,
                            padding: "10px 28px",
                            cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(139,158,107,0.35)",
                          }}
                        >
                          Yes! 💕
                        </motion.button>

                        {/* Shrinking No button */}
                        <div style={{ minWidth: 50, display: "flex", justifyContent: "center" }}>
                          {!noGone ? (
                            <motion.button
                              onClick={handleNoInteract}
                              animate={{ scale: Math.max(0.3, 1 - noClicks * 0.3) }}
                              style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: 13,
                                color: "#c4b5a4",
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontStyle: "italic",
                                padding: 8,
                                position: "relative",
                              }}
                            >
                              no...
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
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              style={{ fontSize: 24 }}
                            >
                              🌸
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Doodle */}
                    <div style={{ position: "absolute", bottom: 12, left: 16, opacity: 0.15 }}>
                      <SketchyHeart size={14} color="#8b9e6b" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder when book is closed */}
              {currentPage === 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    opacity: 0.2,
                  }}
                >
                  <span style={{ fontSize: 40 }}>📜</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SUCCESS STATE
// ============================================

function SuccessState({ senderName }: { senderName: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <FallingPetal key={i} index={i} />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: [1, 1.02, 1], opacity: 1, rotate: [0, 1, -1, 0] }}
        transition={{
          scale: { duration: 4, repeat: Infinity },
          rotate: { duration: 6, repeat: Infinity },
          opacity: { duration: 0.6 },
        }}
        style={{
          background: "linear-gradient(145deg, #fdf8f0 0%, #f5ebe0 100%)",
          borderRadius: 16,
          padding: "48px 40px",
          textAlign: "center",
          maxWidth: 340,
          boxShadow: "0 12px 40px rgba(107,82,64,0.15)",
          position: "relative",
          zIndex: 2,
          border: "1px solid rgba(212,165,116,0.2)",
        }}
      >
        {/* Washi tapes */}
        <div
          style={{
            position: "absolute",
            top: -6,
            left: 30,
            width: 60,
            height: 14,
            background: "linear-gradient(90deg, #c27256, #d4a574)",
            opacity: 0.5,
            transform: "rotate(-3deg)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -6,
            right: 30,
            width: 60,
            height: 14,
            background: "linear-gradient(90deg, #8b9e6b, #a3b88c)",
            opacity: 0.5,
            transform: "rotate(3deg)",
            borderRadius: 2,
          }}
        />

        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ fontSize: 56, marginBottom: 16 }}
        >
          🌿
        </motion.div>
        <h2
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 34,
            color: "#5c3a21",
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          You said yes!
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 16,
            color: "#8b7355",
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          This is the beginning of
          <br />
          something beautiful...
        </p>

        {/* Signature */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid rgba(212,196,176,0.4)",
          }}
        >
          <p
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 14,
              color: "#a08060",
            }}
          >
            with love, {senderName} 💕
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// EVENT DETAIL ROW
// ============================================

function EventDetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 10,
            color: "#a08060",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 1,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 15,
            color: "#5c3a21",
            fontWeight: 600,
          }}
        >
          {value}
        </p>
      </div>
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
        y: ["-60px", "320px"],
        x: [startX + "px", startX + (index % 2 === 0 ? 30 : -30) + "px"],
        opacity: [0, 0.7, 0.7, 0],
        rotate: [0, 180 + index * 45],
      }}
      transition={{ duration: 4 + index * 0.5, delay, repeat: Infinity, ease: "easeIn" }}
      style={{ position: "absolute", top: -30, fontSize: 18, zIndex: 1, pointerEvents: "none" }}
    >
      {petals[index]}
    </motion.div>
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
    { emoji: "🌿", top: "8%", left: "6%", rotate: -15, size: 26 },
    { emoji: "🍂", top: "15%", right: "10%", rotate: 25, size: 22 },
    { emoji: "🌸", bottom: "12%", left: "8%", rotate: 10, size: 24 },
    { emoji: "🌿", bottom: "20%", right: "6%", rotate: -20, size: 20 },
    { emoji: "🍂", top: "45%", left: "3%", rotate: 30, size: 18 },
    { emoji: "🌸", top: "70%", right: "4%", rotate: -8, size: 22 },
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
        opacity: 0.35,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

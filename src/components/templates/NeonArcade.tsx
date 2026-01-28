"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface NeonArcadeProps {
  message: string;
  senderName?: string;
  imageUrl?: string;
}

type Phase = "waiting" | "showing" | "input" | "success" | "miss" | "complete";

const PADS = [
  { color: "#ff00ff", symbol: "\u2665", label: "Magenta" },
  { color: "#00ffff", symbol: "\u2605", label: "Cyan" },
  { color: "#00ff88", symbol: "\u2666", label: "Lime" },
  { color: "#7c3aed", symbol: "\u2660", label: "Purple" },
] as const;

const ROUND_LENGTHS = [2, 3, 4];

const ROUND_LABELS = ["ROUND 1", "ROUND 2 \u2014 FIGHT!", "FINAL ROUND"];

function generateSequences(): number[][] {
  return ROUND_LENGTHS.map((len) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    return seq;
  });
}

export function NeonArcade({
  message,
  senderName = "Someone Special",
  imageUrl,
}: NeonArcadeProps) {
  // --- Sequence generation (lazy init, stable across renders) ---
  const [sequences] = useState<number[][]>(() => generateSequences());

  // --- Game state machine ---
  const [phase, setPhase] = useState<Phase>("waiting");
  const [round, setRound] = useState(0);
  const [inputIndex, setInputIndex] = useState(0);
  const [revealedLines, setRevealedLines] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [userFlash, setUserFlash] = useState<number | null>(null);
  const [showRoundLabel, setShowRoundLabel] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showDeclineMsg, setShowDeclineMsg] = useState(false);
  const [declineVisible, setDeclineVisible] = useState(true);

  // Timeout tracking for cleanup
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback(
    (fn: () => void, ms: number): ReturnType<typeof setTimeout> => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
      return t;
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // --- Play a sequence ---
  const playSequence = useCallback(
    (seq: number[]) => {
      setPhase("showing");
      setActivePad(null);

      seq.forEach((padIdx, i) => {
        // Light up
        addTimeout(() => {
          setActivePad(padIdx);
        }, i * 800);
        // Light off
        addTimeout(() => {
          setActivePad(null);
        }, i * 800 + 500);
      });

      // After full sequence, switch to input phase
      addTimeout(() => {
        setPhase("input");
        setInputIndex(0);
      }, seq.length * 800 + 200);
    },
    [addTimeout]
  );

  // --- Start a round ---
  const startRound = useCallback(
    (r: number) => {
      clearAllTimeouts();
      setRound(r);
      setShowRoundLabel(true);
      setPhase("waiting");
      setInputIndex(0);
      setActivePad(null);
      setUserFlash(null);

      addTimeout(() => {
        setShowRoundLabel(false);
        playSequence(sequences[r]);
      }, 1500);
    },
    [sequences, playSequence, clearAllTimeouts, addTimeout]
  );

  // --- Begin game on mount ---
  useEffect(() => {
    const t = setTimeout(() => {
      startRound(0);
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handle pad tap ---
  const handlePadTap = useCallback(
    (padIdx: number) => {
      if (phase !== "input") return;

      const seq = sequences[round];
      setUserFlash(padIdx);
      addTimeout(() => setUserFlash(null), 250);

      if (padIdx === seq[inputIndex]) {
        // Correct
        const nextInput = inputIndex + 1;
        if (nextInput >= seq.length) {
          // Round complete!
          setPhase("success");
          const newRevealed = revealedLines + 1;
          setRevealedLines(newRevealed);

          if (round < 2) {
            // Start next round after delay
            addTimeout(() => {
              startRound(round + 1);
            }, 1800);
          } else {
            // All rounds complete!
            addTimeout(() => {
              setPhase("complete");
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: ["#ff00ff", "#00ffff", "#00ff88", "#7c3aed", "#ff69b4"],
              });
              addTimeout(() => {
                confetti({
                  particleCount: 120,
                  spread: 140,
                  origin: { y: 0.4, x: 0.3 },
                  colors: ["#ff00ff", "#00ffff", "#7c3aed"],
                });
              }, 400);
              addTimeout(() => {
                confetti({
                  particleCount: 120,
                  spread: 140,
                  origin: { y: 0.4, x: 0.7 },
                  colors: ["#00ff88", "#ff69b4", "#ff00ff"],
                });
              }, 700);
            }, 1200);
          }
        } else {
          setInputIndex(nextInput);
        }
      } else {
        // Miss!
        setPhase("miss");
        addTimeout(() => {
          playSequence(sequences[round]);
        }, 1500);
      }
    },
    [
      phase,
      sequences,
      round,
      inputIndex,
      revealedLines,
      playSequence,
      startRound,
      addTimeout,
    ]
  );

  // --- Accept handler ---
  const handleAccept = () => {
    setAccepted(true);
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
      colors: ["#ff00ff", "#00ffff", "#00ff88", "#7c3aed", "#ff69b4"],
    });
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 160,
        origin: { y: 0.3 },
        colors: ["#ff00ff", "#00ffff", "#7c3aed"],
      });
    }, 500);
  };

  // --- Decline handler ---
  const handleDecline = () => {
    setShowDeclineMsg(true);
    setTimeout(() => {
      setShowDeclineMsg(false);
      setDeclineVisible(false);
    }, 3000);
  };

  // --- Invitation lines ---
  const invitationLines = [
    `${senderName} has a message for you`,
    message,
    imageUrl ? "imageUrl" : "Will you be my Player 2?",
  ];

  // ============================
  // ACCEPTED SUCCESS SCREEN
  // ============================
  if (accepted) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: "#0a0a1a" }}
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
          <NeonRays />
          <FloatingParticles />
        </div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-center p-10 relative z-10 rounded-lg max-w-md w-full"
          style={{
            background: "rgba(10,10,26,0.95)",
            border: "2px solid #00ffff",
            boxShadow:
              "0 0 40px rgba(0,255,255,0.3), 0 0 80px rgba(255,0,255,0.15), inset 0 0 40px rgba(0,255,255,0.05)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-7xl mb-6"
          >
            {"\uD83C\uDFC6"}
          </motion.div>

          <NeonFlickerText
            text="HIGH SCORE:"
            color="#00ffff"
            className="text-2xl font-bold uppercase tracking-[0.3em] mb-2"
          />

          <motion.h2
            className="text-5xl font-bold uppercase tracking-widest mb-4"
            style={{
              color: "#ff00ff",
              fontFamily: "'Courier New', monospace",
              textShadow:
                "0 0 10px #ff00ff, 0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.5)",
            }}
            animate={{
              textShadow: [
                "0 0 10px #ff00ff, 0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.5)",
                "0 0 20px #ff00ff, 0 0 50px #ff00ff, 0 0 100px rgba(255,0,255,0.8)",
                "0 0 10px #ff00ff, 0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {"\u221E"} LOVE
          </motion.h2>

          <p
            className="text-sm uppercase tracking-[0.2em]"
            style={{
              color: "#00ff88",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 8px #00ff88",
            }}
          >
            PLAYER 2 HAS JOINED THE GAME
          </p>

          <motion.p
            className="text-xs mt-6 uppercase tracking-wider"
            style={{
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'Courier New', monospace",
            }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CREDITS: UNLIMITED
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // ============================
  // MAIN GAME SCREEN
  // ============================
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <NeonRays />
        <FloatingParticles />
      </div>

      {/* Miss flash overlay */}
      <AnimatePresence>
        {phase === "miss" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ border: "6px solid #ff0040", boxShadow: "inset 0 0 80px rgba(255,0,64,0.3)" }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Score / round indicator */}
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{
              color: "#00ffff",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 5px #00ffff",
            }}
          >
            RND {round + 1}/3
          </span>
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{
              color: "#00ff88",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 5px #00ff88",
            }}
          >
            SCORE: {revealedLines * 1000}
          </span>
        </div>

        {/* Title */}
        <motion.h1
          className="text-center text-2xl font-bold uppercase tracking-[0.25em] mb-6"
          style={{
            color: "#ff00ff",
            fontFamily: "'Courier New', monospace",
            textShadow:
              "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
          }}
          animate={{
            textShadow: [
              "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
              "0 0 12px #ff00ff, 0 0 35px #ff00ff, 0 0 70px rgba(255,0,255,0.7)",
              "0 0 7px #ff00ff, 0 0 20px #ff00ff, 0 0 40px rgba(255,0,255,0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          PLAYER 2 DETECTED
        </motion.h1>

        {/* Round label overlay */}
        <AnimatePresence>
          {showRoundLabel && (
            <motion.div
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-1/3 z-30"
            >
              <h2
                className="text-3xl font-bold uppercase tracking-[0.3em] text-center"
                style={{
                  color: "#00ffff",
                  fontFamily: "'Courier New', monospace",
                  textShadow:
                    "0 0 15px #00ffff, 0 0 40px #00ffff, 0 0 80px rgba(0,255,255,0.6)",
                }}
              >
                {ROUND_LABELS[round]}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Miss text */}
        <AnimatePresence>
          {phase === "miss" && (
            <motion.div
              initial={{ scale: 2, opacity: 0, y: -20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: [0, -8, 8, -6, 6, -3, 3, 0],
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/3 z-30"
            >
              <h2
                className="text-4xl font-bold uppercase tracking-[0.3em]"
                style={{
                  color: "#ff0040",
                  fontFamily: "'Courier New', monospace",
                  textShadow:
                    "0 0 15px #ff0040, 0 0 40px #ff0040, 0 0 80px rgba(255,0,64,0.6)",
                }}
              >
                MISS!
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success text */}
        <AnimatePresence>
          {phase === "success" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute top-1/3 z-30"
            >
              <NeonFlickerText
                text="CLEAR!"
                color="#00ff88"
                className="text-3xl font-bold uppercase tracking-[0.3em]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2x2 Pad Grid */}
        <div className="grid grid-cols-2 gap-5 mb-8">
          {PADS.map((pad, idx) => {
            const isActive = activePad === idx;
            const isUserFlash = userFlash === idx;
            const isCelebrating = phase === "complete";
            const lit = isActive || isUserFlash;

            return (
              <motion.button
                key={idx}
                onClick={() => handlePadTap(idx)}
                disabled={phase !== "input"}
                className="relative flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  background: lit || isCelebrating
                    ? pad.color
                    : `${pad.color}15`,
                  border: `3px solid ${pad.color}`,
                  boxShadow: lit
                    ? `0 0 25px ${pad.color}, 0 0 50px ${pad.color}80, 0 0 80px ${pad.color}40, inset 0 0 20px ${pad.color}60`
                    : isCelebrating
                    ? `0 0 15px ${pad.color}80, 0 0 30px ${pad.color}40`
                    : `0 0 8px ${pad.color}30`,
                  cursor: phase === "input" ? "pointer" : "default",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "28px",
                  color: lit || isCelebrating ? "#fff" : `${pad.color}90`,
                  textShadow: lit
                    ? `0 0 10px #fff, 0 0 20px ${pad.color}`
                    : "none",
                  transition: "background 0.1s, box-shadow 0.1s",
                }}
                animate={
                  isCelebrating
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          `0 0 15px ${pad.color}80, 0 0 30px ${pad.color}40`,
                          `0 0 30px ${pad.color}, 0 0 60px ${pad.color}80`,
                          `0 0 15px ${pad.color}80, 0 0 30px ${pad.color}40`,
                        ],
                      }
                    : lit
                    ? { scale: 1.15 }
                    : { scale: 1 }
                }
                transition={
                  isCelebrating
                    ? { duration: 0.8, repeat: Infinity, delay: idx * 0.2 }
                    : { type: "spring", stiffness: 500, damping: 25 }
                }
                whileTap={phase === "input" ? { scale: 0.9 } : undefined}
              >
                {pad.symbol}
              </motion.button>
            );
          })}
        </div>

        {/* Phase instruction */}
        <div className="h-8 flex items-center justify-center mb-6">
          {phase === "showing" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-sm uppercase tracking-[0.2em]"
              style={{
                color: "#00ffff",
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 8px #00ffff",
              }}
            >
              WATCH THE SEQUENCE...
            </motion.p>
          )}
          {phase === "input" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm uppercase tracking-[0.2em]"
              style={{
                color: "#00ff88",
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 8px #00ff88",
              }}
            >
              YOUR TURN! ({inputIndex}/{sequences[round]?.length || 0})
            </motion.p>
          )}
          {phase === "waiting" && !showRoundLabel && (
            <motion.p
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-sm uppercase tracking-[0.2em]"
              style={{
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Courier New', monospace",
              }}
            >
              GET READY...
            </motion.p>
          )}
        </div>

        {/* Revealed invitation lines */}
        <div className="w-full max-w-sm min-h-[120px] mb-6">
          <AnimatePresence>
            {revealedLines >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-center"
              >
                <NeonFlickerText
                  text={invitationLines[0]}
                  color="#ff00ff"
                  className="text-sm uppercase tracking-[0.15em]"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealedLines >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-center"
              >
                <p
                  className="text-xl font-bold"
                  style={{
                    color: "#fff",
                    fontFamily: "'Courier New', monospace",
                    textShadow:
                      "0 0 10px rgba(255,255,255,0.4), 0 0 30px rgba(0,255,255,0.2)",
                  }}
                >
                  {"\u201C"}{message}{"\u201D"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {revealedLines >= 3 && imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center mb-3"
              >
                <div
                  className="p-1 rounded-md"
                  style={{
                    border: "2px solid #7c3aed",
                    boxShadow:
                      "0 0 15px rgba(124,58,237,0.4), inset 0 0 15px rgba(124,58,237,0.1)",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="For you"
                    className="w-36 h-36 object-cover rounded-sm"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* YOU WIN + complete state */}
        <AnimatePresence>
          {phase === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              <motion.h2
                className="text-4xl font-bold uppercase tracking-[0.3em] mb-6 text-center"
                style={{
                  color: "#00ffff",
                  fontFamily: "'Courier New', monospace",
                }}
                animate={{
                  textShadow: [
                    "0 0 10px #00ffff, 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.5)",
                    "0 0 20px #00ffff, 0 0 50px #00ffff, 0 0 100px rgba(0,255,255,0.8)",
                    "0 0 10px #00ffff, 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                YOU WIN!
              </motion.h2>

              {/* Accept button */}
              <motion.button
                onClick={handleAccept}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-md font-bold text-lg uppercase tracking-[0.2em] mb-4"
                style={{
                  background: "transparent",
                  border: "2px solid #00ff88",
                  color: "#00ff88",
                  fontFamily: "'Courier New', monospace",
                  textShadow: "0 0 10px #00ff88",
                  boxShadow:
                    "0 0 15px rgba(0,255,136,0.3), 0 0 30px rgba(0,255,136,0.15)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(0,255,136,0.3), 0 0 30px rgba(0,255,136,0.15)",
                    "0 0 25px rgba(0,255,136,0.5), 0 0 50px rgba(0,255,136,0.3)",
                    "0 0 15px rgba(0,255,136,0.3), 0 0 30px rgba(0,255,136,0.15)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ACCEPT? [INSERT COIN]
              </motion.button>

              {/* Decline */}
              {declineVisible && !showDeclineMsg && (
                <motion.button
                  onClick={handleDecline}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  whileHover={{ opacity: 0.7 }}
                  className="text-xs uppercase tracking-[0.2em] bg-transparent border-none mt-2"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "'Courier New', monospace",
                    cursor: "pointer",
                  }}
                >
                  decline
                </motion.button>
              )}

              <AnimatePresence>
                {showDeclineMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs uppercase tracking-[0.15em] mt-3 text-center"
                    style={{
                      color: "#ff00ff",
                      fontFamily: "'Courier New', monospace",
                      textShadow: "0 0 8px #ff00ff",
                    }}
                  >
                    GAME OVER {"\u2014"} just kidding, there{"\u2019"}s no
                    declining {"\uD83D\uDE09"}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom text */}
        {phase !== "complete" && (
          <motion.p
            className="text-center mt-4 text-[10px] uppercase tracking-[0.3em]"
            style={{
              color: "rgba(255,255,255,0.2)",
              fontFamily: "'Courier New', monospace",
            }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {"\u2665"} INSERT HEART TO CONTINUE {"\u2665"}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// =========================================
// NEON FLICKER TEXT (sign turning on effect)
// =========================================
function NeonFlickerText({
  text,
  color,
  className = "",
}: {
  text: string;
  color: string;
  className?: string;
}) {
  return (
    <motion.p
      className={className}
      style={{
        color,
        fontFamily: "'Courier New', monospace",
        textShadow: `0 0 7px ${color}, 0 0 20px ${color}, 0 0 40px ${color}80`,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.2, 1, 0.4, 1],
      }}
      transition={{
        duration: 0.8,
        times: [0, 0.15, 0.3, 0.5, 0.65, 1],
      }}
    >
      {text}
    </motion.p>
  );
}

// =========================================
// NEON RAYS BACKGROUND
// =========================================
function NeonRays() {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {/* Center radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.07) 0%, rgba(255,0,255,0.03) 25%, transparent 65%)",
        }}
      />

      {/* Sweeping diagonal light rays */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute top-1/2 left-1/2 origin-bottom-left"
          style={{
            width: "1.5px",
            height: "600px",
            background: `linear-gradient(to top, transparent, ${
              i % 3 === 0
                ? "rgba(255,0,255,0.06)"
                : i % 3 === 1
                ? "rgba(0,255,255,0.05)"
                : "rgba(0,255,136,0.04)"
            }, transparent)`,
            transform: `rotate(${i * 36}deg)`,
            transformOrigin: "bottom center",
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            rotate: [i * 36, i * 36 + 8, i * 36],
          }}
          transition={{
            duration: 4 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// =========================================
// FLOATING NEON PARTICLES
// =========================================
function FloatingParticles() {
  // Deterministic positions using index-based seeding
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const pseudoRandA = ((i * 7 + 3) % 17) / 17;
    const pseudoRandB = ((i * 13 + 5) % 19) / 19;
    const pseudoRandC = ((i * 11 + 7) % 23) / 23;

    return {
      id: i,
      size: 2 + pseudoRandA * 3,
      left: pseudoRandB * 100,
      top: pseudoRandC * 100,
      color:
        i % 4 === 0
          ? "#ff00ff"
          : i % 4 === 1
          ? "#00ffff"
          : i % 4 === 2
          ? "#00ff88"
          : "#7c3aed",
      duration: 4 + pseudoRandA * 4,
      delay: pseudoRandB * 3,
    };
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}60`,
          }}
          animate={{
            y: [0, -40 - p.size * 5, 0],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * 15, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Y2KDigitalCrushProps {
  message: string;
  senderName?: string;
  imageUrl?: string;
}

const ERROR_MESSAGES = [
  "ERROR: 'No' is not a valid response",
  "FATAL: crush.exe cannot process rejection",
  "BSOD: Blue Screen of Denial detected",
  "WARNING: Heart overflow exception",
  "CRITICAL: love.dll failed to unload",
  "ERR_CONNECTION_REFUSED: feelings.sys",
  "0x80004005: Unspecified heartbreak error",
  "KERNEL PANIC: romance module corrupted",
  "ACCESS DENIED: rejection.exe blocked",
  "SEGFAULT: emotional core dumped",
  "ERR: Cannot read property 'no' of undefined",
  "FATAL: Stack overflow in feelings.js",
];

export function Y2KDigitalCrush({ message, senderName = "Someone Special", imageUrl }: Y2KDigitalCrushProps) {
  const [noClickCount, setNoClickCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-spawn errors that get faster as clicks increase
  useEffect(() => {
    if (noClickCount < 3) return;

    const speed = Math.max(300, 900 - noClickCount * 100);
    const interval = setInterval(() => {
      setErrorMessages((prev) => {
        const msg = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
        return [...prev, msg].slice(-6);
      });
    }, speed);

    return () => clearInterval(interval);
  }, [noClickCount]);

  // Continuous glitch flicker at high intensity
  useEffect(() => {
    if (glitchIntensity < 0.5) return;

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 50 + Math.random() * 100);
    }, 200 + Math.random() * 400);

    return () => clearInterval(interval);
  }, [glitchIntensity]);

  const handleNoClick = useCallback(() => {
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);

    // Trigger glitch flash
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 150 + newCount * 50);

    // Escalate glitch intensity (0-1 scale)
    setGlitchIntensity(Math.min(1, newCount * 0.15));

    // Add an error message
    const msg = ERROR_MESSAGES[Math.min(newCount - 1, ERROR_MESSAGES.length - 1)];
    setErrorMessages((prev) => [...prev, msg].slice(-6));
  }, [noClickCount]);

  const handleYesClick = () => {
    setShowSuccess(true);
    setGlitchIntensity(0);
    setErrorMessages([]);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
    }, 200);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0d0d1a" }}>
        <ScanLines />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 relative z-10"
          style={{
            background: "#1a1a2e",
            border: "3px solid #00ff88",
            boxShadow: "0 0 20px rgba(0,255,136,0.3), inset 0 0 20px rgba(0,255,136,0.05)",
            fontFamily: "'Courier New', monospace",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            💕
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#00ff88" }}>
            SYSTEM_RESPONSE: YES!!!
          </h2>
          <p className="text-cyan-300 text-sm">crush.exe completed successfully ✓</p>
        </motion.div>
      </div>
    );
  }

  // Glitch CSS filter based on intensity
  const glitchFilter = isGlitching
    ? `hue-rotate(${90 + glitchIntensity * 180}deg) saturate(${1 + glitchIntensity * 3}) brightness(${1 + glitchIntensity * 0.5})`
    : glitchIntensity > 0.3
    ? `hue-rotate(${glitchIntensity * 20}deg) saturate(${1 + glitchIntensity})`
    : "none";

  const glitchTransform = isGlitching
    ? `translate(${(Math.random() - 0.5) * glitchIntensity * 12}px, ${(Math.random() - 0.5) * glitchIntensity * 8}px) skewX(${(Math.random() - 0.5) * glitchIntensity * 5}deg)`
    : "none";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "#0d0d1a" }}>
      <ScanLines />

      {/* Pixelated background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#ff69b4 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Glitch color bands - appear at high intensity */}
      {glitchIntensity > 0.4 && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: Math.floor(glitchIntensity * 6) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0"
              style={{
                height: `${2 + Math.random() * 4}px`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 ? "rgba(255,0,0,0.15)" : "rgba(0,255,255,0.1)",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0, 1, 0],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
              }}
              transition={{
                duration: 0.1 + Math.random() * 0.3,
                repeat: Infinity,
                repeatDelay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Main card with glitch effect */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-sm"
        style={{
          filter: glitchFilter,
          transform: glitchTransform,
        }}
      >
        {/* Window title bar */}
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            background: "linear-gradient(90deg, #000080, #1084d0)",
            borderTop: "2px solid #dfdfdf",
            borderLeft: "2px solid #dfdfdf",
            borderRight: "2px solid #404040",
          }}
        >
          <span className="text-xs font-bold text-white" style={{ fontFamily: "'Courier New', monospace" }}>
            💕 crush.exe {noClickCount > 0 ? `[${noClickCount} error${noClickCount > 1 ? "s" : ""}]` : ""}
          </span>
          <div className="ml-auto flex gap-1">
            <Win95Button size="sm">_</Win95Button>
            <Win95Button size="sm">□</Win95Button>
            <Win95Button size="sm">×</Win95Button>
          </div>
        </div>

        {/* Window body */}
        <div
          className="p-6"
          style={{
            background: "#c0c0c0",
            borderLeft: "2px solid #dfdfdf",
            borderRight: "2px solid #404040",
            borderBottom: "2px solid #404040",
          }}
        >
          {/* Title */}
          <motion.h1
            className="text-center text-2xl font-bold mb-4 tracking-wider"
            style={{
              fontFamily: "'Courier New', monospace",
              color: "#ff1493",
              textShadow: "2px 2px 0 #00ffff, -1px -1px 0 #ff69b4",
            }}
            animate={{
              textShadow: [
                "2px 2px 0 #00ffff, -1px -1px 0 #ff69b4",
                "3px 1px 0 #00ffff, -2px 0px 0 #ff69b4",
                "2px 2px 0 #00ffff, -1px -1px 0 #ff69b4",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Y2K Digital Crush
          </motion.h1>

          {/* Pixel heart photo frame */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <PixelHeartFrame />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ top: "18px", left: "18px", right: "18px", bottom: "22px" }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Crush" className="w-16 h-16 object-cover" style={{ imageRendering: "pixelated" }} />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-3xl" style={{ background: "#ff69b4" }}>
                    💖
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sender name */}
          <p className="text-center text-xs mb-1" style={{ fontFamily: "'Courier New', monospace", color: "#666" }}>
            C:\Users\{senderName}\sent_with_love.txt
          </p>

          {/* Message */}
          <div
            className="p-3 mb-4 text-center"
            style={{
              background: "white",
              border: "2px inset #808080",
              fontFamily: "'Courier New', monospace",
              fontSize: "14px",
            }}
          >
            {message}
          </div>

          {/* Error messages console */}
          <AnimatePresence>
            {errorMessages.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mb-4 overflow-hidden"
              >
                <div
                  className="p-2 text-left overflow-hidden"
                  style={{
                    background: "#000",
                    border: "2px inset #808080",
                    maxHeight: "120px",
                  }}
                >
                  {errorMessages.map((msg, i) => (
                    <motion.p
                      key={`${msg}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] leading-tight mb-0.5"
                      style={{
                        fontFamily: "'Courier New', monospace",
                        color: i === errorMessages.length - 1 ? "#ff4444" : "#cc0000",
                        textShadow: i === errorMessages.length - 1 ? "0 0 4px #ff0000" : "none",
                      }}
                    >
                      &gt; {msg}
                    </motion.p>
                  ))}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="text-[11px]"
                    style={{ fontFamily: "'Courier New', monospace", color: "#ff4444" }}
                  >
                    _
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 relative min-h-[60px]">
            <motion.div
              animate={
                noClickCount >= 4
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 0 0px rgba(0,255,136,0)",
                        "0 0 15px rgba(0,255,136,0.4)",
                        "0 0 0px rgba(0,255,136,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Win95Button onClick={handleYesClick} variant="primary">
                YES PLS 💕
              </Win95Button>
            </motion.div>

            {/* No button - always visible but increasingly glitchy */}
            <motion.div
              animate={
                isGlitching && noClickCount > 0
                  ? {
                      x: (Math.random() - 0.5) * Math.min(noClickCount * 4, 20),
                      y: (Math.random() - 0.5) * Math.min(noClickCount * 3, 15),
                    }
                  : {}
              }
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
            >
              <Win95Button onClick={handleNoClick}>
                {noClickCount >= 5
                  ? "N̸̛͝ö̶́"
                  : noClickCount >= 3
                  ? "N̷o̷"
                  : "No"}
              </Win95Button>
            </motion.div>
          </div>

          {noClickCount > 0 && noClickCount < 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-3 text-xs"
              style={{ fontFamily: "'Courier New', monospace", color: "#ff0000" }}
            >
              ⚠ WARNING: &quot;No&quot; is not a valid response
            </motion.p>
          )}

          {noClickCount >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-center mt-3 text-xs font-bold"
              style={{ fontFamily: "'Courier New', monospace", color: "#ff0000", textShadow: "0 0 6px #ff0000" }}
            >
              ⚠ SYSTEM UNSTABLE — CLICK YES TO RESTORE ⚠
            </motion.p>
          )}
        </div>

        {/* Taskbar */}
        <div
          className="flex items-center px-2 py-1"
          style={{
            background: "#c0c0c0",
            borderTop: "2px solid #dfdfdf",
            borderBottom: "2px solid #404040",
          }}
        >
          <span className="text-[10px]" style={{ fontFamily: "'Courier New', monospace", color: noClickCount >= 3 ? "#ff0000" : "#666" }}>
            {noClickCount >= 3 ? "NOT RESPONDING" : "Ready"}
          </span>
          <span className="ml-auto text-[10px]" style={{ fontFamily: "'Courier New', monospace", color: "#666" }}>
            💕 {new Date().toLocaleDateString("en-US")}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Win95-style button
function Win95Button({
  children,
  onClick,
  variant = "default",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary";
  size?: "sm" | "md";
}) {
  const baseStyle = {
    fontFamily: "'Courier New', monospace",
    borderTop: "2px solid #dfdfdf",
    borderLeft: "2px solid #dfdfdf",
    borderRight: "2px solid #404040",
    borderBottom: "2px solid #404040",
    background: "#c0c0c0",
    cursor: "pointer",
  };

  return (
    <button
      onClick={onClick}
      className={`font-bold active:translate-y-px ${
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-6 py-2 text-sm"
      }`}
      style={{
        ...baseStyle,
        color: variant === "primary" ? "#000080" : "#000",
      }}
    >
      {children}
    </button>
  );
}

// Scan lines overlay
function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

// Pixel heart border (CSS art)
function PixelHeartFrame() {
  return (
    <div className="relative" style={{ width: "100px", height: "100px" }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Pixel heart outline */}
        <rect x="20" y="10" width="10" height="10" fill="#ff1493" />
        <rect x="30" y="10" width="10" height="10" fill="#ff1493" />
        <rect x="50" y="10" width="10" height="10" fill="#ff1493" />
        <rect x="60" y="10" width="10" height="10" fill="#ff1493" />
        <rect x="10" y="20" width="10" height="10" fill="#ff1493" />
        <rect x="40" y="20" width="10" height="10" fill="#ff1493" />
        <rect x="70" y="20" width="10" height="10" fill="#ff1493" />
        <rect x="10" y="30" width="10" height="10" fill="#ff1493" />
        <rect x="70" y="30" width="10" height="10" fill="#ff1493" />
        <rect x="10" y="40" width="10" height="10" fill="#ff1493" />
        <rect x="70" y="40" width="10" height="10" fill="#ff1493" />
        <rect x="20" y="50" width="10" height="10" fill="#ff1493" />
        <rect x="60" y="50" width="10" height="10" fill="#ff1493" />
        <rect x="30" y="60" width="10" height="10" fill="#ff1493" />
        <rect x="50" y="60" width="10" height="10" fill="#ff1493" />
        <rect x="40" y="70" width="10" height="10" fill="#ff1493" />
        {/* Inner fill */}
        <rect x="20" y="20" width="20" height="10" fill="#ff69b4" opacity="0.3" />
        <rect x="50" y="20" width="20" height="10" fill="#ff69b4" opacity="0.3" />
        <rect x="20" y="30" width="50" height="10" fill="#ff69b4" opacity="0.3" />
        <rect x="20" y="40" width="50" height="10" fill="#ff69b4" opacity="0.3" />
        <rect x="30" y="50" width="30" height="10" fill="#ff69b4" opacity="0.3" />
        <rect x="40" y="60" width="10" height="10" fill="#ff69b4" opacity="0.3" />
      </svg>
    </div>
  );
}

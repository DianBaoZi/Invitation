"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Y2KDigitalCrushProps {
  message: string;
  senderName?: string;
  imageUrl?: string;
}

// ─── Win95 Style Constants ───────────────────────────────────────────────────

const WIN_COLORS = {
  desktop: "#008080",
  windowBg: "#c0c0c0",
  titleBar: "#000080",
  titleBarActive: "#000080",
  borderLight: "#dfdfdf",
  borderDark: "#404040",
  borderDarkest: "#000000",
  buttonFace: "#c0c0c0",
  insetLight: "#808080",
  white: "#ffffff",
  black: "#000000",
};

const FONT_SYSTEM = "'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif";
const FONT_MONO = "'Courier New', Courier, monospace";

// ─── Desktop Icon Data ──────────────────────────────────────────────────────

interface DesktopIcon {
  id: string;
  label: string;
  emoji: string;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "mycomputer", label: "My Computer", emoji: "🖥️" },
  { id: "recyclebin", label: "Recycle Bin", emoji: "🗑️" },
  { id: "loveexe", label: "love.exe", emoji: "💾" },
  { id: "readme", label: "README.txt", emoji: "📄" },
];

// ─── Terminal Lines ─────────────────────────────────────────────────────────

function getTerminalLines(senderName: string, message: string): string[] {
  return [
    "C:\\> Loading love.exe...",
    "C:\\> Scanning heart database... FOUND: 1 match",
    `C:\\> Recipient: ${senderName}`,
    `C:\\> Message: ${message}`,
    "C:\\> Generating invitation...",
  ];
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function Y2KDigitalCrush({
  message,
  senderName = "Someone Special",
  imageUrl,
}: Y2KDigitalCrushProps) {
  // Phase: "desktop" | "terminal" | "invitation"
  const [phase, setPhase] = useState<"desktop" | "terminal" | "invitation">("desktop");

  // Desktop dialog windows
  const [openDialogs, setOpenDialogs] = useState<
    { id: string; title: string; content: string }[]
  >([]);

  // Terminal state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalDone, setTerminalDone] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const terminalIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Invitation (RSVP) state
  const [noClickCount, setNoClickCount] = useState(0);
  const [errorDialogs, setErrorDialogs] = useState<string[]>([]);
  const [noDeprecated, setNoDeprecated] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // ── Desktop icon click handler ──────────────────────────────────────────

  const handleIconClick = useCallback(
    (iconId: string) => {
      if (iconId === "loveexe") {
        setPhase("terminal");
        return;
      }

      const dialogContent: Record<string, { title: string; content: string }> = {
        mycomputer: {
          title: "My Computer",
          content: "No drives found...\nyour heart took all the space. 💕",
        },
        recyclebin: {
          title: "Recycle Bin",
          content: "Cannot delete feelings.exe\n\nAccess denied: file is in use by heart.sys",
        },
        readme: {
          title: "README.txt - Notepad",
          content: 'Hint: try love.exe 😉\n\nDouble-click "love.exe" on the desktop to continue.',
        },
      };

      const info = dialogContent[iconId];
      if (!info) return;

      // Stack dialog on top (avoid duplicates by id)
      setOpenDialogs((prev) => {
        const filtered = prev.filter((d) => d.id !== iconId);
        return [...filtered, { id: iconId, ...info }];
      });
    },
    []
  );

  const closeDialog = useCallback((id: string) => {
    setOpenDialogs((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ── Terminal typewriter effect ──────────────────────────────────────────

  useEffect(() => {
    if (phase !== "terminal") return;

    const lines = getTerminalLines(senderName, message);
    let lineIndex = 0;

    const typeNextLine = () => {
      if (lineIndex < lines.length) {
        setTerminalLines((prev) => [...prev, lines[lineIndex]]);
        lineIndex++;
        terminalIntervalRef.current = setTimeout(typeNextLine, 600);
      } else {
        // Start progress bar
        let progress = 0;
        progressIntervalRef.current = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress >= 100) {
            progress = 100;
            setProgressPercent(100);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setTerminalDone(true);
            // Auto-advance after a short pause
            setTimeout(() => setPhase("invitation"), 1200);
          } else {
            setProgressPercent(Math.floor(progress));
          }
        }, 200);
      }
    };

    terminalIntervalRef.current = setTimeout(typeNextLine, 400);

    return () => {
      if (terminalIntervalRef.current) clearTimeout(terminalIntervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [phase, senderName, message]);

  // ── RSVP handlers ─────────────────────────────────────────────────────

  const handleYesClick = useCallback(() => {
    setAccepted(true);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 100, spread: 120, origin: { y: 0.4 } });
    }, 300);
  }, []);

  const handleNoClick = useCallback(() => {
    const count = noClickCount + 1;
    setNoClickCount(count);

    if (count >= 5) {
      // Deprecate "No"
      setErrorDialogs([]);
      setNoDeprecated(true);
      return;
    }

    const errors = [
      "ERROR: 'No' is not a valid input. love.exe requires YES.",
      "WARNING: Rejection module not found in registry.",
      "FATAL: heart.dll refuses to unload feelings.",
      "CRITICAL: 'No' caused an access violation at 0x00000LOVE.",
      "BSOD: Blue Screen of Devotion triggered.",
    ];

    setErrorDialogs((prev) => [...prev, errors[count - 1]]);
  }, [noClickCount]);

  const closeErrorDialog = useCallback((index: number) => {
    setErrorDialogs((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Render ────────────────────────────────────────────────────────────

  // Success screen (after accepting)
  if (accepted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: WIN_COLORS.desktop }}
      >
        <ScanLines />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Win95Window title="love.exe — Connected" width="360px">
            <div className="text-center p-6">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💕
              </motion.div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: FONT_MONO, color: "#000080" }}
              >
                CONNECTION ESTABLISHED
              </h2>
              <p
                className="text-sm mb-4"
                style={{ fontFamily: FONT_MONO, color: "#333" }}
              >
                See you there!
              </p>
              {imageUrl && (
                <div className="flex justify-center mb-3">
                  <div
                    style={{
                      border: `2px inset ${WIN_COLORS.insetLight}`,
                      padding: "4px",
                      background: WIN_COLORS.white,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Valentine"
                      className="w-24 h-24 object-cover"
                      style={{ imageRendering: "auto" }}
                    />
                  </div>
                </div>
              )}
              <p
                className="text-xs"
                style={{ fontFamily: FONT_MONO, color: "#008000" }}
              >
                love.exe completed successfully ✓
              </p>
            </div>
          </Win95Window>
        </motion.div>
        <Taskbar />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden select-none"
      style={{ background: WIN_COLORS.desktop }}
    >
      <ScanLines />

      {/* Desktop grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ─── Phase 1: Desktop ─────────────────────────────────────────── */}
      {phase === "desktop" && (
        <>
          {/* Desktop Icons */}
          <div
            className="absolute top-4 left-4 flex flex-col gap-4 sm:gap-5 z-10"
            style={{ fontFamily: FONT_SYSTEM }}
          >
            {DESKTOP_ICONS.map((icon) => (
              <DesktopIconButton
                key={icon.id}
                icon={icon}
                onClick={() => handleIconClick(icon.id)}
              />
            ))}
          </div>

          {/* Dialogs */}
          <AnimatePresence>
            {openDialogs.map((dialog, i) => (
              <motion.div
                key={dialog.id}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute z-20"
                style={{
                  top: `${120 + i * 30}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  maxWidth: "calc(100vw - 32px)",
                }}
              >
                <Win95Window
                  title={dialog.title}
                  width="340px"
                  onClose={() => closeDialog(dialog.id)}
                >
                  <div className="p-4">
                    <p
                      className="text-sm whitespace-pre-line mb-4"
                      style={{ fontFamily: FONT_SYSTEM, color: "#000" }}
                    >
                      {dialog.content}
                    </p>
                    <div className="flex justify-center">
                      <Win95Button onClick={() => closeDialog(dialog.id)}>
                        OK
                      </Win95Button>
                    </div>
                  </div>
                </Win95Window>
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}

      {/* ─── Phase 2: Terminal ────────────────────────────────────────── */}
      {phase === "terminal" && (
        <div
          className="absolute inset-0 flex items-center justify-center p-4 z-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="w-full max-w-lg"
          >
            <Win95Window title="C:\WINDOWS\love.exe" width="100%">
              <div
                className="p-4"
                style={{
                  background: "#000",
                  minHeight: "260px",
                  border: `2px inset ${WIN_COLORS.insetLight}`,
                  fontFamily: FONT_MONO,
                  fontSize: "13px",
                  color: "#33ff33",
                  lineHeight: "1.6",
                }}
              >
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {line}
                  </motion.div>
                ))}

                {/* Progress bar */}
                {terminalLines.length >= getTerminalLines(senderName, message).length && (
                  <div className="mt-2">
                    <span style={{ color: "#33ff33" }}>
                      {"["}
                      {"█".repeat(Math.floor(progressPercent / 8))}
                      {"░".repeat(Math.max(0, 12 - Math.floor(progressPercent / 8)))}
                      {"]"} {progressPercent}%
                    </span>
                  </div>
                )}

                {/* Success message */}
                {terminalDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 font-bold"
                    style={{ color: "#00ff88" }}
                  >
                    INVITATION LOADED SUCCESSFULLY
                  </motion.div>
                )}

                {/* Blinking cursor */}
                {!terminalDone && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{ color: "#33ff33" }}
                  >
                    _
                  </motion.span>
                )}
              </div>
            </Win95Window>
          </motion.div>
        </div>
      )}

      {/* ─── Phase 3: Invitation / RSVP ──────────────────────────────── */}
      {phase === "invitation" && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
            className="w-full max-w-md"
          >
            <Win95Window title="love.exe — Invitation" width="100%">
              <div className="p-5">
                {/* Optional image */}
                {imageUrl && (
                  <div className="flex justify-center mb-4">
                    <div
                      style={{
                        border: `2px inset ${WIN_COLORS.insetLight}`,
                        padding: "4px",
                        background: WIN_COLORS.white,
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt="Valentine"
                        className="w-28 h-28 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Sender */}
                <p
                  className="text-xs text-center mb-1"
                  style={{ fontFamily: FONT_MONO, color: "#666" }}
                >
                  From: {senderName}
                </p>

                {/* Message */}
                <div
                  className="p-3 mb-5"
                  style={{
                    background: WIN_COLORS.white,
                    border: `2px inset ${WIN_COLORS.insetLight}`,
                    fontFamily: FONT_MONO,
                    fontSize: "14px",
                    textAlign: "center",
                    color: "#000",
                    lineHeight: "1.6",
                  }}
                >
                  {message}
                </div>

                {/* Accept label */}
                <p
                  className="text-sm text-center mb-3 font-bold"
                  style={{ fontFamily: FONT_SYSTEM, color: "#000" }}
                >
                  {noDeprecated
                    ? 'love.exe: "No" has been deprecated.'
                    : "Accept?"}
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    animate={
                      noDeprecated
                        ? {
                            scale: [1, 1.06, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Win95Button onClick={handleYesClick} variant="primary">
                      YES
                    </Win95Button>
                  </motion.div>

                  {!noDeprecated && (
                    <Win95Button onClick={handleNoClick}>NO</Win95Button>
                  )}
                </div>
              </div>
            </Win95Window>
          </motion.div>

          {/* Error dialogs stacked on top */}
          <AnimatePresence>
            {errorDialogs.map((errMsg, i) => (
              <motion.div
                key={`err-${i}`}
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute z-30"
                style={{
                  top: `${140 + i * 35}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  maxWidth: "calc(100vw - 32px)",
                }}
              >
                <Win95Window
                  title="love.exe — Error"
                  width="320px"
                  onClose={() => closeErrorDialog(i)}
                >
                  <div className="p-4 flex gap-3 items-start">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <div>
                      <p
                        className="text-sm mb-3"
                        style={{ fontFamily: FONT_SYSTEM, color: "#000" }}
                      >
                        {errMsg}
                      </p>
                      <Win95Button onClick={() => closeErrorDialog(i)}>
                        OK
                      </Win95Button>
                    </div>
                  </div>
                </Win95Window>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Taskbar (always visible) */}
      <Taskbar />
    </div>
  );
}

// ─── Win95 Window Component ─────────────────────────────────────────────────

function Win95Window({
  title,
  children,
  width = "auto",
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  width?: string;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        width,
        maxWidth: "100%",
        background: WIN_COLORS.windowBg,
        borderTop: `2px solid ${WIN_COLORS.borderLight}`,
        borderLeft: `2px solid ${WIN_COLORS.borderLight}`,
        borderRight: `2px solid ${WIN_COLORS.borderDarkest}`,
        borderBottom: `2px solid ${WIN_COLORS.borderDarkest}`,
        boxShadow: `inset -1px -1px 0 ${WIN_COLORS.borderDark}, inset 1px 1px 0 ${WIN_COLORS.white}`,
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center px-2 py-1"
        style={{
          background: `linear-gradient(90deg, ${WIN_COLORS.titleBar}, #1084d0)`,
          margin: "2px",
        }}
      >
        <span
          className="text-xs font-bold truncate"
          style={{ fontFamily: FONT_SYSTEM, color: WIN_COLORS.white }}
        >
          {title}
        </span>
        <div className="ml-auto flex gap-0.5 flex-shrink-0">
          <TitleBarButton label="_" />
          <TitleBarButton label="□" />
          <TitleBarButton label="×" onClick={onClose} />
        </div>
      </div>

      {/* Content */}
      <div style={{ margin: "0 2px 2px 2px" }}>{children}</div>
    </div>
  );
}

// ─── Title Bar Button ───────────────────────────────────────────────────────

function TitleBarButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        width: "16px",
        height: "14px",
        background: WIN_COLORS.buttonFace,
        borderTop: `1px solid ${WIN_COLORS.borderLight}`,
        borderLeft: `1px solid ${WIN_COLORS.borderLight}`,
        borderRight: `1px solid ${WIN_COLORS.borderDark}`,
        borderBottom: `1px solid ${WIN_COLORS.borderDark}`,
        fontFamily: FONT_SYSTEM,
        fontSize: "10px",
        fontWeight: "bold",
        lineHeight: 1,
        cursor: onClick ? "pointer" : "default",
        color: "#000",
        padding: 0,
      }}
    >
      {label}
    </button>
  );
}

// ─── Win95 Button ───────────────────────────────────────────────────────────

function Win95Button({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      className="active:translate-y-px"
      style={{
        fontFamily: FONT_SYSTEM,
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 24px",
        background: WIN_COLORS.buttonFace,
        borderTop: `2px solid ${WIN_COLORS.borderLight}`,
        borderLeft: `2px solid ${WIN_COLORS.borderLight}`,
        borderRight: `2px solid ${WIN_COLORS.borderDark}`,
        borderBottom: `2px solid ${WIN_COLORS.borderDark}`,
        cursor: "pointer",
        color: variant === "primary" ? WIN_COLORS.titleBar : WIN_COLORS.black,
        outline: variant === "primary" ? `1px dotted ${WIN_COLORS.black}` : "none",
        outlineOffset: "-4px",
        minWidth: "75px",
      }}
    >
      {children}
    </button>
  );
}

// ─── Desktop Icon Button ────────────────────────────────────────────────────

function DesktopIconButton({
  icon,
  onClick,
}: {
  icon: DesktopIcon;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onDoubleClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-center gap-1 p-1 rounded-sm cursor-pointer"
      style={{
        width: "72px",
        background: isHovered ? "rgba(0,0,128,0.3)" : "transparent",
        border: isHovered ? "1px dotted rgba(255,255,255,0.6)" : "1px solid transparent",
      }}
    >
      <span className="text-3xl leading-none" style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.3))" }}>
        {icon.emoji}
      </span>
      <span
        className="text-center leading-tight"
        style={{
          fontFamily: FONT_SYSTEM,
          fontSize: "11px",
          color: WIN_COLORS.white,
          textShadow: "1px 1px 1px rgba(0,0,0,0.8)",
          wordBreak: "break-word",
        }}
      >
        {icon.label}
      </span>
    </button>
  );
}

// ─── Taskbar ────────────────────────────────────────────────────────────────

function Taskbar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center px-1"
      style={{
        height: "28px",
        background: WIN_COLORS.windowBg,
        borderTop: `2px solid ${WIN_COLORS.borderLight}`,
      }}
    >
      {/* Start button */}
      <button
        className="flex items-center gap-1 h-5 px-2 mr-2"
        style={{
          fontFamily: FONT_SYSTEM,
          fontSize: "11px",
          fontWeight: "bold",
          background: WIN_COLORS.buttonFace,
          borderTop: `2px solid ${WIN_COLORS.borderLight}`,
          borderLeft: `2px solid ${WIN_COLORS.borderLight}`,
          borderRight: `2px solid ${WIN_COLORS.borderDark}`,
          borderBottom: `2px solid ${WIN_COLORS.borderDark}`,
          cursor: "pointer",
          color: "#000",
        }}
      >
        <span
          style={{
            background: "linear-gradient(180deg, #ff0000, #ffff00, #00ff00, #0000ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
            fontSize: "12px",
          }}
        >
          ■
        </span>
        Start
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Clock */}
      <div
        className="flex items-center h-5 px-2"
        style={{
          fontFamily: FONT_SYSTEM,
          fontSize: "11px",
          color: "#000",
          borderTop: `1px solid ${WIN_COLORS.borderDark}`,
          borderLeft: `1px solid ${WIN_COLORS.borderDark}`,
          borderRight: `1px solid ${WIN_COLORS.borderLight}`,
          borderBottom: `1px solid ${WIN_COLORS.borderLight}`,
        }}
      >
        💕 14:02
      </div>
    </div>
  );
}

// ─── Scan Lines Overlay ─────────────────────────────────────────────────────

function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 1px, #000 1px, #000 2px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

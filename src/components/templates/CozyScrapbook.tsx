"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";
import { saveResponse } from "@/lib/api/saveResponse";

interface CozyScrapbookProps {
  message: string;
  senderName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  photoUrl1?: string;
  photoUrl2?: string;
  slug?: string;
}

export function CozyScrapbook({
  message,
  senderName = "Someone Special",
  eventDate = "Valentine's Day",
  eventTime = "7:30 PM",
  eventLocation = "Somewhere romantic",
  photoUrl1,
  photoUrl2,
  slug,
}: CozyScrapbookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [noClicks, setNoClicks] = useState(0);
  const [noGone, setNoGone] = useState(false);
  const [flippingPage, setFlippingPage] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const [isMobile, setIsMobile] = useState(false);
  // Track which pages have completed flipping (for smooth transitions)
  const [flippedPages, setFlippedPages] = useState<number[]>([]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFlipPage = useCallback((pageIndex: number) => {
    if (flippingPage !== null) return;
    setFlipDirection("forward");
    setFlippingPage(pageIndex);
    // Mark page as flipped immediately so it stays visible during animation
    setFlippedPages(prev => [...prev, pageIndex]);
    setTimeout(() => {
      setCurrentPage(pageIndex + 1);
      setFlippingPage(null);
    }, 700);
  }, [flippingPage]);

  const handleFlipBack = useCallback(() => {
    if (flippingPage !== null || currentPage === 0) return;
    const prevPage = currentPage - 1;
    setFlipDirection("backward");
    setFlippingPage(prevPage); // Use same flipping state to prevent multiple clicks
    setFlippedPages(prev => prev.filter(p => p !== prevPage));
    setTimeout(() => {
      setCurrentPage(prevPage);
      setFlippingPage(null);
    }, 700);
  }, [flippingPage, currentPage]);

  const handleYes = () => {
    setShowSuccess(true);
    // Save RSVP response
    if (slug) {
      saveResponse(slug, "Yes");
    }
    const colors = ["#c27256", "#8b9e6b", "#d4a574", "#e8c9a0", "#a08060"];
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors, shapes: ["circle"], scalar: 1.4 });
    setTimeout(() => {
      confetti({ particleCount: 35, angle: 315, spread: 55, origin: { x: 0, y: 0.2 }, colors: ["#c27256", "#d4a574"], shapes: ["circle"], scalar: 1.5, drift: 1 });
      confetti({ particleCount: 35, angle: 225, spread: 55, origin: { x: 1, y: 0.2 }, colors: ["#8b9e6b", "#a08060"], shapes: ["circle"], scalar: 1.5, drift: -1 });
    }, 200);
  };

  const handleNoInteract = () => {
    if (noGone) return;
    const clicks = noClicks + 1;
    setNoClicks(clicks);
    if (clicks >= 3) setNoGone(true);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 50%, #e6d5c3 100%)" }}
    >
      <PaperTexture />
      <BackgroundDecorations />

      <div className="relative z-10 flex items-center justify-center p-4">
        {showSuccess ? (
          <SuccessState senderName={senderName} />
        ) : isMobile ? (
          <MobileScrapbook
            currentPage={currentPage}
            flippingPage={flippingPage}
            flippedPages={flippedPages}
            onFlipPage={handleFlipPage}
            onFlipBack={handleFlipBack}
            message={message}
            senderName={senderName}
            photoUrl1={photoUrl1}
            photoUrl2={photoUrl2}
            eventDate={eventDate}
            eventTime={eventTime}
            eventLocation={eventLocation}
            onYes={handleYes}
            onNoInteract={handleNoInteract}
            noClicks={noClicks}
            noGone={noGone}
          />
        ) : (
          <DesktopScrapbook
            currentPage={currentPage}
            flippingPage={flippingPage}
            flippedPages={flippedPages}
            flipDirection={flipDirection}
            onFlipPage={handleFlipPage}
            onFlipBack={handleFlipBack}
            message={message}
            senderName={senderName}
            photoUrl1={photoUrl1}
            photoUrl2={photoUrl2}
            eventDate={eventDate}
            eventTime={eventTime}
            eventLocation={eventLocation}
            onYes={handleYes}
            onNoInteract={handleNoInteract}
            noClicks={noClicks}
            noGone={noGone}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// DESKTOP SCRAPBOOK - Open book layout
// ============================================

function DesktopScrapbook({
  currentPage,
  flippingPage,
  flippedPages,
  flipDirection,
  onFlipPage,
  onFlipBack,
  message,
  senderName,
  photoUrl1,
  photoUrl2,
  eventDate,
  eventTime,
  eventLocation,
  onYes,
  onNoInteract,
  noClicks,
  noGone,
}: {
  currentPage: number;
  flippingPage: number | null;
  flippedPages: number[];
  flipDirection: "forward" | "backward";
  onFlipPage: (page: number) => void;
  onFlipBack: () => void;
  message: string;
  senderName: string;
  photoUrl1?: string;
  photoUrl2?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  onYes: () => void;
  onNoInteract: () => void;
  noClicks: number;
  noGone: boolean;
}) {
  const pageWidth = 320;
  const pageHeight = 540; // Increased height for photo + buttons

  return (
    <div
      style={{
        perspective: "2000px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Book container */}
      <div
        style={{
          position: "relative",
          width: pageWidth * 2 + 16,
          height: pageHeight,
          display: "flex",
        }}
      >
        {/* Book spine shadow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 8,
            bottom: 8,
            width: 16,
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, rgba(92,58,33,0.2) 0%, rgba(92,58,33,0.08) 30%, rgba(92,58,33,0.08) 70%, rgba(92,58,33,0.2) 100%)",
            borderRadius: 4,
            zIndex: 50,
          }}
        />

        {/* === LEFT SIDE: Turned pages stack here === */}
        <div
          onClick={currentPage > 0 && flippingPage === null ? onFlipBack : undefined}
          style={{
            width: pageWidth,
            height: pageHeight,
            position: "relative",
            transformStyle: "preserve-3d",
            cursor: currentPage > 0 && flippingPage === null ? "pointer" : "default",
          }}
        >
          {/* Back navigation hint (visible when there are flipped pages) */}
          {currentPage > 0 && flippingPage === null && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                background: "rgba(92,58,33,0.08)",
                borderRadius: 20,
                fontSize: 11,
                color: "#a08060",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                pointerEvents: "none",
              }}
            >
              <span style={{ fontSize: 14 }}>←</span> tap to go back
            </div>
          )}
          {/* Inside of cover (visible when cover is flipped, hide immediately when flipping back) */}
          <AnimatePresence>
            {(flippedPages.includes(0) || currentPage >= 1) && !(flippingPage === 0 && flipDirection === "backward") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: flippingPage === 0 ? 0.35 : 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 100%)",
                  borderRadius: "12px 4px 4px 12px",
                  boxShadow: "inset -4px 0 12px rgba(92,58,33,0.1)",
                  overflow: "hidden",
                }}
              >
                <InsideCoverBack />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back of message page (visible when page 1 is flipped, hide immediately when flipping back) */}
          <AnimatePresence>
            {(flippedPages.includes(1) || currentPage >= 2) && !(flippingPage === 1 && flipDirection === "backward") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: flippingPage === 1 ? 0.35 : 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
                  borderRadius: "12px 4px 4px 12px",
                  boxShadow: "inset -4px 0 12px rgba(92,58,33,0.08)",
                  zIndex: 2,
                }}
              >
                <PageBack pattern="dots" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === RIGHT SIDE: Current pages flip from here === */}
        <div
          style={{
            width: pageWidth,
            height: pageHeight,
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base: RSVP page (always visible underneath) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
              borderRadius: "4px 12px 12px 4px",
              boxShadow: "4px 4px 20px rgba(92,58,33,0.15)",
              overflow: "hidden",
            }}
          >
            <PageTexture />
            <RSVPPage
              eventDate={eventDate}
              eventTime={eventTime}
              eventLocation={eventLocation}
              photoUrl1={photoUrl1}
              onYes={onYes}
              onNoInteract={onNoInteract}
              noClicks={noClicks}
              noGone={noGone}
            />
          </div>

          {/* Message page - flips to left (keep visible during flip animation) */}
          {(currentPage < 2 || flippingPage === 1) && (
            <FlippablePageDesktop
              isFlipping={flippingPage === 1}
              isFlipped={currentPage >= 2}
              flipDirection={flipDirection}
              onClick={currentPage === 1 && flippingPage === null ? () => onFlipPage(1) : undefined}
              zIndex={5}
            >
              <MessagePage message={message} senderName={senderName} photoUrl2={photoUrl2} showHint={currentPage === 1 && flippingPage === null} />
            </FlippablePageDesktop>
          )}

          {/* Cover - flips to left (keep visible during flip animation) */}
          {(currentPage < 1 || flippingPage === 0) && (
            <FlippablePageDesktop
              isFlipping={flippingPage === 0}
              isFlipped={currentPage >= 1}
              flipDirection={flipDirection}
              onClick={currentPage === 0 && flippingPage === null ? () => onFlipPage(0) : undefined}
              zIndex={10}
              isCover
            >
              <CoverPage />
            </FlippablePageDesktop>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MOBILE SCRAPBOOK - Vertical flip down
// ============================================

function MobileScrapbook({
  currentPage,
  flippingPage,
  flippedPages,
  onFlipPage,
  onFlipBack,
  message,
  senderName,
  photoUrl1,
  photoUrl2,
  eventDate,
  eventTime,
  eventLocation,
  onYes,
  onNoInteract,
  noClicks,
  noGone,
}: {
  currentPage: number;
  flippingPage: number | null;
  flippedPages: number[];
  onFlipPage: (page: number) => void;
  onFlipBack: () => void;
  message: string;
  senderName: string;
  photoUrl1?: string;
  photoUrl2?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  onYes: () => void;
  onNoInteract: () => void;
  noClicks: number;
  noGone: boolean;
}) {
  return (
    <div
      style={{
        perspective: "1500px",
        width: "min(320px, 90vw)",
      }}
    >
      {/* Stacked pages - flipped pages stay visible above */}
      <div style={{ position: "relative" }}>
        {/* Flipped cover (shows at top when flipped) - tap to go back */}
        <AnimatePresence>
          {currentPage >= 1 && (
            <motion.div
              onClick={flippingPage === null && currentPage === 1 ? onFlipBack : undefined}
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 80, opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(145deg, #d4a574 0%, #c29366 100%)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(92,58,33,0.15)",
                cursor: flippingPage === null && currentPage === 1 ? "pointer" : "default",
              }}
            >
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📖</span>
                  <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#5c3a21" }}>
                    A Scrapbook
                  </span>
                </div>
                {currentPage === 1 && flippingPage === null && (
                  <span style={{ fontSize: 11, color: "#8b6914", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                    ← tap to go back
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flipped message page (shows when page 1 flipped) */}
        <AnimatePresence>
          {currentPage >= 2 && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 80, opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(92,58,33,0.12)",
              }}
            >
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>💝</span>
                <div>
                  <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 14, color: "#5c3a21" }}>
                    A Little Something
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#8b7355", fontStyle: "italic" }}>
                    from {senderName}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current page stack */}
        <div style={{ position: "relative", height: "min(560px, 75vh)" }}>
          {/* Base: RSVP page */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(92,58,33,0.15)",
              overflow: "hidden",
            }}
          >
            <PageTexture />
            <RSVPPage
              eventDate={eventDate}
              eventTime={eventTime}
              eventLocation={eventLocation}
              photoUrl1={photoUrl1}
              onYes={onYes}
              onNoInteract={onNoInteract}
              noClicks={noClicks}
              noGone={noGone}
            />
          </div>

          {/* Message page (keep visible during flip) */}
          {(currentPage < 2 || flippingPage === 1) && (
            <FlippablePageMobile
              isFlipping={flippingPage === 1}
              onClick={currentPage === 1 && flippingPage === null ? () => onFlipPage(1) : undefined}
              zIndex={5}
            >
              <MessagePage message={message} senderName={senderName} photoUrl2={photoUrl2} showHint={currentPage === 1 && flippingPage === null} />
            </FlippablePageMobile>
          )}

          {/* Cover (keep visible during flip) */}
          {(currentPage < 1 || flippingPage === 0) && (
            <FlippablePageMobile
              isFlipping={flippingPage === 0}
              onClick={currentPage === 0 && flippingPage === null ? () => onFlipPage(0) : undefined}
              zIndex={10}
              isCover
            >
              <CoverPage />
            </FlippablePageMobile>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FLIPPABLE PAGE - Desktop (flips left)
// ============================================

function FlippablePageDesktop({
  children,
  isFlipping,
  isFlipped,
  flipDirection = "forward",
  onClick,
  zIndex,
  isCover = false,
}: {
  children: React.ReactNode;
  isFlipping: boolean;
  isFlipped?: boolean;
  flipDirection?: "forward" | "backward";
  onClick?: () => void;
  zIndex: number;
  isCover?: boolean;
}) {
  const controls = useAnimation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isFlipping) {
      if (flipDirection === "backward") {
        // Flipping backward: instantly set to -180, then animate to 0
        controls.set({ rotateY: -180 });
        controls.start({ rotateY: 0, transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] } });
      } else {
        // Flipping forward: animate from current position to -180
        controls.start({ rotateY: -180, transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] } });
      }
    } else {
      // Not flipping - set to final state
      const targetRotation = isFlipped ? -180 : 0;
      if (!hasInitialized.current) {
        // First render - set instantly without animation
        controls.set({ rotateY: targetRotation });
        hasInitialized.current = true;
      } else {
        // Subsequent renders - this happens after flip completes, no animation needed
        controls.set({ rotateY: targetRotation });
      }
    }
  }, [isFlipping, flipDirection, isFlipped, controls]);

  return (
    <motion.div
      onClick={onClick}
      animate={controls}
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        cursor: onClick ? "pointer" : "default",
        zIndex,
      }}
    >
      {/* Front face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          background: isCover
            ? "linear-gradient(145deg, #d4a574 0%, #c29366 50%, #b8845a 100%)"
            : "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
          borderRadius: "4px 12px 12px 4px",
          boxShadow: isFlipping
            ? "-8px 0 24px rgba(92,58,33,0.3)"
            : "4px 4px 20px rgba(92,58,33,0.15)",
          overflow: "hidden",
        }}
      >
        {!isCover && <PageTexture />}
        {children}
      </div>

      {/* Back face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 100%)",
          borderRadius: "12px 4px 4px 12px",
          boxShadow: "inset -4px 0 12px rgba(92,58,33,0.1)",
          overflow: "hidden",
        }}
      >
        {isCover ? <InsideCoverBack /> : <PageBack pattern="dots" />}
      </div>
    </motion.div>
  );
}

// ============================================
// FLIPPABLE PAGE - Mobile (flips up)
// ============================================

function FlippablePageMobile({
  children,
  isFlipping,
  onClick,
  zIndex,
  isCover = false,
}: {
  children: React.ReactNode;
  isFlipping: boolean;
  onClick?: () => void;
  zIndex: number;
  isCover?: boolean;
}) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ rotateX: 0, y: 0 }}
      animate={{
        rotateX: isFlipping ? -90 : 0,
        y: isFlipping ? -40 : 0,
        opacity: isFlipping ? 0 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
        cursor: onClick ? "pointer" : "default",
        zIndex,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isCover
            ? "linear-gradient(145deg, #d4a574 0%, #c29366 50%, #b8845a 100%)"
            : "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(92,58,33,0.15)",
          overflow: "hidden",
        }}
      >
        {!isCover && <PageTexture />}
        {children}
      </div>
    </motion.div>
  );
}

// ============================================
// PAGE CONTENT COMPONENTS
// ============================================

function CoverPage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        overflow: "hidden",
      }}
    >
      {/* Leather texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />

      {/* Embossed border frame */}
      <div
        style={{
          position: "absolute",
          inset: 12,
          border: "3px double rgba(139,105,20,0.25)",
          borderRadius: 8,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 20,
          border: "1px solid rgba(139,105,20,0.15)",
          borderRadius: 4,
          pointerEvents: "none",
        }}
      />

      {/* Corner flourishes */}
      {[
        { top: 24, left: 24, rot: 0 },
        { top: 24, right: 24, rot: 90 },
        { bottom: 24, right: 24, rot: 180 },
        { bottom: 24, left: 24, rot: 270 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            right: pos.right,
            width: 24,
            height: 24,
            transform: `rotate(${pos.rot}deg)`,
            opacity: 0.35,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#5c3a21" strokeWidth="1.5">
            <path d="M2 2 C2 12, 12 22, 22 22" strokeLinecap="round" />
            <path d="M2 8 C2 14, 10 22, 16 22" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {/* Decorative stitching line */}
      <div
        style={{
          position: "absolute",
          left: 32,
          top: 40,
          bottom: 40,
          width: 2,
          backgroundImage: `repeating-linear-gradient(to bottom, #8b6914 0px, #8b6914 6px, transparent 6px, transparent 10px)`,
          opacity: 0.3,
        }}
      />

      {/* Main content area - vintage label style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "relative",
          background: "linear-gradient(145deg, #faf6f0 0%, #f5ece0 100%)",
          padding: "28px 32px",
          borderRadius: 6,
          boxShadow: `
            0 2px 8px rgba(92,58,33,0.15),
            0 8px 24px rgba(92,58,33,0.1),
            inset 0 1px 0 rgba(255,255,255,0.8)
          `,
          textAlign: "center",
          transform: "rotate(-1deg)",
          border: "1px solid rgba(194,114,86,0.2)",
        }}
      >
        {/* Vintage paper texture on label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 6,
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative top flourish */}
        <div style={{ marginBottom: 8 }}>
          <svg width="80" height="16" viewBox="0 0 80 16" style={{ opacity: 0.4 }}>
            <path
              d="M0 8 Q10 2, 20 8 T40 8 T60 8 T80 8"
              stroke="#c27256"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="40" cy="8" r="3" fill="#c27256" />
          </svg>
        </div>

        {/* Heart emblem */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 14px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #c27256 0%, #a85d45 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(194,114,86,0.35), inset 0 2px 4px rgba(255,255,255,0.2)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#faf6f0">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 28,
            fontWeight: 600,
            color: "#4a3423",
            marginBottom: 6,
            letterSpacing: "0.02em",
          }}
        >
          Our Scrapbook
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 17,
            color: "#8b7355",
            fontStyle: "italic",
            letterSpacing: "0.05em",
          }}
        >
          a collection of memories
        </p>

        {/* Decorative bottom flourish */}
        <div style={{ marginTop: 10 }}>
          <svg width="60" height="12" viewBox="0 0 60 12" style={{ opacity: 0.35 }}>
            <path d="M0 6 L20 6 M40 6 L60 6" stroke="#5c3a21" strokeWidth="1" />
            <circle cx="30" cy="6" r="4" fill="none" stroke="#5c3a21" strokeWidth="1" />
            <circle cx="30" cy="6" r="2" fill="#5c3a21" />
          </svg>
        </div>
      </motion.div>

      {/* Spine detail - left edge */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 8,
          background: "linear-gradient(90deg, rgba(92,58,33,0.15) 0%, transparent 100%)",
        }}
      />

      {/* Tap hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "absolute",
          bottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(92,58,33,0.5)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 11,
            color: "rgba(92,58,33,0.6)",
            fontStyle: "italic",
            letterSpacing: "0.1em",
          }}
        >
          tap to open
        </span>
      </motion.div>
    </div>
  );
}

function MessagePage({ message, senderName, photoUrl2, showHint }: { message: string; senderName: string; photoUrl2?: string; showHint: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 24, paddingTop: 32 }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(transparent, transparent 26px, rgba(212,196,176,0.18) 26px, rgba(212,196,176,0.18) 27px)`, backgroundPositionY: 20, pointerEvents: "none" }} />
      <WashiTape style={{ position: "absolute", top: -6, left: 28, width: 75, transform: "rotate(-3deg)" }} color="#c27256" />

      {photoUrl2 ? (
        <motion.div initial={{ opacity: 0, rotate: -5 }} animate={{ opacity: 1, rotate: 2 }} transition={{ delay: 0.2 }} style={{ background: "#fff", padding: "6px 6px 28px 6px", borderRadius: 2, boxShadow: "0 5px 18px rgba(107,82,64,0.2)", marginBottom: 16 }}>
          <img src={photoUrl2} alt="Our moment" style={{ width: 120, height: 120, objectFit: "cover", display: "block" }} />
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 13, color: "#8b7355", textAlign: "center", marginTop: 8 }}>us ♡</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginTop: 16, marginBottom: 20, fontSize: 52 }}>💝</motion.div>
      )}

      <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: "#5c3a21", marginBottom: 6, position: "relative", zIndex: 1 }}>A Little Something</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#8b7355", fontStyle: "italic", marginBottom: 12, wordBreak: "break-word", overflowWrap: "break-word" }}>from {senderName}</motion.p>
      <div style={{ width: 50, height: 2, background: "linear-gradient(90deg, transparent, #c27256, transparent)", marginBottom: 12 }} />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: "#6b5240", fontStyle: "italic", textAlign: "center", lineHeight: 1.65, padding: "0 8px", maxHeight: 100, overflow: "hidden", position: "relative", zIndex: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
        {message.length > 100 ? message.slice(0, 100) + "..." : message}
      </motion.p>

      <div style={{ position: "absolute", bottom: 36, right: 20, opacity: 0.12 }}><SketchyHeart size={18} color="#c27256" /></div>
      <div style={{ position: "absolute", bottom: 50, left: 18, opacity: 0.12 }}><SketchyHeart size={12} color="#8b9e6b" /></div>

      {showHint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.8, 0.4], y: [0, 3, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ position: "absolute", bottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, color: "#b09878", fontStyle: "italic" }}>tap to continue</span>
          <span style={{ fontSize: 12, color: "#b09878" }}>→</span>
        </motion.div>
      )}
    </div>
  );
}

function RSVPPage({ eventDate, eventTime, eventLocation, photoUrl1, onYes, onNoInteract, noClicks, noGone }: { eventDate: string; eventTime: string; eventLocation: string; photoUrl1?: string; onYes: () => void; onNoInteract: () => void; noClicks: number; noGone: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 24px", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(transparent, transparent 26px, rgba(212,196,176,0.18) 26px, rgba(212,196,176,0.18) 27px)`, backgroundPositionY: 20, pointerEvents: "none" }} />
      <WashiTape style={{ position: "absolute", top: -6, right: 20, width: 65, transform: "rotate(5deg)" }} color="#8b9e6b" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: 28, marginBottom: 4 }}>✨</motion.div>
      <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 24, color: "#5c3a21", marginBottom: 12, position: "relative", zIndex: 1 }}>Save the Date!</motion.h3>

      {/* Photo Frame - Polaroid style */}
      {photoUrl1 && (
        <motion.div
          initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 2, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
          style={{
            background: "#fff",
            padding: "4px 4px 14px 4px",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(107,82,64,0.2)",
            marginBottom: 8,
            transform: "rotate(2deg)",
          }}
        >
          <img
            src={photoUrl1}
            alt="Our memory"
            style={{
              width: 70,
              height: 70,
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 10,
            color: "#8b7355",
            textAlign: "center",
            marginTop: 4,
          }}>
            us ♡
          </p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 16px", background: "rgba(255,255,255,0.8)", borderRadius: 10, border: "2px dashed #d4c4b0", marginBottom: 20, position: "relative", zIndex: 1, width: "100%", maxWidth: 260 }}>
        <EventDetailRow icon="📅" label="When" value={eventDate} />
        <EventDetailRow icon="⏰" label="Time" value={eventTime} />
        <EventDetailRow icon="📍" label="Where" value={eventLocation} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h4 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 18, color: "#5c3a21", marginBottom: 2 }}>What do you say?</h4>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#a08060", fontStyle: "italic", marginBottom: 12 }}>Your answer means the world</p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <motion.button onClick={onYes} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#fff", background: "linear-gradient(135deg, #8b9e6b 0%, #7a8d5c 100%)", border: "none", borderRadius: 20, padding: "10px 28px", cursor: "pointer", boxShadow: "0 5px 18px rgba(139,158,107,0.4)" }}>
            Yes! 💕
          </motion.button>

          <div style={{ minWidth: 50, display: "flex", justifyContent: "center" }}>
            {!noGone ? (
              <motion.button onClick={onNoInteract} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: noClicks >= 2 ? "#d4c4b0" : "#c4b5a4", background: "transparent", border: "none", cursor: "pointer", fontStyle: "italic", padding: "6px 10px", position: "relative", transition: "color 0.3s ease" }}>
                no...
                <svg style={{ position: "absolute", top: -4, left: -4, width: "calc(100% + 8px)", height: "calc(100% + 8px)", pointerEvents: "none" }} viewBox="0 0 50 30" preserveAspectRatio="none">
                  {noClicks >= 1 && <motion.path d="M5 15 Q15 12 25 16 Q35 20 45 14" stroke="#c27256" strokeWidth="2.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} />}
                  {noClicks >= 2 && <motion.path d="M3 18 Q20 10 30 17 Q40 22 48 12" stroke="#8b9e6b" strokeWidth="2" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} />}
                  {noClicks >= 2 && <motion.path d="M8 20 Q25 8 42 18" stroke="#c27256" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }} />}
                </svg>
              </motion.button>
            ) : (
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} style={{ fontSize: 22 }}>🌸</motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <div style={{ position: "absolute", bottom: 8, left: 14, opacity: 0.1 }}><SketchyHeart size={12} color="#8b9e6b" /></div>
    </div>
  );
}

// ============================================
// PAGE BACKS & HELPER COMPONENTS
// ============================================

function PageBack({ pattern }: { pattern: "dots" | "lines" }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, opacity: pattern === "dots" ? 0.08 : 0.05, backgroundImage: pattern === "dots" ? `radial-gradient(circle, #8b7355 1px, transparent 1px)` : `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(139,115,85,0.3) 20px, rgba(139,115,85,0.3) 21px)`, backgroundSize: pattern === "dots" ? "16px 16px" : "100% 21px" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent 40%, rgba(139,115,85,0.05) 100%)" }} />
      <span style={{ fontSize: 28, opacity: 0.15 }}>🌿</span>
    </div>
  );
}

function InsideCoverBack() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238b7355' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
      <div style={{ background: "rgba(253,248,240,0.9)", padding: "20px 28px", borderRadius: 8, border: "2px solid rgba(139,115,85,0.2)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, color: "#a08060", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>From the heart of</p>
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 20, color: "#5c3a21" }}>Someone who loves you</p>
      </div>
      <div style={{ position: "absolute", top: 16, left: 16, opacity: 0.1 }}><CornerFlourish /></div>
      <div style={{ position: "absolute", bottom: 16, right: 16, opacity: 0.1, transform: "rotate(180deg)" }}><CornerFlourish /></div>
    </div>
  );
}

function CornerFlourish() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M2 38C2 20 20 2 38 2" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 38C8 24 24 8 38 8" stroke="#8b7355" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SuccessState({ senderName }: { senderName: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      {[0, 1, 2, 3, 4].map((i) => <FallingPetal key={i} index={i} />)}
      <motion.div initial={{ scale: 0.8, opacity: 0, rotate: -2 }} animate={{ scale: [1, 1.02, 1], opacity: 1, rotate: [0, 1, -1, 0] }} transition={{ scale: { duration: 4, repeat: Infinity }, rotate: { duration: 6, repeat: Infinity }, opacity: { duration: 0.5 } }} style={{ background: "linear-gradient(145deg, #fdf8f0 0%, #f5ebe0 100%)", borderRadius: 18, padding: "48px 40px", textAlign: "center", maxWidth: 340, boxShadow: "0 14px 44px rgba(107,82,64,0.18)", position: "relative", zIndex: 2, border: "1px solid rgba(212,165,116,0.2)" }}>
        <WashiTape style={{ position: "absolute", top: -7, left: 28, width: 65, transform: "rotate(-4deg)" }} color="#c27256" />
        <WashiTape style={{ position: "absolute", top: -7, right: 28, width: 65, transform: "rotate(4deg)" }} color="#8b9e6b" />
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 58, marginBottom: 16 }}>🌿</motion.div>
        <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 34, color: "#5c3a21", marginBottom: 10, fontWeight: 700 }}>You said yes!</h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#8b7355", fontStyle: "italic", lineHeight: 1.65 }}>This is the beginning of<br />something beautiful...</p>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(212,196,176,0.4)" }}>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 15, color: "#a08060", wordBreak: "break-word", overflowWrap: "break-word" }}>with love, {senderName} 💕</p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// UTILITY COMPONENTS
// ============================================

function PageTexture() {
  return <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, pointerEvents: "none" }} />;
}

function WashiTape({ style, color }: { style: React.CSSProperties; color: string }) {
  return <div style={{ height: 15, background: `linear-gradient(90deg, ${color}cc, ${color}aa)`, opacity: 0.55, borderRadius: 2, ...style }} />;
}

function EventDetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, color: "#a08060", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 1 }}>{label}</p>
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#5c3a21", fontWeight: 600, wordBreak: "break-word", overflowWrap: "break-word" }}>{value}</p>
      </div>
    </div>
  );
}

function FallingPetal({ index }: { index: number }) {
  const petals = ["🌸", "🍃", "🌿", "🌷", "🍂"];
  const startX = -55 + index * 30;
  return (
    <motion.div initial={{ y: -50, x: startX, opacity: 0, rotate: 0 }} animate={{ y: ["-50px", "350px"], x: [startX + "px", startX + (index % 2 === 0 ? 30 : -30) + "px"], opacity: [0, 0.7, 0.7, 0], rotate: [0, 180 + index * 45] }} transition={{ duration: 4.2 + index * 0.5, delay: index * 0.7, repeat: Infinity, ease: "easeIn" }} style={{ position: "absolute", top: -25, fontSize: 18, zIndex: 1, pointerEvents: "none" }}>
      {petals[index]}
    </motion.div>
  );
}

function SketchyHeart({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  return (
    <div style={{ position: "relative", width: size, height: size * 0.9 }}>
      <div style={{ position: "absolute", top: 0, left: half / 2, width: half, height: half, borderRadius: `${half}px ${half}px 0 0`, background: color, transform: "rotate(-45deg)", transformOrigin: "0 100%" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: half, height: half, borderRadius: `${half}px ${half}px 0 0`, background: color, transform: "rotate(45deg)", transformOrigin: "100% 100%" }} />
    </div>
  );
}

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
        <div key={i} style={{ position: "absolute", top: item.top, left: item.left, right: (item as Record<string, unknown>).right as string | undefined, bottom: item.bottom, fontSize: item.size, opacity: 0.06, transform: `rotate(${item.rotate}deg)`, userSelect: "none", pointerEvents: "none", zIndex: 0 }}>
          {item.emoji}
        </div>
      ))}
    </>
  );
}

function PaperTexture() {
  return <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")` }} />;
}

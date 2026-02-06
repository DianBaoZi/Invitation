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
  eventDate = "14-Feb-2026",
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
                background: "linear-gradient(145deg, #a67c52 0%, #8b5e3c 50%, #7a4f32 100%)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(92,58,33,0.15), inset 0 1px 2px rgba(255,255,255,0.1)",
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

        {/* Flipped message page (shows when page 1 flipped) - tap to go back */}
        <AnimatePresence>
          {currentPage >= 2 && (
            <motion.div
              onClick={flippingPage === null && currentPage === 2 ? onFlipBack : undefined}
              initial={{ height: 0, opacity: 0, marginBottom: 0 }}
              animate={{ height: 80, opacity: 1, marginBottom: 12 }}
              exit={{ height: 0, opacity: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                background: "linear-gradient(145deg, #fdf8f0 0%, #f8f0e5 100%)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(92,58,33,0.12)",
                cursor: flippingPage === null && currentPage === 2 ? "pointer" : "default",
              }}
            >
              <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                {currentPage === 2 && flippingPage === null && (
                  <span style={{ fontSize: 11, color: "#8b6914", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
                    ← tap to go back
                  </span>
                )}
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
              flipDirection={flipDirection}
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
              flipDirection={flipDirection}
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
            ? "linear-gradient(145deg, #a67c52 0%, #8b5e3c 30%, #7a4f32 60%, #6b4228 100%)"
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
  flipDirection = "forward",
  onClick,
  zIndex,
  isCover = false,
}: {
  children: React.ReactNode;
  isFlipping: boolean;
  flipDirection?: "forward" | "backward";
  onClick?: () => void;
  zIndex: number;
  isCover?: boolean;
}) {
  // For forward: flip up and out (rotateX: -90)
  // For backward: flip down and in (start at rotateX: -90, end at 0)
  const isBackward = flipDirection === "backward";

  return (
    <motion.div
      onClick={onClick}
      initial={isBackward && isFlipping ? { rotateX: -90, y: -40, opacity: 0 } : { rotateX: 0, y: 0, opacity: 1 }}
      animate={{
        rotateX: isFlipping && !isBackward ? -90 : 0,
        y: isFlipping && !isBackward ? -40 : 0,
        opacity: isFlipping && !isBackward ? 0 : 1,
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
            ? "linear-gradient(145deg, #a67c52 0%, #8b5e3c 30%, #7a4f32 60%, #6b4228 100%)"
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
        padding: 16,
        overflow: "hidden",
      }}
    >
      {/* Leather grain texture - primary layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23leather)'/%3E%3C/svg%3E")`,
          mixBlendMode: "multiply",
        }}
      />
      {/* Leather subtle highlights */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 30% 25%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {/* Leather edge darkening (worn look) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 40px rgba(60,30,10,0.25), inset 0 0 80px rgba(60,30,10,0.1)",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
      {/* Leather stitching - top */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 16,
          right: 16,
          height: 2,
          backgroundImage: `repeating-linear-gradient(90deg, #8b6240 0px, #8b6240 6px, transparent 6px, transparent 10px)`,
          opacity: 0.35,
        }}
      />
      {/* Leather stitching - bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 16,
          right: 16,
          height: 2,
          backgroundImage: `repeating-linear-gradient(90deg, #8b6240 0px, #8b6240 6px, transparent 6px, transparent 10px)`,
          opacity: 0.35,
        }}
      />
      {/* Leather stitching - left */}
      <div
        style={{
          position: "absolute",
          top: 16,
          bottom: 16,
          left: 10,
          width: 2,
          backgroundImage: `repeating-linear-gradient(180deg, #8b6240 0px, #8b6240 6px, transparent 6px, transparent 10px)`,
          opacity: 0.35,
        }}
      />
      {/* Leather stitching - right */}
      <div
        style={{
          position: "absolute",
          top: 16,
          bottom: 16,
          right: 10,
          width: 2,
          backgroundImage: `repeating-linear-gradient(180deg, #8b6240 0px, #8b6240 6px, transparent 6px, transparent 10px)`,
          opacity: 0.35,
        }}
      />

      {/* Decorative ribbon bow at top */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <svg width="80" height="45" viewBox="0 0 80 45">
          {/* Ribbon tails */}
          <path d="M25 22 Q15 30, 8 42" stroke="#e8a4a4" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M55 22 Q65 30, 72 42" stroke="#e8a4a4" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Left loop */}
          <ellipse cx="22" cy="18" rx="16" ry="12" fill="#f4b8b8" />
          <ellipse cx="22" cy="18" rx="12" ry="8" fill="#e8a4a4" />
          {/* Right loop */}
          <ellipse cx="58" cy="18" rx="16" ry="12" fill="#f4b8b8" />
          <ellipse cx="58" cy="18" rx="12" ry="8" fill="#e8a4a4" />
          {/* Center knot */}
          <circle cx="40" cy="20" r="8" fill="#dc8c8c" />
          <circle cx="40" cy="20" r="5" fill="#c87878" />
        </svg>
      </div>

      {/* Cute stickers scattered around */}
      {/* Heart sticker - top left */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: -15 }}
        transition={{ delay: 0.2, type: "spring" }}
        style={{
          position: "absolute",
          top: 60,
          left: 16,
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.15))",
        }}
      >
        <svg width="42" height="38" viewBox="0 0 42 38">
          <path d="M21 35 C5 22, 0 12, 8 5 C14 0, 21 6, 21 12 C21 6, 28 0, 34 5 C42 12, 37 22, 21 35Z" fill="#ff6b8a" />
          <path d="M14 10 Q16 7, 19 10" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Star sticker - top right */}
      <motion.div
        initial={{ scale: 0, rotate: 10 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ delay: 0.3, type: "spring" }}
        style={{
          position: "absolute",
          top: 70,
          right: 20,
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.15))",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36">
          <path d="M18 2 L22 14 L34 14 L24 22 L28 34 L18 26 L8 34 L12 22 L2 14 L14 14 Z" fill="#ffd93d" />
          <path d="M18 8 L20 14 L26 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Flower sticker - bottom left */}
      <motion.div
        initial={{ scale: 0, rotate: 5 }}
        animate={{ scale: 1, rotate: -8 }}
        transition={{ delay: 0.4, type: "spring" }}
        style={{
          position: "absolute",
          bottom: 80,
          left: 20,
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.15))",
        }}
      >
        <svg width="38" height="38" viewBox="0 0 38 38">
          {/* Petals */}
          <ellipse cx="19" cy="10" rx="7" ry="9" fill="#ffb5d1" />
          <ellipse cx="28" cy="16" rx="7" ry="9" fill="#ffb5d1" transform="rotate(72 19 19)" />
          <ellipse cx="25" cy="27" rx="7" ry="9" fill="#ffb5d1" transform="rotate(144 19 19)" />
          <ellipse cx="13" cy="27" rx="7" ry="9" fill="#ffb5d1" transform="rotate(216 19 19)" />
          <ellipse cx="10" cy="16" rx="7" ry="9" fill="#ffb5d1" transform="rotate(288 19 19)" />
          {/* Center */}
          <circle cx="19" cy="19" r="6" fill="#ffdd57" />
          <circle cx="17" cy="17" r="1.5" fill="#f0c040" />
          <circle cx="21" cy="18" r="1" fill="#f0c040" />
          <circle cx="19" cy="21" r="1.2" fill="#f0c040" />
        </svg>
      </motion.div>

      {/* Butterfly sticker - bottom right */}
      <motion.div
        initial={{ scale: 0, rotate: -5 }}
        animate={{ scale: 1, rotate: 10 }}
        transition={{ delay: 0.5, type: "spring" }}
        style={{
          position: "absolute",
          bottom: 90,
          right: 18,
          filter: "drop-shadow(2px 2px 3px rgba(0,0,0,0.15))",
        }}
      >
        <svg width="40" height="32" viewBox="0 0 40 32">
          {/* Wings */}
          <ellipse cx="12" cy="14" rx="10" ry="12" fill="#b8e0ff" />
          <ellipse cx="28" cy="14" rx="10" ry="12" fill="#b8e0ff" />
          <ellipse cx="10" cy="12" rx="4" ry="5" fill="#8cc8ff" />
          <ellipse cx="30" cy="12" rx="4" ry="5" fill="#8cc8ff" />
          {/* Body */}
          <ellipse cx="20" cy="16" rx="2.5" ry="10" fill="#6b5240" />
          {/* Antennae */}
          <path d="M18 6 Q16 2, 14 0" stroke="#6b5240" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M22 6 Q24 2, 26 0" stroke="#6b5240" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Small heart stickers scattered */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        style={{ position: "absolute", top: 140, left: 45, fontSize: 16 }}
      >
        💕
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        style={{ position: "absolute", top: 180, right: 40, fontSize: 14 }}
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ position: "absolute", bottom: 140, left: 55, fontSize: 16 }}
      >
        🌸
      </motion.div>

      {/* Main title card - like a cute label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "relative",
          background: "linear-gradient(145deg, #fffbf5 0%, #fff5eb 100%)",
          padding: "32px 28px",
          borderRadius: 16,
          boxShadow: `
            0 4px 20px rgba(194,114,86,0.2),
            0 8px 32px rgba(92,58,33,0.1),
            inset 0 2px 0 rgba(255,255,255,0.9)
          `,
          textAlign: "center",
          border: "3px solid #f0d4c4",
          marginTop: 20,
        }}
      >
        {/* Decorative tape on corners */}
        <div
          style={{
            position: "absolute",
            top: -8,
            left: 15,
            width: 45,
            height: 16,
            background: "linear-gradient(90deg, #a8d8a8 0%, #8bc88b 100%)",
            transform: "rotate(-8deg)",
            borderRadius: 2,
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -8,
            right: 15,
            width: 45,
            height: 16,
            background: "linear-gradient(90deg, #f4b8b8 0%, #e8a4a4 100%)",
            transform: "rotate(8deg)",
            borderRadius: 2,
            opacity: 0.85,
          }}
        />

        {/* Big heart icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: 56,
            marginBottom: 8,
            filter: "drop-shadow(0 4px 8px rgba(255,107,138,0.3))",
          }}
        >
          💝
        </motion.div>

        {/* Title - much bigger */}
        <h2
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 38,
            fontWeight: 700,
            color: "#5c3a21",
            marginBottom: 8,
            textShadow: "1px 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          Our Scrapbook
        </h2>

        {/* Subtitle - bigger */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20,
            color: "#a08060",
            fontStyle: "italic",
            letterSpacing: "0.03em",
          }}
        >
          a collection of memories
        </p>

        {/* Decorative hearts row */}
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 14, opacity: 0.6 }}>♡</span>
          <span style={{ fontSize: 18, color: "#ff6b8a" }}>♥</span>
          <span style={{ fontSize: 14, opacity: 0.6 }}>♡</span>
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
          background: "linear-gradient(90deg, rgba(92,58,33,0.12) 0%, transparent 100%)",
        }}
      />

      {/* Tap hint - bigger */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          position: "absolute",
          bottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c27256" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
        <span
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 16,
            color: "#c27256",
            fontWeight: 600,
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
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 16, color: "#8b7355", textAlign: "center", marginTop: 8 }}>us ♡</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, rotate: -3 }}
          animate={{ opacity: 1, rotate: 2 }}
          transition={{ delay: 0.2 }}
          style={{
            background: "#fff",
            padding: "6px 6px 24px 6px",
            borderRadius: 2,
            boxShadow: "0 5px 18px rgba(107,82,64,0.2)",
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          {/* Empty polaroid frame */}
          <div
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(145deg, #f5ebe0 0%, #ede0d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px dashed rgba(139,115,85,0.3)",
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.3 }}>📷</span>
          </div>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 14, color: "#b09878", textAlign: "center", marginTop: 8, fontStyle: "italic" }}>your photo here</p>
        </motion.div>
      )}

      <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 30, color: "#5c3a21", marginBottom: 8, position: "relative", zIndex: 1 }}>A Little Something</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: "#8b7355", fontStyle: "italic", marginBottom: 14, wordBreak: "break-word", overflowWrap: "break-word" }}>from {senderName}</motion.p>
      <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #c27256, transparent)", marginBottom: 14 }} />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: "#6b5240", fontStyle: "italic", textAlign: "center", lineHeight: 1.7, padding: "0 8px", maxHeight: 110, overflow: "hidden", position: "relative", zIndex: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
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
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 16px 20px", boxSizing: "border-box", overflow: "visible" }}>
      <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(transparent, transparent 26px, rgba(212,196,176,0.18) 26px, rgba(212,196,176,0.18) 27px)`, backgroundPositionY: 20, pointerEvents: "none" }} />
      <WashiTape style={{ position: "absolute", top: -6, right: 20, width: 65, transform: "rotate(5deg)" }} color="#8b9e6b" />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} style={{ fontSize: 26, marginBottom: 2 }}>✨</motion.div>
      <motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 26, color: "#5c3a21", marginBottom: 8, position: "relative", zIndex: 1 }}>Save the Date!</motion.h3>

      {/* Photo Frame - Polaroid style */}
      {photoUrl1 && (
        <motion.div
          initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 2, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 200 }}
          style={{
            background: "#fff",
            padding: "3px 3px 10px 3px",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(107,82,64,0.2)",
            marginBottom: 6,
            transform: "rotate(2deg)",
          }}
        >
          <img
            src={photoUrl1}
            alt="Our memory"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              display: "block",
            }}
          />
          <p style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 9,
            color: "#8b7355",
            textAlign: "center",
            marginTop: 3,
          }}>
            us ♡
          </p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 14px", background: "rgba(255,255,255,0.8)", borderRadius: 10, border: "2px dashed #d4c4b0", marginBottom: 14, position: "relative", zIndex: 1, width: "100%", maxWidth: 260 }}>
        <EventDetailRow icon={<ScrapbookCalendarIcon />} label="When" value={eventDate} />
        <EventDetailRow icon={<ScrapbookClockIcon />} label="Time" value={eventTime} />
        <EventDetailRow icon={<ScrapbookLocationIcon />} label="Where" value={eventLocation} />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h4 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 22, color: "#5c3a21", marginBottom: 2 }}>What do you say?</h4>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: "#a08060", fontStyle: "italic", marginBottom: 10 }}>Your answer means the world</p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <motion.button onClick={onYes} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: 20, color: "#fff", background: "linear-gradient(135deg, #8b9e6b 0%, #7a8d5c 100%)", border: "none", borderRadius: 24, padding: "12px 32px", cursor: "pointer", boxShadow: "0 5px 18px rgba(139,158,107,0.4)" }}>
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
        <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ marginBottom: 16 }}>
          <ScrapbookSuccessFlower />
        </motion.div>
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

function EventDetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: "#a08060", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{label}</p>
        <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 19, color: "#5c3a21", fontWeight: 600, wordBreak: "break-word", overflowWrap: "break-word" }}>{value}</p>
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

// Hand-drawn style calendar icon for scrapbook aesthetic
function ScrapbookCalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(1px 1px 0px rgba(139,115,85,0.15))" }}>
      {/* Calendar body - slightly imperfect rectangle */}
      <path
        d="M4.5 7C4.5 5.8 5.4 5 6.5 5H17.5C18.6 5 19.5 5.9 19.5 7V18C19.5 19.1 18.5 20 17.5 20H6.5C5.4 20 4.5 19 4.5 18V7Z"
        fill="#faf5ef"
        stroke="#8b7355"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top bar with rings */}
      <path d="M4.5 10H19.5" stroke="#c27256" strokeWidth="1.5" strokeLinecap="round" />
      {/* Ring holes - decorative circles */}
      <circle cx="8" cy="4" r="1.2" fill="#d4c4b0" stroke="#8b7355" strokeWidth="0.8" />
      <circle cx="16" cy="4" r="1.2" fill="#d4c4b0" stroke="#8b7355" strokeWidth="0.8" />
      {/* Ring arcs */}
      <path d="M8 3V6" stroke="#8b7355" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 3V6" stroke="#8b7355" strokeWidth="1.2" strokeLinecap="round" />
      {/* Heart mark on calendar */}
      <path
        d="M12 13.5C12 13.5 10 12 10 13.5C10 14.5 12 16 12 16C12 16 14 14.5 14 13.5C14 12 12 13.5 12 13.5Z"
        fill="#c27256"
        stroke="#c27256"
        strokeWidth="0.5"
      />
      {/* Decorative corner fold */}
      <path d="M17 17L19.5 20" stroke="#d4c4b0" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// Vintage clock icon for scrapbook aesthetic
function ScrapbookClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(1px 1px 0px rgba(139,115,85,0.15))" }}>
      {/* Clock face - slightly organic circle */}
      <circle cx="12" cy="12" r="9" fill="#faf5ef" stroke="#8b7355" strokeWidth="1.5" />
      {/* Inner decorative ring */}
      <circle cx="12" cy="12" r="7" fill="none" stroke="#d4c4b0" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* Hour markers with hearts at 12 and 6 */}
      <circle cx="12" cy="5.5" r="0.8" fill="#c27256" />
      <circle cx="12" cy="18.5" r="0.8" fill="#c27256" />
      <circle cx="5.5" cy="12" r="0.6" fill="#8b7355" />
      <circle cx="18.5" cy="12" r="0.6" fill="#8b7355" />
      {/* Clock hands - slightly whimsical */}
      <path d="M12 12L12 7.5" stroke="#5c3a21" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 12L15.5 12" stroke="#c27256" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot with decorative ring */}
      <circle cx="12" cy="12" r="1.5" fill="#c27256" />
      <circle cx="12" cy="12" r="0.6" fill="#faf5ef" />
      {/* Small flower decoration at top */}
      <circle cx="18" cy="5" r="1.5" fill="#f5e6d8" stroke="#8b9e6b" strokeWidth="0.6" />
      <circle cx="18" cy="5" r="0.5" fill="#c27256" />
    </svg>
  );
}

// Location pin icon for scrapbook aesthetic
function ScrapbookLocationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ filter: "drop-shadow(1px 1px 0px rgba(139,115,85,0.15))" }}>
      {/* Pin body - organic teardrop shape */}
      <path
        d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z"
        fill="linear-gradient(180deg, #c27256 0%, #a85d42 100%)"
        stroke="#8b7355"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gradient fill simulation with layered shapes */}
      <path
        d="M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z"
        fill="#c27256"
      />
      <path
        d="M12 3C8.5 3 6 5.5 6 9C6 13 12 20 12 20C12 20 18 13 18 9C18 5.5 15.5 3 12 3Z"
        fill="#d4846a"
      />
      {/* Inner circle - like a vintage map marker */}
      <circle cx="12" cy="9" r="3.5" fill="#faf5ef" stroke="#8b7355" strokeWidth="0.8" />
      {/* Heart in center */}
      <path
        d="M12 8C12 8 10.5 7 10.5 8C10.5 8.8 12 10 12 10C12 10 13.5 8.8 13.5 8C13.5 7 12 8 12 8Z"
        fill="#c27256"
      />
      {/* Decorative highlight */}
      <path d="M8 6C8.5 4.5 10 3.5 12 3.5" stroke="#faf5ef" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// Beautiful hand-drawn flower for "You said yes!" success state
function ScrapbookSuccessFlower() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ filter: "drop-shadow(2px 3px 4px rgba(139,115,85,0.2))" }}>
      {/* Outer petals - soft pink blush */}
      <ellipse cx="30" cy="14" rx="8" ry="12" fill="#f8d4d4" stroke="#e8a0a0" strokeWidth="1" transform="rotate(0 30 30)" />
      <ellipse cx="30" cy="14" rx="8" ry="12" fill="#f5d0d0" stroke="#e8a0a0" strokeWidth="1" transform="rotate(72 30 30)" />
      <ellipse cx="30" cy="14" rx="8" ry="12" fill="#f8d4d4" stroke="#e8a0a0" strokeWidth="1" transform="rotate(144 30 30)" />
      <ellipse cx="30" cy="14" rx="8" ry="12" fill="#f5d0d0" stroke="#e8a0a0" strokeWidth="1" transform="rotate(216 30 30)" />
      <ellipse cx="30" cy="14" rx="8" ry="12" fill="#f8d4d4" stroke="#e8a0a0" strokeWidth="1" transform="rotate(288 30 30)" />

      {/* Inner petals - deeper rose */}
      <ellipse cx="30" cy="19" rx="5" ry="8" fill="#f0b8b8" stroke="#d4846a" strokeWidth="0.8" transform="rotate(36 30 30)" />
      <ellipse cx="30" cy="19" rx="5" ry="8" fill="#edb0b0" stroke="#d4846a" strokeWidth="0.8" transform="rotate(108 30 30)" />
      <ellipse cx="30" cy="19" rx="5" ry="8" fill="#f0b8b8" stroke="#d4846a" strokeWidth="0.8" transform="rotate(180 30 30)" />
      <ellipse cx="30" cy="19" rx="5" ry="8" fill="#edb0b0" stroke="#d4846a" strokeWidth="0.8" transform="rotate(252 30 30)" />
      <ellipse cx="30" cy="19" rx="5" ry="8" fill="#f0b8b8" stroke="#d4846a" strokeWidth="0.8" transform="rotate(324 30 30)" />

      {/* Center - warm golden yellow */}
      <circle cx="30" cy="30" r="8" fill="#f5e6c8" stroke="#d4a574" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="5" fill="#ecd9a8" />

      {/* Center dots - like flower pollen */}
      <circle cx="28" cy="28" r="1" fill="#c9a86c" />
      <circle cx="32" cy="28" r="1" fill="#c9a86c" />
      <circle cx="30" cy="32" r="1" fill="#c9a86c" />
      <circle cx="27" cy="31" r="0.8" fill="#c9a86c" />
      <circle cx="33" cy="31" r="0.8" fill="#c9a86c" />
      <circle cx="30" cy="27" r="0.8" fill="#c9a86c" />

      {/* Highlight on center */}
      <circle cx="28" cy="29" r="2" fill="white" opacity="0.3" />

      {/* Small leaves at bottom */}
      <path d="M25 48C25 48 22 42 25 38C28 42 25 48 25 48Z" fill="#8b9e6b" stroke="#6b7e4b" strokeWidth="0.8" />
      <path d="M35 48C35 48 38 42 35 38C32 42 35 48 35 48Z" fill="#8b9e6b" stroke="#6b7e4b" strokeWidth="0.8" />

      {/* Stem hint */}
      <path d="M30 38V48" stroke="#6b7e4b" strokeWidth="2" strokeLinecap="round" />
    </svg>
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

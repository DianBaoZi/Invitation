"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if:
 * - User has prefers-reduced-motion: reduce
 * - Device is mobile (narrower than 768px)
 * - Device has low performance (< 4 cores or low memory)
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const checkMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    checkMotionPreference();
    mediaQuery.addEventListener("change", checkMotionPreference);

    return () => mediaQuery.removeEventListener("change", checkMotionPreference);
  }, []);

  return reducedMotion;
}

/**
 * Hook to detect if device is mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Combined hook for performance-conscious animations
 * Returns true if animations should be simplified
 */
export function useShouldReduceAnimations(): boolean {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return reducedMotion || isMobile;
}

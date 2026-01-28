"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "invite";

  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/i/${slug}`;
  const statusUrl = `${baseUrl}/status/${slug}`;

  // Fire confetti on mount
  useEffect(() => {
    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Second burst after a short delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5, x: 0.3 },
      });
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.5, x: 0.7 },
      });
    }, 300);
  }, []);

  // Copy share link
  const handleCopyShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Copy status link
  const handleCopyStatus = async () => {
    await navigator.clipboard.writeText(statusUrl);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      {/* Floating hearts */}
      <FloatingHearts />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6 text-center"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
        >
          Your link is ready! 🎉
        </motion.h1>

        {/* Box 1: Share with crush */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <h3 className="font-semibold text-gray-800">Share this with your crush</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <p className="text-sm text-gray-700 truncate">{shareUrl}</p>
              </div>
              <Button
                onClick={handleCopyShare}
                size="sm"
                className={`shrink-0 h-10 px-4 ${
                  copiedShare
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                } text-white`}
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Box 2: Check if opened */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Bookmark className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Check if they opened it</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                <p className="text-sm text-gray-700 truncate">{statusUrl}</p>
              </div>
              <Button
                onClick={handleCopyStatus}
                size="sm"
                className={`shrink-0 h-10 px-4 ${
                  copiedStatus
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                } text-white`}
              >
                {copiedStatus ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Bookmark this to check later
            </p>
          </div>
        </motion.div>

        {/* Email note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 text-center mb-6"
        >
          We've also sent these links to your email
        </motion.p>

        {/* Create another button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            Create another invite
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================
// FLOATING HEARTS
// ============================================

function FloatingHearts() {
  const hearts = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {hearts.map((i) => (
        <motion.div
          key={i}
          className="absolute text-pink-200/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${25 + Math.random() * 35}px`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// MAIN EXPORT
// ============================================

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}

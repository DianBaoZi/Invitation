"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star, Mail, Trees, BookOpen, Camera } from "lucide-react";

// This page renders just the splash screen for a template
// Used as iframe source for thumbnail previews on homepage

export default function SplashPreviewPage() {
  const params = useParams();
  const templateId = params.templateId as string;

  const splashProps = {
    creatorName: "Your Name",
    isPaid: true,
    appName: "YoursInvite",
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {templateId === "runaway-button" && <RunawayButtonSplash {...splashProps} />}
      {templateId === "love-letter-mailbox" && <LoveLetterSplash {...splashProps} />}
      {templateId === "forest-adventure" && <ForestAdventureSplash {...splashProps} />}
      {templateId === "stargazer" && <StargazerSplash {...splashProps} />}
      {templateId === "cozy-scrapbook" && <CozyScrapbookSplash {...splashProps} />}
      {templateId === "elegant-invitation" && <ElegantInvitationSplash {...splashProps} />}
      {templateId === "premiere" && <PremiereSplash {...splashProps} />}
    </div>
  );
}

interface SplashProps {
  creatorName: string;
  isPaid: boolean;
  appName: string;
}

// Runaway Button - Playful pink with hearts
function RunawayButtonSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 flex items-center justify-center relative overflow-hidden">
      {/* Floating hearts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${10 + (i * 11) % 80}%`,
            fontSize: `${16 + (i % 3) * 8}px`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          ♥
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-16 h-16 text-rose-500 fill-rose-500 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold text-rose-600 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}
        </h1>
        <p className="text-rose-400 text-sm">has something to ask you...</p>
      </motion.div>
    </div>
  );
}

// Love Letter - Romantic mailbox theme
function LoveLetterSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
      {/* Envelope decorations */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200"
          style={{
            left: `${5 + (i * 12) % 90}%`,
            top: `${15 + (i * 13) % 70}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <Mail className="w-6 h-6" />
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4"
        >
          <div className="w-20 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg mx-auto relative shadow-lg">
            <div className="absolute inset-x-0 top-0 h-8 bg-rose-300 rounded-t-lg"
              style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
          </div>
        </motion.div>
        <h1 className="text-2xl font-bold text-rose-600 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          A Letter from {creatorName}
        </h1>
        <p className="text-rose-400 text-sm">Sealed with love</p>
      </motion.div>
    </div>
  );
}

// Forest Adventure - Nature theme
function ForestAdventureSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 via-green-700 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Fireflies */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            left: `${5 + (i * 7) % 90}%`,
            top: `${10 + (i * 9) % 80}%`,
            boxShadow: "0 0 10px 3px rgba(253, 224, 71, 0.6)",
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + i * 0.2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Trees className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold text-emerald-100 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}
        </h1>
        <p className="text-emerald-300 text-sm">invites you on an adventure</p>
      </motion.div>
    </div>
  );
}

// Stargazer - Cosmic night sky
function StargazerSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Star className="w-16 h-16 text-yellow-300 fill-yellow-300 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}
        </h1>
        <p className="text-purple-300 text-sm">wants to stargaze with you</p>
      </motion.div>
    </div>
  );
}

// Cozy Scrapbook - Warm craft aesthetic
function CozyScrapbookSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center relative overflow-hidden">
      {/* Paper texture elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i * 15) % 80}%`,
            top: `${15 + (i * 12) % 70}%`,
            transform: `rotate(${-15 + i * 8}deg)`,
          }}
          animate={{
            rotate: [-15 + i * 8, -10 + i * 8, -15 + i * 8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          <div className="w-8 h-10 bg-white/60 rounded shadow-sm border border-amber-200/50" />
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <BookOpen className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold text-amber-800 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}&apos;s Scrapbook
        </h1>
        <p className="text-amber-600 text-sm">A collection of memories</p>
      </motion.div>
    </div>
  );
}

// Elegant Invitation - Refined and sophisticated
function ElegantInvitationSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative flourishes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200"
          style={{
            left: `${5 + (i * 12) % 90}%`,
            top: `${10 + (i * 11) % 80}%`,
            fontSize: "24px",
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          ❀
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Camera className="w-16 h-16 text-rose-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-2xl font-bold text-stone-700 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}
        </h1>
        <p className="text-rose-400 text-sm">cordially invites you</p>
      </motion.div>
    </div>
  );
}

// Premiere - Cinema/film theme
function PremiereSplash({ creatorName }: SplashProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-red-950 flex items-center justify-center relative overflow-hidden">
      {/* Spotlight effects */}
      <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-yellow-500/10 to-transparent transform -skew-x-12" />
      <div className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-yellow-500/10 to-transparent transform skew-x-12" />

      {/* Stars */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${10 + (i * 9) % 80}%`,
            top: `${20 + (i * 7) % 60}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          ★
        </motion.div>
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          🎬
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {creatorName}
        </h1>
        <p className="text-red-300 text-sm">presents a special premiere</p>
      </motion.div>
    </div>
  );
}

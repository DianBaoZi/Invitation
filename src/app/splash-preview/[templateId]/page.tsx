"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Star, Mail, Trees, BookOpen, Camera } from "lucide-react";

// Renders animated splash background for template thumbnails on homepage
// Only shows background animations + center icon, no text (card overlay handles that)

export default function SplashPreviewPage() {
  const params = useParams();
  const templateId = params.templateId as string;

  return (
    <div className="w-full h-full overflow-hidden">
      {templateId === "runaway-button" && <RunawayButtonSplash />}
      {templateId === "love-letter-mailbox" && <LoveLetterSplash />}
      {templateId === "forest-adventure" && <ForestAdventureSplash />}
      {templateId === "stargazer" && <StargazerSplash />}
      {templateId === "cozy-scrapbook" && <CozyScrapbookSplash />}
      {templateId === "elegant-invitation" && <ElegantInvitationSplash />}
      {templateId === "premiere" && <PremiereSplash />}
    </div>
  );
}

// Runaway Button - Romantic dreamy aesthetic with depth
function RunawayButtonSplash() {
  // Deterministic heart positions to avoid hydration issues
  const hearts = [
    { left: 8, top: 12, size: 28, delay: 0 },
    { left: 85, top: 8, size: 22, delay: 0.3 },
    { left: 15, top: 75, size: 32, delay: 0.6 },
    { left: 78, top: 68, size: 24, delay: 0.9 },
    { left: 45, top: 5, size: 20, delay: 1.2 },
    { left: 92, top: 45, size: 26, delay: 1.5 },
    { left: 5, top: 42, size: 18, delay: 1.8 },
    { left: 55, top: 85, size: 30, delay: 2.1 },
    { left: 32, top: 22, size: 16, delay: 2.4 },
    { left: 68, top: 35, size: 24, delay: 2.7 },
    { left: 22, top: 55, size: 20, delay: 3.0 },
    { left: 88, top: 82, size: 22, delay: 3.3 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Layered gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(251,113,133,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(244,63,94,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(253,164,175,0.2) 0%, transparent 70%),
            linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #fecdd3 75%, #ffe4e6 100%)
          `,
        }}
      />

      {/* Soft glow orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(251,113,133,0.3) 0%, transparent 70%)",
          left: "20%",
          top: "30%",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.25) 0%, transparent 70%)",
          right: "15%",
          bottom: "25%",
          filter: "blur(35px)",
        }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.4, 0.6] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Floating hearts with depth */}
      {hearts.map((heart, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            fontSize: `${heart.size}px`,
            filter: heart.size > 24 ? "blur(0.5px)" : "none",
            opacity: heart.size > 26 ? 0.6 : 0.4,
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, -5, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: heart.delay,
            ease: "easeInOut",
          }}
        >
          <span style={{
            background: "linear-gradient(135deg, #fb7185, #f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 4px 20px rgba(244,63,94,0.4)",
          }}>
            ♥
          </span>
        </motion.div>
      ))}

      {/* Center heart with glow ring */}
      <div className="relative z-10">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
            transform: "scale(2)",
          }}
          animate={{ scale: [2, 2.5, 2], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart
            className="w-24 h-24 drop-shadow-2xl"
            style={{
              fill: "url(#heartGradient)",
              stroke: "none",
              filter: "drop-shadow(0 8px 25px rgba(244,63,94,0.5))",
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Sparkle particles */}
      {[
        { left: 25, top: 20, delay: 0 },
        { left: 75, top: 25, delay: 0.5 },
        { left: 30, top: 70, delay: 1 },
        { left: 70, top: 75, delay: 1.5 },
        { left: 50, top: 15, delay: 2 },
        { left: 85, top: 55, delay: 2.5 },
      ].map((sparkle, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            boxShadow: "0 0 6px 2px rgba(255,255,255,0.8)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Love Letter - Romantic mailbox theme
function LoveLetterSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-pink-100 flex items-center justify-center relative overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200"
          style={{
            left: `${5 + (i * 10) % 90}%`,
            top: `${10 + (i * 11) % 80}%`,
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [-5, 5, -5],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.25,
          }}
        >
          <Mail className="w-7 h-7" />
        </motion.div>
      ))}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="z-10"
      >
        <div className="w-24 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg relative shadow-xl">
          <div
            className="absolute inset-x-0 top-0 h-10 bg-rose-300 rounded-t-lg"
            style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
          />
          <Heart className="w-6 h-6 text-white fill-white absolute bottom-2 left-1/2 -translate-x-1/2" />
        </div>
      </motion.div>
    </div>
  );
}

// Forest Adventure - Nature theme
function ForestAdventureSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 via-green-700 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-yellow-300"
          style={{
            left: `${3 + (i * 5) % 94}%`,
            top: `${5 + (i * 7) % 90}%`,
            boxShadow: "0 0 12px 4px rgba(253, 224, 71, 0.5)",
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 2 + i * 0.15,
            repeat: Infinity,
            delay: i * 0.12,
          }}
        />
      ))}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="z-10"
      >
        <Trees className="w-20 h-20 text-emerald-300" />
      </motion.div>
    </div>
  );
}

// Stargazer - Cosmic night sky
function StargazerSplash() {
  // Use deterministic positions instead of Math.random to avoid hydration mismatch
  const starPositions = [
    { left: 5, top: 12, size: 2 }, { left: 15, top: 45, size: 1.5 }, { left: 25, top: 8, size: 2.5 },
    { left: 35, top: 78, size: 1 }, { left: 45, top: 32, size: 2 }, { left: 55, top: 65, size: 1.5 },
    { left: 65, top: 18, size: 2.5 }, { left: 75, top: 52, size: 1 }, { left: 85, top: 38, size: 2 },
    { left: 92, top: 72, size: 1.5 }, { left: 10, top: 88, size: 2 }, { left: 30, top: 55, size: 1 },
    { left: 50, top: 15, size: 2.5 }, { left: 70, top: 85, size: 1.5 }, { left: 88, top: 25, size: 2 },
    { left: 20, top: 70, size: 1 }, { left: 40, top: 42, size: 2 }, { left: 60, top: 90, size: 1.5 },
    { left: 80, top: 10, size: 2.5 }, { left: 95, top: 58, size: 1 }, { left: 8, top: 35, size: 2 },
    { left: 28, top: 22, size: 1.5 }, { left: 48, top: 68, size: 2 }, { left: 68, top: 48, size: 1 },
    { left: 38, top: 92, size: 2 }, { left: 58, top: 5, size: 1.5 }, { left: 78, top: 62, size: 2.5 },
    { left: 18, top: 58, size: 1 }, { left: 82, top: 82, size: 2 }, { left: 42, top: 28, size: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {starPositions.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 2 + (i % 5) * 0.5,
            repeat: Infinity,
            delay: (i % 8) * 0.3,
          }}
        />
      ))}
      {/* Shooting star */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{ boxShadow: "0 0 6px 2px rgba(255,255,255,0.8)" }}
        animate={{
          left: ["10%", "70%"],
          top: ["20%", "50%"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 4,
          delay: 2,
        }}
      />
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="z-10"
      >
        <Star className="w-20 h-20 text-yellow-300 fill-yellow-300" />
      </motion.div>
    </div>
  );
}

// Cozy Scrapbook - Warm craft aesthetic
function CozyScrapbookSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center relative overflow-hidden">
      {/* Washi tape strips */}
      {[
        { left: "5%", top: "15%", rotate: -12, color: "bg-pink-200/60", width: "60px", height: "16px" },
        { left: "75%", top: "25%", rotate: 8, color: "bg-sky-200/60", width: "50px", height: "14px" },
        { left: "15%", top: "70%", rotate: -5, color: "bg-yellow-200/60", width: "55px", height: "14px" },
        { left: "65%", top: "80%", rotate: 15, color: "bg-green-200/60", width: "45px", height: "12px" },
      ].map((tape, i) => (
        <motion.div
          key={`tape-${i}`}
          className={`absolute ${tape.color} rounded-sm`}
          style={{
            left: tape.left,
            top: tape.top,
            width: tape.width,
            height: tape.height,
            transform: `rotate(${tape.rotate}deg)`,
          }}
          animate={{ rotate: [tape.rotate, tape.rotate + 3, tape.rotate] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Paper scraps */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`paper-${i}`}
          className="absolute"
          style={{
            left: `${12 + (i * 18) % 76}%`,
            top: `${20 + (i * 14) % 60}%`,
          }}
          animate={{ rotate: [-10 + i * 5, -5 + i * 5, -10 + i * 5] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
        >
          <div className="w-10 h-12 bg-white/70 rounded shadow-sm border border-amber-200/40 transform rotate-6" />
        </motion.div>
      ))}
      {/* Sticker emojis */}
      {["🌸", "⭐", "🦋", "💛"].map((emoji, i) => (
        <motion.div
          key={`sticker-${i}`}
          className="absolute text-lg"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
        >
          {emoji}
        </motion.div>
      ))}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="z-10"
      >
        <BookOpen className="w-20 h-20 text-amber-600" />
      </motion.div>
    </div>
  );
}

// Elegant Invitation - Refined and sophisticated
function ElegantInvitationSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-rose-50 to-amber-50 flex items-center justify-center relative overflow-hidden">
      {/* Gold corner ornaments */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-amber-300/40 rounded-tl-xl" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-amber-300/40 rounded-tr-xl" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-amber-300/40 rounded-bl-xl" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-amber-300/40 rounded-br-xl" />
      {/* Floating florals */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-200"
          style={{
            left: `${5 + (i * 10) % 90}%`,
            top: `${8 + (i * 11) % 84}%`,
            fontSize: `${20 + (i % 3) * 6}px`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          {i % 2 === 0 ? "❀" : "✿"}
        </motion.div>
      ))}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="z-10"
      >
        <Camera className="w-20 h-20 text-rose-400" />
      </motion.div>
    </div>
  );
}

// Premiere - Cinema/film theme
function PremiereSplash() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-red-950 flex items-center justify-center relative overflow-hidden">
      {/* Spotlight effects */}
      <div className="absolute top-0 left-1/4 w-40 h-full bg-gradient-to-b from-yellow-500/10 to-transparent transform -skew-x-12" />
      <div className="absolute top-0 right-1/4 w-40 h-full bg-gradient-to-b from-yellow-500/10 to-transparent transform skew-x-12" />
      {/* Stars */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${8 + (i * 8) % 84}%`,
            top: `${15 + (i * 7) % 70}%`,
            fontSize: `${14 + (i % 3) * 6}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.18,
          }}
        >
          ★
        </motion.div>
      ))}
      {/* Film strip borders */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 flex items-center justify-around">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-3 h-4 bg-slate-600 rounded-sm" />
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 flex items-center justify-around">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-3 h-4 bg-slate-600 rounded-sm" />
        ))}
      </div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="z-10 text-6xl"
      >
        🎬
      </motion.div>
    </div>
  );
}

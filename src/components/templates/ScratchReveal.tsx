"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ScratchRevealProps {
  message: string;
}

export function ScratchReveal({ message }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize gold overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Draw gold gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#D4AF37");
    gradient.addColorStop(0.3, "#F5E6C4");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(0.7, "#F5E6C4");
    gradient.addColorStop(1, "#D4AF37");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add subtle shimmer dots
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw "Scratch Here" text
    ctx.fillStyle = "#92700C";
    ctx.font = "bold 16px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch Here ✨", rect.width / 2, rect.height / 2);
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";

    const prev = lastPos.current;
    const brushSize = 30;

    if (prev) {
      // Draw line between last position and current for smooth scratching
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Single dot
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPos.current = { x, y };

    // Check scratch percentage
    checkRevealProgress(ctx, canvas);
  }, [revealed]);

  const checkRevealProgress = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    const total = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / total) * 100;

    if (percentage > 60) {
      setRevealed(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
      }, 200);
    }
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    if (pos) {
      lastPos.current = null;
      scratch(pos.x, pos.y);
    }
  }, [getPos, scratch]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    if (pos) {
      scratch(pos.x, pos.y);
    }
  }, [isDrawing, getPos, scratch]);

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md w-full"
    >
      <p className="text-gray-600 mb-6">Scratch to reveal your message! ✨</p>

      <div
        ref={containerRef}
        className="relative w-72 h-40 mx-auto rounded-2xl overflow-hidden select-none"
        style={{ touchAction: "none" }}
      >
        {/* Hidden message underneath */}
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500">
          <p className="text-white font-bold text-lg text-center">{message}</p>
        </div>

        {/* Canvas scratch overlay */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full rounded-2xl transition-opacity duration-500 ${revealed ? "opacity-0 pointer-events-none" : "cursor-grab active:cursor-grabbing"}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {revealed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-pink-500 font-medium"
        >
          💕 Now you know! 💕
        </motion.p>
      )}
    </motion.div>
  );
}

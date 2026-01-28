"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { PreviewModal } from "./PreviewModal";
import { TEMPLATES, PRICING, formatPrice } from "@/lib/supabase/templates";
import { Template } from "@/lib/supabase/types";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export function CardPack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const handleCardClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right - go to previous
      if (currentIndex > 0) {
        setExitDirection("right");
        setTimeout(() => {
          setCurrentIndex(currentIndex - 1);
          setExitDirection(null);
        }, 200);
      }
    } else if (info.offset.x < -threshold) {
      // Swiped left - go to next
      if (currentIndex < TEMPLATES.length - 1) {
        setExitDirection("left");
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setExitDirection(null);
        }, 200);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < TEMPLATES.length - 1) {
      setExitDirection("left");
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);
      }, 200);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setExitDirection("right");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setExitDirection(null);
      }, 200);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        {/* Card stack container */}
        <div className="relative w-[280px] h-[360px] mb-8">
          {/* Render cards in reverse order so the current one is on top */}
          {TEMPLATES.slice().reverse().map((template, reverseIndex) => {
            const index = TEMPLATES.length - 1 - reverseIndex;
            const relativeIndex = index - currentIndex;

            // Only show current and next 2 cards
            if (relativeIndex < 0 || relativeIndex > 2) return null;

            const isTop = relativeIndex === 0;

            return (
              <motion.div
                key={template.id}
                className="absolute inset-0"
                initial={false}
                animate={{
                  scale: 1 - relativeIndex * 0.05,
                  y: relativeIndex * 12,
                  x: exitDirection === "left" && isTop ? -300 : exitDirection === "right" && isTop ? 300 : 0,
                  opacity: exitDirection && isTop ? 0 : 1,
                  rotateZ: exitDirection === "left" && isTop ? -10 : exitDirection === "right" && isTop ? 10 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ zIndex: TEMPLATES.length - relativeIndex }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={isTop ? handleDragEnd : undefined}
              >
                <StackedCard
                  template={template}
                  isTop={isTop}
                  onClick={() => isTop && handleCardClick(template)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex gap-2">
            {TEMPLATES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-gray-800" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === TEMPLATES.length - 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Swipe instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-400 mb-8"
        >
          Swipe or drag to see more templates
        </motion.p>

        {/* Premium bundle offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-100">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-gray-600">or get</span>
            <span className="font-bold text-gray-900">all templates</span>
            <span className="text-gray-600">for just</span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold">
              {formatPrice(PRICING.membership)}/mo
            </span>
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTemplate && (
          <PreviewModal
            template={selectedTemplate}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// STACKED CARD COMPONENT
// ============================================

function StackedCard({
  template,
  isTop,
  onClick
}: {
  template: Template;
  isTop: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-full bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden ${
        isTop ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Preview area */}
      <div className="h-[200px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
        <span className="text-7xl">{template.emoji}</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-gray-900 text-lg">
            {template.name}
          </h3>
          {template.is_free ? (
            <span className="shrink-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Free
            </span>
          ) : (
            <span className="shrink-0 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {formatPrice(template.price_cents)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {template.description}
        </p>

        {isTop && (
          <p className="mt-4 text-center text-sm text-purple-600 font-medium">
            Tap to preview
          </p>
        )}
      </div>
    </div>
  );
}

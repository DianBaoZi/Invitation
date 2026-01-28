"use client";

// ============================================
// INTERACTION PICKER
// Game-selection UI with animated cards
// ============================================

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractionPreviewCard } from "./InteractionPreviewCard";
import {
  INTERACTIONS,
  getAvailableInteractions,
  CATEGORIES,
} from "./data/interactions";
import {
  InteractionType,
  InteractionSlot,
  InteractionPickerProps,
  InteractionDefinition,
  PLAYFUL_COLORS,
} from "./types";

export function InteractionPicker({
  selectedInteractions,
  onSelect,
  onDeselect,
  onContinue,
  maxSelections = 3,
}: InteractionPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const availableInteractions = getAvailableInteractions();
  const selectedTypes = selectedInteractions.map((i) => i.type);
  const canContinue = selectedInteractions.length > 0;
  const isMaxSelected = selectedInteractions.length >= maxSelections;

  // Get selection order for a type
  const getSelectionOrder = (type: InteractionType): number | undefined => {
    const index = selectedInteractions.findIndex((i) => i.type === type);
    return index >= 0 ? index + 1 : undefined;
  };

  // Check if an interaction is selected
  const isSelected = (type: InteractionType): boolean => {
    return selectedTypes.includes(type);
  };

  // Handle card click
  const handleCardClick = (interaction: InteractionDefinition) => {
    if (isSelected(interaction.type)) {
      const slot = selectedInteractions.find((i) => i.type === interaction.type);
      if (slot) {
        onDeselect(slot.id);
      }
    } else if (!isMaxSelected) {
      onSelect(interaction.type);
    }
  };

  // Filter interactions by category
  const getFilteredInteractions = () => {
    if (!activeCategory) return INTERACTIONS;
    return INTERACTIONS.filter((i) => i.category === activeCategory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 relative overflow-hidden">
      {/* Floating background decorations */}
      <FloatingDecorations />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: `${PLAYFUL_COLORS.purple}15` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: PLAYFUL_COLORS.purple }} />
            <span className="text-sm font-medium" style={{ color: PLAYFUL_COLORS.purple }}>
              Step 1 of 3
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pick Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: PLAYFUL_COLORS.funGradient }}
            >
              Interactions
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose up to {maxSelections} fun interactions for your invite.
            Hover over the cards to see them in action!
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CategoryButton
            label="All"
            emoji="✨"
            isActive={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          />
          {CATEGORIES.filter((c) => c.id !== "future").map((category) => (
            <CategoryButton
              key={category.id}
              label={category.name}
              emoji={category.emoji}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </motion.div>

        {/* Selection counter */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm text-gray-600">Selected:</span>
            <div className="flex gap-1">
              {[...Array(maxSelections)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      i < selectedInteractions.length
                        ? PLAYFUL_COLORS.funGradient
                        : "#E5E7EB",
                  }}
                  animate={
                    i === selectedInteractions.length - 1
                      ? { scale: [1, 1.3, 1] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {selectedInteractions.length}/{maxSelections}
            </span>
          </div>
        </motion.div>

        {/* Interaction cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {getFilteredInteractions().map((interaction, index) => (
              <motion.div
                key={interaction.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <InteractionPreviewCard
                  interaction={interaction}
                  isSelected={isSelected(interaction.type)}
                  selectionOrder={getSelectionOrder(interaction.type)}
                  onSelect={() => handleCardClick(interaction)}
                  disabled={isMaxSelected && !isSelected(interaction.type)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Continue button */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <Button
              onClick={onContinue}
              disabled={!canContinue}
              className={`w-full h-14 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                canContinue
                  ? "text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400"
              }`}
              style={
                canContinue
                  ? { background: PLAYFUL_COLORS.funGradient }
                  : undefined
              }
            >
              {canContinue ? (
                <>
                  Continue to Customize
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                "Select at least one interaction"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function CategoryButton({
  label,
  emoji,
  isActive,
  onClick,
}: {
  label: string;
  emoji: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
        isActive
          ? "text-white shadow-md"
          : "bg-white/80 text-gray-600 hover:bg-white hover:shadow-sm"
      }`}
      style={isActive ? { background: PLAYFUL_COLORS.funGradient } : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}

function FloatingDecorations() {
  const emojis = ["💕", "✨", "🎉", "⭐", "💫", "🌟", "💝", "🎈"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-20"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${5 + (i % 3) * 30}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Gradient orbs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: PLAYFUL_COLORS.coolGradient }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ background: PLAYFUL_COLORS.warmGradient }}
      />
    </div>
  );
}

export default InteractionPicker;

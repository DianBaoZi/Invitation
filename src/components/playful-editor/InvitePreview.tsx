"use client";

// ============================================
// INVITE PREVIEW
// Live preview component showing the invite
// ============================================

import { motion } from "framer-motion";
import {
  InteractionSlot,
  LayoutType,
  ThemeType,
  InvitePreviewProps,
  PLAYFUL_COLORS,
} from "./types";
import { getLayoutGridCSS } from "./data/layouts";
import { getThemeByType } from "./data/layouts";
import { getInteractionByType } from "./data/interactions";

export function InvitePreview({
  interactions,
  layout,
  theme,
  globalStyles,
  scale = 1,
}: InvitePreviewProps) {
  const themeDef = getThemeByType(theme);
  const layoutStyles = getLayoutGridCSS(layout);

  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
      }}
    >
      {/* Preview container */}
      <div
        className="w-[375px] min-h-[600px] relative"
        style={{
          background: themeDef?.colors.background || globalStyles.backgroundColor,
          fontFamily: themeDef?.fontFamily || globalStyles.fontFamily,
        }}
      >
        {/* Floating decorations */}
        {themeDef?.decorations.floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl pointer-events-none opacity-30"
            style={{
              left: `${10 + i * 20}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {emoji}
          </motion.span>
        ))}

        {/* Layout container */}
        <div
          className="relative z-10 min-h-[600px]"
          style={layoutStyles as React.CSSProperties}
        >
          {interactions.map((interaction, index) => (
            <InteractionPreviewSlot
              key={interaction.id}
              interaction={interaction}
              theme={themeDef}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Phone frame overlay (optional) */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-gray-800/10" />
    </div>
  );
}

// ============================================
// INTERACTION PREVIEW SLOT
// Renders each interaction in preview mode
// ============================================

function InteractionPreviewSlot({
  interaction,
  theme,
  index,
}: {
  interaction: InteractionSlot;
  theme: ReturnType<typeof getThemeByType>;
  index: number;
}) {
  const interactionDef = getInteractionByType(interaction.type);
  const config = interaction.config;

  const primaryColor = theme?.colors.primary || PLAYFUL_COLORS.purple;
  const textColor = theme?.colors.text || "#1F2937";

  switch (interaction.type) {
    case "yes-no-runaway":
    case "yes-no-shrinking":
      return (
        <YesNoPreview
          config={config as { questionText: string; yesButtonText: string; noButtonText: string }}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      );

    case "scratch-reveal":
      return (
        <ScratchRevealPreview
          config={config as { instructionText: string; revealContent: string }}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      );

    case "spin-wheel":
      return (
        <SpinWheelPreview
          config={config as { titleText: string; wheelOptions: string[] }}
          primaryColor={primaryColor}
          textColor={textColor}
        />
      );

    default:
      return (
        <div className="p-4 text-center">
          <span className="text-3xl">{interactionDef?.emoji}</span>
          <p className="text-sm text-gray-500 mt-2">Preview coming soon</p>
        </div>
      );
  }
}

// ============================================
// PREVIEW COMPONENTS FOR EACH INTERACTION
// ============================================

function YesNoPreview({
  config,
  primaryColor,
  textColor,
}: {
  config: { questionText: string; yesButtonText: string; noButtonText: string };
  primaryColor: string;
  textColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <motion.h2
        className="text-2xl font-bold mb-8"
        style={{ color: textColor }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {config.questionText}
      </motion.h2>

      <div className="flex gap-4">
        <motion.button
          className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg"
          style={{ background: primaryColor }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {config.yesButtonText}
        </motion.button>

        <motion.button
          className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {config.noButtonText}
        </motion.button>
      </div>
    </div>
  );
}

function ScratchRevealPreview({
  config,
  primaryColor,
  textColor,
}: {
  config: { instructionText: string; revealContent: string };
  primaryColor: string;
  textColor: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <p className="text-sm mb-4" style={{ color: textColor }}>
        {config.instructionText}
      </p>

      <div className="relative w-64 h-32 rounded-xl overflow-hidden">
        {/* Hidden content */}
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold p-4"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${PLAYFUL_COLORS.pink})` }}
        >
          {config.revealContent}
        </div>

        {/* Scratch overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #F5E6C4 50%, #D4AF37 100%)",
          }}
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-amber-900 font-medium">✨ Scratch Here ✨</span>
        </motion.div>
      </div>
    </div>
  );
}

function SpinWheelPreview({
  config,
  primaryColor,
  textColor,
}: {
  config: { titleText: string; wheelOptions: string[] };
  primaryColor: string;
  textColor: string;
}) {
  const segmentAngle = 360 / config.wheelOptions.length;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h3 className="text-lg font-bold mb-4" style={{ color: textColor }}>
        {config.titleText}
      </h3>

      <div className="relative w-48 h-48">
        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full relative overflow-hidden border-4 border-white shadow-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {config.wheelOptions.map((option, i) => {
            const rotation = i * segmentAngle;
            const colors = [primaryColor, PLAYFUL_COLORS.pink, PLAYFUL_COLORS.yellow, PLAYFUL_COLORS.green, PLAYFUL_COLORS.blue];
            const bgColor = colors[i % colors.length];

            return (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(from ${rotation}deg, ${bgColor} 0deg, ${bgColor} ${segmentAngle}deg, transparent ${segmentAngle}deg)`,
                }}
              />
            );
          })}

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white shadow-md" />
          </div>
        </motion.div>

        {/* Pointer */}
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent z-10"
          style={{ borderTopColor: primaryColor }}
        />
      </div>

      <motion.button
        className="mt-4 px-6 py-2 rounded-xl text-white font-semibold"
        style={{ background: primaryColor }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        SPIN!
      </motion.button>
    </div>
  );
}

export default InvitePreview;

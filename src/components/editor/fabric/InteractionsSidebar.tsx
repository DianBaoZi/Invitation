"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Type,
  Heart,
  MousePointer2,
  Shrink,
  Wand2,
  CircleDot,
  ChevronDown,
  Crown,
  Sticker,
  Square,
  Circle,
  Shapes,
  LayoutTemplate,
} from "lucide-react";
import { VALENTINE_COLORS } from "../FabricEditor";

type InteractionType = "yes-no-runaway" | "yes-no-shrinking" | "scratch-reveal" | "spin-wheel";
type TextType = "heading" | "subheading" | "body";
type DecorationType = "heart" | "emoji";
type ShapeType = "rectangle" | "circle" | "rounded-rect" | "line";
type TemplateType = "valentine" | "birthday" | "wedding" | "party" | "minimal";
type StickerType =
  | "floating-heart"
  | "bouncing-love"
  | "spinning-star"
  | "wiggle-letter"
  | "pulse-kiss"
  | "dancing-flower"
  | "waving-bear"
  | "flying-cupid"
  | "sparkle-ring"
  | "beating-heart"
  | "twinkle-stars"
  | "love-explosion";

interface InteractionsSidebarProps {
  onAddInteraction: (type: InteractionType) => void;
  onAddText: (type: TextType) => void;
  onAddDecoration: (type: DecorationType) => void;
  onAddSticker?: (type: StickerType) => void;
  onAddShape?: (type: ShapeType) => void;
  onLoadTemplate?: (type: TemplateType) => void;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  delay?: number;
  badge?: string;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
  delay = 0,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="border-b border-purple-100/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-4 px-5 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent transition-all duration-300 group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-purple-300"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        <span className="text-purple-400 group-hover:text-purple-500 transition-colors">{icon}</span>
        <span className="text-sm font-medium text-gray-700 tracking-wide">{title}</span>
        {badge && (
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full">
            {badge}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface InteractionCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
  delay?: number;
}

function InteractionCard({ name, description, icon, onClick, gradient, delay = 0 }: InteractionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl border border-purple-100/50 hover:border-purple-200 shadow-sm hover:shadow-lg hover:shadow-purple-100/30 transition-all duration-300 text-left group relative overflow-hidden"
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${gradient}08 0%, transparent 60%)` }}
      />

      <div className="relative flex items-start gap-3">
        <div
          className="p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${gradient}15 0%, ${gradient}05 100%)` }}
        >
          <div style={{ color: gradient }}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm mb-0.5">{name}</h4>
          <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}

interface ElementButtonProps {
  name: string;
  preview: React.ReactNode;
  onClick: () => void;
  delay?: number;
}

function ElementButton({ name, preview, onClick, delay = 0 }: ElementButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="aspect-square bg-white rounded-xl border border-purple-100/50 hover:border-purple-200 shadow-sm hover:shadow-lg hover:shadow-purple-100/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
    >
      <motion.div
        className="text-2xl"
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        {preview}
      </motion.div>
      <span className="text-[10px] text-gray-400 group-hover:text-gray-600 font-medium tracking-wide uppercase transition-colors">
        {name}
      </span>
    </motion.button>
  );
}

// ============================================
// ANIMATED STICKER BUTTON
// ============================================
interface StickerButtonProps {
  name: string;
  emoji: string;
  animation: Record<string, number[]>;
  onClick: () => void;
  delay?: number;
}

function StickerButton({ name, emoji, animation, onClick, delay = 0 }: StickerButtonProps) {
  // Create distinct transitions based on animation properties
  const hasFullRotation = animation.rotate && animation.rotate[1] === 360;
  const hasScale = 'scale' in animation;
  const hasMultiAxis = Object.keys(animation).length >= 2;

  // Build transition object with per-property settings
  const transition: Record<string, object> = {};
  Object.keys(animation).forEach(key => {
    if (key === 'rotate' && hasFullRotation) {
      transition[key] = { duration: 2, repeat: Infinity, ease: "linear" };
    } else if (key === 'scale' && name === 'Beat') {
      transition[key] = { duration: 0.6, repeat: Infinity, ease: [0.4, 0, 0.2, 1] };
    } else if (key === 'opacity') {
      transition[key] = { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };
    } else if (key === 'y') {
      transition[key] = { duration: 1.2 + (hasMultiAxis ? 0.3 : 0), repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };
    } else if (key === 'x') {
      transition[key] = { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };
    } else if (key === 'rotate') {
      transition[key] = { duration: 1.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };
    } else if (key === 'scale') {
      transition[key] = { duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeOut" };
    } else {
      transition[key] = { duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" };
    }
  });

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="aspect-square bg-gradient-to-br from-white to-purple-50/50 rounded-xl border border-purple-100/50 hover:border-purple-300 shadow-sm hover:shadow-lg hover:shadow-purple-200/40 transition-all duration-300 flex flex-col items-center justify-center gap-1.5 group relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />

      <motion.div
        className="text-2xl relative z-10"
        animate={animation}
        transition={transition}
      >
        {emoji}
      </motion.div>
      <span className="text-[9px] text-gray-400 group-hover:text-purple-500 font-medium tracking-wide uppercase transition-colors relative z-10">
        {name}
      </span>
    </motion.button>
  );
}

// ============================================
// STICKER DATA
// ============================================
const STICKERS: {
  type: StickerType;
  name: string;
  emoji: string;
  animation: Record<string, number[]>;
}[] = [
  {
    type: "floating-heart",
    name: "Float",
    emoji: "💗",
    animation: { y: [-3, 3], rotate: [-5, 5] },
  },
  {
    type: "bouncing-love",
    name: "Bounce",
    emoji: "💕",
    animation: { y: [-5, 0], scale: [1, 1.1, 1] },
  },
  {
    type: "spinning-star",
    name: "Spin",
    emoji: "⭐",
    animation: { rotate: [0, 360] },
  },
  {
    type: "wiggle-letter",
    name: "Wiggle",
    emoji: "💌",
    animation: { rotate: [-10, 10], x: [-2, 2] },
  },
  {
    type: "pulse-kiss",
    name: "Pulse",
    emoji: "💋",
    animation: { scale: [1, 1.2, 1] },
  },
  {
    type: "dancing-flower",
    name: "Dance",
    emoji: "🌹",
    animation: { rotate: [-15, 15], y: [-2, 2] },
  },
  {
    type: "waving-bear",
    name: "Wave",
    emoji: "🧸",
    animation: { rotate: [-8, 8] },
  },
  {
    type: "flying-cupid",
    name: "Fly",
    emoji: "💘",
    animation: { y: [-5, 5], x: [-3, 3], rotate: [-5, 5] },
  },
  {
    type: "sparkle-ring",
    name: "Sparkle",
    emoji: "💍",
    animation: { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] },
  },
  {
    type: "beating-heart",
    name: "Beat",
    emoji: "❤️",
    animation: { scale: [1, 1.3, 1, 1.3, 1] },
  },
  {
    type: "twinkle-stars",
    name: "Twinkle",
    emoji: "✨",
    animation: { opacity: [1, 0.5, 1], scale: [1, 0.9, 1] },
  },
  {
    type: "love-explosion",
    name: "Burst",
    emoji: "💥",
    animation: { scale: [0.9, 1.2, 0.9], rotate: [0, 10, -10, 0] },
  },
];

// ============================================
// TEMPLATE DATA
// ============================================
const TEMPLATES: {
  type: TemplateType;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
}[] = [
  {
    type: "valentine",
    name: "Valentine",
    emoji: "💕",
    description: "Romantic love invitation",
    gradient: "#E91E63",
  },
  {
    type: "birthday",
    name: "Birthday",
    emoji: "🎂",
    description: "Fun celebration invite",
    gradient: "#FF9800",
  },
  {
    type: "wedding",
    name: "Wedding",
    emoji: "💒",
    description: "Elegant ceremony invite",
    gradient: "#9C27B0",
  },
  {
    type: "party",
    name: "Party",
    emoji: "🎉",
    description: "Epic party invitation",
    gradient: "#2196F3",
  },
  {
    type: "minimal",
    name: "Minimal",
    emoji: "✨",
    description: "Clean & simple design",
    gradient: "#607D8B",
  },
];

export function InteractionsSidebar({
  onAddInteraction,
  onAddText,
  onAddDecoration,
  onAddSticker,
  onAddShape,
  onLoadTemplate,
}: InteractionsSidebarProps) {
  return (
    <motion.aside
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 lg:w-80 xl:w-96 bg-gradient-to-b from-white via-white to-purple-50/30 border-r border-purple-100/50 flex flex-col h-full overflow-hidden shadow-xl shadow-purple-900/5"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-6 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/30 to-transparent rounded-bl-full" />
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-bl from-indigo-100/20 to-transparent rounded-full blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.div>
            <div>
              <h2 className="font-serif text-lg text-gray-800 tracking-wide">Elements</h2>
              <p className="text-xs text-purple-400 font-light">Click to add magic</p>
            </div>
          </div>

          {/* Decorative line */}
          <div className="mt-4 h-px bg-gradient-to-r from-purple-200 via-purple-100 to-transparent" />
        </div>
      </motion.div>

      {/* Scrollable Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
        {/* Interactions Section */}
        <CollapsibleSection
          title="Interactions"
          icon={<MousePointer2 className="w-4 h-4" />}
          defaultOpen={true}
          delay={1}
        >
          <div className="space-y-3">
            <InteractionCard
              name="Runaway Button"
              description="No button escapes on hover"
              icon={<MousePointer2 className="w-5 h-5" />}
              onClick={() => onAddInteraction("yes-no-runaway")}
              gradient={VALENTINE_COLORS.primary}
              delay={1}
            />
            <InteractionCard
              name="Shrinking Button"
              description="No button shrinks on click"
              icon={<Shrink className="w-5 h-5" />}
              onClick={() => onAddInteraction("yes-no-shrinking")}
              gradient="#9333EA"
              delay={2}
            />
            <InteractionCard
              name="Scratch Reveal"
              description="Tap to reveal hidden message"
              icon={<Wand2 className="w-5 h-5" />}
              onClick={() => onAddInteraction("scratch-reveal")}
              gradient={VALENTINE_COLORS.gold}
              delay={3}
            />
            <InteractionCard
              name="Spin Wheel"
              description="Random date picker wheel"
              icon={<CircleDot className="w-5 h-5" />}
              onClick={() => onAddInteraction("spin-wheel")}
              gradient="#0EA5E9"
              delay={4}
            />
          </div>
        </CollapsibleSection>

        {/* Animated Stickers Section */}
        <CollapsibleSection
          title="Stickers"
          icon={<Sticker className="w-4 h-4" />}
          defaultOpen={true}
          delay={2}
          badge="NEW"
        >
          <div className="grid grid-cols-4 gap-2">
            {STICKERS.map((sticker, index) => (
              <StickerButton
                key={sticker.type}
                name={sticker.name}
                emoji={sticker.emoji}
                animation={sticker.animation}
                onClick={() => onAddSticker?.(sticker.type)}
                delay={index}
              />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-3 italic">
            Stickers animate in preview mode ✨
          </p>
        </CollapsibleSection>

        {/* Text Section */}
        <CollapsibleSection
          title="Typography"
          icon={<Type className="w-4 h-4" />}
          defaultOpen={true}
          delay={3}
        >
          <div className="grid grid-cols-3 gap-2">
            <ElementButton
              name="Heading"
              preview={<span className="font-serif font-bold text-gray-700">Aa</span>}
              onClick={() => onAddText("heading")}
              delay={1}
            />
            <ElementButton
              name="Subtitle"
              preview={<span className="font-serif text-gray-500">Aa</span>}
              onClick={() => onAddText("subheading")}
              delay={2}
            />
            <ElementButton
              name="Body"
              preview={<span className="text-sm text-gray-400">Tt</span>}
              onClick={() => onAddText("body")}
              delay={3}
            />
          </div>
        </CollapsibleSection>

        {/* Templates Section */}
        <CollapsibleSection
          title="Templates"
          icon={<LayoutTemplate className="w-4 h-4" />}
          defaultOpen={true}
          delay={4}
          badge="START"
        >
          <div className="space-y-2">
            {TEMPLATES.map((template, index) => (
              <motion.button
                key={template.type}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onLoadTemplate?.(template.type)}
                className="w-full p-3 bg-white rounded-xl border border-purple-100/50 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 text-left group flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ background: `${template.gradient}15` }}
                >
                  {template.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{template.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </CollapsibleSection>

        {/* Shapes Section */}
        <CollapsibleSection
          title="Shapes"
          icon={<Shapes className="w-4 h-4" />}
          defaultOpen={false}
          delay={5}
        >
          <div className="grid grid-cols-4 gap-2">
            <ElementButton
              name="Rect"
              preview={<Square className="w-5 h-5 text-purple-400" />}
              onClick={() => onAddShape?.("rectangle")}
              delay={1}
            />
            <ElementButton
              name="Circle"
              preview={<Circle className="w-5 h-5 text-pink-400" />}
              onClick={() => onAddShape?.("circle")}
              delay={2}
            />
            <ElementButton
              name="Rounded"
              preview={<div className="w-5 h-4 rounded-md bg-indigo-400" />}
              onClick={() => onAddShape?.("rounded-rect")}
              delay={3}
            />
            <ElementButton
              name="Line"
              preview={<div className="w-5 h-0.5 bg-gray-400 rotate-45" />}
              onClick={() => onAddShape?.("line")}
              delay={4}
            />
          </div>
        </CollapsibleSection>

        {/* Decorations Section - Expanded */}
        <CollapsibleSection
          title="Decorations"
          icon={<Heart className="w-4 h-4" />}
          defaultOpen={false}
          delay={6}
        >
          <div className="grid grid-cols-4 gap-2">
            <ElementButton name="Heart" preview="❤️" onClick={() => onAddDecoration("heart")} delay={1} />
            <ElementButton name="Love" preview="💕" onClick={() => onAddDecoration("emoji")} delay={2} />
            <ElementButton name="Spark" preview="✨" onClick={() => onAddDecoration("emoji")} delay={3} />
            <ElementButton name="Star" preview="⭐" onClick={() => onAddDecoration("emoji")} delay={4} />
            <ElementButton name="Fire" preview="🔥" onClick={() => onAddDecoration("emoji")} delay={5} />
            <ElementButton name="Rose" preview="🌹" onClick={() => onAddDecoration("emoji")} delay={6} />
            <ElementButton name="Gift" preview="🎁" onClick={() => onAddDecoration("emoji")} delay={7} />
            <ElementButton name="Cake" preview="🎂" onClick={() => onAddDecoration("emoji")} delay={8} />
            <ElementButton name="Balloon" preview="🎈" onClick={() => onAddDecoration("emoji")} delay={9} />
            <ElementButton name="Ring" preview="💍" onClick={() => onAddDecoration("emoji")} delay={10} />
            <ElementButton name="Kiss" preview="💋" onClick={() => onAddDecoration("emoji")} delay={11} />
            <ElementButton name="Confetti" preview="🎊" onClick={() => onAddDecoration("emoji")} delay={12} />
          </div>
        </CollapsibleSection>
      </div>

      {/* Premium Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-5"
      >
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-50 via-purple-50 to-indigo-50 border border-amber-200/30">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full" />
          <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-lg" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-4 h-4 text-amber-500" />
              </motion.div>
              <span className="text-xs font-semibold text-amber-700 tracking-wide">PREMIUM</span>
            </div>
            <p className="text-xs text-amber-600/80 leading-relaxed">
              Unlock confetti effects, custom fonts & more!
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-medium rounded-lg shadow-md shadow-amber-200/50 hover:shadow-amber-300/50 transition-all duration-300"
            >
              Upgrade
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}

export type { StickerType, ShapeType, TemplateType };

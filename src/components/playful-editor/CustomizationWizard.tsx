"use client";

// ============================================
// CUSTOMIZATION WIZARD
// Step form for editing interactions, layouts, themes
// ============================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Sparkles,
  Palette,
  Layout,
  Type,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  InteractionSlot,
  InteractionType,
  LayoutType,
  ThemeType,
  InviteData,
  CustomizationWizardProps,
  PLAYFUL_COLORS,
  YesNoConfig,
  ScratchRevealConfig,
  SpinWheelConfig,
} from "./types";
import { getInteractionByType } from "./data/interactions";
import { LAYOUTS, THEMES, getLayoutByType, getThemeByType } from "./data/layouts";

type WizardTab = "content" | "layout" | "theme";

export function CustomizationWizard({
  interactions,
  layout,
  theme,
  globalStyles,
  onUpdateInteraction,
  onUpdateLayout,
  onUpdateTheme,
  onUpdateStyles,
  onBack,
  onPreview,
}: CustomizationWizardProps) {
  const [activeTab, setActiveTab] = useState<WizardTab>("content");
  const [activeInteractionIndex, setActiveInteractionIndex] = useState(0);

  const tabs: { id: WizardTab; label: string; icon: React.ReactNode }[] = [
    { id: "content", label: "Content", icon: <Type className="w-4 h-4" /> },
    { id: "layout", label: "Layout", icon: <Layout className="w-4 h-4" /> },
    { id: "theme", label: "Theme", icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: PLAYFUL_COLORS.purple }} />
              <span className="text-sm font-medium text-gray-600">
                Step 2 of 3: Customize
              </span>
            </div>

            {/* Preview button */}
            <Button
              onClick={onPreview}
              className="flex items-center gap-2 text-white"
              style={{ background: PLAYFUL_COLORS.funGradient }}
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>

          {/* Tab navigation */}
          <div className="flex justify-center gap-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                style={
                  activeTab === tab.id
                    ? { background: PLAYFUL_COLORS.funGradient }
                    : undefined
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "content" && (
            <ContentTab
              key="content"
              interactions={interactions}
              activeIndex={activeInteractionIndex}
              onChangeIndex={setActiveInteractionIndex}
              onUpdate={onUpdateInteraction}
            />
          )}
          {activeTab === "layout" && (
            <LayoutTab
              key="layout"
              currentLayout={layout}
              onSelect={onUpdateLayout}
            />
          )}
          {activeTab === "theme" && (
            <ThemeTab
              key="theme"
              currentTheme={theme}
              onSelect={onUpdateTheme}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onPreview}
            className="flex-1 h-12 rounded-xl text-white font-semibold"
            style={{ background: PLAYFUL_COLORS.funGradient }}
          >
            Preview Invite
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTENT TAB
// ============================================

function ContentTab({
  interactions,
  activeIndex,
  onChangeIndex,
  onUpdate,
}: {
  interactions: InteractionSlot[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onUpdate: (id: string, config: unknown) => void;
}) {
  if (interactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500">No interactions selected</p>
      </motion.div>
    );
  }

  const activeInteraction = interactions[activeIndex];
  const interactionDef = getInteractionByType(activeInteraction.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Interaction selector tabs */}
      {interactions.length > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          {interactions.map((interaction, index) => {
            const def = getInteractionByType(interaction.type);
            return (
              <button
                key={interaction.id}
                onClick={() => onChangeIndex(index)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                  index === activeIndex
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{def?.emoji}</span>
                <span>{def?.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Interaction header */}
      <div className="text-center mb-6">
        <span className="text-4xl mb-2 block">{interactionDef?.emoji}</span>
        <h2 className="text-2xl font-bold text-gray-900">
          {interactionDef?.name}
        </h2>
        <p className="text-gray-500 mt-1">{interactionDef?.description}</p>
      </div>

      {/* Config form based on interaction type */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <InteractionConfigForm
          interaction={activeInteraction}
          onUpdate={(config) => onUpdate(activeInteraction.id, config)}
        />
      </div>
    </motion.div>
  );
}

// ============================================
// INTERACTION CONFIG FORMS
// ============================================

function InteractionConfigForm({
  interaction,
  onUpdate,
}: {
  interaction: InteractionSlot;
  onUpdate: (config: unknown) => void;
}) {
  switch (interaction.type) {
    case "yes-no-runaway":
    case "yes-no-shrinking":
      return (
        <YesNoConfigForm
          config={interaction.config as YesNoConfig}
          onUpdate={onUpdate}
        />
      );
    case "scratch-reveal":
      return (
        <ScratchRevealConfigForm
          config={interaction.config as ScratchRevealConfig}
          onUpdate={onUpdate}
        />
      );
    case "spin-wheel":
      return (
        <SpinWheelConfigForm
          config={interaction.config as SpinWheelConfig}
          onUpdate={onUpdate}
        />
      );
    default:
      return <div className="text-gray-500">Configuration coming soon</div>;
  }
}

function YesNoConfigForm({
  config,
  onUpdate,
}: {
  config: YesNoConfig;
  onUpdate: (config: YesNoConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="questionText" className="text-gray-700 font-medium">
          Your Question
        </Label>
        <Input
          id="questionText"
          value={config.questionText}
          onChange={(e) => onUpdate({ ...config, questionText: e.target.value })}
          placeholder="Will you be my Valentine?"
          className="mt-2 h-12 rounded-xl"
        />
        <p className="text-xs text-gray-400 mt-1">
          The main question you want to ask
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="yesButtonText" className="text-gray-700 font-medium">
            Yes Button
          </Label>
          <Input
            id="yesButtonText"
            value={config.yesButtonText}
            onChange={(e) =>
              onUpdate({ ...config, yesButtonText: e.target.value })
            }
            placeholder="Yes! 💕"
            className="mt-2 h-12 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="noButtonText" className="text-gray-700 font-medium">
            No Button
          </Label>
          <Input
            id="noButtonText"
            value={config.noButtonText}
            onChange={(e) =>
              onUpdate({ ...config, noButtonText: e.target.value })
            }
            placeholder="No"
            className="mt-2 h-12 rounded-xl"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="successMessage" className="text-gray-700 font-medium">
          Success Message
        </Label>
        <Textarea
          id="successMessage"
          value={config.successMessage}
          onChange={(e) =>
            onUpdate({ ...config, successMessage: e.target.value })
          }
          placeholder="Yay! You made me so happy! 🎉💕"
          className="mt-2 rounded-xl min-h-[80px]"
        />
        <p className="text-xs text-gray-400 mt-1">
          Shows when they click Yes
        </p>
      </div>
    </div>
  );
}

function ScratchRevealConfigForm({
  config,
  onUpdate,
}: {
  config: ScratchRevealConfig;
  onUpdate: (config: ScratchRevealConfig) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="instructionText" className="text-gray-700 font-medium">
          Instruction Text
        </Label>
        <Input
          id="instructionText"
          value={config.instructionText}
          onChange={(e) =>
            onUpdate({ ...config, instructionText: e.target.value })
          }
          placeholder="Scratch to reveal your surprise!"
          className="mt-2 h-12 rounded-xl"
        />
        <p className="text-xs text-gray-400 mt-1">
          Tells them what to do
        </p>
      </div>

      <div>
        <Label htmlFor="revealContent" className="text-gray-700 font-medium">
          Hidden Message
        </Label>
        <Textarea
          id="revealContent"
          value={config.revealContent}
          onChange={(e) =>
            onUpdate({ ...config, revealContent: e.target.value })
          }
          placeholder="You're invited to my birthday party! 🎂🎈"
          className="mt-2 rounded-xl min-h-[100px]"
        />
        <p className="text-xs text-gray-400 mt-1">
          The message revealed after scratching
        </p>
      </div>
    </div>
  );
}

function SpinWheelConfigForm({
  config,
  onUpdate,
}: {
  config: SpinWheelConfig;
  onUpdate: (config: SpinWheelConfig) => void;
}) {
  const updateOption = (index: number, value: string) => {
    const newOptions = [...config.wheelOptions];
    newOptions[index] = value;
    onUpdate({ ...config, wheelOptions: newOptions });
  };

  const addOption = () => {
    if (config.wheelOptions.length < 8) {
      onUpdate({
        ...config,
        wheelOptions: [...config.wheelOptions, "New Option"],
      });
    }
  };

  const removeOption = (index: number) => {
    if (config.wheelOptions.length > 2) {
      const newOptions = config.wheelOptions.filter((_, i) => i !== index);
      onUpdate({ ...config, wheelOptions: newOptions });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="titleText" className="text-gray-700 font-medium">
          Wheel Title
        </Label>
        <Input
          id="titleText"
          value={config.titleText}
          onChange={(e) => onUpdate({ ...config, titleText: e.target.value })}
          placeholder="Spin to see your prize!"
          className="mt-2 h-12 rounded-xl"
        />
      </div>

      <div>
        <Label className="text-gray-700 font-medium">
          Wheel Options ({config.wheelOptions.length}/8)
        </Label>
        <div className="space-y-2 mt-2">
          {config.wheelOptions.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 h-10 rounded-lg"
                placeholder={`Option ${index + 1}`}
              />
              {config.wheelOptions.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
        {config.wheelOptions.length < 8 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="mt-2 text-sm"
          >
            + Add Option
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================
// LAYOUT TAB
// ============================================

function LayoutTab({
  currentLayout,
  onSelect,
}: {
  currentLayout: LayoutType;
  onSelect: (layout: LayoutType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Layout</h2>
        <p className="text-gray-500 mt-1">
          How should your interactions be arranged?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {LAYOUTS.map((layoutDef) => (
          <button
            key={layoutDef.type}
            onClick={() => onSelect(layoutDef.type)}
            className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
              currentLayout === layoutDef.type
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            {currentLayout === layoutDef.type && (
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ background: PLAYFUL_COLORS.funGradient }}
              >
                <Check className="w-4 h-4" />
              </div>
            )}

            <span className="text-3xl block mb-2">{layoutDef.emoji}</span>
            <h3 className="font-semibold text-gray-900">{layoutDef.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{layoutDef.description}</p>

            {/* Mini layout preview */}
            <div className="mt-4 h-20 bg-gray-100 rounded-lg p-2">
              <LayoutMiniPreview type={layoutDef.type} />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function LayoutMiniPreview({ type }: { type: LayoutType }) {
  switch (type) {
    case "centered":
      return (
        <div className="h-full flex flex-col items-center justify-center gap-1">
          <div className="w-12 h-3 bg-gray-300 rounded" />
          <div className="w-10 h-3 bg-gray-300 rounded" />
          <div className="w-10 h-3 bg-gray-300 rounded" />
        </div>
      );
    case "hero-grid":
      return (
        <div className="h-full grid grid-rows-2 gap-1">
          <div className="bg-gray-300 rounded" />
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-gray-300 rounded" />
            <div className="bg-gray-300 rounded" />
          </div>
        </div>
      );
    case "split":
      return (
        <div className="h-full grid grid-cols-2 gap-1">
          <div className="bg-gray-300 rounded" />
          <div className="flex flex-col gap-1">
            <div className="flex-1 bg-gray-300 rounded" />
            <div className="flex-1 bg-gray-300 rounded" />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className="h-full flex items-center justify-center">
          <div className="w-16 h-8 bg-gray-300 rounded" />
        </div>
      );
    default:
      return null;
  }
}

// ============================================
// THEME TAB
// ============================================

function ThemeTab({
  currentTheme,
  onSelect,
}: {
  currentTheme: ThemeType;
  onSelect: (theme: ThemeType) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Pick a Theme</h2>
        <p className="text-gray-500 mt-1">
          Set the mood for your invite
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {THEMES.map((themeDef) => (
          <button
            key={themeDef.type}
            onClick={() => onSelect(themeDef.type)}
            className={`relative p-4 rounded-2xl border-2 transition-all ${
              currentTheme === themeDef.type
                ? "border-purple-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
            style={{
              background: themeDef.colors.background,
            }}
          >
            {currentTheme === themeDef.type && (
              <div
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ background: PLAYFUL_COLORS.funGradient }}
              >
                <Check className="w-4 h-4" />
              </div>
            )}

            <span className="text-3xl block mb-2">{themeDef.emoji}</span>
            <h3
              className="font-semibold"
              style={{ color: themeDef.colors.text }}
            >
              {themeDef.name}
            </h3>
            <p
              className="text-sm mt-1"
              style={{ color: themeDef.colors.secondary }}
            >
              {themeDef.description}
            </p>

            {/* Color swatches */}
            <div className="flex gap-1 mt-3">
              <div
                className="w-6 h-6 rounded-full"
                style={{ background: themeDef.colors.primary }}
              />
              <div
                className="w-6 h-6 rounded-full"
                style={{ background: themeDef.colors.secondary }}
              />
              <div
                className="w-6 h-6 rounded-full border"
                style={{
                  background: themeDef.colors.accent,
                  borderColor: themeDef.colors.primary + "40",
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default CustomizationWizard;

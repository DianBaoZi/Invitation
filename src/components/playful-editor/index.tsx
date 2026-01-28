"use client";

// ============================================
// PLAYFUL EDITOR - MAIN ORCHESTRATOR
// ============================================

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InteractionPicker } from "./InteractionPicker";
import { CustomizationWizard } from "./CustomizationWizard";
import { InvitePreview } from "./InvitePreview";

// Simple ID generator (no external dependency needed)
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}
import {
  EditorStep,
  InteractionSlot,
  InteractionType,
  LayoutType,
  ThemeType,
  InviteData,
  PLAYFUL_COLORS,
} from "./types";
import { getInteractionByType } from "./data/interactions";
import { getDefaultLayout, getDefaultTheme } from "./data/layouts";

// ============================================
// FULL PREVIEW SCREEN (Step 3)
// ============================================

interface FullPreviewProps {
  inviteData: InviteData;
  onBack: () => void;
  onShare: () => void;
}

function FullPreviewScreen({ inviteData, onBack, onShare }: FullPreviewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white/80 hover:text-white flex items-center gap-2"
        >
          ← Back to Edit
        </button>
        <span className="text-white/60 text-sm">Preview Mode</span>
        <button
          onClick={onShare}
          className="px-6 py-2 rounded-xl text-white font-semibold"
          style={{ background: PLAYFUL_COLORS.funGradient }}
        >
          Share Invite
        </button>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <InvitePreview
            interactions={inviteData.interactions}
            layout={inviteData.layout}
            theme={inviteData.theme}
            globalStyles={inviteData.globalStyles}
          />
        </motion.div>
      </div>

      {/* Footer note */}
      <div className="p-4 text-center">
        <p className="text-white/40 text-sm">
          This is how your invite will look to recipients
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN PLAYFUL EDITOR COMPONENT
// ============================================

interface PlayfulEditorProps {
  initialData?: InviteData;
  onSave?: (data: InviteData) => void;
}

export function PlayfulEditor({ initialData, onSave }: PlayfulEditorProps) {
  // Current step in the flow
  const [step, setStep] = useState<EditorStep>("pick");

  // Invite data state
  const [interactions, setInteractions] = useState<InteractionSlot[]>(
    initialData?.interactions || []
  );
  const [layout, setLayout] = useState<LayoutType>(
    initialData?.layout || getDefaultLayout().type
  );
  const [theme, setTheme] = useState<ThemeType>(
    initialData?.theme || getDefaultTheme().type
  );
  const [globalStyles, setGlobalStyles] = useState(
    initialData?.globalStyles || {
      fontFamily: "'Poppins', sans-serif",
      primaryColor: PLAYFUL_COLORS.purple,
      secondaryColor: PLAYFUL_COLORS.pink,
      backgroundColor: "#FAFAFF",
    }
  );

  // ========================================
  // INTERACTION HANDLERS
  // ========================================

  const handleSelectInteraction = useCallback((type: InteractionType) => {
    const interactionDef = getInteractionByType(type);
    if (!interactionDef) return;

    const newSlot: InteractionSlot = {
      id: generateId(),
      type,
      slot: (interactions.length + 1) as 1 | 2 | 3,
      config: interactionDef.defaultConfig as InteractionSlot["config"],
    };

    setInteractions((prev) => [...prev, newSlot]);
  }, [interactions.length]);

  const handleDeselectInteraction = useCallback((id: string) => {
    setInteractions((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      // Re-number slots
      return filtered.map((i, index) => ({
        ...i,
        slot: (index + 1) as 1 | 2 | 3,
      }));
    });
  }, []);

  const handleUpdateInteraction = useCallback((id: string, config: unknown) => {
    setInteractions((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, config: config as InteractionSlot["config"] } : i
      )
    );
  }, []);

  const handleUpdateLayout = useCallback((newLayout: LayoutType) => {
    setLayout(newLayout);
  }, []);

  const handleUpdateTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme);
  }, []);

  const handleUpdateStyles = useCallback(
    (styles: Partial<InviteData["globalStyles"]>) => {
      setGlobalStyles((prev) => ({ ...prev, ...styles }));
    },
    []
  );

  // ========================================
  // NAVIGATION HANDLERS
  // ========================================

  const handleContinueFromPicker = useCallback(() => {
    if (interactions.length > 0) {
      setStep("customize");
    }
  }, [interactions.length]);

  const handleBackToPicker = useCallback(() => {
    setStep("pick");
  }, []);

  const handleGoToPreview = useCallback(() => {
    setStep("preview");
  }, []);

  const handleBackToCustomize = useCallback(() => {
    setStep("customize");
  }, []);

  const handleShare = useCallback(() => {
    const inviteData: InviteData = {
      version: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme,
      layout,
      interactions,
      globalStyles,
      decorations: {
        floatingEmojis: ["💕", "✨", "🎉"],
        showConfetti: true,
      },
    };

    if (onSave) {
      onSave(inviteData);
    }

    // For now, just log - later this will handle actual sharing
    console.log("Sharing invite:", inviteData);
    alert("Share functionality coming soon! Your invite data has been logged to console.");
  }, [theme, layout, interactions, globalStyles, onSave]);

  // ========================================
  // BUILD CURRENT INVITE DATA
  // ========================================

  const currentInviteData: InviteData = {
    version: 2,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    theme,
    layout,
    interactions,
    globalStyles,
    decorations: {
      floatingEmojis: ["💕", "✨", "🎉"],
      showConfetti: true,
    },
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <AnimatePresence mode="wait">
      {step === "pick" && (
        <motion.div
          key="picker"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <InteractionPicker
            selectedInteractions={interactions}
            onSelect={handleSelectInteraction}
            onDeselect={handleDeselectInteraction}
            onContinue={handleContinueFromPicker}
            maxSelections={3}
          />
        </motion.div>
      )}

      {step === "customize" && (
        <motion.div
          key="customize"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <CustomizationWizard
            interactions={interactions}
            layout={layout}
            theme={theme}
            globalStyles={globalStyles}
            onUpdateInteraction={handleUpdateInteraction}
            onUpdateLayout={handleUpdateLayout}
            onUpdateTheme={handleUpdateTheme}
            onUpdateStyles={handleUpdateStyles}
            onBack={handleBackToPicker}
            onPreview={handleGoToPreview}
          />
        </motion.div>
      )}

      {step === "preview" && (
        <motion.div
          key="preview"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FullPreviewScreen
            inviteData={currentInviteData}
            onBack={handleBackToCustomize}
            onShare={handleShare}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ========================================
// EXPORTS
// ========================================

export { InteractionPicker } from "./InteractionPicker";
export { InteractionPreviewCard } from "./InteractionPreviewCard";
export { CustomizationWizard } from "./CustomizationWizard";
export { InvitePreview } from "./InvitePreview";
export * from "./types";
export * from "./data/interactions";
export * from "./data/layouts";

export default PlayfulEditor;

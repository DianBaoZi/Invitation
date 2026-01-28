// ============================================
// PLAYFUL EDITOR - TYPE DEFINITIONS
// ============================================

// Interaction Types
export type InteractionType =
  | "yes-no-runaway"
  | "yes-no-shrinking"
  | "scratch-reveal"
  | "spin-wheel"
  | "shake-reveal"    // Future
  | "swipe-cards"     // Future
  | "tap-counter";    // Future

// Layout Types
export type LayoutType = "centered" | "hero-grid" | "split" | "minimal";

// Theme Types
export type ThemeType = "romantic" | "fun" | "elegant" | "playful" | "minimal";

// ============================================
// INTERACTION CONFIGS
// ============================================

export interface YesNoConfig {
  questionText: string;
  yesButtonText: string;
  noButtonText: string;
  successMessage: string;
}

export interface ScratchRevealConfig {
  instructionText: string;
  revealContent: string;
}

export interface SpinWheelConfig {
  titleText: string;
  wheelOptions: string[];
}

export interface ShakeRevealConfig {
  instructionText: string;
  revealContent: string;
  shakeThreshold: number;
}

export interface SwipeCardsConfig {
  cards: { text: string; emoji: string }[];
  finalMessage: string;
}

export interface TapCounterConfig {
  targetTaps: number;
  tapMessage: string;
  revealContent: string;
}

export type InteractionConfigMap = {
  "yes-no-runaway": YesNoConfig;
  "yes-no-shrinking": YesNoConfig;
  "scratch-reveal": ScratchRevealConfig;
  "spin-wheel": SpinWheelConfig;
  "shake-reveal": ShakeRevealConfig;
  "swipe-cards": SwipeCardsConfig;
  "tap-counter": TapCounterConfig;
};

// ============================================
// INTERACTION DEFINITION (for picker)
// ============================================

export interface InteractionDefinition {
  type: InteractionType;
  name: string;
  description: string;
  shortDescription: string;
  emoji: string;
  category: "buttons" | "reveal" | "games" | "future";
  isAvailable: boolean;
  isPremium: boolean;
  previewAnimation: {
    type: "bounce" | "shake" | "spin" | "shimmer" | "pulse" | "float";
    duration: number;
  };
  defaultConfig: InteractionConfigMap[InteractionType];
}

// ============================================
// INVITE DATA STRUCTURE (v2)
// ============================================

export interface InteractionSlot<T extends InteractionType = InteractionType> {
  id: string;
  type: T;
  slot: 1 | 2 | 3;
  config: InteractionConfigMap[T];
}

export interface InviteData {
  version: 2;
  createdAt: string;
  updatedAt: string;
  theme: ThemeType;
  layout: LayoutType;
  interactions: InteractionSlot[];
  globalStyles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  decorations: {
    floatingEmojis: string[];
    showConfetti: boolean;
  };
}

// ============================================
// LAYOUT DEFINITION
// ============================================

export interface LayoutSlot {
  id: string;
  position: "full" | "top" | "bottom" | "left" | "right" | "center";
  size: "large" | "medium" | "small";
  gridArea?: string;
}

export interface LayoutDefinition {
  type: LayoutType;
  name: string;
  description: string;
  emoji: string;
  slots: LayoutSlot[];
  gridTemplate: string;
  decorationPositions: string[];
}

// ============================================
// EDITOR STATE
// ============================================

export type EditorStep = "pick" | "customize" | "preview";

export interface EditorState {
  step: EditorStep;
  selectedInteractions: InteractionSlot[];
  layout: LayoutType;
  theme: ThemeType;
  globalStyles: InviteData["globalStyles"];
}

// ============================================
// COMPONENT PROPS
// ============================================

export interface InteractionPickerProps {
  selectedInteractions: InteractionSlot[];
  onSelect: (type: InteractionType) => void;
  onDeselect: (id: string) => void;
  onContinue: () => void;
  maxSelections?: number;
}

export interface InteractionPreviewCardProps {
  interaction: InteractionDefinition;
  isSelected: boolean;
  selectionOrder?: number;
  onSelect: () => void;
  disabled?: boolean;
}

export interface CustomizationWizardProps {
  interactions: InteractionSlot[];
  layout: LayoutType;
  theme: ThemeType;
  globalStyles: InviteData["globalStyles"];
  onUpdateInteraction: (id: string, config: unknown) => void;
  onUpdateLayout: (layout: LayoutType) => void;
  onUpdateTheme: (theme: ThemeType) => void;
  onUpdateStyles: (styles: Partial<InviteData["globalStyles"]>) => void;
  onBack: () => void;
  onPreview: () => void;
}

export interface InvitePreviewProps {
  interactions: InteractionSlot[];
  layout: LayoutType;
  theme: ThemeType;
  globalStyles: InviteData["globalStyles"];
  scale?: number;
}

// ============================================
// THEME COLORS
// ============================================

export const PLAYFUL_COLORS = {
  // Primary palette
  purple: "#7C3AED",
  pink: "#EC4899",
  yellow: "#F59E0B",
  green: "#10B981",
  blue: "#3B82F6",

  // Backgrounds
  background: "#FAFAFF",
  card: "#FFFFFF",
  cardHover: "#F9FAFB",

  // Text
  text: "#1F2937",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",

  // Gradients
  funGradient: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
  warmGradient: "linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",
  coolGradient: "linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%)",

  // Effects
  glow: "0 0 40px rgba(124, 58, 237, 0.3)",
  cardShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  cardShadowHover: "0 8px 30px rgba(124, 58, 237, 0.15)",
} as const;

// ============================================
// ANIMATION PRESETS
// ============================================

export const ANIMATIONS = {
  float: {
    y: [-5, 5],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
  bounce: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
  shimmer: {
    x: [-100, 100],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
  wiggle: {
    rotate: [-3, 3],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
} as const;

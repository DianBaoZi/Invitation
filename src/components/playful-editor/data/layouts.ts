// ============================================
// PLAYFUL EDITOR - LAYOUT DEFINITIONS
// ============================================

import { LayoutDefinition, LayoutType, ThemeType } from "../types";

// ============================================
// LAYOUT DEFINITIONS
// ============================================

export const LAYOUTS: LayoutDefinition[] = [
  {
    type: "centered",
    name: "Centered Stack",
    description: "Clean, centered layout with interactions stacked vertically",
    emoji: "📐",
    slots: [
      { id: "slot-1", position: "center", size: "large" },
      { id: "slot-2", position: "center", size: "medium" },
      { id: "slot-3", position: "center", size: "medium" },
    ],
    gridTemplate: `
      "slot-1"
      "slot-2"
      "slot-3"
    `,
    decorationPositions: ["top-left", "top-right", "bottom-left", "bottom-right"],
  },
  {
    type: "hero-grid",
    name: "Hero + Grid",
    description: "Large hero interaction with smaller items below",
    emoji: "🏆",
    slots: [
      { id: "slot-1", position: "top", size: "large", gridArea: "hero" },
      { id: "slot-2", position: "bottom", size: "small", gridArea: "left" },
      { id: "slot-3", position: "bottom", size: "small", gridArea: "right" },
    ],
    gridTemplate: `
      "hero hero"
      "left right"
    `,
    decorationPositions: ["top-left", "top-right"],
  },
  {
    type: "split",
    name: "Split Screen",
    description: "Decorative left side with interactions on the right",
    emoji: "↔️",
    slots: [
      { id: "slot-1", position: "right", size: "medium" },
      { id: "slot-2", position: "right", size: "medium" },
      { id: "slot-3", position: "right", size: "small" },
    ],
    gridTemplate: `
      "deco slot-1"
      "deco slot-2"
      "deco slot-3"
    `,
    decorationPositions: ["left-full"],
  },
  {
    type: "minimal",
    name: "Minimal",
    description: "Simple, elegant single-focus layout",
    emoji: "✨",
    slots: [
      { id: "slot-1", position: "full", size: "large" },
    ],
    gridTemplate: `
      "slot-1"
    `,
    decorationPositions: ["subtle-corners"],
  },
];

// ============================================
// THEME DEFINITIONS
// ============================================

export interface ThemeDefinition {
  type: ThemeType;
  name: string;
  description: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fontFamily: string;
  decorations: {
    floatingEmojis: string[];
    showConfetti: boolean;
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    type: "romantic",
    name: "Romantic",
    description: "Soft pinks and reds, perfect for love",
    emoji: "💕",
    colors: {
      primary: "#E91E63",
      secondary: "#F8BBD9",
      background: "#FFF5F7",
      text: "#4A1942",
      accent: "#FF4081",
    },
    fontFamily: "'Playfair Display', serif",
    decorations: {
      floatingEmojis: ["💕", "💖", "💗", "💝", "✨"],
      showConfetti: true,
    },
  },
  {
    type: "fun",
    name: "Fun & Playful",
    description: "Bright colors and bouncy energy",
    emoji: "🎉",
    colors: {
      primary: "#7C3AED",
      secondary: "#EC4899",
      background: "#FAFAFF",
      text: "#1F2937",
      accent: "#F59E0B",
    },
    fontFamily: "'Poppins', sans-serif",
    decorations: {
      floatingEmojis: ["🎉", "🎈", "🎊", "⭐", "🌟"],
      showConfetti: true,
    },
  },
  {
    type: "elegant",
    name: "Elegant",
    description: "Sophisticated gold and cream",
    emoji: "👑",
    colors: {
      primary: "#D4AF37",
      secondary: "#F5E6C4",
      background: "#FFFEF5",
      text: "#2C2416",
      accent: "#8B7355",
    },
    fontFamily: "'Cormorant Garamond', serif",
    decorations: {
      floatingEmojis: ["✨", "👑", "💫", "⭐"],
      showConfetti: false,
    },
  },
  {
    type: "playful",
    name: "Playful Pop",
    description: "Bold, colorful, and eye-catching",
    emoji: "🌈",
    colors: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      background: "#F7FFF7",
      text: "#2D3436",
      accent: "#FFE66D",
    },
    fontFamily: "'Fredoka One', cursive",
    decorations: {
      floatingEmojis: ["🌈", "⭐", "🎨", "💫", "🎪"],
      showConfetti: true,
    },
  },
  {
    type: "minimal",
    name: "Minimal",
    description: "Clean and modern simplicity",
    emoji: "◻️",
    colors: {
      primary: "#1A1A1A",
      secondary: "#666666",
      background: "#FFFFFF",
      text: "#1A1A1A",
      accent: "#3B82F6",
    },
    fontFamily: "'Inter', sans-serif",
    decorations: {
      floatingEmojis: [],
      showConfetti: false,
    },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getLayoutByType(type: LayoutType): LayoutDefinition | undefined {
  return LAYOUTS.find((l) => l.type === type);
}

export function getThemeByType(type: ThemeType): ThemeDefinition | undefined {
  return THEMES.find((t) => t.type === type);
}

export function getDefaultTheme(): ThemeDefinition {
  return THEMES.find((t) => t.type === "fun") || THEMES[0];
}

export function getDefaultLayout(): LayoutDefinition {
  return LAYOUTS.find((l) => l.type === "centered") || LAYOUTS[0];
}

// ============================================
// GRID CSS HELPERS
// ============================================

export function getLayoutGridCSS(layout: LayoutType): React.CSSProperties {
  const layoutDef = getLayoutByType(layout);
  if (!layoutDef) return {};

  switch (layout) {
    case "centered":
      return {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "32px",
      };
    case "hero-grid":
      return {
        display: "grid",
        gridTemplateAreas: `"hero hero" "left right"`,
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "2fr 1fr",
        gap: "16px",
        padding: "24px",
      };
    case "split":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0",
      };
    case "minimal":
      return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
      };
    default:
      return {};
  }
}

export function getSlotGridArea(slotId: string): string {
  const slotNum = slotId.replace("slot-", "");
  return `slot-${slotNum}`;
}

// ============================================
// PLAYFUL EDITOR - INTERACTION DEFINITIONS
// ============================================

import {
  InteractionDefinition,
  InteractionType,
  YesNoConfig,
  ScratchRevealConfig,
  SpinWheelConfig,
  ShakeRevealConfig,
  SwipeCardsConfig,
  TapCounterConfig,
} from "../types";

// ============================================
// DEFAULT CONFIGS
// ============================================

const DEFAULT_YES_NO_CONFIG: YesNoConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "Yes! 💕",
  noButtonText: "No",
  successMessage: "Yay! You made me so happy! 🎉💕",
};

const DEFAULT_SCRATCH_REVEAL_CONFIG: ScratchRevealConfig = {
  instructionText: "Scratch to reveal your surprise!",
  revealContent: "You're invited to my birthday party! 🎂🎈",
};

const DEFAULT_SPIN_WHEEL_CONFIG: SpinWheelConfig = {
  titleText: "Spin to see your prize!",
  wheelOptions: [
    "Free Hug 🤗",
    "Movie Night 🎬",
    "Ice Cream 🍦",
    "Dinner Date 🍝",
    "Adventure Day 🎢",
    "Spa Day 💆",
  ],
};

const DEFAULT_SHAKE_REVEAL_CONFIG: ShakeRevealConfig = {
  instructionText: "Shake your phone to reveal!",
  revealContent: "You're amazing! ✨",
  shakeThreshold: 15,
};

const DEFAULT_SWIPE_CARDS_CONFIG: SwipeCardsConfig = {
  cards: [
    { text: "You're awesome!", emoji: "⭐" },
    { text: "I appreciate you", emoji: "💖" },
    { text: "Let's celebrate!", emoji: "🎉" },
  ],
  finalMessage: "You're invited! 🎊",
};

const DEFAULT_TAP_COUNTER_CONFIG: TapCounterConfig = {
  targetTaps: 10,
  tapMessage: "Keep tapping!",
  revealContent: "You unlocked the secret! 🎁",
};

// ============================================
// INTERACTION DEFINITIONS
// ============================================

export const INTERACTIONS: InteractionDefinition[] = [
  // ========== BUTTON INTERACTIONS ==========
  {
    type: "yes-no-runaway",
    name: "Runaway No Button",
    description:
      "The classic! Ask a question where the 'No' button playfully runs away when they try to click it. Perfect for proposals and invitations!",
    shortDescription: "No button escapes your cursor",
    emoji: "🏃",
    category: "buttons",
    isAvailable: true,
    isPremium: false,
    previewAnimation: {
      type: "bounce",
      duration: 0.6,
    },
    defaultConfig: DEFAULT_YES_NO_CONFIG,
  },
  {
    type: "yes-no-shrinking",
    name: "Shrinking No Button",
    description:
      "Each time they hover over 'No', it gets smaller and smaller until it disappears! A fun twist on the runaway button.",
    shortDescription: "No button shrinks on hover",
    emoji: "🔍",
    category: "buttons",
    isAvailable: true,
    isPremium: false,
    previewAnimation: {
      type: "pulse",
      duration: 1.5,
    },
    defaultConfig: DEFAULT_YES_NO_CONFIG,
  },

  // ========== REVEAL INTERACTIONS ==========
  {
    type: "scratch-reveal",
    name: "Scratch to Reveal",
    description:
      "Create a golden scratch card experience! They scratch away to reveal your hidden message. Great for surprises and announcements!",
    shortDescription: "Scratch off to reveal message",
    emoji: "✨",
    category: "reveal",
    isAvailable: true,
    isPremium: true,
    previewAnimation: {
      type: "shimmer",
      duration: 1.5,
    },
    defaultConfig: DEFAULT_SCRATCH_REVEAL_CONFIG,
  },
  {
    type: "shake-reveal",
    name: "Shake to Reveal",
    description:
      "They shake their phone to reveal your hidden message! Perfect for mobile users who love a bit of magic.",
    shortDescription: "Shake phone to reveal",
    emoji: "📱",
    category: "reveal",
    isAvailable: false, // Future
    isPremium: true,
    previewAnimation: {
      type: "shake",
      duration: 0.5,
    },
    defaultConfig: DEFAULT_SHAKE_REVEAL_CONFIG,
  },

  // ========== GAME INTERACTIONS ==========
  {
    type: "spin-wheel",
    name: "Spin the Wheel",
    description:
      "A colorful prize wheel they can spin! Set custom options like date ideas, prizes, or fun activities. Always a crowd pleaser!",
    shortDescription: "Spin wheel for prizes",
    emoji: "🎡",
    category: "games",
    isAvailable: true,
    isPremium: true,
    previewAnimation: {
      type: "spin",
      duration: 2,
    },
    defaultConfig: DEFAULT_SPIN_WHEEL_CONFIG,
  },
  {
    type: "swipe-cards",
    name: "Swipe Cards",
    description:
      "Tinder-style cards they swipe through! Each card reveals a message or reason, building up to a final reveal.",
    shortDescription: "Swipe through message cards",
    emoji: "💌",
    category: "games",
    isAvailable: false, // Future
    isPremium: true,
    previewAnimation: {
      type: "float",
      duration: 2,
    },
    defaultConfig: DEFAULT_SWIPE_CARDS_CONFIG,
  },
  {
    type: "tap-counter",
    name: "Tap to Unlock",
    description:
      "They tap a certain number of times to unlock your message! Shows progress as they tap. Fun and engaging!",
    shortDescription: "Tap to unlock message",
    emoji: "👆",
    category: "games",
    isAvailable: false, // Future
    isPremium: true,
    previewAnimation: {
      type: "bounce",
      duration: 0.3,
    },
    defaultConfig: DEFAULT_TAP_COUNTER_CONFIG,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getInteractionByType(
  type: InteractionType
): InteractionDefinition | undefined {
  return INTERACTIONS.find((i) => i.type === type);
}

export function getAvailableInteractions(): InteractionDefinition[] {
  return INTERACTIONS.filter((i) => i.isAvailable);
}

export function getFutureInteractions(): InteractionDefinition[] {
  return INTERACTIONS.filter((i) => !i.isAvailable);
}

export function getInteractionsByCategory(
  category: InteractionDefinition["category"]
): InteractionDefinition[] {
  return INTERACTIONS.filter((i) => i.category === category);
}

export function getFreeInteractions(): InteractionDefinition[] {
  return INTERACTIONS.filter((i) => i.isAvailable && !i.isPremium);
}

export function getPremiumInteractions(): InteractionDefinition[] {
  return INTERACTIONS.filter((i) => i.isAvailable && i.isPremium);
}

// ============================================
// CATEGORY METADATA
// ============================================

export const CATEGORIES = [
  {
    id: "buttons" as const,
    name: "Button Magic",
    description: "Interactive buttons that respond to clicks and hovers",
    emoji: "🔘",
  },
  {
    id: "reveal" as const,
    name: "Reveal Effects",
    description: "Hidden messages waiting to be discovered",
    emoji: "🎁",
  },
  {
    id: "games" as const,
    name: "Mini Games",
    description: "Fun interactive games and activities",
    emoji: "🎮",
  },
  {
    id: "future" as const,
    name: "Coming Soon",
    description: "Exciting new interactions on the way",
    emoji: "🚀",
  },
];

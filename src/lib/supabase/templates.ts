import {
  Template,
  RunawayButtonConfig,
  ScratchRevealConfig,
  Y2KDigitalCrushConfig,
  CozyScrapbookConfig,
  NeonArcadeConfig,
  LoveLetterMailboxConfig,
  StargazerConfig,
  PremiereConfig,
} from "./types";

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

export const DEFAULT_RUNAWAY_CONFIG: RunawayButtonConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "Yes! 💕",
  noButtonText: "No",
  successMessage: "Yay! You made me so happy! 🎉💕",
};

export const DEFAULT_SCRATCH_CONFIG: ScratchRevealConfig = {
  instructionText: "Scratch to reveal your surprise!",
  revealContent: "You're invited to my special day! 🎂🎈",
};

export const DEFAULT_Y2K_CONFIG: Y2KDigitalCrushConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "YES PLS 💕",
  noButtonText: "No",
  successMessage: "crush.exe completed successfully ✓",
};

export const DEFAULT_COZY_SCRAPBOOK_CONFIG: CozyScrapbookConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "Absolutely ♥",
  successMessage: "This is the beginning of something beautiful...",
  eventDate: "Valentine's Day",
  eventTime: "7:30 PM",
  eventLocation: "Somewhere romantic",
};

export const DEFAULT_NEON_ARCADE_CONFIG: NeonArcadeConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "PRESS START (YES)",
  successMessage: "YOU WIN: A Date! 💕",
};

export const DEFAULT_LOVE_LETTER_CONFIG: LoveLetterMailboxConfig = {
  message: "I've been wanting to ask you this...",
  plan: "Valentine's Dinner",
  date: "Feb 14th @ 7:30 PM",
  location: "The Little Italian Place",
  yesButtonText: "I'm There! 💕",
  declineButtonText: "Can't make it...",
};

export const DEFAULT_STARGAZER_CONFIG: StargazerConfig = {
  message: "Will you be my Valentine?",
  personalMessage: "Every moment with you feels like stargazing — infinite, breathtaking, and full of wonder.",
  date: "February 14th",
  time: "7:00 PM",
  location: "Under the stars",
};

export const DEFAULT_PREMIERE_CONFIG: PremiereConfig = {
  message: "Will you be my Valentine?",
  personalMessage: "Every scene of my life is better with you in it.",
  date: "February 14th",
  time: "7:00 PM",
  location: "The usual spot",
};

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const TEMPLATES: Template[] = [
  {
    id: "runaway-button",
    name: "Runaway 'No' Button",
    description:
      "The classic! Ask a question where the 'No' button playfully runs away. They can only say Yes!",
    emoji: "🏃",
    is_free: true,
    price_cents: 0,
    default_config: DEFAULT_RUNAWAY_CONFIG,
  },
  {
    id: "love-letter-mailbox",
    name: "Love Letter Mailbox",
    description:
      "Open the mailbox to reveal a multi-card love letter with event ticket and shy RSVP button.",
    emoji: "📬",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_LOVE_LETTER_CONFIG,
  },
  {
    id: "stargazer",
    name: "Stargazer",
    description:
      "Written in the stars — a cinematic night sky experience with constellations, shooting stars, and a supernova finale.",
    emoji: "🌌",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_STARGAZER_CONFIG,
  },
  {
    id: "premiere",
    name: "Premiere",
    description:
      "You're the star of my movie — a cinematic experience with film countdown, velvet curtains, and a movie ticket invite.",
    emoji: "🎬",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_PREMIERE_CONFIG,
  },
  {
    id: "y2k-digital-crush",
    name: "System Crush",
    description:
      "Retro desktop vibes! Click 'No' and watch the system crash with escalating glitch errors.",
    emoji: "💾",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_Y2K_CONFIG,
  },
  {
    id: "neon-arcade",
    name: "Neon Arcade",
    description:
      "80s arcade cabinet vibes! The No button splits and multiplies — game over, you can't win!",
    emoji: "🕹️",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_NEON_ARCADE_CONFIG,
  },
  {
    id: "scratch-reveal",
    name: "Scratch to Reveal",
    description:
      "A golden scratch card! They scratch away the surface to reveal your hidden message.",
    emoji: "✨",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_SCRATCH_CONFIG,
  },
  {
    id: "cozy-scrapbook",
    name: "Cozy Scrapbook",
    description:
      "Flip through a handmade scrapbook with torn paper pages, washi tape, and a ticket-stub invite.",
    emoji: "📒",
    is_free: false,
    price_cents: 100, // $1
    default_config: DEFAULT_COZY_SCRAPBOOK_CONFIG,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getFreeTemplate(): Template {
  return TEMPLATES.find((t) => t.is_free)!;
}

export function getPaidTemplates(): Template[] {
  return TEMPLATES.filter((t) => !t.is_free);
}

export function getDefaultConfig(templateId: string) {
  const template = getTemplateById(templateId);
  return template?.default_config;
}

// ============================================
// PRICING
// ============================================

export const PRICING = {
  single: 100, // $1 in cents
  membership: 300, // $3 one-time in cents - all templates + future releases
};

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

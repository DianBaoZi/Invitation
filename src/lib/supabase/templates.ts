import {
  Template,
  RunawayButtonConfig,
  Y2KDigitalCrushConfig,
  CozyScrapbookConfig,
  LoveLetterMailboxConfig,
  StargazerConfig,
  PremiereConfig,
  ForestAdventureConfig,
  ElegantInvitationConfig,
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


export const DEFAULT_Y2K_CONFIG: Y2KDigitalCrushConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "YES PLS 💕",
  noButtonText: "No",
  successMessage: "crush.exe completed successfully ✓",
  personalMessage: "You've captured my heart like a rare Pokémon.",
  date: "February 14th",
  time: "7:00 PM",
  location: "The usual spot",
};

export const DEFAULT_COZY_SCRAPBOOK_CONFIG: CozyScrapbookConfig = {
  questionText: "Will you be my Valentine?",
  yesButtonText: "Absolutely ♥",
  successMessage: "This is the beginning of something beautiful...",
  personalMessage: "Every page of my heart has your name written on it.",
  eventDate: "Valentine's Day",
  eventTime: "7:30 PM",
  eventLocation: "Somewhere romantic",
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

export const DEFAULT_FOREST_ADVENTURE_CONFIG: ForestAdventureConfig = {
  message: "Will you be my Valentine?",
  personalMessage: "I planned this whole adventure just for you!",
  date: "February 14th",
  time: "7:00 PM",
  location: "The Enchanted Forest",
};

export const DEFAULT_ELEGANT_INVITATION_CONFIG: ElegantInvitationConfig = {
  message: "Will you be my Valentine?",
  personalMessage: "Every moment with you feels like a beautiful story unfolding.",
  date: "February 14th",
  time: "7:00 PM",
  location: "Our special place",
};

// ============================================
// TEMPLATE DEFINITIONS
// ============================================

export const TEMPLATES: Template[] = [
  {
    id: "runaway-button",
    name: "Standard Invite",
    description:
      "A simple, elegant invitation with a playful twist — the 'No' button runs away so they can only say Yes!",
    emoji: "💌",
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
    price_cents: 199, // $1.99
    default_config: DEFAULT_LOVE_LETTER_CONFIG,
    badge: "Most Popular",
  },
  // Hidden: Forest Adventure template removed from public listing
  // {
  //   id: "forest-adventure",
  //   name: "Forest Adventure",
  //   description:
  //     "Embark on a pixelated quest through the Enchanted Forest — make choices, befriend a bear, and discover a magical invitation!",
  //   emoji: "🌲",
  //   is_free: false,
  //   price_cents: 199, // $1.99
  //   default_config: DEFAULT_FOREST_ADVENTURE_CONFIG,
  //   badge: "New",
  // },
  {
    id: "stargazer",
    name: "Stargazer",
    description:
      "Written in the stars — a cinematic night sky experience with constellations, shooting stars, and a supernova finale.",
    emoji: "🌌",
    is_free: false,
    price_cents: 199, // $1.99
    default_config: DEFAULT_STARGAZER_CONFIG,
    badge: "Trending",
  },
  {
    id: "premiere",
    name: "Premiere",
    description:
      "You're the star of my movie — a cinematic experience with film countdown, velvet curtains, and a movie ticket invite.",
    emoji: "🎬",
    is_free: false,
    price_cents: 199, // $1.99
    default_config: DEFAULT_PREMIERE_CONFIG,
  },
  // Hidden: Y2K Digital Crush template removed from public listing
    {
    id: "cozy-scrapbook",
    name: "Cozy Scrapbook",
    description:
      "Flip through a handmade scrapbook with torn paper pages, washi tape, and a ticket-stub invite.",
    emoji: "📒",
    is_free: false,
    price_cents: 199, // $1.99
    default_config: DEFAULT_COZY_SCRAPBOOK_CONFIG,
  },
  {
    id: "elegant-invitation",
    name: "Elegant Invitation",
    description:
      "A refined scroll-through invitation with photo frames, rose gold accents, and delicate floral details.",
    emoji: "💐",
    is_free: false,
    price_cents: 199, // $1.99
    default_config: DEFAULT_ELEGANT_INVITATION_CONFIG,
    badge: "New",
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
  single: 199, // $1.99 in cents - single template, 30-day access
  lifetime: 399, // $3.99 one-time in cents - all templates + future releases forever
};

export function formatPrice(cents: number): string {
  // Always show decimals for charm pricing effect, with USD suffix
  return `${(cents / 100).toFixed(2)} USD`;
}

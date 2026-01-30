// ============================================
// DATABASE TYPES
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================
// TEMPLATE TYPES
// ============================================

export interface Template {
  id: string;
  name: string;
  description: string;
  emoji: string;
  is_free: boolean;
  price_cents: number;
  default_config: TemplateConfig;
  preview_video_url?: string;
  badge?: "Most Popular" | "Staff Pick" | "New" | "Trending";
}

export type TemplateId = "runaway-button" | "y2k-digital-crush" | "cozy-scrapbook" | "love-letter-mailbox" | "stargazer" | "premiere" | "avocado-valentine" | "forest-adventure" | "elegant-invitation";

// Configuration for each template type
export interface RunawayButtonConfig {
  questionText: string;
  yesButtonText: string;
  noButtonText: string;
  successMessage: string;
}

export interface Y2KDigitalCrushConfig {
  questionText: string;
  yesButtonText: string;
  noButtonText: string;
  successMessage: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
}

export interface CozyScrapbookConfig {
  questionText: string;
  yesButtonText: string;
  successMessage: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

export interface LoveLetterMailboxConfig {
  message: string;
  plan: string;
  date: string;
  location: string;
  yesButtonText: string;
  declineButtonText: string;
}

export interface StargazerConfig {
  message: string;
  personalMessage: string;
  date: string;
  time: string;
  location: string;
}

export interface PremiereConfig {
  message: string;
  personalMessage: string;
  date: string;
  time: string;
  location: string;
}

export interface ForestAdventureConfig {
  message: string;
  personalMessage: string;
  date: string;
  time: string;
  location: string;
}

export interface ElegantInvitationConfig {
  message: string;
  personalMessage: string;
  date: string;
  time: string;
  location: string;
  photo1Url?: string;
  photo1Caption?: string;
  photo2Url?: string;
  photo2Caption?: string;
  photo3Url?: string;
  photo3Caption?: string;
}

export type TemplateConfig =
  | RunawayButtonConfig
  | Y2KDigitalCrushConfig
  | CozyScrapbookConfig
  | LoveLetterMailboxConfig
  | StargazerConfig
  | PremiereConfig
  | ForestAdventureConfig
  | ElegantInvitationConfig;

// ============================================
// INVITE TYPES
// ============================================

export interface Invite {
  id: string;
  slug: string;
  template_id: TemplateId;
  configuration: TemplateConfig;
  creator_email: string | null;
  creator_name: string | null;
  recipient_name: string | null;
  is_paid: boolean;
  stripe_payment_id: string | null;
  created_at: string;
  expires_at: string;
}

export interface CreateInviteInput {
  template_id: TemplateId;
  configuration?: TemplateConfig;
  creator_email?: string;
  creator_name?: string;
  recipient_name?: string;
  is_paid?: boolean;
  stripe_payment_id?: string;
}

// ============================================
// INVITE VIEW TYPES (Analytics)
// ============================================

export interface InviteView {
  id: string;
  invite_id: string;
  viewed_at: string;
  ip_address: string | null;
}

// ============================================
// PURCHASE TYPES
// ============================================

export interface Purchase {
  id: string;
  email: string;
  name: string;
  product_type: "single" | "premium";
  template_id: TemplateId | null;
  amount_cents: number;
  stripe_session_id: string | null;
  stripe_payment_id: string | null;
  created_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface CreateInviteResponse {
  success: boolean;
  invite?: {
    id: string;
    slug: string;
    shareUrl: string;
  };
  error?: string;
}

export interface GetInviteResponse {
  success: boolean;
  invite?: Invite & {
    template: Template;
  };
  error?: string;
}

// ============================================
// DATABASE SCHEMA (for Supabase)
// ============================================

export interface Database {
  public: {
    Tables: {
      templates: {
        Row: Template;
        Insert: Omit<Template, "id"> & { id?: string };
        Update: Partial<Template>;
      };
      invites: {
        Row: Invite;
        Insert: Omit<Invite, "id" | "created_at" | "slug" | "expires_at"> & {
          id?: string;
          slug?: string;
          created_at?: string;
          expires_at?: string;
        };
        Update: Partial<Invite>;
      };
      invite_views: {
        Row: InviteView;
        Insert: Omit<InviteView, "id" | "viewed_at"> & {
          id?: string;
          viewed_at?: string;
        };
        Update: Partial<InviteView>;
      };
      purchases: {
        Row: Purchase;
        Insert: Omit<Purchase, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Purchase>;
      };
    };
  };
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, AlertCircle, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, PenLine, Eye, MessageSquare, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTemplateById } from "@/lib/supabase/templates";
import { createClient } from "@/lib/supabase/client";
import { CozyScrapbook } from "@/components/templates/CozyScrapbook";
import { ElegantInvitation } from "@/components/templates/ElegantInvitation";
import { SplashScreen } from "@/components/invite/SplashScreen";

// Format date from YYYY-MM-DD to readable format
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

// Format time from HH:MM to readable format
function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

// ============================================
// TEMPLATE FIELD CONFIGURATION
// ============================================

interface TemplateFieldConfig {
  sectionTitle: string;
  sectionIcon: "sparkles" | "heart";
  accentColor: string; // tailwind color key like "pink", "indigo", "amber"
  fields: FieldDef[];
}

interface FieldDef {
  key: "message" | "personalMessage" | "date" | "time" | "location";
  label: string;
  placeholder: string;
  icon: "calendar" | "clock" | "mappin" | "penline" | "message" | "heart";
  type: "input" | "textarea";
  inputType?: "text" | "date" | "time"; // For date/time pickers
  maxLength?: number;
  hint?: string;
  textareaStyle?: React.CSSProperties;
}

// Character limits
const CHAR_LIMITS = {
  name: 30,
  message: 80,
  personalMessage: 200,
  location: 40,
  date: 25,
  time: 15,
};

function getTemplateFields(templateId: string): TemplateFieldConfig {
  switch (templateId) {
    case "love-letter-mailbox":
      return {
        sectionTitle: "Love Letter Details",
        sectionIcon: "heart",
        accentColor: "pink",
        fields: [
          {
            key: "date",
            label: "Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Location",
            placeholder: "The Little Italian Place",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "You make every moment feel like a fairytale...",
            icon: "penline",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "This appears on a dedicated card in cursive",
            textareaStyle: {
              fontFamily: "'Poppins', sans-serif",
              fontStyle: "italic",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#880e4f",
            },
          },
        ],
      };

    case "stargazer":
      return {
        sectionTitle: "Stargazer Details",
        sectionIcon: "sparkles",
        accentColor: "indigo",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "The typewriter text in the night sky",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "Every moment with you feels like stargazing...",
            icon: "penline",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "Appears as a stardust letter in the night sky",
            textareaStyle: {
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#312e81",
            },
          },
          {
            key: "date",
            label: "Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Location",
            placeholder: "Under the stars",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "premiere":
      return {
        sectionTitle: "Premiere Details",
        sectionIcon: "sparkles",
        accentColor: "amber",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "The marquee text on the big screen",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "Every scene of my life is better with you in it.",
            icon: "penline",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "Scrolls like film credits on the big screen",
            textareaStyle: {
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#78350f",
            },
          },
          {
            key: "date",
            label: "Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Venue",
            placeholder: "The usual spot",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "cozy-scrapbook":
      return {
        sectionTitle: "Scrapbook Event Details",
        sectionIcon: "sparkles",
        accentColor: "amber",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
          },
          {
            key: "date",
            label: "Event Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Event Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Event Location",
            placeholder: "Somewhere romantic",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "neon-arcade":
      return {
        sectionTitle: "Arcade Details",
        sectionIcon: "sparkles",
        accentColor: "purple",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "Shown after beating the rhythm game",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "Ready Player 2? Let's start a co-op adventure!",
            icon: "heart",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "Your reward message revealed after winning",
          },
          {
            key: "date",
            label: "Event Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Event Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Event Location",
            placeholder: "The usual spot",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "y2k-digital-crush":
      return {
        sectionTitle: "System Crush Details",
        sectionIcon: "sparkles",
        accentColor: "blue",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "Displayed in the love.exe dialog",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "You've captured my heart like a rare Pokémon.",
            icon: "heart",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "A sweet note shown in the invitation",
          },
          {
            key: "date",
            label: "Event Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Event Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Event Location",
            placeholder: "The usual spot",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "avocado-valentine":
      return {
        sectionTitle: "Avocado Details",
        sectionIcon: "heart",
        accentColor: "green",
        fields: [], // Only needs name
      };

    case "forest-adventure":
      return {
        sectionTitle: "Adventure Details",
        sectionIcon: "sparkles",
        accentColor: "emerald",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "Revealed in the magical letter at the end of the quest",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "I planned this whole adventure just for you!",
            icon: "penline",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "A sweet note on the invitation scroll",
            textareaStyle: {
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "12px",
              lineHeight: 1.8,
              color: "#166534",
            },
          },
          {
            key: "date",
            label: "Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Location",
            placeholder: "The Enchanted Forest",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "elegant-invitation":
      return {
        sectionTitle: "Elegant Invitation Details",
        sectionIcon: "heart",
        accentColor: "rose",
        fields: [
          {
            key: "message",
            label: "Main Question",
            placeholder: "Will you be my Valentine?",
            icon: "heart",
            type: "input",
            maxLength: CHAR_LIMITS.message,
            hint: "The elegant question displayed in the invitation",
          },
          {
            key: "personalMessage",
            label: "Personal Message",
            placeholder: "Every moment with you feels like a beautiful story unfolding.",
            icon: "penline",
            type: "textarea",
            maxLength: CHAR_LIMITS.personalMessage,
            hint: "A heartfelt note in the message card",
            textareaStyle: {
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#b76e79",
            },
          },
          {
            key: "date",
            label: "Date",
            placeholder: "",
            icon: "calendar",
            type: "input",
            inputType: "date",
          },
          {
            key: "time",
            label: "Time",
            placeholder: "",
            icon: "clock",
            type: "input",
            inputType: "time",
          },
          {
            key: "location",
            label: "Location",
            placeholder: "Our special place",
            icon: "mappin",
            type: "input",
            maxLength: CHAR_LIMITS.location,
          },
        ],
      };

    case "runaway-button":
      return {
        sectionTitle: "Invitation Details",
        sectionIcon: "heart",
        accentColor: "pink",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
          },
        ],
      };

    default:
      return {
        sectionTitle: "Details",
        sectionIcon: "sparkles",
        accentColor: "pink",
        fields: [
          {
            key: "message",
            label: "Main Message",
            placeholder: "Will you be my Valentine?",
            icon: "message",
            type: "input",
            maxLength: CHAR_LIMITS.message,
          },
        ],
      };
  }
}

// Map accent color to tailwind-style classes
function getAccentClasses(accent: string) {
  const map: Record<string, { border: string; ring: string; text: string; bg: string; bgGradient: string }> = {
    pink: {
      border: "focus:border-pink-300",
      ring: "focus:ring-pink-200",
      text: "text-pink-700",
      bg: "bg-pink-50",
      bgGradient: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    },
    indigo: {
      border: "focus:border-indigo-300",
      ring: "focus:ring-indigo-200",
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      bgGradient: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
    },
    amber: {
      border: "focus:border-amber-300",
      ring: "focus:ring-amber-200",
      text: "text-amber-700",
      bg: "bg-amber-50",
      bgGradient: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
    },
    purple: {
      border: "focus:border-purple-300",
      ring: "focus:ring-purple-200",
      text: "text-purple-700",
      bg: "bg-purple-50",
      bgGradient: "bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600",
    },
    blue: {
      border: "focus:border-blue-300",
      ring: "focus:ring-blue-200",
      text: "text-blue-700",
      bg: "bg-blue-50",
      bgGradient: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    emerald: {
      border: "focus:border-emerald-300",
      ring: "focus:ring-emerald-200",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      bgGradient: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
    },
    green: {
      border: "focus:border-green-300",
      ring: "focus:ring-green-200",
      text: "text-green-700",
      bg: "bg-green-50",
      bgGradient: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
    },
    rose: {
      border: "focus:border-rose-300",
      ring: "focus:ring-rose-200",
      text: "text-rose-700",
      bg: "bg-rose-50",
      bgGradient: "bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500",
    },
  };
  return map[accent] || map.pink;
}

// Icon component resolver
function FieldIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "calendar": return <Calendar className="w-4 h-4 text-gray-400" />;
    case "clock": return <Clock className="w-4 h-4 text-gray-400" />;
    case "mappin": return <MapPin className="w-4 h-4 text-gray-400" />;
    case "penline": return <PenLine className="w-4 h-4 text-gray-400" />;
    case "message": return <MessageSquare className="w-4 h-4 text-gray-400" />;
    case "heart": return <Heart className="w-4 h-4 text-gray-400" />;
    default: return null;
  }
}

// ============================================
// BACKGROUND GRADIENTS PER TEMPLATE
// ============================================

function getPageBackground(templateId: string): string {
  switch (templateId) {
    case "love-letter-mailbox":
      return "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50";
    case "stargazer":
      return "bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50";
    case "premiere":
      return "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50";
    case "cozy-scrapbook":
      return "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50";
    case "neon-arcade":
      return "bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50";
    case "y2k-digital-crush":
      return "bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50";
    case "avocado-valentine":
      return "bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50";
    case "runaway-button":
      return "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50";
    case "forest-adventure":
      return "bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50";
    case "elegant-invitation":
      return "bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50";
    default:
      return "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50";
  }
}

function getHeaderBorder(templateId: string): string {
  switch (templateId) {
    case "love-letter-mailbox": return "border-pink-100";
    case "stargazer": return "border-indigo-100";
    case "premiere": return "border-amber-100";
    case "neon-arcade": return "border-purple-100";
    case "y2k-digital-crush": return "border-blue-100";
    case "cozy-scrapbook": return "border-amber-100";
    case "avocado-valentine": return "border-green-100";
    case "forest-adventure": return "border-emerald-100";
    case "elegant-invitation": return "border-rose-100";
    default: return "border-gray-100";
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

function CustomizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "love-letter-mailbox";
  const template = getTemplateById(templateId);
  const fieldConfig = getTemplateFields(templateId);
  const accent = getAccentClasses(fieldConfig.accentColor);

  const [name, setName] = useState("invitely");
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoUrl1, setPhotoUrl1] = useState<string>(""); // First photo - splash/cover
  const [photoUrl2, setPhotoUrl2] = useState<string>(""); // Second photo - inside scrapbook
  const [photoUrl3, setPhotoUrl3] = useState<string>(""); // Third photo - for elegant-invitation
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user if logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  // Template-specific field values with defaults
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({
    message: "",
    personalMessage: "",
    date: "2025-02-14", // 14 February
    time: "19:00", // 7:00 PM
    location: "",
  });

  // Handle photo upload - can be used for either photo slot
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  };

  // Multi-step flow: all templates use 3 steps
  const [step, setStep] = useState(1);

  // Build preview URL for any template
  const buildPreviewUrl = (includeSplash = false) => {
    const params = new URLSearchParams();
    if (!includeSplash) params.set("nosplash", "true");
    if (name.trim()) params.set("name", name.trim());

    // Map field values to the right query param names per template
    if (templateId === "love-letter-mailbox") {
      if (fieldValues.date.trim()) params.set("date", fieldValues.date.trim());
      if (fieldValues.location.trim()) params.set("location", fieldValues.location.trim());
      if (fieldValues.personalMessage.trim()) params.set("personalMessage", fieldValues.personalMessage.trim());
    } else if (templateId === "cozy-scrapbook") {
      if (fieldValues.message.trim()) params.set("message", fieldValues.message.trim());
      if (fieldValues.date.trim()) params.set("eventDate", fieldValues.date.trim());
      if (fieldValues.time.trim()) params.set("eventTime", fieldValues.time.trim());
      if (fieldValues.location.trim()) params.set("eventLocation", fieldValues.location.trim());
    } else if (templateId === "stargazer" || templateId === "premiere" || templateId === "forest-adventure" || templateId === "elegant-invitation") {
      if (fieldValues.message.trim()) params.set("message", fieldValues.message.trim());
      if (fieldValues.personalMessage.trim()) params.set("personalMessage", fieldValues.personalMessage.trim());
      if (fieldValues.date.trim()) params.set("date", fieldValues.date.trim());
      if (fieldValues.time.trim()) params.set("time", fieldValues.time.trim());
      if (fieldValues.location.trim()) params.set("location", fieldValues.location.trim());
    } else {
      // Generic: pass message
      if (fieldValues.message.trim()) params.set("message", fieldValues.message.trim());
    }

    return `/test/${templateId}?${params.toString()}`;
  };

  // Generate slug: name-4random
  const generateSlug = (n: string) => {
    const cleanName = n.toLowerCase().replace(/[^a-z0-9]/g, "") || "invite";
    const random = Math.random().toString(36).substring(2, 6);
    return `${cleanName}-${random}`;
  };

  // Get default message based on template
  const getDefaultMessage = (tid: string) => {
    switch (tid) {
      case "love-letter-mailbox":
        return "I've been wanting to ask you this...";
      default:
        return "Will you be my Valentine?";
    }
  };

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setShowConfirm(true);
  };

  const [isCreating, setIsCreating] = useState(false);

  const handleConfirm = async () => {
    setIsCreating(true);

    try {
      // Build configuration based on template type
      let configuration: Record<string, string> = {
        message: fieldValues.message.trim() || getDefaultMessage(templateId),
      };

      if (templateId === "runaway-button" || templateId === "y2k-digital-crush") {
        configuration = {
          questionText: fieldValues.message.trim() || "Will you be my Valentine?",
          yesButtonText: "Yes!",
          noButtonText: "No",
          successMessage: "You made my day! 💕",
        };
      } else if (templateId === "love-letter-mailbox") {
        configuration = {
          message: fieldValues.message.trim() || getDefaultMessage(templateId),
          plan: fieldValues.personalMessage.trim() || "",
          date: fieldValues.date.trim() || "",
          location: fieldValues.location.trim() || "",
          yesButtonText: "Yes!",
          declineButtonText: "Maybe later",
        };
      } else if (templateId === "cozy-scrapbook") {
        configuration = {
          questionText: fieldValues.message.trim() || "Will you be my Valentine?",
          yesButtonText: "Yes!",
          successMessage: "You made my day! 💕",
          eventDate: fieldValues.date.trim() || "",
          eventTime: fieldValues.time.trim() || "",
          eventLocation: fieldValues.location.trim() || "",
        };
      } else {
        // stargazer, premiere, forest-adventure, elegant-invitation
        configuration = {
          message: fieldValues.message.trim() || "Will you be my Valentine?",
          personalMessage: fieldValues.personalMessage.trim() || "",
          date: fieldValues.date.trim() || "",
          time: fieldValues.time.trim() || "",
          location: fieldValues.location.trim() || "",
        };
      }

      // Call API to create invite in Supabase
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: templateId,
          configuration,
          creator_name: name.trim(),
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create invite");
      }

      // Build URL params for success page
      const params = new URLSearchParams({
        slug: result.invite.slug,
        name: name.trim(),
        message: fieldValues.message.trim() || getDefaultMessage(templateId),
        template: templateId,
      });

      // Add template-specific params for success page display
      if (templateId === "love-letter-mailbox") {
        if (fieldValues.date.trim()) params.set("date", fieldValues.date.trim());
        if (fieldValues.location.trim()) params.set("location", fieldValues.location.trim());
        if (fieldValues.personalMessage.trim()) params.set("personalMessage", fieldValues.personalMessage.trim());
      }
      if (templateId === "cozy-scrapbook") {
        if (fieldValues.date.trim()) params.set("eventDate", fieldValues.date.trim());
        if (fieldValues.time.trim()) params.set("eventTime", fieldValues.time.trim());
        if (fieldValues.location.trim()) params.set("eventLocation", fieldValues.location.trim());
      }
      if (templateId === "stargazer" || templateId === "premiere" || templateId === "forest-adventure" || templateId === "elegant-invitation") {
        if (fieldValues.personalMessage.trim()) params.set("personalMessage", fieldValues.personalMessage.trim());
        if (fieldValues.date.trim()) params.set("date", fieldValues.date.trim());
        if (fieldValues.time.trim()) params.set("time", fieldValues.time.trim());
        if (fieldValues.location.trim()) params.set("location", fieldValues.location.trim());
      }

      router.push(`/success?${params.toString()}`);
    } catch (error) {
      console.error("Error creating invite:", error);
      alert("Failed to create invite. Please try again.");
      setIsCreating(false);
    }
  };

  // Determine step labels
  const hasFields = fieldConfig.fields.length > 0;
  const totalSteps = hasFields ? 3 : 2; // Templates with no extra fields skip step 2

  const getStepTitle = () => {
    if (step === 1) return "Customize your splash";
    if (step === totalSteps) return "Preview your invite";
    return "Customize your invite";
  };

  // ==========================================
  // STEP 3 (or 2 for minimal templates): FULL PREVIEW
  // ==========================================
  if (step === totalSteps && totalSteps > 1 && step > 1) {
    // For step 2 of minimal templates (no fields), or step 3 of full templates
    if ((totalSteps === 2 && step === 2) || (totalSteps === 3 && step === 3)) {
      return (
        <div className={`min-h-screen ${getPageBackground(templateId)}`}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`sticky top-0 z-20 p-4 md:p-6 border-b ${getHeaderBorder(templateId)} bg-white/50 backdrop-blur-sm`}
          >
            <div className="max-w-6xl mx-auto flex items-center gap-4">
              <button
                onClick={() => setStep(step - 1)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Preview your invite
                </h1>
                <p className="text-gray-500 text-sm">
                  {template ? `${template.emoji} ${template.name}` : templateId}
                  {" · "}Step {step} of {totalSteps}
                </p>
              </div>
            </div>
          </motion.div>

          {/* For templates with photos, render directly to pass photos; others use iframe */}
          {templateId === "cozy-scrapbook" ? (
            <CozyScrapbookFullPreview
              message={fieldValues.message || "Will you be my Valentine?"}
              senderName={name}
              eventDate={fieldValues.date}
              eventTime={fieldValues.time}
              eventLocation={fieldValues.location}
              photoUrl1={photoUrl1}
              photoUrl2={photoUrl2}
              onBack={() => setStep(step - 1)}
              onGenerate={handleSubmit}
              accentGradient={accent.bgGradient}
            />
          ) : templateId === "elegant-invitation" ? (
            <ElegantInvitationFullPreview
              senderName={name}
              message={fieldValues.message || "Will you be my Valentine?"}
              personalMessage={fieldValues.personalMessage}
              date={fieldValues.date}
              time={fieldValues.time}
              location={fieldValues.location}
              photo1Url={photoUrl1}
              photo2Url={photoUrl2}
              photo3Url={photoUrl3}
              onBack={() => setStep(step - 1)}
              onGenerate={handleSubmit}
              accentGradient={accent.bgGradient}
            />
          ) : (
            <FullPreview
              previewUrl={buildPreviewUrl(true)}
              onBack={() => setStep(step - 1)}
              onGenerate={handleSubmit}
              accentGradient={accent.bgGradient}
            />
          )}

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirm && (
              <ConfirmModal
                name={name}
                onConfirm={handleConfirm}
                onCancel={() => setShowConfirm(false)}
                isLoading={isCreating}
              />
            )}
          </AnimatePresence>
        </div>
      );
    }
  }

  // ==========================================
  // STEPS 1 & 2: FORM + PREVIEW PANEL
  // ==========================================
  return (
    <div className={`min-h-screen ${getPageBackground(templateId)}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-0 z-20 p-4 md:p-6 border-b ${getHeaderBorder(templateId)} bg-white/50 backdrop-blur-sm`}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {getStepTitle()}
            </h1>
            <p className="text-gray-500 text-sm">
              {template ? `${template.emoji} ${template.name}` : templateId}
              {" · "}Step {step} of {totalSteps}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form — animated between steps */}
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1-form"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="space-y-6">
                  <div className="text-center pb-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Heart className="w-10 h-10 mx-auto text-pink-400 fill-pink-400 mb-3" />
                    </motion.div>
                    <h2 className="text-lg font-bold text-gray-800">Who is this from?</h2>
                    <p className="text-sm text-gray-500 mt-1">This will appear on the splash screen your recipient sees first</p>
                  </div>

                  {/* Name input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Your name
                      </Label>
                      <span className={`text-xs ${name.length > CHAR_LIMITS.name ? 'text-red-500' : 'text-gray-400'}`}>
                        {name.length}/{CHAR_LIMITS.name}
                      </span>
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Daniel"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, CHAR_LIMITS.name))}
                      maxLength={CHAR_LIMITS.name}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                    />
                  </div>

                  {/* Photo uploads for cozy-scrapbook - 2 photos */}
                  {templateId === "cozy-scrapbook" && (
                    <div className="space-y-4">
                      {/* Photo 1 - Splash/Cover */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          Cover Photo (optional)
                        </Label>
                        <p className="text-xs text-gray-500">This appears on the splash screen</p>

                        {photoUrl1 ? (
                          <div className="relative inline-block">
                            <img
                              src={photoUrl1}
                              alt="Cover Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-amber-200 shadow-sm"
                            />
                            <button
                              onClick={() => setPhotoUrl1("")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all">
                            <div className="text-center">
                              <ImagePlus className="w-6 h-6 mx-auto text-amber-400 mb-1" />
                              <span className="text-xs text-amber-600">Upload cover photo</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, setPhotoUrl1)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Photo 2 - Inside scrapbook */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          Inside Photo (optional)
                        </Label>
                        <p className="text-xs text-gray-500">This appears inside the unfolded scrapbook</p>

                        {photoUrl2 ? (
                          <div className="relative inline-block">
                            <img
                              src={photoUrl2}
                              alt="Inside Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-orange-200 shadow-sm"
                            />
                            <button
                              onClick={() => setPhotoUrl2("")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-orange-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all">
                            <div className="text-center">
                              <ImagePlus className="w-6 h-6 mx-auto text-orange-400 mb-1" />
                              <span className="text-xs text-orange-600">Upload inside photo</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, setPhotoUrl2)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Photo uploads for elegant-invitation (Elegant Invitation) - 3 photos */}
                  {templateId === "elegant-invitation" && (
                    <div className="space-y-4">
                      {/* Photo 1 - First frame */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          Photo 1 (optional)
                        </Label>
                        <p className="text-xs text-gray-500">First photo frame - &quot;Where it all began&quot;</p>

                        {photoUrl1 ? (
                          <div className="relative inline-block">
                            <img
                              src={photoUrl1}
                              alt="Photo 1 Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-rose-200 shadow-sm"
                            />
                            <button
                              onClick={() => setPhotoUrl1("")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-rose-200 rounded-xl cursor-pointer hover:border-rose-300 hover:bg-rose-50/50 transition-all">
                            <div className="text-center">
                              <ImagePlus className="w-6 h-6 mx-auto text-rose-400 mb-1" />
                              <span className="text-xs text-rose-600">Upload photo 1</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, setPhotoUrl1)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Photo 2 - Second frame (polaroid) */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          Photo 2 (optional)
                        </Label>
                        <p className="text-xs text-gray-500">Second photo frame - &quot;A moment I&apos;ll never forget&quot;</p>

                        {photoUrl2 ? (
                          <div className="relative inline-block">
                            <img
                              src={photoUrl2}
                              alt="Photo 2 Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-pink-200 shadow-sm"
                            />
                            <button
                              onClick={() => setPhotoUrl2("")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-pink-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/50 transition-all">
                            <div className="text-center">
                              <ImagePlus className="w-6 h-6 mx-auto text-pink-400 mb-1" />
                              <span className="text-xs text-pink-600">Upload photo 2</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, setPhotoUrl2)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Photo 3 - Third frame (ornate) */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 font-medium flex items-center gap-1.5">
                          <ImagePlus className="w-4 h-4 text-gray-400" />
                          Photo 3 (optional)
                        </Label>
                        <p className="text-xs text-gray-500">Third photo frame - &quot;Here&apos;s to many more&quot;</p>

                        {photoUrl3 ? (
                          <div className="relative inline-block">
                            <img
                              src={photoUrl3}
                              alt="Photo 3 Preview"
                              className="w-24 h-24 object-cover rounded-lg border-2 border-amber-200 shadow-sm"
                            />
                            <button
                              onClick={() => setPhotoUrl3("")}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all">
                            <div className="text-center">
                              <ImagePlus className="w-6 h-6 mx-auto text-amber-400 mb-1" />
                              <span className="text-xs text-amber-600">Upload photo 3</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, setPhotoUrl3)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Next button */}
                  <Button
                    onClick={handleNext}
                    className={`w-full h-14 text-lg font-semibold rounded-xl ${accent.bgGradient} text-white shadow-lg`}
                  >
                    {hasFields ? (
                      <>
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5 mr-2" />
                        Preview your invite
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : step === 2 && hasFields ? (
              <motion.div
                key="step2-form"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              >
                <div className="space-y-6">
                  <div className="text-center pb-2">
                    <h2 className="text-lg font-bold text-gray-800">Set your details</h2>
                    <p className="text-sm text-gray-500 mt-1">These appear in your invitation</p>
                  </div>

                  {/* Section divider */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className={`text-sm font-semibold ${accent.text} mb-4 flex items-center gap-1.5`}>
                      <Sparkles className="w-4 h-4" />
                      {fieldConfig.sectionTitle}
                    </p>
                  </div>

                  {/* Dynamic fields */}
                  {fieldConfig.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={field.key} className="text-gray-700 font-medium flex items-center gap-1.5">
                          <FieldIcon icon={field.icon} />
                          {field.label}
                        </Label>
                        {field.maxLength && (
                          <span className={`text-xs ${fieldValues[field.key].length > field.maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                            {fieldValues[field.key].length}/{field.maxLength}
                          </span>
                        )}
                      </div>
                      {field.type === "textarea" ? (
                        <>
                          <textarea
                            id={field.key}
                            placeholder={field.placeholder}
                            value={fieldValues[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value.slice(0, field.maxLength || 9999))}
                            rows={3}
                            maxLength={field.maxLength}
                            className={`w-full px-4 py-3 text-base rounded-xl border border-gray-200 ${accent.border} focus:ring-2 ${accent.ring} focus:outline-none resize-none`}
                            style={field.textareaStyle}
                          />
                          {field.hint && (
                            <p className="text-sm text-gray-500">{field.hint}</p>
                          )}
                        </>
                      ) : field.inputType === "date" ? (
                        <>
                          <Input
                            id={field.key}
                            type="date"
                            value={fieldValues[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className={`h-12 text-lg rounded-xl border-gray-200 ${accent.border} ${accent.ring}`}
                          />
                          {field.hint && (
                            <p className="text-sm text-gray-500">{field.hint}</p>
                          )}
                        </>
                      ) : field.inputType === "time" ? (
                        <>
                          <Input
                            id={field.key}
                            type="time"
                            value={fieldValues[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            className={`h-12 text-lg rounded-xl border-gray-200 ${accent.border} ${accent.ring}`}
                          />
                          {field.hint && (
                            <p className="text-sm text-gray-500">{field.hint}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <Input
                            id={field.key}
                            type="text"
                            placeholder={field.placeholder}
                            value={fieldValues[field.key]}
                            onChange={(e) => updateField(field.key, e.target.value.slice(0, field.maxLength || 9999))}
                            maxLength={field.maxLength}
                            className={`h-12 text-lg rounded-xl border-gray-200 ${accent.border} ${accent.ring}`}
                          />
                          {field.hint && (
                            <p className="text-sm text-gray-500">{field.hint}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}

                  {/* Preview button */}
                  <Button
                    onClick={() => setStep(3)}
                    className={`w-full h-14 text-lg font-semibold rounded-xl ${accent.bgGradient} text-white shadow-lg`}
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    Preview your invite
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Preview panel - hidden on mobile, shown on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block space-y-4"
          >
            {/* Step indicator pills */}
            <div className="flex items-center gap-1.5 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
              <div
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                  step === 1 ? `${accent.bgGradient} text-white shadow-md` : "text-gray-400"
                }`}
              >
                1. Splash
              </div>
              {hasFields && (
                <div
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                    step === 2 ? `${accent.bgGradient} text-white shadow-md` : "text-gray-400"
                  }`}
                >
                  2. Details
                </div>
              )}
              <div
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                  step === totalSteps ? `${accent.bgGradient} text-white shadow-md` : "text-gray-400"
                }`}
              >
                {totalSteps}. Preview
              </div>
            </div>

            {/* Preview container */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] max-h-[500px]">
              <div className="absolute inset-0 border-[3px] border-gray-800 rounded-2xl pointer-events-none z-10" />

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <SplashPreview key="splash" name={name} templateId={templateId} photoUrl1={templateId === "cozy-scrapbook" ? photoUrl1 : undefined} />
                ) : (
                  <DetailsPreview
                    key="details"
                    templateId={templateId}
                    name={name}
                    fieldValues={fieldValues}
                    fieldConfig={fieldConfig}
                    accentColor={fieldConfig.accentColor}
                    photoUrl1={templateId === "cozy-scrapbook" ? photoUrl1 : undefined}
                    photoUrl2={templateId === "cozy-scrapbook" ? photoUrl2 : undefined}
                  />
                )}
              </AnimatePresence>
            </div>

            <p className="text-center text-sm text-gray-500">
              {step === 1
                ? "Your recipient sees this splash first"
                : "Your details update live — full experience in step " + totalSteps}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile floating preview bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-30">
        <div className="flex items-center gap-3">
          {/* Mini preview */}
          <div className="w-14 h-20 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 relative">
            <div className="absolute inset-0 border border-gray-700 rounded-lg pointer-events-none z-10" />
            {step === 1 ? (
              <MiniSplashPreview name={name} templateId={templateId} photoUrl1={templateId === "cozy-scrapbook" ? photoUrl1 : undefined} />
            ) : (
              <MiniDetailsPreview templateId={templateId} name={name} fieldValues={fieldValues} photoUrl1={templateId === "cozy-scrapbook" ? photoUrl1 : undefined} photoUrl2={templateId === "cozy-scrapbook" ? photoUrl2 : undefined} />
            )}
          </div>
          {/* Status text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Step {step}: {step === 1 ? "Splash Screen" : "Details"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {step === 1 ? `From ${name || "Your Name"}` : "Fill in the details above"}
            </p>
          </div>
          {/* Step dots */}
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? accent.bgGradient : "bg-gray-200"}`} />
            {hasFields && <div className={`w-2 h-2 rounded-full ${step === 2 ? accent.bgGradient : "bg-gray-200"}`} />}
            <div className={`w-2 h-2 rounded-full ${step === totalSteps ? accent.bgGradient : "bg-gray-200"}`} />
          </div>
        </div>
      </div>

      {/* Spacer for mobile floating bar */}
      <div className="md:hidden h-24" />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            name={name}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
            isLoading={isCreating}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// DETAILS PREVIEW (Step 2 — inline, no iframe)
// ============================================

function DetailsPreview({
  templateId,
  name,
  fieldValues,
  fieldConfig,
  accentColor,
  photoUrl1,
  photoUrl2,
}: {
  templateId: string;
  name: string;
  fieldValues: Record<string, string>;
  fieldConfig: TemplateFieldConfig;
  accentColor: string;
  photoUrl1?: string;
  photoUrl2?: string;
}) {
  const accent = getAccentClasses(accentColor);

  // Template-specific background for the preview card
  const getBg = () => {
    switch (templateId) {
      case "love-letter-mailbox": return "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 50%, #f5d6d6 100%)";
      case "stargazer": return "linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 50%, #0a0a2e 100%)";
      case "premiere": return "linear-gradient(180deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)";
      case "neon-arcade": return "linear-gradient(180deg, #0a0a1a 0%, #120825 50%, #0a0a1a 100%)";
      case "y2k-digital-crush": return "#008080";
      case "cozy-scrapbook": return "linear-gradient(180deg, #f5ebe0 0%, #eddcd2 50%, #e3d5ca 100%)";
      case "avocado-valentine": return "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)";
      case "forest-adventure": return "linear-gradient(180deg, #1a3c1a 0%, #2d5a2d 50%, #1a3c1a 100%)";
      case "elegant-invitation": return "linear-gradient(180deg, #fdfbf7 0%, #f8e8e4 50%, #fdfbf7 100%)";
      default: return "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 100%)";
    }
  };

  const isDark = ["stargazer", "premiere", "neon-arcade", "y2k-digital-crush", "forest-adventure"].includes(templateId);
  const textColor = isDark ? "text-white/90" : "text-gray-800";
  const subtextColor = isDark ? "text-white/50" : "text-gray-500";
  const cardBg = isDark ? "bg-white/10 border-white/10" : "bg-white/80 border-white/50";
  const iconColor = isDark ? "text-white/40" : "text-gray-400";

  // Get template emoji
  const getEmoji = () => {
    switch (templateId) {
      case "love-letter-mailbox": return "📬";
      case "stargazer": return "🌌";
      case "premiere": return "🎬";
      case "neon-arcade": return "🕹️";
      case "y2k-digital-crush": return "💾";
      case "cozy-scrapbook": return "📒";
      case "avocado-valentine": return "🥑";
      case "runaway-button": return "💕";
      case "forest-adventure": return "🌲";
      case "elegant-invitation": return "💐";
      default: return "💌";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-y-auto"
      style={{ background: getBg() }}
    >
      <div className="flex flex-col items-center gap-4 px-5 py-8">
        {/* Template icon or photo for cozy-scrapbook - show both photos if available */}
        {templateId === "cozy-scrapbook" && (photoUrl1 || photoUrl2) ? (
          <div className="flex gap-2 mb-1">
            {photoUrl1 && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: -3 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="bg-white p-1 pb-4 rounded shadow-lg"
              >
                <img
                  src={photoUrl1}
                  alt="Cover"
                  className="w-12 h-12 object-cover rounded-sm"
                />
              </motion.div>
            )}
            {photoUrl2 && (
              <motion.div
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="bg-white p-1 pb-4 rounded shadow-lg"
              >
                <img
                  src={photoUrl2}
                  alt="Inside"
                  className="w-12 h-12 object-cover rounded-sm"
                />
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-4xl mb-1"
          >
            {getEmoji()}
          </motion.div>
        )}

        {/* From name */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-xs ${subtextColor} tracking-widest uppercase`}
        >
          From {name || "Your Name"}
        </motion.p>

        {/* Main message */}
        {fieldValues.message && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`text-lg font-bold ${textColor} text-center px-4`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            &ldquo;{fieldValues.message}&rdquo;
          </motion.h3>
        )}

        {/* Detail cards */}
        {fieldConfig.fields
          .filter((f) => f.key !== "message" && fieldValues[f.key])
          .map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className={`w-full rounded-xl border backdrop-blur-sm p-3.5 ${cardBg}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${iconColor}`}>
                  <FieldIcon icon={field.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[10px] uppercase tracking-wider ${subtextColor} mb-0.5`}>
                    {field.label}
                  </p>
                  <p className={`text-sm font-medium ${textColor} ${
                    field.key === "personalMessage" ? "italic" : ""
                  }`}
                    style={field.key === "personalMessage" ? {
                      fontFamily: "'Playfair Display', Georgia, serif",
                      lineHeight: 1.6,
                    } : undefined}
                  >
                    {fieldValues[field.key]}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

        {/* Empty state when no fields filled */}
        {fieldConfig.fields.filter((f) => fieldValues[f.key]).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-8 ${subtextColor}`}
          >
            <p className="text-sm">Fill in the details on the left</p>
            <p className="text-xs mt-1 opacity-60">Your invite preview will update here</p>
          </motion.div>
        )}

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className={`text-[10px] ${subtextColor} text-center mt-2`}
        >
          Full interactive experience in the next step
        </motion.p>
      </div>
    </motion.div>
  );
}

// ============================================
// FULL PREVIEW (Final Step)
// ============================================

function FullPreview({
  previewUrl,
  onBack,
  onGenerate,
  accentGradient,
}: {
  previewUrl: string;
  onBack: () => void;
  onGenerate: () => void;
  accentGradient: string;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-black" style={{ top: 0 }}>
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Full invite preview"
        allow="autoplay"
      />

      {/* Floating toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-gray-200"
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="h-11 px-5 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to edit
        </Button>
        <Button
          onClick={onGenerate}
          className={`h-11 px-5 rounded-xl font-semibold ${accentGradient} text-white`}
        >
          <Heart className="w-4 h-4 mr-2" />
          Generate my link
        </Button>
      </motion.div>
    </div>
  );
}

// ============================================
// COZY SCRAPBOOK FULL PREVIEW (renders directly with photos)
// ============================================

function CozyScrapbookFullPreview({
  message,
  senderName,
  eventDate,
  eventTime,
  eventLocation,
  photoUrl1,
  photoUrl2,
  onBack,
  onGenerate,
  accentGradient,
}: {
  message: string;
  senderName: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  photoUrl1?: string;
  photoUrl2?: string;
  onBack: () => void;
  onGenerate: () => void;
  accentGradient: string;
}) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="fixed inset-0 z-40" style={{ top: 0 }}>
      {/* Show splash screen first */}
      {showSplash && (
        <SplashScreen
          creatorName={senderName}
          isPaid={true}
          onComplete={() => setShowSplash(false)}
          templateId="cozy-scrapbook"
          photoUrl1={photoUrl1}
        />
      )}

      {/* Render actual CozyScrapbook with photos after splash */}
      {!showSplash && (
        <CozyScrapbook
          message={message}
          senderName={senderName}
          eventDate={eventDate}
          eventTime={eventTime}
          eventLocation={eventLocation}
          photoUrl1={photoUrl1}
          photoUrl2={photoUrl2}
        />
      )}

      {/* Floating toolbar - only show after splash */}
      {!showSplash && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-gray-200"
        >
          <Button
            onClick={onBack}
            variant="outline"
            className="h-11 px-5 rounded-xl font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to edit
          </Button>
          <Button
            onClick={onGenerate}
            className={`h-11 px-5 rounded-xl font-semibold ${accentGradient} text-white`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Generate my link
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// ============================================
// OCEAN DREAMS FULL PREVIEW (renders directly with photos)
// ============================================

function ElegantInvitationFullPreview({
  senderName,
  message,
  personalMessage,
  date,
  time,
  location,
  photo1Url,
  photo2Url,
  photo3Url,
  onBack,
  onGenerate,
  accentGradient,
}: {
  senderName: string;
  message?: string;
  personalMessage?: string;
  date?: string;
  time?: string;
  location?: string;
  photo1Url?: string;
  photo2Url?: string;
  photo3Url?: string;
  onBack: () => void;
  onGenerate: () => void;
  accentGradient: string;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ top: 0 }}>
      {/* Render actual ElegantInvitation with photos */}
      <ElegantInvitation
        senderName={senderName}
        message={message}
        personalMessage={personalMessage}
        date={date}
        time={time}
        location={location}
        photo1Url={photo1Url}
        photo2Url={photo2Url}
        photo3Url={photo3Url}
      />

      {/* Floating toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-gray-200"
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="h-11 px-5 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to edit
        </Button>
        <Button
          onClick={onGenerate}
          className={`h-11 px-5 rounded-xl font-semibold ${accentGradient} text-white`}
        >
          <Heart className="w-4 h-4 mr-2" />
          Generate my link
        </Button>
      </motion.div>
    </div>
  );
}

// ============================================
// SPLASH PREVIEW
// ============================================

function SplashPreview({ name, templateId, photoUrl1 }: { name: string; templateId: string; photoUrl1?: string }) {
  // Love Letter Mailbox - Wax seal style
  if (templateId === "love-letter-mailbox") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#f5f0e8" }}
      >
        {/* Airmail stripes - top */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex-1 h-full" style={{ background: i % 2 === 0 ? "#c62828" : "#1565c0" }} />
          ))}
        </div>
        {/* Airmail stripes - bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="flex-1 h-full" style={{ background: i % 2 === 0 ? "#1565c0" : "#c62828" }} />
          ))}
        </div>

        {/* Wax seal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 12 }}
          className="mb-4"
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #ef5350 0%, #c62828 35%, #8b0000 70%, #5d0000 100%)",
              boxShadow: "0 4px 12px rgba(139,0,0,0.3)",
            }}
          >
            <Heart className="w-6 h-6 text-white/90 fill-white/90" />
          </div>
        </motion.div>

        <p className="text-xs text-[#6d4c41] tracking-wider uppercase mb-1">Sealed with love by</p>
        <h2 className="text-xl font-bold text-[#880e4f]" style={{ fontFamily: "'Dancing Script', cursive" }}>
          {name || "Your Name"}
        </h2>
      </motion.div>
    );
  }

  // Stargazer - Celestial style
  if (templateId === "stargazer") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#050514" }}
      >
        {/* Stars */}
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: 1 + (i % 2),
              height: 1 + (i % 2),
              background: i % 5 === 0 ? "#fbbf24" : "#e8e4ff",
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5 + (i % 2), delay: i * 0.1, repeat: Infinity }}
          />
        ))}

        {/* Pulsing star */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fbbf24",
            boxShadow: "0 0 20px #fbbf24, 0 0 40px rgba(124,58,237,0.5)",
          }}
        />

        <p className="text-[10px] text-[#e8e4ff]/60 tracking-widest uppercase mb-1">written in the stars by</p>
        <h2 className="text-lg font-semibold italic text-[#e8e4ff]" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 0 20px rgba(124,58,237,0.6)" }}>
          {name || "Your Name"}
        </h2>
      </motion.div>
    );
  }

  // Premiere - Cinematic style
  if (templateId === "premiere") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        {/* Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 70%)" }} />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-3xl mb-4"
        >
          🎬
        </motion.div>

        <p className="text-[10px] text-[#d4a017]/50 tracking-widest uppercase mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>a film by</p>
        <h2 className="text-lg font-semibold italic text-[#f5e6d0]" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 0 20px rgba(212,160,23,0.4)" }}>
          {name || "Your Name"}
        </h2>
      </motion.div>
    );
  }

  // Y2K - BIOS style
  if (templateId === "y2k-digital-crush") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#000080" }}
      >
        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)" }} />

        <div className="text-left px-4 w-full max-w-[200px]">
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "8px", color: "#c0c0c0", lineHeight: 1.6 }}>
            BIOS v2.14 — Heart Edition
          </p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "8px", color: "#c0c0c0", lineHeight: 1.6 }}>
            Loading crush.sys...
          </p>
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "8px", color: "#00ff00", lineHeight: 1.6 }}>
            STATUS: READY ♥
          </p>
        </div>

        <div className="mt-4 text-center">
          <p style={{ fontFamily: "'Courier New', monospace", fontSize: "7px", color: "#808080", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Programmed with love by
          </p>
          <h2 style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", fontWeight: 700, color: "#00ff00", textShadow: "0 0 10px rgba(0,255,0,0.4)" }}>
            {name || "Your Name"}
          </h2>
        </div>
      </motion.div>
    );
  }

  // Cozy Scrapbook - Craft paper style
  if (templateId === "cozy-scrapbook") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "#f5ebe0" }}
      >
        {/* Scattered decorations */}
        <motion.span className="absolute top-4 left-4 text-sm opacity-25" style={{ transform: "rotate(-30deg)" }}>🌿</motion.span>
        <motion.span className="absolute top-6 right-4 text-sm opacity-25" style={{ transform: "rotate(20deg)" }}>🍂</motion.span>
        <motion.span className="absolute bottom-8 left-6 text-xs opacity-25" style={{ transform: "rotate(15deg)" }}>🌸</motion.span>

        {/* Polaroid frame - always shown */}
        <motion.div
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: -3 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-3"
          style={{
            width: 70,
            padding: "4px 4px 16px 4px",
            background: "#fff",
            boxShadow: "0 3px 8px rgba(92,58,33,0.2)",
          }}
        >
          {photoUrl1 ? (
            <img src={photoUrl1} alt="Memory" className="w-full aspect-square object-cover" />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5ebe0 0%, #e8ddd0 100%)" }}>
              <span className="text-[8px] text-[#a08060]/60 italic">photo</span>
            </div>
          )}
        </motion.div>

        <motion.div
          animate={{ y: [0, -2, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-xl mb-2"
        >
          ✉️
        </motion.div>

        <p className="text-[10px] text-[#c27256]/60 mb-0.5" style={{ fontFamily: "'Dancing Script', cursive" }}>lovingly crafted by</p>
        <h2 className="text-lg font-bold text-[#5c3a21]" style={{ fontFamily: "'Dancing Script', cursive" }}>
          {name || "Your Name"}
        </h2>
      </motion.div>
    );
  }

  // Forest Adventure - Pixel RPG style
  if (templateId === "forest-adventure") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0c1445 0%, #1a237e 40%, #283593 70%, #3949ab 100%)" }}
      >
        {/* Pixel stars */}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 41 + 7) % 100}%`,
              top: `${(i * 31 + 3) % 50}%`,
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: i % 4 === 0 ? "#ffd54f" : "#fff",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
          />
        ))}

        {/* Forest silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-6" style={{ background: "#1a3d1a" }} />

        {/* RPG dialog box frame */}
        <div
          className="relative px-4 py-3 mx-3"
          style={{
            background: "linear-gradient(180deg, #8b5a2b 0%, #6b4423 50%, #5c3a1d 100%)",
            border: "3px solid #3d2314",
            boxShadow: "inset 0 0 0 1px #a0522d, 2px 2px 0 #1a0f0a",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #1a237e 0%, #0d1445 100%)",
              border: "2px solid #3949ab",
              padding: "10px 12px",
            }}
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xl mb-2 text-center"
            >
              💌
            </motion.div>
            <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "#90caf9", textAlign: "center", marginBottom: 4 }}>
              A QUEST FROM
            </p>
            <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px", color: "#ffd54f", textAlign: "center", textShadow: "1px 1px 0 #5d4037" }}>
              {name || "Your Name"}
            </h2>
          </div>
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)", opacity: 0.3 }} />
      </motion.div>
    );
  }

  // Elegant Invitation - Envelope with wax seal style
  if (templateId === "elegant-invitation") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #f5ebe0 0%, #e8d5c4 100%)" }}
      >
        {/* Envelope */}
        <motion.div
          initial={{ scale: 0.8, rotateX: 20 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="relative mb-3"
          style={{
            width: 120,
            height: 80,
            background: "linear-gradient(180deg, #fdfbf7 0%, #f8f4f0 100%)",
            borderRadius: 4,
            boxShadow: "0 8px 20px rgba(139, 90, 90, 0.15)",
            border: "1px solid rgba(183, 110, 121, 0.1)",
          }}
        >
          {/* Envelope flap */}
          <div
            className="absolute -top-0.5 left-0 right-0"
            style={{
              height: "40%",
              background: "linear-gradient(180deg, #f8e8e4 0%, #fdfbf7 100%)",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
            }}
          />

          {/* Wax seal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: "15%" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 30%, #c9787e 0%, #b76e79 50%, #9a5a63 100%)",
                boxShadow: "0 2px 6px rgba(183, 110, 121, 0.3)",
              }}
            >
              <Heart className="w-4 h-4 text-white/90 fill-white/90" />
            </div>
          </motion.div>
        </motion.div>

        <p className="text-[9px] text-[#9a8a8a] tracking-wider uppercase mb-0.5">sealed with love by</p>
        <h2 className="text-lg italic text-[#b76e79]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {name || "Your Name"}
        </h2>
      </motion.div>
    );
  }

  // Default fallback for other templates
  const getBg = () => {
    switch (templateId) {
      case "neon-arcade": return "bg-[#0a0a1a]";
      case "avocado-valentine": return "bg-white";
      default: return "bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100";
    }
  };

  const getNameColor = () => {
    switch (templateId) {
      case "neon-arcade": return "from-cyan-400 to-magenta-400";
      case "avocado-valentine": return "from-green-500 to-emerald-500";
      default: return "from-pink-500 to-purple-500";
    }
  };

  const isDark = templateId === "neon-arcade";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 flex items-center justify-center ${getBg()}`}
    >
      <div className="text-center px-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4"
        >
          <Heart className={`w-12 h-12 mx-auto ${isDark ? "text-white/80 fill-white/80" : "text-pink-500 fill-pink-500"}`} />
        </motion.div>

        <p className={`mb-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>Wholeheartedly made by</p>
        <h2 className={`text-2xl font-bold bg-gradient-to-r ${getNameColor()} bg-clip-text text-transparent`}>
          {name || "Your Name"}
        </h2>
      </div>
    </motion.div>
  );
}

// ============================================
// MINI SPLASH PREVIEW (for mobile floating bar)
// ============================================

function MiniSplashPreview({ name, templateId, photoUrl1 }: { name: string; templateId: string; photoUrl1?: string }) {
  // Love Letter - Mini wax seal
  if (templateId === "love-letter-mailbox") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#f5f0e8" }}>
        <div className="w-5 h-5 rounded-full flex items-center justify-center mb-0.5"
          style={{ background: "radial-gradient(circle at 35% 30%, #ef5350 0%, #c62828 50%, #8b0000 100%)" }}>
          <Heart className="w-2.5 h-2.5 text-white/90 fill-white/90" />
        </div>
        <p className="text-[4px] text-[#6d4c41] uppercase tracking-wide">Sealed with love</p>
        <p className="text-[5px] text-[#880e4f] font-medium truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Stargazer - Mini star
  if (templateId === "stargazer") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#050514" }}>
        <div className="w-2.5 h-2.5 rounded-full mb-0.5" style={{ background: "#fbbf24", boxShadow: "0 0 6px #fbbf24" }} />
        <p className="text-[4px] text-[#e8e4ff]/50 uppercase tracking-wide">In the stars</p>
        <p className="text-[5px] text-[#e8e4ff]/80 italic truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Premiere - Mini clapperboard
  if (templateId === "premiere") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#0a0a0a" }}>
        <span className="text-xs mb-0.5">🎬</span>
        <p className="text-[4px] text-[#d4a017]/50 uppercase tracking-wide">A film by</p>
        <p className="text-[5px] text-[#f5e6d0] italic truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Y2K - Mini BIOS
  if (templateId === "y2k-digital-crush") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#000080" }}>
        <p className="text-[4px] text-[#c0c0c0] mb-0.5">STATUS: READY ♥</p>
        <p className="text-[4px] text-[#808080] uppercase">With love by</p>
        <p className="text-[5px] text-[#00ff00] truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Cozy Scrapbook - Mini envelope style (matching actual splash)
  if (templateId === "cozy-scrapbook") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "#f5ebe0" }}>
        <span className="text-sm mb-0.5">✉️</span>
        <p className="text-[4px] text-[#c27256]/60">Lovingly crafted by</p>
        <p className="text-[5px] text-[#5c3a21] truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Forest Adventure - Mini RPG
  if (templateId === "forest-adventure") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #0c1445 0%, #283593 100%)" }}>
        <div className="px-1 py-0.5 mb-0.5" style={{ background: "#1a237e", border: "1px solid #3949ab" }}>
          <span className="text-[8px]">💌</span>
        </div>
        <p className="text-[4px] text-[#90caf9]" style={{ fontFamily: "monospace" }}>A QUEST FROM</p>
        <p className="text-[5px] text-[#ffd54f] truncate max-w-[50px]" style={{ fontFamily: "monospace" }}>{name || "Name"}</p>
      </div>
    );
  }

  // Elegant Invitation - Mini envelope
  if (templateId === "elegant-invitation") {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(180deg, #f5ebe0 0%, #e8d5c4 100%)" }}>
        <div className="relative w-7 h-4 mb-0.5" style={{ background: "#fdfbf7", borderRadius: 2, boxShadow: "0 1px 3px rgba(139, 90, 90, 0.1)" }}>
          <div className="absolute -top-0 left-0 right-0" style={{ height: "40%", background: "#f8e8e4", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
          <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ top: "15%", background: "#b76e79" }} />
        </div>
        <p className="text-[4px] text-[#9a8a8a] uppercase tracking-wide">Sealed with love</p>
        <p className="text-[5px] text-[#b76e79] italic truncate max-w-[50px]">{name || "Name"}</p>
      </div>
    );
  }

  // Default fallback
  const getBg = () => {
    switch (templateId) {
      case "neon-arcade": return "bg-[#0a0a1a]";
      case "avocado-valentine": return "bg-white";
      default: return "bg-gradient-to-br from-rose-100 to-pink-100";
    }
  };

  const isDark = templateId === "neon-arcade";

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${getBg()}`}>
      <div className="text-center">
        <Heart className={`w-3 h-3 mx-auto mb-0.5 ${isDark ? "text-white/80 fill-white/80" : "text-pink-500 fill-pink-500"}`} />
        <p className={`text-[4px] mb-0 ${isDark ? "text-white/50" : "text-gray-500"}`}>Made with love</p>
        <p className={`text-[6px] truncate max-w-[50px] ${isDark ? "text-white/70" : "text-gray-700"}`}>
          {name || "Name"}
        </p>
      </div>
    </div>
  );
}

// ============================================
// MINI DETAILS PREVIEW (for mobile floating bar)
// ============================================

function MiniDetailsPreview({
  templateId,
  name,
  fieldValues,
  photoUrl1,
  photoUrl2,
}: {
  templateId: string;
  name: string;
  fieldValues: Record<string, string>;
  photoUrl1?: string;
  photoUrl2?: string;
}) {
  const getBg = () => {
    switch (templateId) {
      case "love-letter-mailbox": return "bg-gradient-to-br from-pink-100 to-rose-200";
      case "stargazer": return "bg-gradient-to-br from-[#0a0a2e] to-[#1a1a4e]";
      case "premiere": return "bg-gradient-to-br from-[#0a0a0a] to-[#1a0a0a]";
      case "neon-arcade": return "bg-[#0a0a1a]";
      case "y2k-digital-crush": return "bg-[#008080]";
      case "cozy-scrapbook": return "bg-[#f5ebe0]";
      case "avocado-valentine": return "bg-green-50";
      case "forest-adventure": return "bg-gradient-to-br from-[#1a3c1a] to-[#2d5a2d]";
      case "elegant-invitation": return "bg-[#fdfbf7]";
      default: return "bg-gradient-to-br from-pink-100 to-rose-100";
    }
  };

  const isDark = ["stargazer", "premiere", "neon-arcade", "y2k-digital-crush", "forest-adventure"].includes(templateId);
  const isElegantInvitation = templateId === "elegant-invitation";

  return (
    <div className={`absolute inset-0 flex flex-col items-center justify-center p-1 ${getBg()}`}>
      {fieldValues.message && (
        <p className={`text-[5px] text-center leading-tight line-clamp-2 ${isDark ? "text-white/80" : isElegantInvitation ? "text-[#b76e79]" : "text-gray-700"}`}>
          {fieldValues.message}
        </p>
      )}
      {fieldValues.date && (
        <p className={`text-[5px] mt-0.5 ${isDark ? "text-white/60" : "text-gray-500"}`}>
          📅 {fieldValues.date}
        </p>
      )}
    </div>
  );
}

// ============================================
// CONFIRMATION MODAL
// ============================================

function ConfirmModal({
  name,
  onConfirm,
  onCancel,
  isLoading = false,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={isLoading ? undefined : onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isLoading ? "Creating your invite..." : "Ready to generate?"}
          </h3>
          <p className="text-gray-600">
            {isLoading
              ? "Please wait while we set up your invite link."
              : <>Your invite will be created for <strong>{name}</strong>. You can&apos;t change this once submitted.</>
            }
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            disabled={isLoading}
          >
            Go back
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Heart className="w-5 h-5" />
              </motion.div>
            ) : (
              "Generate link"
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN EXPORT WITH SUSPENSE
// ============================================

export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-12 h-12 text-pink-500" />
          </motion.div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CustomizePageContent />
    </Suspense>
  );
}

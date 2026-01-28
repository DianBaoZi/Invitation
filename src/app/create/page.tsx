"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Heart, Cake, CalendarHeart, PartyPopper, Wand2, ArrowRight } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Invitation types
const invitationTypes = [
  {
    id: "valentine",
    name: "Valentine",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    description: "Romantic love letters & proposals",
    emoji: "💕",
  },
  {
    id: "birthday",
    name: "Birthday",
    icon: Cake,
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    description: "Fun party invites",
    emoji: "🎂",
  },
  {
    id: "wedding",
    name: "Wedding",
    icon: CalendarHeart,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Elegant celebrations",
    emoji: "💒",
  },
  {
    id: "party",
    name: "Party",
    icon: PartyPopper,
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Epic get-togethers",
    emoji: "🎉",
  },
  {
    id: "custom",
    name: "Custom",
    icon: Sparkles,
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Any occasion you want",
    emoji: "✨",
  },
];

// Dynamic import for playful editor (new)
const PlayfulEditor = dynamic(
  () => import("@/components/playful-editor").then((mod) => mod.PlayfulEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-sm text-gray-600">Loading magic...</p>
        </div>
      </div>
    ),
  }
);

// Dynamic import for fabric editor (legacy)
const FabricEditor = dynamic(
  () => import("@/components/editor/FabricEditor").then((mod) => mod.FabricEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Wand2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-sm text-gray-600">Loading editor...</p>
        </div>
      </div>
    ),
  }
);

// Type selection component
function TypeSelection({ onSelect }: { onSelect: (type: string) => void }) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/10 to-pink-100/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-purple-100 mb-6"
          >
            <Wand2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Create Your Invite</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4"
          >
            What are you{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              celebrating?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-slate-500 max-w-md mx-auto"
          >
            Choose an invitation type to get started with the perfect template
          </motion.p>
        </div>

        {/* Type Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {invitationTypes.map((type, index) => {
            const Icon = type.icon;
            const isHovered = hoveredType === type.id;

            return (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                onClick={() => onSelect(type.id)}
                onMouseEnter={() => setHoveredType(type.id)}
                onMouseLeave={() => setHoveredType(null)}
                className={`relative group p-6 rounded-2xl border-2 bg-white/80 backdrop-blur-sm transition-all duration-300 ${
                  isHovered
                    ? `${type.borderColor} shadow-xl scale-105`
                    : "border-slate-200 hover:border-slate-300 shadow-lg"
                }`}
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="font-bold text-slate-800 text-lg mb-1">{type.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>

                {/* Emoji decoration */}
                <motion.span
                  className="absolute -top-2 -right-2 text-2xl"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: isHovered ? 1 : 0, rotate: isHovered ? 0 : -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {type.emoji}
                </motion.span>

                {/* Arrow indicator */}
                <motion.div
                  className={`absolute bottom-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-3 h-3 text-white" />
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Skip option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => onSelect("custom")}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-4"
          >
            Skip and start with a blank canvas
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Inner component that uses useSearchParams
function CreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");
  const editorMode = searchParams.get("editor"); // "legacy" for old fabric editor

  const [selectedType, setSelectedType] = useState<string | null>(typeFromUrl);
  const [showEditor, setShowEditor] = useState(!!typeFromUrl);

  useEffect(() => {
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
      setShowEditor(true);
    }
  }, [typeFromUrl]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    // Update URL without navigation
    window.history.replaceState(null, "", `/create?type=${type}`);
    setShowEditor(true);
  };

  const handlePreview = () => {
    router.push("/preview");
  };

  const handleSave = (json: string) => {
    localStorage.setItem("invitation-design", json);
    alert("Design saved!");
  };

  // Handle save from new playful editor
  const handlePlayfulSave = (data: unknown) => {
    localStorage.setItem("invitation-design-v2", JSON.stringify(data));
    console.log("Saved playful invite:", data);
  };

  // Determine which editor to use
  const useLegacyEditor = editorMode === "legacy";

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!showEditor ? (
          <motion.div
            key="type-selection"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <TypeSelection onSelect={handleTypeSelect} />
          </motion.div>
        ) : useLegacyEditor ? (
          <motion.div
            key="legacy-editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <FabricEditor
              onPreview={handlePreview}
              onSave={handleSave}
            />
          </motion.div>
        ) : (
          <motion.div
            key="playful-editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <PlayfulEditor onSave={handlePlayfulSave} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main component with Suspense boundary
export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Wand2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreatePageInner />
    </Suspense>
  );
}

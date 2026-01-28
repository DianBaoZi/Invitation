"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas, FabricObject, Textbox, Rect, Circle, Group, Line } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Eye, Save, Download, Trash2, Sparkles, Type, Palette, ChevronDown, Heart } from "lucide-react";
import { InteractionsSidebar, StickerType, ShapeType, TemplateType } from "./fabric/InteractionsSidebar";

// Modern theme colors - Purple/Indigo
export const THEME_COLORS = {
  primary: "#7C3AED",       // Purple
  primaryLight: "#A78BFA",  // Light purple
  primaryDark: "#5B21B6",   // Dark purple
  secondary: "#6366F1",     // Indigo
  secondaryLight: "#818CF8",
  background: "#FFFFFF",    // White canvas
  cream: "#FAFAFA",
  accent: "#F59E0B",        // Amber accent
  accentLight: "#FCD34D",
  gold: "#D4AF37",          // Gold for scratch reveal
  text: "#1E1B4B",          // Dark indigo
  textMuted: "#6B7280",
  white: "#FFFFFF",
};

// Keep VALENTINE_COLORS for backward compatibility with preview
export const VALENTINE_COLORS = THEME_COLORS;

// ============================================
// FONT LIBRARY
// ============================================
interface FontOption {
  name: string;
  family: string;
  category: "script" | "serif" | "sans" | "display";
  preview: string;
}

const FONT_LIBRARY: FontOption[] = [
  // Script / Calligraphy
  { name: "Great Vibes", family: "'Great Vibes', cursive", category: "script", preview: "Romantic" },
  { name: "Dancing Script", family: "'Dancing Script', cursive", category: "script", preview: "Elegant" },
  { name: "Parisienne", family: "'Parisienne', cursive", category: "script", preview: "Parisian" },
  { name: "Alex Brush", family: "'Alex Brush', cursive", category: "script", preview: "Flowing" },
  { name: "Allura", family: "'Allura', cursive", category: "script", preview: "Graceful" },
  { name: "Sacramento", family: "'Sacramento', cursive", category: "script", preview: "Classic" },

  // Serif / Elegant
  { name: "Playfair Display", family: "'Playfair Display', serif", category: "serif", preview: "Timeless" },
  { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", category: "serif", preview: "Refined" },
  { name: "Libre Baskerville", family: "'Libre Baskerville', serif", category: "serif", preview: "Editorial" },
  { name: "Crimson Text", family: "'Crimson Text', serif", category: "serif", preview: "Literary" },
  { name: "EB Garamond", family: "'EB Garamond', serif", category: "serif", preview: "Heritage" },
  { name: "Cinzel", family: "'Cinzel', serif", category: "serif", preview: "Majestic" },

  // Sans Serif / Modern
  { name: "Lato", family: "'Lato', sans-serif", category: "sans", preview: "Clean" },
  { name: "Montserrat", family: "'Montserrat', sans-serif", category: "sans", preview: "Modern" },
  { name: "Raleway", family: "'Raleway', sans-serif", category: "sans", preview: "Stylish" },
  { name: "Josefin Sans", family: "'Josefin Sans', sans-serif", category: "sans", preview: "Geometric" },
  { name: "Quicksand", family: "'Quicksand', sans-serif", category: "sans", preview: "Friendly" },

  // Display / Decorative
  { name: "Pinyon Script", family: "'Pinyon Script', cursive", category: "display", preview: "Royal" },
  { name: "Satisfy", family: "'Satisfy', cursive", category: "display", preview: "Playful" },
  { name: "Lobster", family: "'Lobster', cursive", category: "display", preview: "Bold" },
];

// ============================================
// COLOR PALETTE
// ============================================
interface ColorOption {
  name: string;
  value: string;
  category: "romantic" | "neutral" | "accent";
}

const COLOR_PALETTE: ColorOption[] = [
  // Romantic
  { name: "Rose", value: "#E11D48", category: "romantic" },
  { name: "Blush", value: "#FB7185", category: "romantic" },
  { name: "Coral", value: "#FF6B6B", category: "romantic" },
  { name: "Fuchsia", value: "#D946EF", category: "romantic" },
  { name: "Wine", value: "#881337", category: "romantic" },
  { name: "Berry", value: "#BE185D", category: "romantic" },

  // Neutral
  { name: "Charcoal", value: "#1F2937", category: "neutral" },
  { name: "Slate", value: "#475569", category: "neutral" },
  { name: "Gray", value: "#6B7280", category: "neutral" },
  { name: "Warm Gray", value: "#78716C", category: "neutral" },
  { name: "Cream Text", value: "#A8A29E", category: "neutral" },
  { name: "White", value: "#FFFFFF", category: "neutral" },

  // Accent
  { name: "Gold", value: "#D4AF37", category: "accent" },
  { name: "Champagne", value: "#C9A962", category: "accent" },
  { name: "Bronze", value: "#CD7F32", category: "accent" },
  { name: "Burgundy", value: "#722F37", category: "accent" },
  { name: "Forest", value: "#228B22", category: "accent" },
  { name: "Navy", value: "#1E3A5F", category: "accent" },
];

// ============================================
// TEXT PROPERTIES PANEL
// ============================================
interface TextPropertiesPanelProps {
  selectedObject: FabricObject | null;
  canvas: Canvas | null;
  onUpdate: () => void;
}

function TextPropertiesPanel({ selectedObject, canvas, onUpdate }: TextPropertiesPanelProps) {
  const [selectedFont, setSelectedFont] = useState<string>("'Playfair Display', serif");
  const [selectedColor, setSelectedColor] = useState<string>("#1F2937");
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontCategory, setFontCategory] = useState<"all" | "script" | "serif" | "sans" | "display">("all");
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sync state when selection changes
  useEffect(() => {
    if (selectedObject && selectedObject.type === "textbox") {
      const textbox = selectedObject as Textbox;
      setSelectedFont(textbox.fontFamily || "'Playfair Display', serif");
      setSelectedColor((textbox.fill as string) || "#1F2937");
      setFontSize(textbox.fontSize || 24);
    }
  }, [selectedObject]);

  const isTextSelected = selectedObject?.type === "textbox";

  const updateFont = (fontFamily: string) => {
    if (!canvas || !selectedObject || selectedObject.type !== "textbox") return;
    const textbox = selectedObject as Textbox;
    textbox.set("fontFamily", fontFamily);
    setSelectedFont(fontFamily);
    canvas.renderAll();
    onUpdate();
    setShowFontPicker(false);
  };

  const updateColor = (color: string) => {
    if (!canvas || !selectedObject || selectedObject.type !== "textbox") return;
    const textbox = selectedObject as Textbox;
    textbox.set("fill", color);
    setSelectedColor(color);
    canvas.renderAll();
    onUpdate();
  };

  const updateFontSize = (size: number) => {
    if (!canvas || !selectedObject || selectedObject.type !== "textbox") return;
    const textbox = selectedObject as Textbox;
    textbox.set("fontSize", size);
    setFontSize(size);
    canvas.renderAll();
    onUpdate();
  };

  const filteredFonts = fontCategory === "all"
    ? FONT_LIBRARY
    : FONT_LIBRARY.filter(f => f.category === fontCategory);

  const currentFontName = FONT_LIBRARY.find(f => f.family === selectedFont)?.name || "Custom";

  if (!isTextSelected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute right-4 top-24 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-900/10 border border-purple-100 overflow-hidden z-20"
    >
      {/* Header with close button */}
      <div className="px-4 py-3 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-500" />
            <span className="font-medium text-gray-800 text-sm">Text Properties</span>
          </div>
          <button
            onClick={() => {
              setShowFontPicker(false);
              setShowColorPicker(false);
              canvas?.discardActiveObject();
              canvas?.renderAll();
            }}
            className="p-1 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Font Picker */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Family</label>
          <div className="relative">
            <button
              onClick={() => setShowFontPicker(!showFontPicker)}
              className="w-full px-3 py-2.5 bg-white border border-purple-100 rounded-xl text-left flex items-center justify-between hover:border-purple-300 transition-colors"
            >
              <span style={{ fontFamily: selectedFont }} className="text-gray-800 truncate">
                {currentFontName}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFontPicker ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showFontPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden z-30"
                >
                  {/* Category tabs */}
                  <div className="flex border-b border-purple-50 p-1 gap-1 bg-purple-50/50">
                    {(["all", "script", "serif", "sans", "display"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFontCategory(cat)}
                        className={`flex-1 px-2 py-1.5 text-xs rounded-lg capitalize transition-all ${
                          fontCategory === cat
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Font list */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredFonts.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => updateFont(font.family)}
                        className={`w-full px-3 py-2.5 text-left hover:bg-purple-50 flex items-center justify-between transition-colors ${
                          selectedFont === font.family ? "bg-purple-50" : ""
                        }`}
                      >
                        <span style={{ fontFamily: font.family }} className="text-gray-800">
                          {font.name}
                        </span>
                        <span className="text-xs text-gray-400">{font.preview}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Font Size</label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="12"
              max="72"
              value={fontSize}
              onChange={(e) => updateFontSize(Number(e.target.value))}
              className="flex-1 h-2 bg-purple-100 rounded-full appearance-none cursor-pointer accent-purple-500"
            />
            <span className="w-12 text-center text-sm font-medium text-gray-700 bg-purple-50 px-2 py-1 rounded-lg">
              {fontSize}
            </span>
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color</label>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 text-xs text-purple-500 hover:text-purple-600"
            >
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
              />
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {/* Romantic Colors */}
                <div className="mb-3">
                  <span className="text-xs text-gray-400 mb-1.5 block">Romantic</span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLOR_PALETTE.filter(c => c.category === "romantic").map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateColor(color.value)}
                        title={color.name}
                        className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${
                          selectedColor === color.value ? "ring-2 ring-purple-400 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Neutral Colors */}
                <div className="mb-3">
                  <span className="text-xs text-gray-400 mb-1.5 block">Neutral</span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLOR_PALETTE.filter(c => c.category === "neutral").map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateColor(color.value)}
                        title={color.name}
                        className={`w-8 h-8 rounded-lg transition-all hover:scale-110 border ${
                          color.value === "#FFFFFF" ? "border-gray-200" : "border-transparent"
                        } ${selectedColor === color.value ? "ring-2 ring-purple-400 ring-offset-2" : ""}`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">Accent</span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLOR_PALETTE.filter(c => c.category === "accent").map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateColor(color.value)}
                        title={color.name}
                        className={`w-8 h-8 rounded-lg transition-all hover:scale-110 ${
                          selectedColor === color.value ? "ring-2 ring-purple-400 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom color input */}
                <div className="mt-3 pt-3 border-t border-purple-100">
                  <label className="text-xs text-gray-400 mb-1.5 block">Custom Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => updateColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => updateColor(e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border border-purple-100 rounded-lg font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick color preview row when picker is closed */}
          {!showColorPicker && (
            <div className="flex gap-1.5">
              {COLOR_PALETTE.slice(0, 8).map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateColor(color.value)}
                  title={color.name}
                  className={`w-7 h-7 rounded-lg transition-all hover:scale-110 ${
                    selectedColor === color.value ? "ring-2 ring-purple-400 ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Sticker animation definitions
const STICKER_DATA: Record<StickerType, { emoji: string; animation: object }> = {
  "floating-heart": { emoji: "💗", animation: { y: [-8, 8], rotate: [-10, 10] } },
  "bouncing-love": { emoji: "💕", animation: { y: [-12, 0], scale: [1, 1.2, 1] } },
  "spinning-star": { emoji: "⭐", animation: { rotate: [0, 360] } },
  "wiggle-letter": { emoji: "💌", animation: { rotate: [-15, 15], x: [-5, 5] } },
  "pulse-kiss": { emoji: "💋", animation: { scale: [1, 1.3, 1] } },
  "dancing-flower": { emoji: "🌹", animation: { rotate: [-20, 20], y: [-5, 5] } },
  "waving-bear": { emoji: "🧸", animation: { rotate: [-12, 12] } },
  "flying-cupid": { emoji: "💘", animation: { y: [-10, 10], x: [-8, 8], rotate: [-8, 8] } },
  "sparkle-ring": { emoji: "💍", animation: { scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] } },
  "beating-heart": { emoji: "❤️", animation: { scale: [1, 1.4, 1, 1.4, 1] } },
  "twinkle-stars": { emoji: "✨", animation: { opacity: [1, 0.4, 1], scale: [1, 0.8, 1] } },
  "love-explosion": { emoji: "💥", animation: { scale: [0.8, 1.3, 0.8], rotate: [0, 15, -15, 0] } },
};

// Custom data interface for interaction elements
export interface InteractionData {
  interactionType?: "yes-no-runaway" | "yes-no-shrinking" | "scratch-reveal" | "spin-wheel";
  interactionId?: string;
  role?: "question" | "yes-button" | "no-button" | "reveal-area" | "wheel" | "sticker";
  wheelOptions?: string[];
  revealContent?: string;
  stickerType?: StickerType;
  stickerAnimation?: object;
}

declare module "fabric" {
  interface FabricObject {
    data?: InteractionData;
  }
}

interface FabricEditorProps {
  onPreview?: () => void;
  onSave?: (json: string) => void;
}

// Floating sparkles background component
function FloatingSparkles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-200/30"
          initial={{
            x: `${Math.random() * 100}%`,
            y: "110%",
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            y: "-10%",
            rotate: Math.random() * 360 + 180,
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear",
          }}
        >
          <Sparkles className="w-6 h-6" />
        </motion.div>
      ))}
    </div>
  );
}

// Canvas size configurations for different screen sizes
const CANVAS_SIZES = {
  mobile: { width: 360, height: 480 },
  tablet: { width: 500, height: 400 },
  desktop: { width: 750, height: 500 },
};

function getCanvasSize() {
  if (typeof window === 'undefined') return CANVAS_SIZES.desktop;
  const width = window.innerWidth;
  if (width >= 1280) return CANVAS_SIZES.desktop;
  if (width >= 768) return CANVAS_SIZES.tablet;
  return CANVAS_SIZES.mobile;
}

export function FabricEditor({ onPreview, onSave }: FabricEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Detect client-side and set initial canvas size
  useEffect(() => {
    setIsClient(true);
    setCanvasSize(getCanvasSize());
  }, []);

  // Load Google Fonts
  useEffect(() => {
    const fontFamilies = FONT_LIBRARY.map(f => f.name.replace(/ /g, "+")).join("&family=");
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Listen for window resize
  useEffect(() => {
    if (!isClient) return;
    const updateSize = () => setCanvasSize(getCanvasSize());
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isClient]);

  // Initialize canvas and load saved design
  useEffect(() => {
    if (!canvasRef.current || !canvasSize) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#FFFFFF",
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvas.on("selection:created", (e) => setSelectedObject(e.selected?.[0] || null));
    fabricCanvas.on("selection:updated", (e) => setSelectedObject(e.selected?.[0] || null));
    fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

    // Load saved design from localStorage
    const savedDesign = localStorage.getItem("invitation-design");
    if (savedDesign) {
      try {
        const designJSON = JSON.parse(savedDesign);
        fabricCanvas.loadFromJSON(designJSON).then(() => {
          // Restore custom data properties after loading
          const objects = fabricCanvas.getObjects();
          if (designJSON.objects) {
            designJSON.objects.forEach((objData: { data?: InteractionData }, index: number) => {
              if (objData.data && objects[index]) {
                objects[index].data = objData.data;
              }
            });
          }
          fabricCanvas.renderAll();
        });
      } catch (e) {
        console.error("Failed to load saved design:", e);
      }
    }

    setCanvas(fabricCanvas);
    return () => {
      fabricCanvas.dispose();
    };
  }, [canvasSize]);

  const generateInteractionId = useCallback(() => {
    return `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add Yes/No Runaway interaction set
  const addYesNoRunaway = useCallback(() => {
    if (!canvas) return;
    const interactionId = generateInteractionId();
    const centerX = canvas.width! / 2;

    const question = new Textbox("Will you be my Valentine?", {
      left: centerX, top: 200, width: 280,
      fontSize: 28, fontFamily: "'Great Vibes', cursive",
      fill: VALENTINE_COLORS.text, textAlign: "center",
      originX: "center", originY: "center",
    });
    question.data = { interactionType: "yes-no-runaway", interactionId, role: "question" };

    const yesRect = new Rect({
      width: 100, height: 44, fill: VALENTINE_COLORS.primary,
      rx: 22, ry: 22, originX: "center", originY: "center",
    });
    const yesText = new Textbox("Yes! 💕", {
      width: 100, fontSize: 16, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });
    const yesButton = new Group([yesRect, yesText], {
      left: centerX - 70, top: 300, originX: "center", originY: "center",
    });
    yesButton.data = { interactionType: "yes-no-runaway", interactionId, role: "yes-button" };

    const noRect = new Rect({
      width: 100, height: 44, fill: VALENTINE_COLORS.textMuted,
      rx: 22, ry: 22, originX: "center", originY: "center",
    });
    const noText = new Textbox("No", {
      width: 100, fontSize: 16, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });
    const noButton = new Group([noRect, noText], {
      left: centerX + 70, top: 300, originX: "center", originY: "center",
    });
    noButton.data = { interactionType: "yes-no-runaway", interactionId, role: "no-button" };

    canvas.add(question, yesButton, noButton);
    canvas.renderAll();
  }, [canvas, generateInteractionId]);

  // Add Yes/No Shrinking interaction set
  const addYesNoShrinking = useCallback(() => {
    if (!canvas) return;
    const interactionId = generateInteractionId();
    const centerX = canvas.width! / 2;

    const question = new Textbox("Will you be my Valentine?", {
      left: centerX, top: 200, width: 280,
      fontSize: 28, fontFamily: "'Great Vibes', cursive",
      fill: VALENTINE_COLORS.text, textAlign: "center",
      originX: "center", originY: "center",
    });
    question.data = { interactionType: "yes-no-shrinking", interactionId, role: "question" };

    const yesRect = new Rect({
      width: 100, height: 44, fill: VALENTINE_COLORS.primary,
      rx: 22, ry: 22, originX: "center", originY: "center",
    });
    const yesText = new Textbox("Yes! 💕", {
      width: 100, fontSize: 16, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });
    const yesButton = new Group([yesRect, yesText], {
      left: centerX - 70, top: 300, originX: "center", originY: "center",
    });
    yesButton.data = { interactionType: "yes-no-shrinking", interactionId, role: "yes-button" };

    const noRect = new Rect({
      width: 100, height: 44, fill: VALENTINE_COLORS.textMuted,
      rx: 22, ry: 22, originX: "center", originY: "center",
    });
    const noText = new Textbox("No", {
      width: 100, fontSize: 16, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });
    const noButton = new Group([noRect, noText], {
      left: centerX + 70, top: 300, originX: "center", originY: "center",
    });
    noButton.data = { interactionType: "yes-no-shrinking", interactionId, role: "no-button" };

    canvas.add(question, yesButton, noButton);
    canvas.renderAll();
  }, [canvas, generateInteractionId]);

  // Add Scratch Reveal interaction
  const addScratchReveal = useCallback(() => {
    if (!canvas) return;
    const interactionId = generateInteractionId();
    const centerX = canvas.width! / 2;

    const instruction = new Textbox("Scratch to reveal! ✨", {
      left: centerX, top: 200, width: 280,
      fontSize: 24, fontFamily: "'Playfair Display', serif",
      fill: VALENTINE_COLORS.text, textAlign: "center",
      originX: "center", originY: "center",
    });
    instruction.data = { interactionType: "scratch-reveal", interactionId, role: "question" };

    const scratchArea = new Rect({
      left: centerX, top: 320, width: 200, height: 100,
      fill: VALENTINE_COLORS.primary, rx: 12, ry: 12,
      originX: "center", originY: "center",
    });
    scratchArea.data = {
      interactionType: "scratch-reveal", interactionId, role: "reveal-area",
      revealContent: "I Love You! 💝"
    };

    const hintText = new Textbox("🎁 Tap Here 🎁", {
      left: centerX, top: 320, width: 200,
      fontSize: 16, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });

    canvas.add(instruction, scratchArea, hintText);
    canvas.renderAll();
  }, [canvas, generateInteractionId]);

  // Add Spin Wheel interaction
  const addSpinWheel = useCallback(() => {
    if (!canvas) return;
    const interactionId = generateInteractionId();
    const centerX = canvas.width! / 2;

    const title = new Textbox("Spin for our date! 🎡", {
      left: centerX, top: 150, width: 280,
      fontSize: 24, fontFamily: "'Great Vibes', cursive",
      fill: VALENTINE_COLORS.text, textAlign: "center",
      originX: "center", originY: "center",
    });
    title.data = { interactionType: "spin-wheel", interactionId, role: "question" };

    const wheel = new Circle({
      left: centerX, top: 300, radius: 80,
      fill: VALENTINE_COLORS.background,
      stroke: VALENTINE_COLORS.primary, strokeWidth: 4,
      originX: "center", originY: "center",
    });
    wheel.data = {
      interactionType: "spin-wheel", interactionId, role: "wheel",
      wheelOptions: ["Dinner 🍝", "Movie 🎬", "Picnic 🧺", "Dancing 💃", "Stargazing ⭐"]
    };

    const wheelEmoji = new Textbox("🎰", {
      left: centerX, top: 300, width: 100,
      fontSize: 48, textAlign: "center",
      originX: "center", originY: "center",
    });

    const spinRect = new Rect({
      width: 100, height: 40, fill: VALENTINE_COLORS.primary,
      rx: 20, ry: 20, originX: "center", originY: "center",
    });
    const spinText = new Textbox("Spin! 🎲", {
      width: 100, fontSize: 14, fontFamily: "'Lato', sans-serif",
      fill: VALENTINE_COLORS.white, textAlign: "center",
      originX: "center", originY: "center",
    });
    const spinButton = new Group([spinRect, spinText], {
      left: centerX, top: 420, originX: "center", originY: "center",
    });
    spinButton.data = { interactionType: "spin-wheel", interactionId, role: "yes-button" };

    canvas.add(title, wheel, wheelEmoji, spinButton);
    canvas.renderAll();
  }, [canvas, generateInteractionId]);

  // Add text element with default romantic font
  const addText = useCallback((type: "heading" | "subheading" | "body") => {
    if (!canvas) return;
    const styles = {
      heading: { fontSize: 36, fontFamily: "'Great Vibes', cursive", text: "Your Heading" },
      subheading: { fontSize: 24, fontFamily: "'Playfair Display', serif", text: "Subheading" },
      body: { fontSize: 16, fontFamily: "'Lato', sans-serif", text: "Body text here..." },
    };
    const style = styles[type];
    const text = new Textbox(style.text, {
      left: canvas.width! / 2, top: 100, width: 300,
      fontSize: style.fontSize, fontFamily: style.fontFamily,
      fill: VALENTINE_COLORS.text, textAlign: "center",
      originX: "center", originY: "center",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [canvas]);

  // Add decoration
  const addDecoration = useCallback((type: "heart" | "emoji") => {
    if (!canvas) return;
    const emoji = type === "heart" ? "❤️" : "💕";
    const decoration = new Textbox(emoji, {
      left: 100 + Math.random() * 100,
      top: 100 + Math.random() * 100,
      fontSize: 48,
      originX: "center", originY: "center",
    });
    canvas.add(decoration);
    canvas.setActiveObject(decoration);
    canvas.renderAll();
  }, [canvas]);

  // Add animated sticker
  const addSticker = useCallback((type: StickerType) => {
    if (!canvas) return;
    const stickerInfo = STICKER_DATA[type];
    const sticker = new Textbox(stickerInfo.emoji, {
      left: canvas.width! / 2 + (Math.random() - 0.5) * 100,
      top: canvas.height! / 2 + (Math.random() - 0.5) * 100,
      fontSize: 56,
      originX: "center",
      originY: "center",
    });
    sticker.data = {
      role: "sticker",
      stickerType: type,
      stickerAnimation: stickerInfo.animation,
    };
    canvas.add(sticker);
    canvas.setActiveObject(sticker);
    canvas.renderAll();
  }, [canvas]);

  // Add shape
  const addShape = useCallback((type: ShapeType) => {
    if (!canvas) return;
    let shape: FabricObject;
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    switch (type) {
      case "rectangle":
        shape = new Rect({
          left: centerX,
          top: centerY,
          width: 120,
          height: 80,
          fill: VALENTINE_COLORS.primaryLight,
          originX: "center",
          originY: "center",
        });
        break;
      case "circle":
        shape = new Circle({
          left: centerX,
          top: centerY,
          radius: 50,
          fill: VALENTINE_COLORS.primary,
          originX: "center",
          originY: "center",
        });
        break;
      case "rounded-rect":
        shape = new Rect({
          left: centerX,
          top: centerY,
          width: 120,
          height: 80,
          fill: VALENTINE_COLORS.secondary,
          rx: 16,
          ry: 16,
          originX: "center",
          originY: "center",
        });
        break;
      case "line":
        shape = new Line([centerX - 60, centerY, centerX + 60, centerY], {
          stroke: VALENTINE_COLORS.text,
          strokeWidth: 3,
          originX: "center",
          originY: "center",
        });
        break;
      default:
        return;
    }
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  }, [canvas]);

  // Load template
  const loadTemplate = useCallback((type: TemplateType) => {
    if (!canvas) return;

    // Clear canvas first
    canvas.clear();
    canvas.backgroundColor = "#FFFFFF";

    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    switch (type) {
      case "valentine": {
        // Valentine template
        const title = new Textbox("Will You Be My Valentine?", {
          left: centerX, top: 80, width: 400, fontSize: 36,
          fontFamily: "'Great Vibes', cursive", fill: "#E91E63",
          textAlign: "center", originX: "center", originY: "center",
        });
        const heart = new Textbox("💕", {
          left: centerX, top: 160, fontSize: 64,
          originX: "center", originY: "center",
        });
        const message = new Textbox("You make my heart skip a beat.\nBe mine forever?", {
          left: centerX, top: 260, width: 350, fontSize: 18,
          fontFamily: "'Playfair Display', serif", fill: "#1E1B4B",
          textAlign: "center", originX: "center", originY: "center",
        });
        canvas.add(title, heart, message);
        break;
      }
      case "birthday": {
        // Birthday template
        const title = new Textbox("🎂 You're Invited! 🎂", {
          left: centerX, top: 70, width: 400, fontSize: 32,
          fontFamily: "'Playfair Display', serif", fill: "#FF9800",
          textAlign: "center", originX: "center", originY: "center",
        });
        const subtitle = new Textbox("Birthday Celebration", {
          left: centerX, top: 130, width: 350, fontSize: 24,
          fontFamily: "'Dancing Script', cursive", fill: "#1E1B4B",
          textAlign: "center", originX: "center", originY: "center",
        });
        const details = new Textbox("Join us for cake, fun & memories!\n\nDate: [Your Date]\nTime: [Your Time]\nPlace: [Location]", {
          left: centerX, top: 260, width: 350, fontSize: 16,
          fontFamily: "'Lato', sans-serif", fill: "#374151",
          textAlign: "center", originX: "center", originY: "center",
        });
        const balloons = new Textbox("🎈🎉🎁", {
          left: centerX, top: 380, fontSize: 48,
          originX: "center", originY: "center",
        });
        canvas.add(title, subtitle, details, balloons);
        break;
      }
      case "wedding": {
        // Wedding template
        const names = new Textbox("Sarah & Michael", {
          left: centerX, top: 100, width: 400, fontSize: 42,
          fontFamily: "'Great Vibes', cursive", fill: "#9C27B0",
          textAlign: "center", originX: "center", originY: "center",
        });
        const invite = new Textbox("Request the pleasure of your company\nat their wedding celebration", {
          left: centerX, top: 180, width: 380, fontSize: 16,
          fontFamily: "'Playfair Display', serif", fill: "#1E1B4B",
          textAlign: "center", originX: "center", originY: "center",
        });
        const details = new Textbox("Saturday, June 15th, 2025\nat Four O'Clock in the Afternoon\n\nThe Grand Ballroom\n123 Wedding Lane", {
          left: centerX, top: 300, width: 350, fontSize: 14,
          fontFamily: "'Cormorant Garamond', serif", fill: "#374151",
          textAlign: "center", originX: "center", originY: "center",
        });
        const rings = new Textbox("💍💒💐", {
          left: centerX, top: 410, fontSize: 36,
          originX: "center", originY: "center",
        });
        canvas.add(names, invite, details, rings);
        break;
      }
      case "party": {
        // Party template
        const title = new Textbox("LET'S PARTY! 🎉", {
          left: centerX, top: 80, width: 400, fontSize: 38,
          fontFamily: "'Playfair Display', serif", fill: "#2196F3",
          textAlign: "center", originX: "center", originY: "center",
        });
        const subtitle = new Textbox("You're Invited to the Party of the Year", {
          left: centerX, top: 150, width: 380, fontSize: 18,
          fontFamily: "'Lato', sans-serif", fill: "#1E1B4B",
          textAlign: "center", originX: "center", originY: "center",
        });
        const details = new Textbox("When: [Date & Time]\nWhere: [Location]\nDress Code: [Style]", {
          left: centerX, top: 260, width: 350, fontSize: 16,
          fontFamily: "'Lato', sans-serif", fill: "#374151",
          textAlign: "center", originX: "center", originY: "center",
        });
        const emojis = new Textbox("🎊🥳🎶🍕🎈", {
          left: centerX, top: 370, fontSize: 40,
          originX: "center", originY: "center",
        });
        canvas.add(title, subtitle, details, emojis);
        break;
      }
      case "minimal": {
        // Minimal template
        const title = new Textbox("You're Invited", {
          left: centerX, top: 150, width: 400, fontSize: 32,
          fontFamily: "'Playfair Display', serif", fill: "#1E1B4B",
          textAlign: "center", originX: "center", originY: "center",
        });
        const line = new Rect({
          left: centerX, top: 200, width: 100, height: 2,
          fill: "#9CA3AF", originX: "center", originY: "center",
        });
        const details = new Textbox("Event details go here\n\nDate • Time • Place", {
          left: centerX, top: 280, width: 350, fontSize: 16,
          fontFamily: "'Lato', sans-serif", fill: "#6B7280",
          textAlign: "center", originX: "center", originY: "center",
        });
        canvas.add(title, line, details);
        break;
      }
    }
    canvas.renderAll();
  }, [canvas]);

  const deleteSelected = useCallback(() => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    setSelectedObject(null);
    canvas.renderAll();
  }, [canvas, selectedObject]);

  // Clipboard state for copy/paste
  const clipboardRef = useRef<FabricObject | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      // Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
        e.preventDefault();
        canvas.remove(selectedObject);
        setSelectedObject(null);
        canvas.renderAll();
      }

      // Copy (Ctrl+C or Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedObject) {
        e.preventDefault();
        selectedObject.clone().then((cloned: FabricObject) => {
          clipboardRef.current = cloned;
        });
      }

      // Paste (Ctrl+V or Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboardRef.current) {
        e.preventDefault();
        clipboardRef.current.clone().then((cloned: FabricObject) => {
          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
          });
          // Preserve custom data
          if (clipboardRef.current?.data) {
            cloned.data = { ...clipboardRef.current.data };
          }
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
        });
      }

      // Duplicate (Ctrl+D or Cmd+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedObject) {
        e.preventDefault();
        selectedObject.clone().then((cloned: FabricObject) => {
          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
          });
          if (selectedObject.data) {
            cloned.data = { ...selectedObject.data };
          }
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, selectedObject]);

  const serializeCanvas = useCallback(() => {
    if (!canvas) return null;
    // Use toObject with custom properties instead of toJSON (which doesn't accept properties)
    const propertiesToInclude = [
      'data',
      'text',
      'fontFamily',
      'fontSize',
      'fill',
      'textAlign',
      'originX',
      'originY',
      'stroke',
      'strokeWidth',
      'backgroundColor',
      'rx',
      'ry',
    ];
    const canvasData = canvas.toObject(propertiesToInclude);
    const objects = canvas.getObjects();

    // Ensure canvas dimensions are saved
    canvasData.width = canvas.width;
    canvasData.height = canvas.height;

    // Ensure custom data property is preserved for all objects
    if (canvasData.objects) {
      canvasData.objects.forEach((obj: Record<string, unknown>, index: number) => {
        const fabricObj = objects[index];
        if (fabricObj?.data) {
          obj.data = fabricObj.data;
        }
        // Ensure text content is properly captured for textboxes
        if (fabricObj?.type === 'textbox' || fabricObj?.type === 'text') {
          const textObj = fabricObj as Textbox;
          obj.text = textObj.text;
          obj.fontFamily = textObj.fontFamily;
          obj.fontSize = textObj.fontSize;
          obj.fill = textObj.fill;
          obj.textAlign = textObj.textAlign;
          obj.originX = textObj.originX;
          obj.originY = textObj.originY;
        }
      });
    }
    console.log("Serialized canvas:", canvasData);
    return JSON.stringify(canvasData);
  }, [canvas]);

  const handleSave = useCallback(() => {
    const json = serializeCanvas();
    if (!json) return;
    setIsSaving(true);
    localStorage.setItem("invitation-design", json);
    onSave?.(json);
    setTimeout(() => setIsSaving(false), 1500);
  }, [serializeCanvas, onSave]);

  const handleExport = useCallback(() => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: "png", quality: 1, multiplier: 2 });
    const link = document.createElement("a");
    link.download = "valentine-invitation.png";
    link.href = dataURL;
    link.click();
  }, [canvas]);

  const handlePreview = useCallback(() => {
    const json = serializeCanvas();
    if (!json) return;
    localStorage.setItem("invitation-design", json);
    onPreview?.();
  }, [serializeCanvas, onPreview]);

  const forceUpdate = useCallback(() => {
    // Force re-render to sync state
    setSelectedObject(selectedObject);
  }, [selectedObject]);

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-200 via-slate-100 to-purple-100 relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <FloatingSparkles />

      {/* Sidebar */}
      <InteractionsSidebar
        onAddInteraction={(type) => {
          if (type === "yes-no-runaway") addYesNoRunaway();
          else if (type === "yes-no-shrinking") addYesNoShrinking();
          else if (type === "scratch-reveal") addScratchReveal();
          else if (type === "spin-wheel") addSpinWheel();
        }}
        onAddText={addText}
        onAddDecoration={addDecoration}
        onAddSticker={addSticker}
        onAddShape={addShape}
        onLoadTemplate={loadTemplate}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Elegant Toolbar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 px-6 py-4 flex items-center justify-between"
        >
          {/* Decorative line */}
          <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
            </motion.div>
            <div>
              <h1 className="font-sans text-xl font-bold text-gray-800 tracking-tight">Invitely</h1>
              <p className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-medium tracking-widest uppercase">Interactive Invites</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {selectedObject && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={deleteSelected}
                  className="p-2.5 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-300"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePreview}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-800 bg-white/60 hover:bg-white rounded-full border border-purple-100 hover:border-purple-200 transition-all duration-300 backdrop-blur-sm"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Preview</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-800 bg-white/60 hover:bg-white rounded-full border border-purple-100 hover:border-purple-200 transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </motion.div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{isSaving ? "Saved!" : "Save"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 text-white rounded-full shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${VALENTINE_COLORS.primary} 0%, ${VALENTINE_COLORS.primaryDark} 100%)`
              }}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </motion.button>
          </div>
        </motion.header>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
          {!canvasSize ? (
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-12 h-12 text-purple-400" fill="#FB7185" />
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
            >
              {/* Canvas glow effect */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl"
                style={{
                  background: `radial-gradient(ellipse at center, ${VALENTINE_COLORS.primaryLight}20 0%, transparent 70%)`
                }}
              />

              {/* Canvas frame */}
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-purple-900/10 overflow-hidden ring-1 ring-purple-100">
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-purple-200/50 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-purple-200/50 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-purple-200/50 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-purple-200/50 rounded-br-lg" />

                <canvas ref={canvasRef} className="block" />
              </div>

              {/* Canvas label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-purple-300 font-light tracking-widest uppercase"
              >
                {canvasSize.width} × {canvasSize.height} px
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Text Properties Panel */}
        <AnimatePresence>
          <TextPropertiesPanel
            selectedObject={selectedObject}
            canvas={canvas}
            onUpdate={forceUpdate}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FabricEditor;

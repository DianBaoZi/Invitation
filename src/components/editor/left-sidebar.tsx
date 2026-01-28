"use client";

import { useEditor } from "@craftjs/core";
import {
  Type,
  MousePointer2,
  Heart,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import {
  HeadingElement,
  SubheadingElement,
  BodyTextElement,
  LoveQuoteElement,
  YesButtonElement,
  RunawayNoButtonElement,
  ShrinkingNoButtonElement,
  NormalButtonElement,
  HeartElement,
  EmojiElement,
  DividerElement,
} from "./canvas-elements";

interface ElementItemProps {
  name: string;
  preview: React.ReactNode;
  element: React.ReactElement;
}

function ElementItem({ name, preview, element }: ElementItemProps) {
  const { connectors } = useEditor();

  return (
    <div
      ref={(ref) => {
        if (ref) connectors.create(ref, element);
      }}
      className="aspect-square bg-white rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-1 group shadow-sm hover:shadow-md"
    >
      <div className="text-lg">{preview}</div>
      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors text-center px-1">
        {name}
      </span>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-3 px-4 hover:bg-muted/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function LeftSidebar() {
  return (
    <aside className="w-[250px] bg-white border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Elements
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag elements onto the canvas
        </p>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection
          title="Text"
          icon={<Type className="w-4 h-4" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            <ElementItem
              name="Heading"
              preview={<span className="font-bold text-base">Aa</span>}
              element={<HeadingElement />}
            />
            <ElementItem
              name="Subheading"
              preview={<span className="font-medium text-sm">Aa</span>}
              element={<SubheadingElement />}
            />
            <ElementItem
              name="Body"
              preview={<span className="text-sm">Tt</span>}
              element={<BodyTextElement />}
            />
            <ElementItem
              name="Love Quote"
              preview={<span className="italic text-primary">❝</span>}
              element={<LoveQuoteElement />}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Interactive Buttons"
          icon={<MousePointer2 className="w-4 h-4" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            <ElementItem
              name="Yes Button"
              preview={<span className="text-primary">🎉 Yes!</span>}
              element={<YesButtonElement />}
            />
            <ElementItem
              name="Runaway No"
              preview={<span className="text-muted-foreground">🏃 No</span>}
              element={<RunawayNoButtonElement />}
            />
            <ElementItem
              name="Shrinking No"
              preview={<span className="text-muted-foreground">📉 No</span>}
              element={<ShrinkingNoButtonElement />}
            />
            <ElementItem
              name="Normal"
              preview={<span className="text-xs bg-muted px-2 py-0.5 rounded">Btn</span>}
              element={<NormalButtonElement />}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Decorations"
          icon={<Heart className="w-4 h-4" />}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-2">
            <ElementItem
              name="Heart"
              preview={<Heart className="w-5 h-5 text-primary fill-primary" />}
              element={<HeartElement size={48} color="#FF4B6E" opacity={1} filled={true} x={50} y={50} />}
            />
            <ElementItem
              name="Emoji"
              preview={<span>❤️</span>}
              element={<EmojiElement emoji="❤️" size={48} opacity={1} x={80} y={80} />}
            />
            <ElementItem
              name="Divider"
              preview={
                <div className="w-8 border-t-2 border-primary" />
              }
              element={<DividerElement width={100} color="#FF4B6E" opacity={1} style="solid" x={50} y={200} />}
            />
          </div>
        </CollapsibleSection>
      </div>

      {/* Pro Elements Banner */}
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-pink-100 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Premium Elements
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Unlock confetti, music, and more!
          </p>
        </div>
      </div>
    </aside>
  );
}

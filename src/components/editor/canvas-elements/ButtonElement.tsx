"use client";

import { useNode } from "@craftjs/core";
import { motion } from "framer-motion";
import { useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

export type ButtonInteraction = "normal" | "runaway" | "shrinking" | "confetti";

export interface ButtonElementProps {
  label: string;
  backgroundColor: string;
  textColor: string;
  interaction: ButtonInteraction;
  isPreview?: boolean;
  x: number;
  y: number;
}

// Position settings for buttons
const PositionSettings = () => {
  const {
    actions: { setProp },
    x,
    y,
  } = useNode((node) => ({
    x: node.data.props.x,
    y: node.data.props.y,
  }));

  return (
    <div className="space-y-3 pt-3 border-t border-border mt-3">
      <label className="text-xs font-medium text-muted-foreground block">
        Position
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-muted-foreground">X</label>
          <input
            type="number"
            value={Math.round(x)}
            onChange={(e) =>
              setProp((props: ButtonElementProps) => (props.x = parseInt(e.target.value) || 0))
            }
            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground">Y</label>
          <input
            type="number"
            value={Math.round(y)}
            onChange={(e) =>
              setProp((props: ButtonElementProps) => (props.y = parseInt(e.target.value) || 0))
            }
            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

// Shared Settings Component
const ButtonSettings = () => {
  const {
    actions: { setProp },
    label,
    backgroundColor,
    textColor,
    interaction,
  } = useNode((node) => ({
    label: node.data.props.label,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    interaction: node.data.props.interaction,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Label
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) =>
            setProp((props: ButtonElementProps) => (props.label = e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Button Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) =>
              setProp(
                (props: ButtonElementProps) =>
                  (props.backgroundColor = e.target.value)
              )
            }
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) =>
              setProp(
                (props: ButtonElementProps) =>
                  (props.backgroundColor = e.target.value)
              )
            }
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Text Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={textColor}
            onChange={(e) =>
              setProp(
                (props: ButtonElementProps) => (props.textColor = e.target.value)
              )
            }
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) =>
              setProp(
                (props: ButtonElementProps) => (props.textColor = e.target.value)
              )
            }
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Interaction Type
        </label>
        <select
          value={interaction}
          onChange={(e) =>
            setProp(
              (props: ButtonElementProps) =>
                (props.interaction = e.target.value as ButtonInteraction)
            )
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
        >
          <option value="normal">Normal (No interaction)</option>
          <option value="confetti">Confetti (On click)</option>
          <option value="runaway">Runaway (Escapes cursor)</option>
          <option value="shrinking">Shrinking (Gets smaller)</option>
        </select>
      </div>

      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          {interaction === "normal" && "Standard button with no special effects."}
          {interaction === "confetti" && "Triggers confetti explosion when clicked!"}
          {interaction === "runaway" && "Button runs away when cursor approaches."}
          {interaction === "shrinking" && "Shrinks 20% each time you hover until it disappears."}
        </p>
      </div>

      <PositionSettings />
    </div>
  );
};

// Base Button Component
export function ButtonElement({
  label = "Click Me",
  backgroundColor = "#FF4B6E",
  textColor = "#ffffff",
  interaction = "normal",
  isPreview = false,
  x = 150,
  y = 250,
}: ButtonElementProps) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [interactionOffset, setInteractionOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [, setHoverCount] = useState(0);
  const [localPos, setLocalPos] = useState({ x, y });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: ButtonElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  const handleRunaway = useCallback(() => {
    if (!isPreview || interaction !== "runaway") return;
    const maxX = 100;
    const maxY = 150;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setInteractionOffset({ x: newX, y: newY });
  }, [isPreview, interaction]);

  const handleShrink = useCallback(() => {
    if (!isPreview || interaction !== "shrinking") return;
    setHoverCount((prev) => {
      const newCount = prev + 1;
      const newScale = Math.max(0, 1 - newCount * 0.2);
      setScale(newScale);
      return newCount;
    });
  }, [isPreview, interaction]);

  const handleConfetti = useCallback(() => {
    if (!isPreview || interaction !== "confetti") return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF4B6E", "#FF6B8A", "#FFB6C1", "#FFC0CB", "#FF69B4"],
    });
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FF4B6E", "#FF6B8A", "#FFB6C1"],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#FF4B6E", "#FF6B8A", "#FFB6C1"],
    });
  }, [isPreview, interaction]);

  const handleMouseEnter = () => {
    if (interaction === "runaway") handleRunaway();
    else if (interaction === "shrinking") handleShrink();
  };

  const handleClick = () => {
    if (interaction === "confetti") handleConfetti();
  };

  if (scale <= 0) return null;

  // Preview mode - absolute positioning without drag
  if (isPreview) {
    return (
      <motion.div
        className="absolute"
        style={{ left: x, top: y }}
        animate={{ x: interactionOffset.x, y: interactionOffset.y, scale }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <button
          onMouseEnter={handleMouseEnter}
          onClick={handleClick}
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          {label}
        </button>
      </motion.div>
    );
  }

  // Editor mode - draggable
  return (
    <Draggable
      nodeRef={nodeRef}
      position={localPos}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = ref;
          }
        }}
        className={`absolute cursor-move p-1 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg pointer-events-none"
        >
          {label}
        </button>
      </div>
    </Draggable>
  );
}

ButtonElement.craft = {
  displayName: "Button",
  props: {
    label: "Click Me",
    backgroundColor: "#FF4B6E",
    textColor: "#ffffff",
    interaction: "normal" as ButtonInteraction,
    isPreview: false,
    x: 150,
    y: 250,
  },
  related: {
    settings: ButtonSettings,
  },
};

// Yes Button - Confetti
export function YesButtonElement({
  label = "Yes!",
  backgroundColor = "#FF4B6E",
  textColor = "#ffffff",
  interaction = "confetti" as ButtonInteraction,
  isPreview = false,
  x = 120,
  y = 300,
}: Partial<ButtonElementProps>) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x: x!, y: y! });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: ButtonElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  const handleConfetti = useCallback(() => {
    if (!isPreview || interaction !== "confetti") return;
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF4B6E", "#FF6B8A", "#FFB6C1", "#FFC0CB", "#FF69B4"],
    });
  }, [isPreview, interaction]);

  if (isPreview) {
    return (
      <div
        className="absolute"
        style={{ left: x, top: y }}
      >
        <button
          onClick={handleConfetti}
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={localPos}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = ref;
          }
        }}
        className={`absolute cursor-move p-1 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg pointer-events-none"
        >
          {label}
        </button>
      </div>
    </Draggable>
  );
}

YesButtonElement.craft = {
  displayName: "Yes Button",
  props: {
    label: "Yes!",
    backgroundColor: "#FF4B6E",
    textColor: "#ffffff",
    interaction: "confetti" as ButtonInteraction,
    isPreview: false,
    x: 120,
    y: 300,
  },
  related: {
    settings: ButtonSettings,
  },
};

// Runaway No Button
export function RunawayNoButtonElement({
  label = "No",
  backgroundColor = "#e5e5e5",
  textColor = "#666666",
  interaction: _interaction = "runaway" as ButtonInteraction,
  isPreview = false,
  x = 220,
  y = 300,
}: Partial<ButtonElementProps>) {
  void _interaction;
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [interactionOffset, setInteractionOffset] = useState({ x: 0, y: 0 });
  const [localPos, setLocalPos] = useState({ x: x!, y: y! });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: ButtonElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  const handleRunaway = useCallback(() => {
    if (!isPreview) return;
    const maxX = 100;
    const maxY = 150;
    const newX = (Math.random() - 0.5) * maxX * 2;
    const newY = (Math.random() - 0.5) * maxY * 2;
    setInteractionOffset({ x: newX, y: newY });
  }, [isPreview]);

  if (isPreview) {
    return (
      <motion.div
        className="absolute"
        style={{ left: x, top: y }}
        animate={{ x: interactionOffset.x, y: interactionOffset.y }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <button
          onMouseEnter={handleRunaway}
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          {label}
        </button>
      </motion.div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={localPos}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = ref;
          }
        }}
        className={`absolute cursor-move p-1 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg pointer-events-none"
        >
          {label}
        </button>
      </div>
    </Draggable>
  );
}

RunawayNoButtonElement.craft = {
  displayName: "Runaway No",
  props: {
    label: "No",
    backgroundColor: "#e5e5e5",
    textColor: "#666666",
    interaction: "runaway" as ButtonInteraction,
    isPreview: false,
    x: 220,
    y: 300,
  },
  related: {
    settings: ButtonSettings,
  },
};

// Shrinking No Button
export function ShrinkingNoButtonElement({
  label = "No",
  backgroundColor = "#e5e5e5",
  textColor = "#666666",
  interaction: _interaction = "shrinking" as ButtonInteraction,
  isPreview = false,
  x = 220,
  y = 300,
}: Partial<ButtonElementProps>) {
  void _interaction;
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [, setHoverCount] = useState(0);
  const [localPos, setLocalPos] = useState({ x: x!, y: y! });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: ButtonElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  const handleShrink = useCallback(() => {
    if (!isPreview) return;
    setHoverCount((prev) => {
      const newCount = prev + 1;
      const newScale = Math.max(0, 1 - newCount * 0.2);
      setScale(newScale);
      return newCount;
    });
  }, [isPreview]);

  if (scale <= 0) return null;

  if (isPreview) {
    return (
      <motion.div
        className="absolute"
        style={{ left: x, top: y }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <button
          onMouseEnter={handleShrink}
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          {label}
        </button>
      </motion.div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={localPos}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = ref;
          }
        }}
        className={`absolute cursor-move p-1 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg pointer-events-none"
        >
          {label}
        </button>
      </div>
    </Draggable>
  );
}

ShrinkingNoButtonElement.craft = {
  displayName: "Shrinking No",
  props: {
    label: "No",
    backgroundColor: "#e5e5e5",
    textColor: "#666666",
    interaction: "shrinking" as ButtonInteraction,
    isPreview: false,
    x: 220,
    y: 300,
  },
  related: {
    settings: ButtonSettings,
  },
};

// Normal Button
export function NormalButtonElement({
  label = "Button",
  backgroundColor = "#1a1a1a",
  textColor = "#ffffff",
  interaction: _interaction = "normal" as ButtonInteraction,
  isPreview = false,
  x = 150,
  y = 350,
}: Partial<ButtonElementProps>) {
  void _interaction;
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x: x!, y: y! });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: ButtonElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  if (isPreview) {
    return (
      <div
        className="absolute"
        style={{ left: x, top: y }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-shadow"
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={localPos}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={(ref) => {
          if (ref) {
            connect(ref);
            (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = ref;
          }
        }}
        className={`absolute cursor-move p-1 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <button
          style={{ backgroundColor, color: textColor }}
          className="px-6 py-3 rounded-full font-medium text-sm shadow-lg pointer-events-none"
        >
          {label}
        </button>
      </div>
    </Draggable>
  );
}

NormalButtonElement.craft = {
  displayName: "Normal Button",
  props: {
    label: "Button",
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    interaction: "normal" as ButtonInteraction,
    isPreview: false,
    x: 150,
    y: 350,
  },
  related: {
    settings: ButtonSettings,
  },
};

"use client";

import { useNode } from "@craftjs/core";
import { Heart } from "lucide-react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useRef, useState } from "react";

// Shared position settings
interface PositionProps {
  x: number;
  y: number;
}

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
              setProp((props: PositionProps) => (props.x = parseInt(e.target.value) || 0))
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
              setProp((props: PositionProps) => (props.y = parseInt(e.target.value) || 0))
            }
            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

export interface HeartElementProps {
  size: number;
  color: string;
  opacity: number;
  filled: boolean;
  x: number;
  y: number;
}

export function HeartElement({
  size,
  color,
  opacity,
  filled,
  x = 50,
  y = 50,
}: HeartElementProps) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x, y });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: HeartElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

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
        className={`absolute cursor-move ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 rounded"
            : "hover:outline hover:outline-1 hover:outline-primary/50 rounded"
        }`}
        style={{ opacity, touchAction: "none" }}
      >
        <Heart
          size={size}
          color={color}
          fill={filled ? color : "none"}
          strokeWidth={2}
        />
      </div>
    </Draggable>
  );
}

const HeartElementSettings = () => {
  const {
    actions: { setProp },
    size,
    color,
    opacity,
    filled,
  } = useNode((node) => ({
    size: node.data.props.size,
    color: node.data.props.color,
    opacity: node.data.props.opacity,
    filled: node.data.props.filled,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Size: {size}px
        </label>
        <input
          type="range"
          min={16}
          max={120}
          value={size}
          onChange={(e) =>
            setProp(
              (props: HeartElementProps) => (props.size = parseInt(e.target.value))
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) =>
              setProp((props: HeartElementProps) => (props.color = e.target.value))
            }
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) =>
              setProp((props: HeartElementProps) => (props.color = e.target.value))
            }
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity * 100}
          onChange={(e) =>
            setProp(
              (props: HeartElementProps) =>
                (props.opacity = parseInt(e.target.value) / 100)
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Style
        </label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setProp((props: HeartElementProps) => (props.filled = false))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${!filled ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Outline
          </button>
          <button
            onClick={() =>
              setProp((props: HeartElementProps) => (props.filled = true))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${filled ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Filled
          </button>
        </div>
      </div>

      <PositionSettings />
    </div>
  );
};

HeartElement.craft = {
  props: {
    size: 48,
    color: "#FF4B6E",
    opacity: 1,
    filled: true,
    x: 50,
    y: 50,
  },
  related: {
    settings: HeartElementSettings,
  },
  displayName: "Heart",
};

// Emoji Element
export interface EmojiElementProps {
  emoji: string;
  size: number;
  opacity: number;
  x: number;
  y: number;
}

export function EmojiElement({
  emoji,
  size,
  opacity,
  x = 80,
  y = 80,
}: EmojiElementProps) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x, y });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: EmojiElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

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
        className={`absolute cursor-move ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 rounded"
            : "hover:outline hover:outline-1 hover:outline-primary/50 rounded"
        }`}
        style={{
          fontSize: `${size}px`,
          opacity,
          lineHeight: 1,
          touchAction: "none",
        }}
      >
        {emoji}
      </div>
    </Draggable>
  );
}

const EmojiElementSettings = () => {
  const {
    actions: { setProp },
    emoji,
    size,
    opacity,
  } = useNode((node) => ({
    emoji: node.data.props.emoji,
    size: node.data.props.size,
    opacity: node.data.props.opacity,
  }));

  const commonEmojis = [
    "❤️", "💕", "💖", "💗", "💓", "💝", "💘", "💞",
    "🥰", "😍", "😘", "🌹", "💐", "🌸", "✨", "💫",
    "🎉", "🎊", "🦋", "🌈", "⭐", "🌟", "💎", "🔥",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Emoji
        </label>
        <div className="grid grid-cols-6 gap-2 mb-2">
          {commonEmojis.map((e) => (
            <button
              key={e}
              onClick={() =>
                setProp((props: EmojiElementProps) => (props.emoji = e))
              }
              className={`text-2xl p-2 rounded-lg hover:bg-muted ${emoji === e ? "bg-primary/10 ring-2 ring-primary" : ""}`}
            >
              {e}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={emoji}
          onChange={(e) =>
            setProp((props: EmojiElementProps) => (props.emoji = e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Or type any emoji..."
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Size: {size}px
        </label>
        <input
          type="range"
          min={16}
          max={96}
          value={size}
          onChange={(e) =>
            setProp(
              (props: EmojiElementProps) => (props.size = parseInt(e.target.value))
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity * 100}
          onChange={(e) =>
            setProp(
              (props: EmojiElementProps) =>
                (props.opacity = parseInt(e.target.value) / 100)
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <PositionSettings />
    </div>
  );
};

EmojiElement.craft = {
  props: {
    emoji: "❤️",
    size: 48,
    opacity: 1,
    x: 80,
    y: 80,
  },
  related: {
    settings: EmojiElementSettings,
  },
  displayName: "Emoji",
};

// Divider Element
export interface DividerElementProps {
  width: number;
  color: string;
  opacity: number;
  style: "solid" | "dashed" | "dotted";
  x: number;
  y: number;
}

export function DividerElement({
  width,
  color,
  opacity,
  style,
  x = 50,
  y = 200,
}: DividerElementProps) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x, y });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: DividerElementProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

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
        className={`absolute cursor-move py-2 ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 rounded"
            : "hover:outline hover:outline-1 hover:outline-primary/50 rounded"
        }`}
        style={{ opacity, touchAction: "none", minWidth: "100px" }}
      >
        <div
          style={{
            width: `${width * 2}px`,
            borderTopWidth: "2px",
            borderTopStyle: style,
            borderTopColor: color,
          }}
        />
      </div>
    </Draggable>
  );
}

const DividerElementSettings = () => {
  const {
    actions: { setProp },
    width,
    color,
    opacity,
    style,
  } = useNode((node) => ({
    width: node.data.props.width,
    color: node.data.props.color,
    opacity: node.data.props.opacity,
    style: node.data.props.style,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Width: {width * 2}px
        </label>
        <input
          type="range"
          min={50}
          max={200}
          value={width}
          onChange={(e) =>
            setProp(
              (props: DividerElementProps) =>
                (props.width = parseInt(e.target.value))
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Color
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) =>
              setProp(
                (props: DividerElementProps) => (props.color = e.target.value)
              )
            }
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) =>
              setProp(
                (props: DividerElementProps) => (props.color = e.target.value)
              )
            }
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Style
        </label>
        <div className="flex gap-2">
          {(["solid", "dashed", "dotted"] as const).map((s) => (
            <button
              key={s}
              onClick={() =>
                setProp((props: DividerElementProps) => (props.style = s))
              }
              className={`flex-1 px-3 py-2 text-sm rounded-lg border capitalize ${style === s ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Opacity: {Math.round(opacity * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={opacity * 100}
          onChange={(e) =>
            setProp(
              (props: DividerElementProps) =>
                (props.opacity = parseInt(e.target.value) / 100)
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <PositionSettings />
    </div>
  );
};

DividerElement.craft = {
  props: {
    width: 100,
    color: "#FF4B6E",
    opacity: 1,
    style: "solid" as const,
    x: 50,
    y: 200,
  },
  related: {
    settings: DividerElementSettings,
  },
  displayName: "Divider",
};

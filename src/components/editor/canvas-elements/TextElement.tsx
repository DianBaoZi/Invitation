"use client";

import { useNode } from "@craftjs/core";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useRef, useState } from "react";

export interface TextElementProps {
  text: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  textAlign: "left" | "center" | "right";
  color: string;
  fontStyle?: "normal" | "italic";
  x: number;
  y: number;
}

// Position settings shared by all text elements
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
              setProp((props: TextElementProps) => (props.x = parseInt(e.target.value) || 0))
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
              setProp((props: TextElementProps) => (props.y = parseInt(e.target.value) || 0))
            }
            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};

// Shared Settings Component
const TextSettings = () => {
  const {
    actions: { setProp },
    text,
    fontSize,
    fontWeight,
    textAlign,
    color,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign,
    color: node.data.props.color,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Content
        </label>
        <textarea
          value={text}
          onChange={(e) =>
            setProp((props: TextElementProps) => (props.text = e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Font Size: {fontSize}px
        </label>
        <input
          type="range"
          min={12}
          max={72}
          value={fontSize}
          onChange={(e) =>
            setProp(
              (props: TextElementProps) =>
                (props.fontSize = parseInt(e.target.value))
            )
          }
          className="w-full accent-primary"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Font Weight
        </label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setProp((props: TextElementProps) => (props.fontWeight = "normal"))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${fontWeight === "normal" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Normal
          </button>
          <button
            onClick={() =>
              setProp((props: TextElementProps) => (props.fontWeight = "bold"))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${fontWeight === "bold" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Bold
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Text Align
        </label>
        <div className="flex gap-2">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              onClick={() =>
                setProp((props: TextElementProps) => (props.textAlign = align))
              }
              className={`flex-1 px-3 py-2 text-sm rounded-lg border capitalize ${textAlign === align ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
            >
              {align}
            </button>
          ))}
        </div>
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
              setProp((props: TextElementProps) => (props.color = e.target.value))
            }
            className="w-10 h-10 rounded-lg border border-border cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) =>
              setProp((props: TextElementProps) => (props.color = e.target.value))
            }
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <PositionSettings />
    </div>
  );
};

// Base Text Component
export function TextElement({
  text,
  fontSize,
  fontWeight,
  textAlign,
  color,
  fontStyle = "normal",
  x = 100,
  y = 100,
}: TextElementProps) {
  const {
    connectors: { connect },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const nodeRef = useRef<HTMLDivElement>(null);
  const [localPos, setLocalPos] = useState({ x, y });

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: TextElementProps) => {
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
        className={`absolute cursor-move p-2 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <p
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign,
            color,
            fontStyle,
            lineHeight: 1.4,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </p>
      </div>
    </Draggable>
  );
}

TextElement.craft = {
  displayName: "Text",
  props: {
    text: "Edit this text",
    fontSize: 16,
    fontWeight: "normal" as const,
    textAlign: "center" as const,
    color: "#1a1a1a",
    fontStyle: "normal" as const,
    x: 100,
    y: 100,
  },
  related: {
    settings: TextSettings,
  },
};

// Heading Element
export function HeadingElement({
  text = "Your Heading",
  fontSize = 32,
  fontWeight = "bold" as const,
  textAlign = "center" as const,
  color = "#1a1a1a",
  fontStyle = "normal" as const,
  x = 100,
  y = 50,
}: Partial<TextElementProps>) {
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
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: TextElementProps) => {
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
        className={`absolute cursor-move p-2 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <h2
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign,
            color,
            fontStyle,
            lineHeight: 1.2,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </h2>
      </div>
    </Draggable>
  );
}

HeadingElement.craft = {
  displayName: "Heading",
  props: {
    text: "Your Heading",
    fontSize: 32,
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    color: "#1a1a1a",
    fontStyle: "normal" as const,
    x: 100,
    y: 50,
  },
  related: {
    settings: TextSettings,
  },
};

// Subheading Element
export function SubheadingElement({
  text = "Your Subheading",
  fontSize = 20,
  fontWeight = "normal" as const,
  textAlign = "center" as const,
  color = "#444444",
  fontStyle = "normal" as const,
  x = 100,
  y = 100,
}: Partial<TextElementProps>) {
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
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: TextElementProps) => {
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
        className={`absolute cursor-move p-2 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <h3
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign,
            color,
            fontStyle,
            lineHeight: 1.3,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </h3>
      </div>
    </Draggable>
  );
}

SubheadingElement.craft = {
  displayName: "Subheading",
  props: {
    text: "Your Subheading",
    fontSize: 20,
    fontWeight: "normal" as const,
    textAlign: "center" as const,
    color: "#444444",
    fontStyle: "normal" as const,
    x: 100,
    y: 100,
  },
  related: {
    settings: TextSettings,
  },
};

// Body Text Element
export function BodyTextElement({
  text = "Add your body text here...",
  fontSize = 16,
  fontWeight = "normal" as const,
  textAlign = "center" as const,
  color = "#666666",
  fontStyle = "normal" as const,
  x = 100,
  y = 150,
}: Partial<TextElementProps>) {
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
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: TextElementProps) => {
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
        className={`absolute cursor-move p-2 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <p
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign,
            color,
            fontStyle,
            lineHeight: 1.5,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </p>
      </div>
    </Draggable>
  );
}

BodyTextElement.craft = {
  displayName: "Body Text",
  props: {
    text: "Add your body text here...",
    fontSize: 16,
    fontWeight: "normal" as const,
    textAlign: "center" as const,
    color: "#666666",
    fontStyle: "normal" as const,
    x: 100,
    y: 150,
  },
  related: {
    settings: TextSettings,
  },
};

// Love Quote Element
export function LoveQuoteElement({
  text = "Love is all you need...",
  fontSize = 18,
  fontWeight = "normal" as const,
  textAlign = "center" as const,
  color = "#FF4B6E",
  fontStyle = "italic" as const,
  x = 100,
  y = 200,
}: Partial<TextElementProps>) {
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
    setLocalPos({ x: data.x, y: data.y });
  };

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    setProp((props: TextElementProps) => {
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
        className={`absolute cursor-move p-2 rounded transition-all ${
          selected
            ? "outline outline-2 outline-primary outline-offset-2 bg-primary/5"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        <p
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            textAlign,
            color,
            fontStyle,
            lineHeight: 1.5,
            margin: 0,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          &ldquo;{text}&rdquo;
        </p>
      </div>
    </Draggable>
  );
}

LoveQuoteElement.craft = {
  displayName: "Love Quote",
  props: {
    text: "Love is all you need...",
    fontSize: 18,
    fontWeight: "normal" as const,
    textAlign: "center" as const,
    color: "#FF4B6E",
    fontStyle: "italic" as const,
    x: 100,
    y: 200,
  },
  related: {
    settings: TextSettings,
  },
};

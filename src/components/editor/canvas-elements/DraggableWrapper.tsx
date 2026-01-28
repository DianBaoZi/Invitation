"use client";

import { useNode } from "@craftjs/core";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { useRef } from "react";

export interface DraggableProps {
  x: number;
  y: number;
}

interface DraggableWrapperProps {
  children: React.ReactNode;
  x: number;
  y: number;
  selected?: boolean;
  isPreview?: boolean;
}

export function DraggableWrapper({
  children,
  x,
  y,
  selected = false,
  isPreview = false,
}: DraggableWrapperProps) {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode();

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    if (isPreview) return;
    setProp((props: DraggableProps) => {
      props.x = data.x;
      props.y = data.y;
    });
  };

  // In preview mode, just render absolutely positioned without drag
  if (isPreview) {
    return (
      <div
        className="absolute"
        style={{ left: x, top: y }}
      >
        {children}
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x, y }}
      onDrag={handleDrag}
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
            ? "outline outline-2 outline-primary outline-offset-2 ring-2 ring-primary/20"
            : "hover:outline hover:outline-1 hover:outline-primary/50"
        }`}
        style={{ touchAction: "none" }}
      >
        {children}
      </div>
    </Draggable>
  );
}

"use client";

import { useEditor, SerializedNodes } from "@craftjs/core";
import React from "react";
import {
  TextElement,
  HeadingElement,
  SubheadingElement,
  BodyTextElement,
  LoveQuoteElement,
  ButtonElement,
  YesButtonElement,
  RunawayNoButtonElement,
  ShrinkingNoButtonElement,
  NormalButtonElement,
  HeartElement,
  EmojiElement,
  DividerElement,
} from "./canvas-elements";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, React.ComponentType<any>> = {
  TextElement,
  HeadingElement,
  SubheadingElement,
  BodyTextElement,
  LoveQuoteElement,
  ButtonElement,
  YesButtonElement,
  RunawayNoButtonElement,
  ShrinkingNoButtonElement,
  NormalButtonElement,
  HeartElement,
  EmojiElement,
  DividerElement,
};

interface RenderNodeProps {
  nodeId: string;
  nodes: SerializedNodes;
}

function RenderNode({ nodeId, nodes }: RenderNodeProps) {
  const node = nodes[nodeId];
  if (!node) return null;

  const { type, props, nodes: childNodes } = node;
  const resolvedName = typeof type === 'string' ? type : type.resolvedName;

  // Container node - uses relative positioning for free-form canvas
  if (resolvedName === "Container") {
    const backgroundStyle = props.useGradient && props.backgroundGradient
      ? { background: String(props.backgroundGradient) }
      : { backgroundColor: String(props.backgroundColor) };

    return (
      <div
        className="min-h-full w-full h-full relative overflow-hidden"
        style={{
          ...backgroundStyle,
          padding: `${props.padding}px`,
        }}
      >
        {childNodes?.map((childId: string) => (
          <RenderNode key={childId} nodeId={childId} nodes={nodes} />
        ))}
      </div>
    );
  }

  // Get the component
  const Component = componentMap[resolvedName];
  if (!Component) {
    return null;
  }

  // For buttons, enable preview mode
  const componentProps =
    resolvedName.includes("Button")
      ? { ...props, isPreview: true }
      : props;

  return <Component {...componentProps} />;
}

export function PreviewRenderer() {
  const { query } = useEditor();

  const nodes = query.getSerializedNodes();
  const rootNodeId = "ROOT";

  return (
    <div className="w-full h-full overflow-auto">
      <RenderNode nodeId={rootNodeId} nodes={nodes} />
    </div>
  );
}

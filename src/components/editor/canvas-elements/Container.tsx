"use client";

import { useNode } from "@craftjs/core";
import React from "react";

export interface ContainerProps {
  backgroundColor: string;
  backgroundGradient?: string;
  useGradient: boolean;
  padding: number;
  children?: React.ReactNode;
}

export function Container({
  backgroundColor,
  backgroundGradient,
  useGradient,
  padding,
  children,
}: ContainerProps) {
  const {
    connectors: { connect },
  } = useNode();

  const backgroundStyle = useGradient && backgroundGradient
    ? { background: backgroundGradient }
    : { backgroundColor };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      className="w-full h-full relative overflow-hidden"
      style={{
        ...backgroundStyle,
        padding: `${padding}px`,
        minHeight: "100%",
      }}
    >
      {/* Free-form canvas - children use absolute positioning */}
      {children}
    </div>
  );
}

const ContainerSettings = () => {
  const {
    actions: { setProp },
    backgroundColor,
    backgroundGradient,
    useGradient,
    padding,
  } = useNode((node) => ({
    backgroundColor: node.data.props.backgroundColor,
    backgroundGradient: node.data.props.backgroundGradient,
    useGradient: node.data.props.useGradient,
    padding: node.data.props.padding,
  }));

  const gradientPresets = [
    { name: "Sunset", value: "linear-gradient(135deg, #FF4B6E 0%, #FF8A80 100%)" },
    { name: "Rose", value: "linear-gradient(135deg, #FFF0F3 0%, #FFD6E0 100%)" },
    { name: "Love", value: "linear-gradient(135deg, #FF6B8A 0%, #FF4B6E 50%, #FF8A80 100%)" },
    { name: "Soft Pink", value: "linear-gradient(180deg, #FFFFFF 0%, #FFF0F3 100%)" },
    { name: "Warm", value: "linear-gradient(135deg, #FFF5F5 0%, #FFE0E0 100%)" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Background Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setProp((props: ContainerProps) => (props.useGradient = false))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${!useGradient ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Solid
          </button>
          <button
            onClick={() =>
              setProp((props: ContainerProps) => (props.useGradient = true))
            }
            className={`flex-1 px-3 py-2 text-sm rounded-lg border ${useGradient ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Gradient
          </button>
        </div>
      </div>

      {!useGradient ? (
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Background Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) =>
                setProp(
                  (props: ContainerProps) =>
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
                  (props: ContainerProps) =>
                    (props.backgroundColor = e.target.value)
                )
              }
              className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">
            Gradient Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() =>
                  setProp(
                    (props: ContainerProps) =>
                      (props.backgroundGradient = preset.value)
                  )
                }
                className={`p-3 rounded-lg border text-xs font-medium ${backgroundGradient === preset.value ? "ring-2 ring-primary" : "border-border hover:border-primary/50"}`}
                style={{ background: preset.value }}
              >
                <span className="bg-white/80 px-2 py-0.5 rounded">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">
          Padding: {padding}px
        </label>
        <input
          type="range"
          min={0}
          max={48}
          value={padding}
          onChange={(e) =>
            setProp(
              (props: ContainerProps) => (props.padding = parseInt(e.target.value))
            )
          }
          className="w-full accent-primary"
        />
      </div>
    </div>
  );
};

Container.craft = {
  displayName: "Canvas",
  props: {
    backgroundColor: "#ffffff",
    backgroundGradient: "linear-gradient(180deg, #FFFFFF 0%, #FFF0F3 100%)",
    useGradient: true,
    padding: 24,
  },
  related: {
    settings: ContainerSettings,
  },
  rules: {
    canDrag: () => false,
  },
};

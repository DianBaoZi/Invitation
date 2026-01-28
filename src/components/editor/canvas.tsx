"use client";

import { useEditor, Frame, Element } from "@craftjs/core";
import { useCallback, useEffect } from "react";
import { Container } from "./canvas-elements";

export function Canvas() {
  const { actions, query } = useEditor((state) => {
    const currentNodeId = Array.from(state.events.selected)[0];
    return {
      selected: currentNodeId,
    };
  });

  // Handle delete key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const selectedNodes = query.getEvent("selected").all();
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodes.length > 0) {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== "INPUT" &&
          activeElement?.tagName !== "TEXTAREA" &&
          !activeElement?.getAttribute("contenteditable")
        ) {
          e.preventDefault();
          selectedNodes.forEach((nodeId) => {
            const node = query.node(nodeId);
            if (node.isDeletable()) {
              actions.delete(nodeId);
            }
          });
        }
      }
    },
    [query, actions]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 bg-muted/30 flex items-center justify-center p-8 overflow-auto">
      {/* Canvas Container */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[375px] h-[667px] bg-white rounded-[40px] shadow-2xl border-8 border-gray-800 overflow-hidden relative">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />

          {/* Canvas Content Area - Craft.js Frame */}
          <div className="w-full h-full overflow-y-auto pt-6">
            <Frame>
              <Element
                is={Container}
                canvas
                backgroundColor="#ffffff"
                backgroundGradient="linear-gradient(180deg, #FFFFFF 0%, #FFF0F3 100%)"
                useGradient={true}
                padding={24}
              />
            </Frame>
          </div>
        </div>

        {/* Device Label */}
        <div className="text-center mt-4">
          <span className="text-xs text-muted-foreground">
            iPhone Preview (375 × 667)
          </span>
        </div>
      </div>
    </div>
  );
}

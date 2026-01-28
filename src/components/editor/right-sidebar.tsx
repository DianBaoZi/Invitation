"use client";

import { useEditor } from "@craftjs/core";
import { Settings2, MousePointer, Trash2 } from "lucide-react";

export function RightSidebar() {
  const { selected, actions, query } = useEditor((state) => {
    const currentNodeId = Array.from(state.events.selected)[0];
    let selected;

    if (currentNodeId) {
      const nodeData = state.nodes[currentNodeId];
      selected = {
        id: currentNodeId,
        name: nodeData?.data?.displayName || nodeData?.data?.name,
        settings: nodeData?.related?.settings,
        // We'll check isDeletable using query after the hook
      };
    }

    return {
      selected,
    };
  });

  // Check if the selected node is deletable using query
  const isDeletable = selected ? query.node(selected.id).isDeletable() : false;

  return (
    <aside className="w-[280px] bg-white border-l border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Properties
        </h2>
        {selected && (
          <p className="text-xs text-muted-foreground mt-1">
            Editing: {selected.name}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <div className="p-4">
            {/* Settings Panel */}
            {selected.settings && (
              <selected.settings />
            )}

            {/* Delete Button */}
            {isDeletable && (
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    actions.delete(selected.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Element
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              <MousePointer className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Select an Element</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Click on an element in the canvas to edit its properties
            </p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Press Delete or Backspace to remove the selected element
          </p>
        </div>
      </div>
    </aside>
  );
}

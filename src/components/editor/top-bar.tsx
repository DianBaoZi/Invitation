"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Share2, ChevronLeft, X } from "lucide-react";
import { useState } from "react";
import { PreviewRenderer } from "./preview-renderer";

export function TopBar() {
  const [showPreview, setShowPreview] = useState(false);

  const handlePublish = () => {
    alert("Publishing coming soon! Your invite will get a unique shareable link.");
  };

  return (
    <>
      <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </Link>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-2">
            <input
              type="text"
              defaultValue="My Valentine's Invite"
              className="text-sm font-medium bg-transparent border-none outline-none focus:ring-0 text-foreground"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Share2 className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </header>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setShowPreview(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Preview Phone Frame */}
          <div className="relative">
            <div className="w-[375px] h-[667px] bg-white rounded-[40px] shadow-2xl border-8 border-gray-800 overflow-hidden">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10" />

              {/* Preview Content */}
              <div className="w-full h-full overflow-auto pt-6">
                <PreviewRenderer />
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center mt-6">
              <p className="text-white/80 text-sm">
                Try hovering over the &quot;No&quot; button or clicking &quot;Yes&quot;!
              </p>
              <button
                onClick={() => setShowPreview(false)}
                className="mt-4 px-6 py-2 bg-white text-foreground rounded-full text-sm font-medium hover:bg-muted transition-colors"
              >
                Back to Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

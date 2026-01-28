"use client";

import dynamic from "next/dynamic";
import { Heart } from "lucide-react";

const PreviewRenderer = dynamic(
  () => import("@/components/preview/PreviewRenderer").then((mod) => mod.PreviewRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <Heart className="w-12 h-12 text-pink-500 animate-pulse mx-auto mb-4" fill="#FF4B6E" />
          <p className="text-sm text-gray-600">Loading preview...</p>
        </div>
      </div>
    ),
  }
);

export default function PreviewPage() {
  return <PreviewRenderer />;
}

"use client";

/* eslint-disable @next/next/no-img-element */
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const PreviewRenderer = dynamic(
  () => import("@/components/preview/PreviewRenderer").then((mod) => mod.PreviewRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/logo-with-name.svg" alt="YoursInvite" className="h-32 w-auto" />
        </motion.div>
      </div>
    ),
  }
);

export default function PreviewPage() {
  return <PreviewRenderer />;
}

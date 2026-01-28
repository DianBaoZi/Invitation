"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Template } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/supabase/templates";

interface PreviewModalProps {
  template: Template;
  onClose: () => void;
}

export function PreviewModal({ template, onClose }: PreviewModalProps) {
  const router = useRouter();

  const handleUseTemplate = () => {
    if (template.is_free) {
      router.push("/free");
    } else {
      router.push(`/customize?template=${template.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col bg-black overflow-hidden"
    >
      {/* Top bar - floating over content */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Full-page interactive template iframe */}
      <div className="flex-1 w-full h-full overflow-hidden">
        <iframe
          src={`/test/${template.id}`}
          className="w-full h-full border-0"
          style={{ overflow: "auto" }}
          title={`${template.name} preview`}
          allow="autoplay"
        />
      </div>

      {/* Bottom CTA bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-6">
          <div className="max-w-sm mx-auto">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleUseTemplate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all"
              style={{
                background: template.is_free
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "linear-gradient(135deg, #e11d48, #f43f5e, #fb7185)",
                color: "white",
                boxShadow: template.is_free
                  ? "0 4px 20px rgba(16,185,129,0.4)"
                  : "0 4px 20px rgba(225,29,72,0.4)",
              }}
            >
              {template.is_free
                ? "Create my invite — Free ✨"
                : `Unlock this template · ${formatPrice(template.price_cents)}`}
            </motion.button>

            {template.is_free && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/40 text-xs mt-3 font-medium"
              >
                No sign-up required
              </motion.p>
            )}

            {!template.is_free && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/40 text-xs mt-3"
              >
                One-time payment · Yours forever
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

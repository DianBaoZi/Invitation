"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Copy, Check, X, Link } from "lucide-react";
import { Template } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/supabase/templates";

interface PreviewModalProps {
  template: Template;
  onClose: () => void;
}

export function PreviewModal({ template, onClose }: PreviewModalProps) {
  const router = useRouter();
  const [showFreeShareModal, setShowFreeShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const freeInviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/free`
    : "/free";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(freeInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseTemplate = () => {
    if (template.is_free) {
      setShowFreeShareModal(true);
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

      {/* Bottom CTA bar - pointer-events-none on gradient, auto on button */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-6">
          <div className="max-w-sm mx-auto pointer-events-auto">
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

      {/* Free Template Share Modal */}
      <AnimatePresence>
        {showFreeShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowFreeShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setShowFreeShareModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mb-4"
                >
                  <Link className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your invite is ready! 🎉
                </h3>
                <p className="text-sm text-gray-500">
                  Share this link with your special someone
                </p>
              </div>

              {/* Copy link section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-mono truncate">
                    {freeInviteUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Preview link */}
              <div className="text-center">
                <a
                  href="/free"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Preview your invite →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

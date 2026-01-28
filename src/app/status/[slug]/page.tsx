"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Eye, Clock, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function StatusPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/i/${slug}`;

  // Mock data - will be replaced with real database queries
  const mockStatus = {
    opened: true,
    firstOpenedAt: new Date(2025, 0, 27, 22, 42), // Jan 27, 2025 at 10:42 PM
    totalViews: 3,
  };

  // Calculate expiry date (1 month from now)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Copy link
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full"
      >
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Eye className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Link Status</h1>
        </motion.div>

        {/* Shareable link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-500 mb-2">Your shareable link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <p className="text-sm text-gray-700 truncate">{shareUrl}</p>
            </div>
            <Button
              onClick={handleCopy}
              size="sm"
              className={`shrink-0 h-10 px-3 ${
                copied
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-800 hover:bg-gray-900"
              } text-white`}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className={`p-5 rounded-2xl border-2 ${
            mockStatus.opened
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
          }`}>
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-2xl ${mockStatus.opened ? "" : "grayscale"}`}>
                {mockStatus.opened ? "✅" : "⏳"}
              </span>
              <span className={`text-lg font-semibold ${
                mockStatus.opened ? "text-green-700" : "text-gray-600"
              }`}>
                {mockStatus.opened ? "Opened" : "Not opened yet"}
              </span>
            </div>

            {/* Stats */}
            {mockStatus.opened && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">First opened:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(mockStatus.firstOpenedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Total views:</span>
                  <span className="text-gray-900 font-medium">
                    {mockStatus.totalViews}
                  </span>
                </div>
              </div>
            )}

            {!mockStatus.opened && (
              <p className="text-sm text-gray-500">
                We'll show you when they open your invite
              </p>
            )}
          </div>
        </motion.div>

        {/* Refresh hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh this page to check for updates</span>
        </motion.div>

        {/* Expiry note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6"
        >
          <Calendar className="w-4 h-4" />
          <span>This link expires on {formatDate(expiryDate)}</span>
        </motion.div>

        {/* Create another button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => router.push("/")}
            className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
          >
            <Heart className="w-4 h-4 mr-2" />
            Create another invite
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN EXPORT WITH SUSPENSE
// ============================================

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8 text-gray-400" />
          </motion.div>
        </div>
      }
    >
      <StatusPageContent />
    </Suspense>
  );
}

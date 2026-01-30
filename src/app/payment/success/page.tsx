"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get("slug");
  const [copied, setCopied] = useState(false);

  const shareUrl = slug ? `${window.location.origin}/i/${slug}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Confetti effect on success
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#f472b6", "#f9a8d4", "#fce7f3"],
        });
      });
    }
  }, []);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <p className="text-gray-600">Invalid session</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-green-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your invite is now active for 30 days
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Share this link:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-white px-3 py-2 rounded-lg border truncate">
              {shareUrl}
            </code>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => window.open(shareUrl, "_blank")}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Invite
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex-1"
          >
            Create Another
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-12 h-12 text-pink-500" />
          </motion.div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

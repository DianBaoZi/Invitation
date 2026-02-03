"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Clock, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface InviteStatus {
  id: string;
  slug: string;
  template_id: string;
  creator_name: string | null;
  recipient_name: string | null;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  response: string | null;
  responded_at: string | null;
}

function StatusPageContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<InviteStatus | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/i/${slug}`;

  useEffect(() => {
    loadInviteStatus();
  }, [slug]);

  const loadInviteStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any;

      // Get invite data
      const { data: invite, error: inviteError } = await supabase
        .from("invites")
        .select("id, slug, template_id, creator_name, recipient_name, is_paid, created_at, expires_at, response, responded_at")
        .eq("slug", slug)
        .single();

      if (inviteError || !invite) {
        setError("Invite not found");
        setLoading(false);
        return;
      }

      setStatus(invite);
    } catch (err) {
      console.error("Error loading status:", err);
      setError("Failed to load invite status");
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
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

  // Check if expired
  const isExpired = status?.expires_at ? new Date(status.expires_at) < new Date() : false;
  const hasResponded = status?.response !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-10 h-10 text-pink-400 fill-pink-400" />
        </motion.div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invite Not Found</h1>
          <p className="text-gray-500 mb-6">{error || "This invite doesn't exist or has been deleted."}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Create New Invite
          </Button>
        </motion.div>
      </div>
    );
  }

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
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            hasResponded
              ? "bg-gradient-to-br from-green-100 to-emerald-100"
              : "bg-gradient-to-br from-pink-100 to-rose-100"
          }`}>
            <Heart className={`w-8 h-8 ${hasResponded ? "text-green-500 fill-green-500" : "text-pink-400"}`} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {hasResponded ? "They said Yes!" : "Waiting for response..."}
          </h1>
          {status.recipient_name && (
            <p className="text-gray-500 mt-1">For {status.recipient_name}</p>
          )}
        </motion.div>

        {/* Response status card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className={`p-5 rounded-2xl border-2 ${
            isExpired
              ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
              : hasResponded
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200"
          }`}>
            {hasResponded ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="text-4xl mb-3"
                >
                  💕
                </motion.div>
                <p className="text-green-700 font-semibold text-lg mb-2">
                  {status.response}
                </p>
                {status.responded_at && (
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatDateTime(status.responded_at)}</span>
                  </div>
                )}
              </div>
            ) : isExpired ? (
              <div className="text-center">
                <span className="text-3xl mb-2 block">⏰</span>
                <p className="text-red-600 font-medium">
                  This invite has expired
                </p>
              </div>
            ) : (
              <div className="text-center">
                <motion.span
                  className="text-3xl mb-2 block"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💌
                </motion.span>
                <p className="text-pink-600 font-medium">
                  Waiting for them to open your invite
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Shareable link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Refresh button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Button
            onClick={loadInviteStatus}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>

        {/* Expiry note */}
        {!isExpired && status.expires_at && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6"
          >
            <Calendar className="w-4 h-4" />
            <span>Expires on {formatDate(status.expires_at)}</span>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
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
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-10 h-10 text-pink-400 fill-pink-400" />
          </motion.div>
        </div>
      }
    >
      <StatusPageContent />
    </Suspense>
  );
}

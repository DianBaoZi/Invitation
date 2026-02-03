"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Eye, Clock, Calendar, RefreshCw, AlertCircle } from "lucide-react";
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
  view_count: number;
  first_viewed_at: string | null;
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

      // Get view count
      const { count: viewCount } = await supabase
        .from("invite_views")
        .select("*", { count: "exact", head: true })
        .eq("invite_id", invite.id);

      // Get first view timestamp
      const { data: firstView } = await supabase
        .from("invite_views")
        .select("viewed_at")
        .eq("invite_id", invite.id)
        .order("viewed_at", { ascending: true })
        .limit(1)
        .single();

      setStatus({
        ...invite,
        view_count: viewCount || 0,
        first_viewed_at: firstView?.viewed_at || null,
      });
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
  const hasBeenViewed = status && status.view_count > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-gray-400" />
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
          <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Eye className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Link Status</h1>
          {status.recipient_name && (
            <p className="text-gray-500 mt-1">For {status.recipient_name}</p>
          )}
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
            isExpired
              ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
              : hasBeenViewed
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
              : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
          }`}>
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-2xl`}>
                {isExpired ? "⏰" : hasBeenViewed ? "✅" : "⏳"}
              </span>
              <span className={`text-lg font-semibold ${
                isExpired
                  ? "text-red-700"
                  : hasBeenViewed
                  ? "text-green-700"
                  : "text-gray-600"
              }`}>
                {isExpired ? "Expired" : hasBeenViewed ? "Opened" : "Not opened yet"}
              </span>
            </div>

            {/* Stats */}
            {hasBeenViewed && (
              <div className="space-y-3">
                {status.first_viewed_at && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">First opened:</span>
                    <span className="text-gray-900 font-medium">
                      {formatDateTime(status.first_viewed_at)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Total views:</span>
                  <span className="text-gray-900 font-medium">
                    {status.view_count}
                  </span>
                </div>
                {status.response && (
                  <div className="flex items-center gap-3 text-sm pt-2 border-t border-gray-200">
                    <Heart className={`w-4 h-4 ${status.response.toLowerCase().includes('yes') ? 'text-green-500 fill-green-500' : 'text-gray-400'}`} />
                    <span className="text-gray-600">Response:</span>
                    <span className={`font-semibold ${status.response.toLowerCase().includes('yes') ? 'text-green-600' : 'text-gray-600'}`}>
                      {status.response}
                    </span>
                    {status.responded_at && (
                      <span className="text-gray-400 text-xs">
                        ({formatDateTime(status.responded_at)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {!hasBeenViewed && !isExpired && (
              <p className="text-sm text-gray-500">
                We'll show you when they open your invite
              </p>
            )}

            {isExpired && (
              <p className="text-sm text-red-600">
                This invite has expired and is no longer accessible
              </p>
            )}
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
            Refresh status
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
            onClick={() => window.open(`/i/${slug}`, "_blank")}
            variant="outline"
            className="w-full h-12 text-base font-medium rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Invite
          </Button>
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

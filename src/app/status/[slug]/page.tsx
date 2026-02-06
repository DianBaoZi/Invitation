"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Eye, Clock, Calendar, RefreshCw, AlertCircle, ArrowLeft, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
/* eslint-disable @next/next/no-img-element */

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
  const hasResponse = status?.response;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/logo-with-name.svg" alt="YoursInvite" className="h-20 w-auto" />
        </motion.div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-rose-200/30 border border-rose-100 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-rose-100 to-red-100 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Invite Not Found</h1>
          <p className="text-gray-500 mb-8">{error || "This invite doesn't exist or has been deleted."}</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white h-12 px-8 rounded-xl shadow-lg shadow-rose-200/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4 py-8 sm:py-12">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </motion.button>

        {/* Main card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-rose-200/30 border border-rose-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiIGN4PSIyMCIgY3k9IjIwIiByPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Invite Status</h1>
                  {status.recipient_name && (
                    <p className="text-white/80 text-sm">For {status.recipient_name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Shareable link */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Share this link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 overflow-hidden">
                  <p className="text-sm text-gray-700 truncate font-mono">{shareUrl}</p>
                </div>
                <Button
                  onClick={handleCopy}
                  className={`shrink-0 h-12 w-12 rounded-xl transition-all ${
                    copied
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  } text-white shadow-lg`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Status cards */}
            <div className="grid gap-4">
              {/* Opened status card */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                isExpired
                  ? "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                  : hasBeenViewed
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                  : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isExpired
                        ? "bg-gray-100"
                        : hasBeenViewed
                        ? "bg-emerald-100"
                        : "bg-amber-100"
                    }`}>
                      {isExpired ? (
                        <Clock className="w-5 h-5 text-gray-500" />
                      ) : hasBeenViewed ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {isExpired ? "Expired" : hasBeenViewed ? "Opened" : "Waiting"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isExpired
                          ? "Link no longer active"
                          : hasBeenViewed
                          ? `Viewed ${status.view_count} time${status.view_count > 1 ? 's' : ''}`
                          : "Not opened yet"
                        }
                      </p>
                    </div>
                  </div>
                  {hasBeenViewed && status.first_viewed_at && (
                    <span className="text-xs text-gray-400 text-right">
                      First opened<br/>{formatDateTime(status.first_viewed_at)}
                    </span>
                  )}
                </div>
              </div>

              {/* RSVP status card */}
              <div className={`p-5 rounded-2xl border-2 transition-all ${
                hasResponse
                  ? status.response?.toLowerCase().includes('yes')
                    ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"
                    : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                  : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      hasResponse
                        ? status.response?.toLowerCase().includes('yes')
                          ? "bg-rose-100"
                          : "bg-gray-100"
                        : "bg-purple-100"
                    }`}>
                      {hasResponse ? (
                        <Heart className={`w-5 h-5 ${
                          status.response?.toLowerCase().includes('yes')
                            ? "text-rose-500 fill-rose-500"
                            : "text-gray-500"
                        }`} />
                      ) : (
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {hasResponse ? "Response Received" : "Awaiting RSVP"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {hasResponse
                          ? status.response
                          : "No response yet"
                        }
                      </p>
                    </div>
                  </div>
                  {hasResponse && status.responded_at && (
                    <span className="text-xs text-gray-400 text-right">
                      {formatDateTime(status.responded_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expiry info */}
            {!isExpired && status.expires_at && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-2">
                <Calendar className="w-4 h-4" />
                <span>Expires on {formatDate(status.expires_at)}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={loadInviteStatus}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => window.open(`/i/${slug}`, "_blank")}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-200/50 font-medium"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-400 mt-6"
        >
          Share the link and wait for the magic ✨
        </motion.p>
      </div>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/logo-with-name.svg" alt="YoursInvite" className="h-[80vh] w-auto" />
          </motion.div>
        </div>
      }
    >
      <StatusPageContent />
    </Suspense>
  );
}

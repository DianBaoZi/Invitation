"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  Copy,
  Check,
  Clock,
  Calendar,
  RefreshCw,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const shareUrl = `${baseUrl}/i/${slug}`;

  useEffect(() => {
    loadInviteStatus();
  }, [slug]);

  const loadInviteStatus = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = createClient() as any;

      const { data: invite, error: inviteError } = await supabase
        .from("invites")
        .select(
          "id, slug, template_id, creator_name, recipient_name, is_paid, created_at, expires_at, response, responded_at"
        )
        .eq("slug", slug)
        .single();

      if (inviteError || !invite) {
        setError("Invite not found");
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      setStatus(invite);
    } catch (err) {
      console.error("Error loading status:", err);
      setError("Failed to load invite status");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = status?.expires_at
    ? new Date(status.expires_at) < new Date()
    : false;
  const hasResponded = status?.response !== null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfa]">
        <div
          className="fixed inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcfa] p-4">
        <div
          className="fixed inset-0 opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100/50 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 mx-auto mb-5 bg-rose-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h1
            className="text-2xl text-stone-800 mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Invite Not Found
          </h1>
          <p
            className="text-stone-500 mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {error || "This invite doesn't exist or has been deleted."}
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfa] relative overflow-hidden">
      {/* Paper texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-rose-50/40 via-transparent to-stone-50/30 pointer-events-none" />

      {/* Floating decorative elements */}
      <motion.div
        className="fixed top-20 left-[10%] text-rose-200/30 pointer-events-none"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-12 h-12 fill-current" />
      </motion.div>
      <motion.div
        className="fixed bottom-32 right-[8%] text-rose-200/20 pointer-events-none"
        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Heart className="w-16 h-16 fill-current" />
      </motion.div>
      <motion.div
        className="fixed top-1/3 right-[15%] text-amber-200/25 pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.35, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/dashboard")}
          className="absolute top-6 left-6 flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-md"
        >
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-rose-100/50 border border-rose-100/30 overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-1.5 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200" />

            <div className="p-8">
              {/* Title section */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center ${
                    hasResponded
                      ? "bg-gradient-to-br from-emerald-50 to-green-100 shadow-lg shadow-emerald-100/50"
                      : "bg-gradient-to-br from-rose-50 to-pink-100 shadow-lg shadow-rose-100/50"
                  }`}
                >
                  <Heart
                    className={`w-9 h-9 ${
                      hasResponded
                        ? "text-emerald-500 fill-emerald-500"
                        : "text-rose-400 fill-rose-400"
                    }`}
                  />
                </motion.div>

                <p
                  className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Invitation Status
                </p>

                <h1
                  className="text-3xl text-stone-800 mb-1"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 500,
                  }}
                >
                  {hasResponded ? "They Said Yes!" : "Awaiting Response"}
                </h1>

                {status.recipient_name && (
                  <p
                    className="text-stone-500 text-lg"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    for {status.recipient_name}
                  </p>
                )}
              </motion.div>

              {/* RSVP Status Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-8"
              >
                <div
                  className={`relative p-6 rounded-2xl transition-all ${
                    hasResponded
                      ? "bg-gradient-to-br from-emerald-50/80 to-green-50/80 border border-emerald-200/50"
                      : "bg-gradient-to-br from-stone-50/80 to-slate-50/80 border border-stone-200/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                        hasResponded
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          hasResponded ? "fill-current" : ""
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-medium block mb-1 ${
                          hasResponded ? "text-emerald-700" : "text-stone-600"
                        }`}
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.25rem",
                        }}
                      >
                        {hasResponded
                          ? "They clicked Yes! 💕"
                          : "Not clicked Yes yet"}
                      </span>
                      <p
                        className={`text-sm ${
                          hasResponded ? "text-emerald-600/70" : "text-stone-400"
                        }`}
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        {hasResponded && status.responded_at ? (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Responded on {formatDateTime(status.responded_at)}
                          </span>
                        ) : (
                          "Waiting for their answer..."
                        )}
                      </p>
                    </div>
                    {hasResponded && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Expired warning */}
              {isExpired && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⏰</span>
                    <div>
                      <p
                        className="font-medium text-amber-700"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        Invite Expired
                      </p>
                      <p
                        className="text-sm text-amber-600/70"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}
                      >
                        This invitation is no longer active
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Shareable link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-6"
              >
                <p
                  className="text-xs tracking-[0.15em] uppercase text-stone-400 mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Shareable Link
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/50 overflow-hidden">
                    <p
                      className="text-sm text-stone-600 truncate"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {shareUrl}
                    </p>
                  </div>
                  <Button
                    onClick={handleCopy}
                    size="sm"
                    className={`shrink-0 h-11 w-11 p-0 rounded-xl transition-all ${
                      copied
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : "bg-stone-800 hover:bg-stone-900"
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

              {/* Refresh & Expiry */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between mb-8"
              >
                <button
                  onClick={() => loadInviteStatus(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm">Refresh</span>
                </button>

                {!isExpired && status.expires_at && (
                  <div
                    className="flex items-center gap-1.5 text-sm text-stone-400"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Expires {formatDate(status.expires_at)}</span>
                  </div>
                )}
              </motion.div>

              {/* Action button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full h-12 text-base rounded-full bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white shadow-lg shadow-rose-200/50 transition-all hover:shadow-xl hover:shadow-rose-200/60"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Decorative flourish */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <span className="block h-px w-12 bg-gradient-to-r from-transparent to-rose-200" />
            <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            <span className="block h-px w-12 bg-gradient-to-l from-transparent to-rose-200" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfcfa]">
          <div
            className="fixed inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
          </motion.div>
        </div>
      }
    >
      <StatusPageContent />
    </Suspense>
  );
}

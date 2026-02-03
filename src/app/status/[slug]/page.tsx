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
  ArrowLeft,
  Mail,
  Sparkle,
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5]">
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5] p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white rounded-2xl shadow-2xl shadow-stone-200/50 p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-rose-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1
            className="text-3xl text-stone-800 mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Not Found
          </h1>
          <p
            className="text-stone-500 mb-8 text-lg"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {error || "This invite doesn't exist or has been deleted."}
          </p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8 h-12"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[200vh] bg-[#FAF7F5] relative">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-rose-50/40 via-transparent to-amber-50/20 pointer-events-none" />

      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[8%] w-2 h-2 rounded-full bg-rose-300/40"
          animate={{ y: [0, -20, 0], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[25%] right-[12%] w-3 h-3 rounded-full bg-amber-300/30"
          animate={{ y: [0, 15, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[15%] w-1.5 h-1.5 rounded-full bg-pink-400/30"
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.4, 0.3] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Fixed header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span
              className="text-sm tracking-wide"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Dashboard
            </span>
          </button>

          <button
            onClick={() => loadInviteStatus(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 text-stone-400 hover:text-stone-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span
              className="text-sm"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Refresh
            </span>
          </button>
        </div>
      </motion.header>

      {/* Hero section - requires scroll */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className={`w-28 h-28 mx-auto mb-8 rounded-full flex items-center justify-center shadow-2xl ${
              hasResponded
                ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-200/50"
                : "bg-gradient-to-br from-rose-400 to-pink-500 shadow-rose-200/50"
            }`}
          >
            <Heart
              className={`w-14 h-14 ${
                hasResponded ? "text-white fill-white" : "text-white fill-white"
              }`}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-stone-400 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Invitation Status
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-5xl md:text-6xl text-stone-800 mb-4"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            {hasResponded ? (
              <>
                They Said <span className="italic text-emerald-600">Yes</span>
              </>
            ) : (
              <>
                Waiting for <span className="italic text-rose-500">Love</span>
              </>
            )}
          </motion.h1>

          {status.recipient_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-stone-500"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              An invitation for{" "}
              <span className="text-stone-700 font-medium">
                {status.recipient_name}
              </span>
            </motion.p>
          )}

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-stone-400"
            >
              <span
                className="text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Scroll for details
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-60"
              >
                <path
                  d="M12 5v14M5 12l7 7 7-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Status cards section */}
      <div className="relative z-10 px-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* RSVP Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div
              className={`relative overflow-hidden rounded-3xl p-8 ${
                hasResponded
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl shadow-emerald-100/40"
                  : "bg-white shadow-xl shadow-stone-200/30"
              }`}
            >
              {/* Decorative corner */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${
                  hasResponded ? "bg-emerald-100/50" : "bg-rose-50"
                } rounded-bl-[100px]`}
              />

              {hasResponded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-4 right-4"
                >
                  <Sparkle className="w-5 h-5 text-amber-400 fill-amber-400" />
                </motion.div>
              )}

              <div className="relative flex items-start gap-5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                    hasResponded
                      ? "bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-200/50"
                      : "bg-gradient-to-br from-rose-300 to-pink-400 shadow-lg shadow-rose-200/50"
                  }`}
                >
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className="text-2xl text-stone-800"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      {hasResponded ? "They Said Yes! 💕" : "Awaiting Response"}
                    </h3>
                    {hasResponded && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  <p
                    className={`text-base ${
                      hasResponded ? "text-emerald-600" : "text-stone-400"
                    }`}
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    {hasResponded && status.responded_at ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Responded on {formatDateTime(status.responded_at)}
                      </span>
                    ) : (
                      "Waiting for their heartfelt answer..."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Expired warning */}
          {isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="rounded-3xl p-8 bg-amber-50 shadow-xl shadow-amber-100/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <div>
                    <h3
                      className="text-xl text-amber-800 mb-1"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                      }}
                    >
                      Invitation Expired
                    </h3>
                    <p
                      className="text-amber-600"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      This invitation is no longer active
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Share Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="rounded-3xl p-8 bg-white shadow-xl shadow-stone-200/30">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3
                    className="text-lg text-stone-800"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    Share Your Invitation
                  </h3>
                  <p
                    className="text-sm text-stone-400"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                    }}
                  >
                    Copy the link and send it to your special someone
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-4 bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden">
                  <p
                    className="text-sm text-stone-600 truncate font-mono"
                  >
                    {shareUrl}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  className={`shrink-0 h-14 w-14 p-0 rounded-2xl transition-all ${
                    copied
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200/50"
                      : "bg-stone-900 hover:bg-stone-800 shadow-lg shadow-stone-300/50"
                  } text-white`}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {!isExpired && status.expires_at && (
                <div
                  className="flex items-center gap-2 mt-5 pt-5 border-t border-stone-100 text-sm text-stone-400"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Valid until {formatDate(status.expires_at)}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="pt-6"
          >
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full h-14 text-base rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-xl shadow-rose-200/40 transition-all hover:shadow-2xl hover:shadow-rose-200/50"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: "0.05em",
                fontSize: "1.1rem",
              }}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </motion.div>

          {/* Decorative flourish */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 pt-8"
          >
            <span className="block h-px w-16 bg-gradient-to-r from-transparent to-rose-200" />
            <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
            <span className="block h-px w-16 bg-gradient-to-l from-transparent to-rose-200" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F5]">
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

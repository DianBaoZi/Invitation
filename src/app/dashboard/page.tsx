"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, ExternalLink, Copy, CheckCircle, Trash2, BarChart3, AlertTriangle, X, Mail, Crown, Check, Square, CheckSquare } from "lucide-react";
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { getTemplateById } from "@/lib/supabase/templates";
import type { User } from "@supabase/supabase-js";

interface InviteData {
  id: string;
  slug: string;
  template_id: string;
  creator_name: string | null;
  recipient_name: string | null;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [invites, setInvites] = useState<InviteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; inviteIds: string[]; inviteCount: number }>({
    isOpen: false,
    inviteIds: [],
    inviteCount: 0,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check auth state
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      loadInvites(user.id);

      // Check premium status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: purchases } = await (supabase as any)
        .from("purchases")
        .select("id")
        .eq("email", user.email)
        .eq("product_type", "premium")
        .limit(1);

      if (purchases && purchases.length > 0) {
        setIsPremium(true);
      }
    });
  }, [router]);

  const loadInvites = async (userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    const { data: invitesData, error } = await supabase
      .from("invites")
      .select(`
        id,
        slug,
        template_id,
        creator_name,
        recipient_name,
        is_paid,
        created_at,
        expires_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading invites:", error);
      setLoading(false);
      return;
    }

    setInvites((invitesData || []) as InviteData[]);
    setLoading(false);
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/i/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(invites.map((i) => i.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const openDeleteModal = (ids: string[]) => {
    setDeleteModal({ isOpen: true, inviteIds: ids, inviteCount: ids.length });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, inviteIds: [], inviteCount: 0 });
  };

  const confirmDelete = async () => {
    if (deleteModal.inviteIds.length === 0) return;

    setIsDeleting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;

    // Delete all selected invites
    const { error } = await supabase
      .from("invites")
      .delete()
      .in("id", deleteModal.inviteIds);

    setIsDeleting(false);
    closeDeleteModal();
    setSelectedIds(new Set());

    if (!error && user) {
      loadInvites(user.id);
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/logo-with-name.svg" alt="YoursInvite" className="h-[80vh] w-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 pt-36 sm:pt-40">
        {/* Premium Badge */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm">Premium Member</span>
              <span className="text-white/80 text-xs">• All Templates Unlocked</span>
            </div>
          </motion.div>
        )}

        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Invite
          </Button>
        </motion.div>

        {/* Selection Bar */}
        <AnimatePresence>
          {invites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectedIds.size === invites.length ? clearSelection : selectAll}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                  >
                    {selectedIds.size === invites.length ? (
                      <CheckSquare className="w-5 h-5 text-pink-500" />
                    ) : selectedIds.size > 0 ? (
                      <div className="w-5 h-5 rounded border-2 border-pink-500 bg-pink-50 flex items-center justify-center">
                        <div className="w-2 h-0.5 bg-pink-500" />
                      </div>
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {selectedIds.size === 0
                        ? "Select All"
                        : selectedIds.size === invites.length
                        ? "Deselect All"
                        : `${selectedIds.size} selected`}
                    </span>
                  </button>
                  {selectedIds.size > 0 && (
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-500 hover:text-gray-700 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {selectedIds.size > 0 && (
                  <Button
                    onClick={() => openDeleteModal(Array.from(selectedIds))}
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete {selectedIds.size} {selectedIds.size === 1 ? "invite" : "invites"}
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invites Grid */}
        {invites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Mail className="w-16 h-16 text-pink-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No invites yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first Valentine&apos;s invite to get started
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
            >
              Create Your First Invite
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {invites.map((invite, index) => {
              const template = getTemplateById(invite.template_id);
              const expired = isExpired(invite.expires_at);

              return (
                <motion.div
                  key={invite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/status/${invite.slug}`)}
                  className={`bg-white rounded-2xl shadow-sm border p-5 cursor-pointer hover:shadow-md transition-all ${
                    selectedIds.has(invite.id) ? "border-pink-400 ring-2 ring-pink-100" : "hover:border-pink-200"
                  } ${expired ? "opacity-60" : ""}`}
                >
                  {/* Template Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={(e) => toggleSelect(invite.id, e)}
                        className="flex-shrink-0"
                      >
                        {selectedIds.has(invite.id) ? (
                          <div className="w-6 h-6 rounded-md bg-pink-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md border-2 border-gray-300 hover:border-pink-400 transition" />
                        )}
                      </button>
                      <span className="text-2xl">{template?.emoji || "💌"}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {template?.name || invite.template_id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {invite.recipient_name
                            ? `For ${invite.recipient_name}`
                            : `From ${invite.creator_name || "Anonymous"}`}
                        </p>
                      </div>
                    </div>
                    {expired && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        Expired
                      </span>
                    )}
                    {invite.is_paid && !expired && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(invite.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      onClick={() => handleCopyLink(invite.slug)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {copiedSlug === invite.slug ? (
                        <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {copiedSlug === invite.slug ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                      onClick={() => router.push(`/status/${invite.slug}`)}
                      variant="outline"
                      size="sm"
                      title="View Status"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => window.open(`/i/${invite.slug}`, "_blank")}
                      variant="outline"
                      size="sm"
                      title="Preview Invite"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => openDeleteModal([invite.id])}
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeDeleteModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Close button */}
              <button
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-6 pt-8 text-center">
                {/* Warning icon */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Delete {deleteModal.inviteCount === 1 ? "this invite" : `${deleteModal.inviteCount} invites`}?
                </h3>
                <p className="text-gray-600 mb-2">
                  {deleteModal.inviteCount === 1
                    ? "You're about to delete this invite."
                    : `You're about to delete ${deleteModal.inviteCount} invites at once.`}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  This action cannot be undone. {deleteModal.inviteCount === 1 ? "The invite link" : "All invite links"} will stop working.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={closeDeleteModal}
                    variant="outline"
                    className="flex-1 h-11 rounded-xl"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isDeleting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

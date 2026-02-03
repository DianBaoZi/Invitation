"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Calendar, ExternalLink, Copy, CheckCircle, LogOut, Trash2, BarChart3, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; inviteId: string | null; inviteName: string }>({
    isOpen: false,
    inviteId: null,
    inviteName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      loadInvites(user.id);
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/i/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const openDeleteModal = (id: string, templateName: string) => {
    setDeleteModal({ isOpen: true, inviteId: id, inviteName: templateName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, inviteId: null, inviteName: "" });
  };

  const confirmDelete = async () => {
    if (!deleteModal.inviteId) return;

    setIsDeleting(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any;
    const { error } = await supabase.from("invites").delete().eq("id", deleteModal.inviteId);

    setIsDeleting(false);
    closeDeleteModal();

    if (!error && user) {
      loadInvites(user.id);
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Heart className="w-7 h-7 text-pink-500 fill-pink-500" />
            <span className="font-bold text-lg text-gray-900">Invitely</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.email}
            </span>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {/* Invites Grid */}
        {invites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-pink-200 mx-auto mb-4" />
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
                  className={`bg-white rounded-2xl shadow-sm border p-5 ${
                    expired ? "opacity-60" : ""
                  }`}
                >
                  {/* Template Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
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
                  <div className="flex items-center gap-2">
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
                      onClick={() => openDeleteModal(invite.id, template?.name || invite.template_id)}
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
                  Delete this invite?
                </h3>
                <p className="text-gray-600 mb-2">
                  You&apos;re about to delete your{" "}
                  <span className="font-medium text-gray-800">{deleteModal.inviteName}</span> invite.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  This action cannot be undone. The invite link will stop working.
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

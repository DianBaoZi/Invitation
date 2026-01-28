// ============================================
// DEVELOPMENT STORE
// ============================================
// This is a temporary in-memory store for development.
// IMPORTANT: This will reset when the server restarts.
// In production, replace all usages with Supabase queries.

import { Invite } from "./types";

// Global store that persists across route handlers
// (within the same server process)
const globalStore = globalThis as unknown as {
  invitesStore: Map<string, Invite> | undefined;
};

export const invitesStore: Map<string, Invite> =
  globalStore.invitesStore || new Map<string, Invite>();

if (!globalStore.invitesStore) {
  globalStore.invitesStore = invitesStore;
}

// ============================================
// STORE OPERATIONS
// ============================================

export function saveInvite(invite: Invite): void {
  // Store by both slug and id for easy lookup
  invitesStore.set(invite.slug, invite);
  invitesStore.set(invite.id, invite);
}

export function getInviteBySlug(slug: string): Invite | undefined {
  return invitesStore.get(slug);
}

export function getInviteById(id: string): Invite | undefined {
  return invitesStore.get(id);
}

export function getInviteCount(): number {
  // Since we store by both slug and id, divide by 2
  return Math.floor(invitesStore.size / 2);
}

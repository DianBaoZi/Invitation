"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User, Crown } from "lucide-react";
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  // Check premium status via API (bypasses RLS)
  const checkPremiumStatus = async () => {
    try {
      const response = await fetch("/api/premium-status");
      const data = await response.json();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error("Premium check failed:", error);
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth changes FIRST (catches OAuth redirects)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Check premium status when user changes
      if (session?.user) {
        checkPremiumStatus();
      } else {
        setIsPremium(false);
      }
    });

    // Then get initial session (use getSession for faster local check)
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);

        // Check premium status
        if (session?.user) {
          checkPremiumStatus();
        }
      })
      .catch((error) => {
        console.error("Auth check failed:", error);
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // Get user's display name or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="w-full px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Logo - centered on desktop, left-aligned on mobile */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 hover:opacity-80 transition select-none caret-transparent focus:outline-none sm:ml-[130px]"
        >
          <img
            src="/logo.svg"
            alt="YoursInvite"
            className="h-20 sm:h-28 w-auto"
          />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <>
              {/* Dashboard link */}
              <Button
                onClick={() => router.push("/dashboard")}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all hidden sm:flex"
              >
                Dashboard
              </Button>

              {/* User info */}
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 hover:opacity-80 transition select-none caret-transparent focus:outline-none"
              >
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className={`w-8 h-8 rounded-full border-2 ${isPremium ? "border-amber-400" : "border-pink-200"}`}
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPremium ? "bg-gradient-to-br from-amber-400 to-yellow-500" : "bg-gradient-to-br from-pink-400 to-rose-400"}`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center gap-1.5">
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  {isPremium && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>
              </button>

              {/* Sign out */}
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

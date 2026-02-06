"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Heart } from "lucide-react";

// Redirect signup to login since we're using OAuth only
export default function SignUpPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl mb-6"
        >
          💌
        </motion.div>

        <h1
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          404
        </h1>

        <h2
          className="text-2xl text-stone-700 mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Page Not Found
        </h2>

        <p
          className="text-stone-500 mb-8"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px" }}
        >
          Oops! This invitation must have gotten lost in the mail.
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

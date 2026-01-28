"use client";

import { motion } from "framer-motion";
import { Template } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/supabase/templates";

interface TemplateCardProps {
  template: Template;
  index: number;
  onClick: () => void;
}

export function TemplateCard({ template, index, onClick }: TemplateCardProps) {
  const delay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className="relative w-[240px] bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Preview area */}
        <div className="h-[180px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100">
          <span className="text-6xl">{template.emoji}</span>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {template.name}
            </h3>
            {template.is_free ? (
              <span className="shrink-0 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                Free
              </span>
            ) : (
              <span className="shrink-0 px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {formatPrice(template.price_cents)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

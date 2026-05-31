"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded?: boolean;
  onToggle: () => void;
}

export default function FAQItem({
  question,
  answer,
  isExpanded = false,
  onToggle,
}: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="border border-gray-200 rounded-lg mb-3 bg-white"
    >
      <button
        className="flex items-center justify-between w-full text-left p-4 hover:bg-gray-50 transition-colors duration-200"
        onClick={onToggle}
      >
        <span className="text-sm font-inter text-[#444444] pr-4 font-medium">
          {question}
        </span>
        <div className="flex-shrink-0">
          {isExpanded ? (
            <Minus className="w-4 h-4 text-gray-600 transition-transform duration-200" />
          ) : (
            <Plus className="w-4 h-4 text-gray-600 transition-transform duration-200" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="text-sm pt-4 font-inter text-[#444] leading-relaxed">
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

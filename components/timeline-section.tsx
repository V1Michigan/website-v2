"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TimelineSectionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
}

export default function TimelineSection({
  title,
  children,
}: TimelineSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dotTopPx, setDotTopPx] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !containerRef.current) return;

      const sectionEl = sectionRef.current;
      const containerEl = containerRef.current;

      const sectionRect = sectionEl.getBoundingClientRect();
      const sectionTopDoc = sectionRect.top + window.scrollY;
      const sectionHeight = sectionEl.offsetHeight || 1;

      const scrolledWithinSection = window.scrollY - sectionTopDoc;
      const progress = Math.min(
        1,
        Math.max(0, scrolledWithinSection / sectionHeight)
      );

      const containerHeight = containerEl.offsetHeight || sectionHeight;
      const dotHeight = 16; // matches h-4
      const topPx = progress * (containerHeight - dotHeight);
      setDotTopPx(topPx);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8 snap-start"
    >
      <div ref={containerRef} className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-[#F5A623]"
            style={{ top: dotTopPx }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(245,166,35,0.6)",
                "0 0 0 8px rgba(245,166,35,0)",
              ],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            aria-hidden
          />
        </div>

        <div className="ml-8 md:ml-10">
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-serif font-light mb-6"
          >
            {title}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

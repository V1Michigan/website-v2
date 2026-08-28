"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";

const LINKS = [
  { label: "Website", href: "https://v1michigan.com/" },
  { label: "Instagram", href: "https://www.instagram.com/v1michigan/" },
  { label: "LinkedIn", href: "https://linkedin.com/company/v1-michigan" },
  { label: "X", href: "https://x.com/V1Michigan" },
  { label: "Substack", href: "https://v1network.substack.com/" },
] as const;

export default function JoinSocialBar() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const opacity = useTransform(scrollYProgress, [0.94, 0.985], [0, 1]);
  const y = useTransform(scrollYProgress, [0.94, 0.985], [32, 0]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setIsVisible(progress >= 0.94);
  });

  return (
    <motion.aside
      aria-label="V1 social links"
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-[100] w-full bg-black px-4 pb-[calc(1.75rem+env(safe-area-inset-bottom))] pt-7 sm:px-6 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-8 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ opacity, y }}
    >
      <nav className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isVisible ? undefined : -1}
            className="font-mona text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-70 sm:text-[0.75rem]"
          >
            {label}
          </a>
        ))}
      </nav>
    </motion.aside>
  );
}

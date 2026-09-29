"use client";

import { useRef } from "react";

interface StartupCardProps {
  image: string;
  name: string;
  domain: string;
  website: string;
}

export default function StartupCard({ image, name, domain, website }: StartupCardProps) {
  const glareRef = useRef<HTMLSpanElement>(null);

  function sweepGlare(card: HTMLAnchorElement) {
    const glare = glareRef.current;
    if (!glare || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = card.getBoundingClientRect();
    const angle = Math.atan2(bounds.height, bounds.width);
    const distance = Math.hypot(bounds.width, bounds.height);
    const transform = (offset: number) =>
      `translate(-50%, -50%) rotate(${angle}rad) translateX(${offset}px)`;

    glare.getAnimations().forEach((animation) => animation.cancel());
    glare.animate(
      [
        { transform: transform(-distance), opacity: 0 },
        { opacity: 0.65, offset: 0.3 },
        { opacity: 0.65, offset: 0.7 },
        { transform: transform(distance), opacity: 0 },
      ],
      { duration: 800, easing: "ease-out" },
    );
  }

  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${name} website (opens in a new tab)`}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") {
          sweepGlare(event.currentTarget);
        }
      }}
      onFocus={(event) => {
        if (event.currentTarget.matches(":focus-visible")) sweepGlare(event.currentTarget);
      }}
      className="group relative isolate block overflow-hidden bg-white/10 rounded-xl p-3 md:p-4 text-center w-full h-32 md:h-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E5AC61]"
    >
      <span
        ref={glareRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[300%] w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
      />
      <div className={`w-12 h-12 md:w-20 md:h-20 rounded-lg overflow-hidden mb-2 mt-2 lg:mt-0 md:mb-3 mx-auto flex items-center justify-center ${name === "Forus" ? "bg-white" : ""}`}>
        {image ? (
          <img
            src={image}
            alt={`${name} logo`}
            className={`w-full h-full object-contain ${name === "Forus" ? "p-1" : ""}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-400 rounded-lg"></div>
        )}
      </div>
      <div className="text-[11px] md:text-xs font-medium font-inter text-[#FEF9F5] mb-1 leading-tight">
        {name}
      </div>
      <div className="text-[9px] md:text-[10px] font-medium font-inter text-[#CEC9C5] leading-tight">
        {domain}
      </div>
    </a>
  );
}

"use client";

import React, { useEffect, useState } from "react";

interface TimelineRailProps {
  sectionRefs: React.RefObject<HTMLElement>[];
}

export default function TimelineRail({ sectionRefs }: TimelineRailProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [filledDotTop, setFilledDotTop] = useState(0);
  const [railLeft, setRailLeft] = useState<number>(64); // default ~4rem
  const [markerTops, setMarkerTops] = useState<number[]>([]);

  // Calculate positions of empty circles based on section title positions
  const computeLayout = () => {
    const positions: number[] = [];
    // Align rail with the left edge of the first section container
    const first = sectionRefs[0]?.current;
    if (first) {
      const left = first.getBoundingClientRect().left;
      setRailLeft(left);
    }

    sectionRefs.forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const titleEl = el.querySelector("h2");
      if (!titleEl) return;
      const titleRect = titleEl.getBoundingClientRect();
      // Use viewport-relative top for fixed container
      positions.push(titleRect.top);
    });
    setMarkerTops(positions);
  };

  useEffect(() => {
    const update = () => {
      if (sectionRefs.length === 0) return;

      // Determine which section is most visible in viewport
      const viewportTop = window.scrollY;
      const viewportBottom = viewportTop + window.innerHeight;

      let closestIdx = 0;
      let maxVisibility = 0;

      sectionRefs.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        // Calculate how much of the section is visible
        const visibleTop = Math.max(viewportTop, sectionTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          closestIdx = idx;
        }
      });

      setActiveIndex(closestIdx);

      // Get the current section's title position (viewport-relative)
      const currentSection = sectionRefs[closestIdx]?.current;
      if (currentSection) {
        const titleEl = currentSection.querySelector("h2");
        if (titleEl) {
          const titleRect = titleEl.getBoundingClientRect();
          setFilledDotTop(titleRect.top);
        }
      }
    };

    // Initial layout + update
    setTimeout(() => {
      computeLayout();
      update();
    }, 100);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => {
      computeLayout();
      update();
    });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", () => {
        /* noop */
      });
    };
  }, [sectionRefs]);

  // Marker positions are kept in state (viewport-relative)

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 bottom-0 z-10"
      aria-hidden
    >
      {/* Continuous vertical line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-gray-200"
        style={{ left: railLeft }}
      />

      {/* Empty circles at each section title */}
      {markerTops.map((topPos, idx) => (
        <div
          key={idx}
          className="absolute -translate-x-1/2 h-4 w-4 rounded-full border-2 border-[#F5A623] bg-white"
          style={{ top: topPos - 8, left: railLeft }}
        />
      ))}

      {/* Moving filled circle */}
      <div
        className="absolute -translate-x-1/2 h-4 w-4 rounded-full bg-[#F5A623] transition-[top] duration-300 ease-out z-10"
        style={{ top: filledDotTop - 8, left: railLeft }}
      />
    </div>
  );
}

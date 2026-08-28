"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

const ParallaxContext = createContext<MotionValue<number> | null>(null);

/**
 * One scroll driver for the whole stack — layers share progress
 * but move different distances (that’s what creates depth).
 */
export function ParallaxRoot({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Finish before the following footer enters the viewport. This keeps the
    // parallax stack and the document-flow boundary in sync at the page end.
    offset: ["start end", "end end"],
  });

  return (
    <ParallaxContext.Provider value={scrollYProgress}>
      <div ref={ref} className={`relative w-full ${className}`}>
        {children}
      </div>
    </ParallaxContext.Provider>
  );
}

type LayerProps = {
  children: ReactNode;
  /**
   * How far this layer travels across the stack scroll, in px.
   * Background: ~40–80 · Mid: ~100–140 · Foreground: ~180–280
   * Negative = opposite direction (moves down as you scroll).
   */
  distance?: number;
  /** Final vertical offset. Defaults to the mirrored parallax position. */
  endOffset?: number;
  /** Move at the original parallax rate, then stop at normal document flow. */
  settleInFlow?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Layer({
  children,
  distance = 80,
  endOffset = -distance,
  settleInFlow = false,
  className = "",
  style,
}: LayerProps) {
  const progress = useContext(ParallaxContext);
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement>(null);

  // Fallback if used outside ParallaxRoot
  const { scrollYProgress: localProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });

  const source = progress ?? localProgress;
  const y = useTransform(
    source,
    settleInFlow ? [0, 0.5, 1] : [0, 1],
    settleInFlow ? [distance, 0, 0] : [distance, endOffset]
  );

  return (
    <motion.div
      ref={localRef}
      className={`will-change-transform ${className}`}
      style={{ y: reduce ? 0 : y, ...style }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Exported Figma layers have solid black “empty” areas.
 * lighten = black becomes invisible so layers show through.
 */
export function LayerImage({
  src,
  alt = "",
  className = "",
  seeThrough = true,
}: {
  src: string;
  alt?: string;
  className?: string;
  seeThrough?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`pointer-events-none block h-auto w-full max-w-none select-none ${
        seeThrough ? "mix-blend-lighten" : ""
      } ${className}`}
    />
  );
}

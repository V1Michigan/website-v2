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

type ParallaxContextValue = {
  progress: MotionValue<number>;
  flowProgress: MotionValue<number>;
};

const ParallaxContext = createContext<ParallaxContextValue | null>(null);

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
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: flowProgress } = useScroll({
    target: ref,
    offset: ["start 150%", "end end"],
  });

  return (
    <ParallaxContext.Provider
      value={{ progress: scrollYProgress, flowProgress }}
    >
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
  /** Responsive endpoint used to align a layer with document flow. */
  flowEndVw?: number;
  className?: string;
  style?: CSSProperties;
};

export function Layer({
  children,
  distance = 80,
  flowEndVw,
  className = "",
  style,
}: LayerProps) {
  const parallax = useContext(ParallaxContext);
  const reduce = useReducedMotion();
  const localRef = useRef<HTMLDivElement>(null);

  // Fallback if used outside ParallaxRoot
  const { scrollYProgress: localProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });

  const source = parallax?.progress ?? localProgress;
  const flowSource = parallax?.flowProgress ?? localProgress;
  const y = useTransform(source, [0, 1], [distance, -distance]);
  const flowAlignedY = useTransform<number, string>(
    flowSource,
    (progress) =>
      `calc(${distance * (1 - progress)}px + ${(flowEndVw ?? 0) * progress}vw)`
  );
  const resolvedY = reduce
    ? flowEndVw !== undefined
      ? `${flowEndVw}vw`
      : 0
    : flowEndVw !== undefined
      ? flowAlignedY
      : y;

  return (
    <motion.div
      ref={localRef}
      className={`will-change-transform ${className}`}
      style={{ y: resolvedY, ...style }}
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

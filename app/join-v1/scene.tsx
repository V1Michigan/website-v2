"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

const ParallaxContext = createContext<MotionValue<number> | null>(null);

const LAYER_ASSETS: Record<
  string,
  { width: number; height: number; mobileSrc: string }
> = {
  "/join-v1/layers/01-who-are-we-for-bg.png": {
    width: 1280,
    height: 2312,
    mobileSrc: "/join-v1/layers/01-who-are-we-for-bg-mobile.webp",
  },
  "/join-v1/layers/02-people-1.png": {
    width: 1280,
    height: 3739,
    mobileSrc: "/join-v1/layers/02-people-1-mobile.webp",
  },
  "/join-v1/layers/03-who-are-we-bg.png": {
    width: 1280,
    height: 2285,
    mobileSrc: "/join-v1/layers/03-who-are-we-bg-mobile.webp",
  },
  "/join-v1/layers/04-people-2.png": {
    width: 720,
    height: 1280,
    mobileSrc: "/join-v1/layers/04-people-2-mobile.webp",
  },
  "/join-v1/layers/05-how-to-join-bg.png": {
    width: 1280,
    height: 1499,
    mobileSrc: "/join-v1/layers/05-how-to-join-bg-mobile.webp",
  },
};

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
  const stableProgress = useMotionValue(scrollYProgress.get());

  useEffect(() => {
    stableProgress.set(scrollYProgress.get());

    const stopSyncing = scrollYProgress.on("change", (latest) => {
      const activeElement = document.activeElement;
      const isJoinFormFocused = activeElement?.closest(".join-v1-form");

      if (!isJoinFormFocused) {
        stableProgress.set(latest);
      }
    });

    const resumeAfterFocus = () => {
      requestAnimationFrame(() => {
        if (!document.activeElement?.closest(".join-v1-form")) {
          stableProgress.set(scrollYProgress.get());
        }
      });
    };

    document.addEventListener("focusout", resumeAfterFocus);

    return () => {
      stopSyncing();
      document.removeEventListener("focusout", resumeAfterFocus);
    };
  }, [scrollYProgress, stableProgress]);

  return (
    <ParallaxContext.Provider value={stableProgress}>
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
  className?: string;
  style?: CSSProperties;
};

export function Layer({
  children,
  distance = 80,
  className = "",
  style,
}: LayerProps) {
  const progress = useContext(ParallaxContext);
  const reduce = useReducedMotion();
  const fallbackProgress = useMotionValue(0);

  const source = progress ?? fallbackProgress;
  const y = useTransform(source, [0, 1], [distance, -distance]);

  return (
    <motion.div
      className={`will-change-auto sm:will-change-transform ${className}`}
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
  const asset = LAYER_ASSETS[src];

  return (
    <picture className="block w-full">
      {asset?.mobileSrc ? (
        <source
          media="(max-width: 639px)"
          srcSet={asset.mobileSrc}
          type="image/webp"
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        width={asset?.width}
        height={asset?.height}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={`pointer-events-none block h-auto w-full max-w-none select-none ${
          seeThrough ? "mix-blend-lighten" : ""
        } ${className}`}
      />
    </picture>
  );
}

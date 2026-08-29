"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";

const LINE_ONE = "So, you were curious enough to find this link…";
const LINE_TWO = "Where will your curiosity take you next?";
const LINE_ONE_WORDS = LINE_ONE.split(" ").map((word, wordIndex, words) => ({
  word,
  startIndex: words
    .slice(0, wordIndex)
    .reduce((offset, previousWord) => offset + previousWord.length + 1, 0),
}));

function SmokeLetter({
  char,
  index,
  total,
  progress,
  range,
}: {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const [rangeStart, rangeEnd] = range;
  const span = rangeEnd - rangeStart;
  const start = rangeStart + (index / Math.max(total - 1, 1)) * span * 0.35;
  const end = Math.min(start + span * 0.65, rangeEnd);

  const driftX = (index % 2 === 0 ? -1 : 1) * (3 + (index % 4));
  const driftY = -8 - (index % 5) * 2;

  const opacity = useTransform(progress, [start, end], [1, 0]);
  const blur = useTransform(progress, [start, end], [0, 5]);
  const y = useTransform(progress, [start, end], [0, driftY]);
  const x = useTransform(progress, [start, end], [0, driftX]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  if (char === " ") {
    return <span className="inline-block w-[0.28em]" />;
  }

  return (
    <motion.span
      className="inline-block will-change-auto sm:will-change-[opacity,transform,filter]"
      style={{ opacity, x, y, filter }}
    >
      {char}
    </motion.span>
  );
}

function VectorSmoke({
  progress,
  className,
  drift,
}: {
  progress: MotionValue<number>;
  className: string;
  drift: { x: [number, number]; y: [number, number]; scale: [number, number] };
}) {
  const opacity = useTransform(progress, [0.72, 0.85, 1], [0, 0.85, 0.2]);
  const x = useTransform(progress, [0.72, 1], drift.x);
  const y = useTransform(progress, [0.72, 1], drift.y);
  const scale = useTransform(progress, [0.72, 1], drift.scale);

  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ opacity, x, y, scale }}
    />
  );
}

/**
 * Scroll-scrubbed “video”: content stays pinned dead-center.
 * Scroll only advances the animation — nothing moves up the page.
 */
export default function CuriosityIntro() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    // Full runway = full animation timeline while sticky stays pinned
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const mobileLineOneOpacity = useTransform(
    progress,
    [0.08, 0.16, 0.22],
    [1, 1, 0]
  );
  const mobileLineOneY = useTransform(progress, [0.08, 0.22], [0, -12]);

  const lineTwoOpacity = useTransform(
    progress,
    [0.18, 0.28, 0.42, 0.56],
    [0, 1, 1, 0]
  );
  const lineTwoBlur = useTransform(
    progress,
    [0.18, 0.28, 0.42, 0.56],
    [6, 0, 0, 6]
  );
  const lineTwoY = useTransform(
    progress,
    [0.18, 0.28, 0.42, 0.56],
    [10, 0, 0, -14]
  );
  const lineTwoFilter = useMotionTemplate`blur(${lineTwoBlur}px)`;

  const vectorOpacity = useTransform(
    progress,
    [0.55, 0.66, 0.82, 0.92],
    [0, 1, 1, 0]
  );
  const vectorBlur = useTransform(progress, [0.78, 0.92], [0, 4]);
  const vectorY = useTransform(progress, [0.55, 0.66], [16, 0]);
  const vectorFilter = useMotionTemplate`blur(${vectorBlur}px)`;

  // Logo glow blooms outward until the whole viewport is solid lime
  const bloomScale = useTransform(progress, [0.62, 0.78, 0.92], [0.15, 1.2, 8]);
  const bloomOpacity = useTransform(
    progress,
    [0.58, 0.68, 0.88, 1],
    [0, 0.55, 1, 1]
  );
  const washOpacity = useTransform(progress, [0.8, 0.92], [0, 1]);

  const hintOpacity = useTransform(progress, [0, 0.06, 0.14], [0.45, 0.25, 0]);

  return (
    // Tall runway = scroll length. Sticky child never leaves center until runway ends.
    <section
      ref={runwayRef}
      className="relative z-0 w-full bg-black"
      style={{
        height: "calc(var(--join-v1-viewport-height, 100svh) * 2.6)",
      }}
    >
      <div
        className="sticky top-0 flex w-full items-center justify-center overflow-hidden px-5"
        style={{ height: "var(--join-v1-viewport-height, 100svh)" }}
      >
        {/* Solid wash kicks in once bloom has filled the frame */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[#E5FF00]"
          style={{ opacity: washOpacity }}
        />

        <div className="relative z-10 flex h-48 w-full max-w-md items-center justify-center text-center">
          <motion.p
            className="absolute inset-x-0 font-mona text-[clamp(1.25rem,5.5vw,1.85rem)] font-light leading-snug tracking-tight text-[#E5FF00] sm:hidden"
            style={{ opacity: mobileLineOneOpacity, y: mobileLineOneY }}
          >
            {LINE_ONE}
          </motion.p>

          <p className="absolute inset-x-0 hidden font-mona text-[clamp(1.25rem,5.5vw,1.85rem)] font-light leading-snug tracking-tight text-[#E5FF00] sm:block">
            {LINE_ONE_WORDS.map(({ word, startIndex }, wordIndex) => (
              <Fragment key={`${word}-${startIndex}`}>
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, charIndex) => (
                    <SmokeLetter
                      key={`one-${startIndex + charIndex}`}
                      char={char}
                      index={startIndex + charIndex}
                      total={LINE_ONE.length}
                      progress={progress}
                      range={[0.08, 0.22]}
                    />
                  ))}
                </span>
                {wordIndex < LINE_ONE_WORDS.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>

          <motion.p
            className="absolute inset-x-0 font-mona text-[clamp(1.25rem,5.5vw,1.85rem)] font-bold leading-snug tracking-tight text-[#E5FF00] sm:hidden"
            style={{ opacity: lineTwoOpacity, y: lineTwoY }}
          >
            {LINE_TWO}
          </motion.p>

          <motion.p
            className="absolute inset-x-0 hidden font-mona text-[clamp(1.25rem,5.5vw,1.85rem)] font-bold leading-snug tracking-tight text-[#E5FF00] sm:block"
            style={{
              opacity: lineTwoOpacity,
              y: lineTwoY,
              filter: lineTwoFilter,
            }}
          >
            {LINE_TWO}
          </motion.p>

          <div className="absolute inset-0 flex items-center justify-center">
            <VectorSmoke
              progress={progress}
              className="pointer-events-none absolute hidden h-36 w-36 rounded-full bg-[#E5FF00]/35 blur-3xl sm:block"
              drift={{ x: [-30, -50], y: [0, -80], scale: [0.5, 2.1] }}
            />
            <VectorSmoke
              progress={progress}
              className="pointer-events-none absolute hidden h-40 w-40 rounded-full bg-[#E5FF00]/30 blur-3xl sm:block"
              drift={{ x: [30, 55], y: [0, -95], scale: [0.4, 2.4] }}
            />
            <VectorSmoke
              progress={progress}
              className="pointer-events-none absolute hidden h-44 w-28 rounded-full bg-white/15 blur-3xl sm:block"
              drift={{ x: [0, 8], y: [0, -110], scale: [0.6, 2.8] }}
            />

            {/* Bloom + logo share one origin so the glow expands from behind the mark */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              style={{ y: vectorY }}
            >
              {/* Outer: CSS center. Inner: FM scale — keeps origin locked to logo */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  aria-hidden
                  className="h-[min(55vw,16rem)] w-[min(55vw,16rem)] rounded-full bg-[#E5FF00] blur-xl sm:blur-2xl"
                  style={{ scale: bloomScale, opacity: bloomOpacity }}
                />
              </div>
              <motion.img
                src="/join-v1/vector.svg"
                alt=""
                width={491}
                height={661}
                loading="eager"
                fetchPriority="high"
                className="relative z-10 h-auto w-[42vw] max-w-[180px] sm:hidden"
                style={{ opacity: vectorOpacity }}
              />
              <motion.img
                src="/join-v1/vector.svg"
                alt=""
                width={491}
                height={661}
                loading="eager"
                fetchPriority="high"
                className="relative z-10 hidden h-auto w-[42vw] max-w-[180px] sm:block"
                style={{
                  opacity: vectorOpacity,
                  filter: vectorFilter,
                }}
              />
            </motion.div>
          </div>
        </div>

        <motion.p
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mona text-[0.6rem] font-light uppercase tracking-[0.35em] text-[#E5FF00]/45"
          style={{ opacity: hintOpacity }}
        >
          Scroll
        </motion.p>
      </div>
    </section>
  );
}

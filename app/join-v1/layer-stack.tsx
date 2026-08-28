"use client";

import JoinSocialBar from "./join-social-bar";
import { Layer, LayerImage, ParallaxRoot } from "./scene";

/**
 * Continuous stack driven by ONE scroll progress.
 * Bigger `distance` = moves more = feels closer (foreground).
 */
export default function LayerStack() {
  return (
    <ParallaxRoot className="bg-transparent">
      {/* ═══════════ WHO ARE WE FOR ═══════════ */}
      <div className="relative z-[1]">
        {/* Background — slow */}
        <Layer distance={50} className="-mt-[8vw]">
          <LayerImage src="/join-v1/layers/01-who-are-we-for-bg.png" />
        </Layer>

        <div className="pointer-events-none absolute inset-x-0 top-[clamp(4.5rem,17vw,8.5rem)] z-[1] px-5 text-center sm:px-6">
          {/* Text — under the people layer so it gets covered on scroll */}
          <Layer distance={20}>
            <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
              WHO ARE WE FOR?
            </h2>
            <p className="mx-auto mt-5 max-w-md font-sans text-[clamp(1rem,3.8vw,1.75rem)] font-normal leading-snug text-black">
              Self-starters. Risk-takers. People who turn their ideas into real
              things.
            </p>
          </Layer>
        </div>

        {/* People — above the text so “Problem Solvers” gets covered */}
        <Layer distance={280} className="relative z-[3] -mt-[222vw]">
          <LayerImage
            src="/join-v1/layers/02-people-1.png"
            alt="V1 members"
          />
        </Layer>
      </div>

      {/* ═══════════ VISION QUOTE ═══════════ */}
      <div className="relative z-[3] -mt-[147vw] px-10 py-8 sm:px-14 sm:py-12">
        <Layer distance={400}>
          <div className="mx-auto flex max-w-xl gap-4 sm:gap-5">
            <div
              aria-hidden
              className="w-1.5 shrink-0 self-stretch rounded-full bg-[#E5FF00] sm:w-2"
            />
            <p className="text-left font-mona text-[clamp(1.25rem,4vw,2.25rem)] font-extralight leading-[1.25] tracking-tight text-[#E5FF00]">
              We look for the hardest problems, and bet on ourselves to solve
              them
            </p>
          </div>
        </Layer>
      </div>

      {/* ═══════════ WHO ARE WE ═══════════ */}
      <div className="relative z-[4] mt-[3vw]">
        <Layer distance={500} className="mt-[4vw]">
          <LayerImage src="/join-v1/layers/03-who-are-we-bg.png" />
        </Layer>

        <div className="pointer-events-none absolute inset-x-0 top-[clamp(3rem,10vw,5.5rem)] z-[2] px-5 sm:px-6">
          <Layer distance={500}>
            <div className="ml-auto max-w-[min(90%,20rem)] text-right">
              <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
                WHO
                <br />
                ARE WE?
              </h2>
              <p className="mt-4 font-sans text-[clamp(0.875rem,2.8vw,1.25rem)] font-normal leading-snug text-black">
                V1 is the premier builder community at the University of Michigan
                dedicated to supporting hackers and creators every step of the
                way.
              </p>
            </div>
          </Layer>
        </div>

        <Layer distance={750} className="relative -mt-[158vw]">
          <LayerImage
            src="/join-v1/layers/04-people-2.png"
            alt="V1 members at an event"
          />
        </Layer>

        {/* Same distance as 4people so the curve doesn’t slip and flash lime. */}
        <Layer distance={750} className="relative z-[6] -mt-[47vw] -mb-[55vw]">
          <LayerImage src="/join-v1/layers/05-how-to-join-bg.png" />

          <div className="relative z-10 -mt-[105vw] pt-2 font-mona">
            <div className="px-5 sm:px-6">
              <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
                HOW
                <br />
                TO JOIN
              </h2>

              <p className="mt-5 max-w-md font-mona text-[clamp(0.95rem,3vw,1.75rem)] font-light leading-snug text-black">
                Sign Up to learn more about how you can join Michigan&apos;s
                Leading Student Org for Founders and Entrepreneurship
              </p>

              <form
                className="pointer-events-auto relative mt-7 flex w-full max-w-sm items-center gap-2 rounded-full border-2 border-black bg-white p-1.5 sm:max-w-md"
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="join-uniqname" className="sr-only">
                  Uniqname
                </label>
                <input
                  id="join-uniqname"
                  type="text"
                  name="uniqname"
                  placeholder="Uniqname"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="min-w-0 flex-1 rounded-full bg-white px-4 py-2.5 font-mona text-[clamp(1rem,3.5vw,1.35rem)] font-bold leading-none text-black placeholder:text-black/70 focus:outline-none sm:px-5"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-black px-5 py-2.5 font-mona text-[clamp(0.85rem,2.8vw,1rem)] font-bold uppercase tracking-wide text-[#E5FF00] transition-opacity hover:opacity-90 active:opacity-80"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </Layer>
      </div>

      <div aria-hidden className="h-6 w-full bg-[#E5FF00] sm:h-8" />
      <JoinSocialBar />
    </ParallaxRoot>
  );
}

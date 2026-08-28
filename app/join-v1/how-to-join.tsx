"use client";

import { Layer, LayerImage, Scene, SceneContent } from "./scene";

/**
 * Layer 5 — HOW TO JOIN solid lime with rounded top
 */
export default function HowToJoin() {
  return (
    <Scene className="relative z-20 -mt-[18vw] bg-black">
      <Layer speed={6} className="relative z-0">
        <LayerImage src="/join-v1/layers/05-how-to-join-bg.png" />
      </Layer>

      <SceneContent className="absolute inset-x-0 top-[clamp(3.5rem,16vw,7rem)] z-10 px-5 pb-24 font-mona sm:px-6 sm:pb-32">
        <Layer speed={5}>
          <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
            HOW TO JOIN
          </h2>

          <p className="mt-6 max-w-md font-mona text-[clamp(0.95rem,3vw,1.75rem)] font-light leading-snug text-black">
            Sign Up to learn more about how you can join Michigan&apos;s Leading
            Student Org for Founders and Entrepreneurship
          </p>

          <form
            className="pointer-events-auto relative mt-10 w-full max-w-xl rounded-full border-[3px] border-black sm:border-4"
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
              className="w-full rounded-full bg-[#E5FF00] px-8 py-5 font-mona text-[clamp(1.5rem,6.5vw,3.5rem)] font-bold leading-none text-black placeholder:text-black focus:outline-none sm:px-10 sm:py-6"
            />
          </form>
        </Layer>
      </SceneContent>
    </Scene>
  );
}

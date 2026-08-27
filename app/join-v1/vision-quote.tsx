"use client";

import { Layer, Scene, SceneContent } from "./scene";

export default function VisionQuote() {
  return (
    <Scene className="relative z-20 bg-black px-5 py-20 sm:px-6 sm:py-28">
      <SceneContent>
        <Layer speed={8}>
          <p className="mx-auto max-w-lg text-center font-mona text-[clamp(1.25rem,4.8vw,2.75rem)] font-extralight leading-[1.25] tracking-tight text-[#E5FF00]">
            We look for the hardest problems, and{" "}
            <span className="underline decoration-1 underline-offset-[6px]">
              bet
            </span>{" "}
            on ourselves to solve them
          </p>
        </Layer>
      </SceneContent>
    </Scene>
  );
}

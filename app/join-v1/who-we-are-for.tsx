"use client";

import { Layer, LayerImage, Scene, SceneContent } from "./scene";

/**
 * Layers 1 + 2
 * 01 — solid lime hill section
 * 02 — people photo (moves faster)
 */
export default function WhoWeAreFor() {
  return (
    <Scene className="bg-black">
      <Layer speed={6} className="relative z-0">
        <LayerImage src="/join-v1/layers/01-who-are-we-for-bg.png" />
      </Layer>

      <SceneContent className="pointer-events-none absolute inset-x-0 top-[clamp(3.5rem,14vw,7rem)] z-20 px-5 text-center sm:px-6">
        <Layer speed={5}>
          <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
            WHO ARE WE FOR?
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-[clamp(1rem,3.8vw,1.75rem)] font-normal leading-snug text-black">
            Self-starters. Risk-takers. People who turn their ideas into real things.
          </p>
        </Layer>
      </SceneContent>

      {/* People overlay — clip tall export to the lower half of the lime section */}
      <Layer
        speed={18}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[58%] overflow-hidden"
      >
        <LayerImage
          src="/join-v1/layers/02-people-1.png"
          alt="V1 members"
          className="h-full w-full object-cover object-top"
        />
      </Layer>
    </Scene>
  );
}

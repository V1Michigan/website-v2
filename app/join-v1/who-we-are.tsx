"use client";

import { Layer, LayerImage, Scene, SceneContent } from "./scene";

/**
 * Layers 3 + 4
 * 03 — lime sweep (WHO ARE WE)
 * 04 — second people photo
 */
export default function WhoWeAre() {
  return (
    <Scene className="bg-black">
      <Layer speed={7} className="relative z-0">
        <LayerImage src="/join-v1/layers/03-who-are-we-bg.png" />
      </Layer>

      <SceneContent className="pointer-events-none absolute inset-x-0 top-[clamp(2rem,9vw,4.5rem)] z-20 px-5 sm:px-6">
        <Layer speed={5}>
          <div className="ml-auto max-w-[min(90%,20rem)] text-right">
            <h2 className="font-mona text-[clamp(2.75rem,12vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight text-black">
              WHO ARE WE?
            </h2>
            <p className="mt-4 font-sans text-[clamp(0.875rem,2.8vw,1.25rem)] font-normal leading-snug text-black">
              V1 is the premier builder community at the University of Michigan
              dedicated to supporting hackers and creators every step of the way.
            </p>
          </div>
        </Layer>
      </SceneContent>

      <Layer
        speed={20}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[52%] overflow-hidden"
      >
        <LayerImage
          src="/join-v1/layers/04-people-2.png"
          alt="V1 members at an event"
          className="h-full w-full object-cover object-top"
        />
      </Layer>
    </Scene>
  );
}

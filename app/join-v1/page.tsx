import CuriosityIntro from "./curiosity-scroll";
import LayerStack from "./layer-stack";

export const metadata = {
  title: "Join V1 | V1 @ Michigan",
  description: "So you were curious enough to find this link and follow it..",
};

export default function JoinV1Page() {
  return (
    // overflow-x-hidden breaks position:sticky — keep it off this main
    <main className="relative w-full bg-[#E5FF00] text-[#E5FF00]">
      <CuriosityIntro />
      {/* Whole stack pulled up so WHO ARE WE FOR covers the sticky intro sooner */}
      <div className="relative z-10 -mt-[55vh] -mb-[min(30vh,18rem)]">
        <LayerStack />
      </div>
    </main>
  );
}

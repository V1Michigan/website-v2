import type { ReactNode } from "react";
import "@fontsource-variable/mona-sans/wght.css";

export default function JoinV1Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black">
      {/* Site body is cream (#FAF7F2) — keep this page black so no strip shows under the footer */}
      <style>{`
        html,
        body {
          background-color: #000 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .will-change-transform {
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import "@fontsource-variable/mona-sans/wght.css";

export default function JoinV1Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full bg-black">
      {/* Site body is cream (#FAF7F2) — keep this page black so no strip shows under the footer */}
      <style>{`
        html,
        body {
          background-color: #000 !important;
        }
        .join-v1-page :where(h1, h2, h3) {
          overflow-wrap: normal;
          word-break: normal;
          hyphens: none;
          text-wrap: balance;
        }
        .join-v1-page :where(p, a, label, button) {
          overflow-wrap: normal;
          word-break: normal;
          hyphens: none;
          text-wrap: pretty;
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

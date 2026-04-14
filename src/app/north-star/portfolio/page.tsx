"use client";

import Link from "next/link";
import { useState } from "react";

type Company = {
  year: string;
  name: string;
  url: string;
  blurb: string;
};

const companies: Company[] = [
  {
    year: "2025",
    name: "Embedder",
    url: "http://embedder.dev/",
    blurb: "Coding agent that writes and tests firmware on real hardware.",
  },
  {
    year: "2024",
    name: "Dezu",
    url: "https://www.dezu.ai/",
    blurb: "AI tax accountant automating complex K-1 workflows end-to-end.",
  },
];

function HoverSwap({ name, blurb, url }: { name: string; blurb: string; url: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-colors underline-offset-4 hover:underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="inline-grid whitespace-nowrap">
        <span className={`col-start-1 row-start-1 transition-opacity duration-200 ${hovered ? "opacity-0" : "opacity-100"}`}>
          {name}
        </span>
        <span className={`col-start-1 row-start-1 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          {blurb}
        </span>
      </span>
    </a>
  );
}

export default function PortfolioPage() {
  return (
    <div className="min-h-dvh w-screen flex items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl sm:text-4xl text-white/90">Portfolio</h1>
        <p className="text-white/60 mt-1">Select investments and partners.</p>

        <div className="mt-6 divide-y divide-white/10">
          {companies.map((c) => (
            <div key={`${c.year}-${c.name}`} className="py-4 flex items-baseline gap-3">
              <div className="text-white/40 w-16 shrink-0">{c.year}</div>
              <div className="relative text-white/80">
                <HoverSwap name={`${c.name}`} blurb={c.blurb} url={c.url} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/north-star" className="text-white/60 hover:text-white transition-colors underline-offset-4 hover:underline">
            ← Back to North Star
          </Link>
        </div>
      </div>
    </div>
  );
}



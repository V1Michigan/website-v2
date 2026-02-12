"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  backgroundColor: string;
  defaultText: string;
  defaultImage: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "red-romance",
    name: "Red Romance",
    backgroundColor: "#DC2626",
    defaultText: "You make my heart skip a beat!",
    defaultImage: "/love-notes/heart-red.svg",
  },
  {
    id: "green-love",
    name: "Green Love",
    backgroundColor: "#16A34A",
    defaultText: "Growing together, always.",
    defaultImage: "/love-notes/heart-green.svg",
  },
  {
    id: "blue-devotion",
    name: "Blue Devotion",
    backgroundColor: "#2563EB",
    defaultText: "My love for you is as deep as the ocean.",
    defaultImage: "/love-notes/heart-blue.svg",
  },
];

interface StarterCanvasesProps {
  onSelectTemplate: (template: Template) => void;
  onCreateNew: () => void;
}

export default function StarterCanvases({
  onSelectTemplate,
  onCreateNew,
}: StarterCanvasesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-rose-300"
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: template.backgroundColor }}
          >
            {/* Decorative hearts background */}
            <div className="absolute inset-0 opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 200"
                fill="white"
              >
                <path d="M30 50C30 50 10 35 10 22C10 15 17 10 23 10C27 10 31 12 33 16C35 12 39 10 43 10C49 10 56 15 56 22C56 35 36 50 36 50Z" />
                <path d="M150 30C150 30 130 15 130 2C130 -5 137 -10 143 -10C147 -10 151 -8 153 -4C155 -8 159 -10 163 -10C169 -10 176 -5 176 2C176 15 156 30 156 30Z" />
                <path d="M160 170C160 170 140 155 140 142C140 135 147 130 153 130C157 130 161 132 163 136C165 132 169 130 173 130C179 130 186 135 186 142C186 155 166 170 166 170Z" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <Image
                src={template.defaultImage}
                alt={template.name}
                width={80}
                height={80}
                className="drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
              />
              <p className="text-white font-serif text-lg text-center leading-snug drop-shadow-md">
                &ldquo;{template.defaultText}&rdquo;
              </p>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-white/80 text-sm font-medium tracking-wide uppercase">
                {template.name}
              </span>
            </div>
          </div>
        </button>
      ))}

      {/* Create New card */}
      <button
        onClick={onCreateNew}
        className="group aspect-[3/4] rounded-2xl border-3 border-dashed border-rose-300 hover:border-rose-500 bg-white/60 hover:bg-rose-50/80 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-rose-300"
      >
        <div className="w-16 h-16 rounded-full bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center transition-colors duration-300">
          <Plus className="w-8 h-8 text-rose-500" />
        </div>
        <span className="text-rose-600 font-medium text-lg">Create New</span>
        <span className="text-rose-400 text-sm">Start from scratch</span>
      </button>
    </div>
  );
}

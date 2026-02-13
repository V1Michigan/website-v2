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
    defaultImage: "/valentines/heart-red.svg",
  },
  {
    id: "green-love",
    name: "Green Love",
    backgroundColor: "#16A34A",
    defaultText: "Growing together, always.",
    defaultImage: "/valentines/heart-green.svg",
  },
  {
    id: "blue-devotion",
    name: "Blue Devotion",
    backgroundColor: "#2563EB",
    defaultText: "My love for you is as deep as the ocean.",
    defaultImage: "/valentines/heart-blue.svg",
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelectTemplate(template)}
          className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rose-300 flex flex-col"
        >
          <div
            className="flex-1 flex flex-col items-center min-h-[320px]"
            style={{ backgroundColor: template.backgroundColor }}
          >
            {/* Image - centered, top, takes up at least half */}
            <div className="flex-1 w-full flex items-center justify-center p-8">
              <Image
                src={template.defaultImage}
                alt={template.name}
                width={280}
                height={280}
                className="w-3/4 max-w-[280px] h-auto drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text - wrapping */}
            <div className="w-full px-6 pb-6 text-center">
              <p className="text-white font-serif text-xl leading-relaxed break-words whitespace-normal">
                &ldquo;{template.defaultText}&rdquo;
              </p>
              <span className="mt-3 inline-block text-white/80 text-sm font-medium tracking-wide uppercase">
                {template.name}
              </span>
            </div>
          </div>
        </button>
      ))}

      {/* Create New card */}
      <button
        onClick={onCreateNew}
        className="group rounded-2xl border-3 border-dashed border-rose-300 hover:border-rose-500 bg-white/60 hover:bg-rose-50/80 flex flex-col items-center justify-center gap-4 py-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-rose-300"
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

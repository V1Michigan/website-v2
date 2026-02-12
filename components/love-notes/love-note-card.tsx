"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

export interface LoveNote {
  id: string;
  user_id: string;
  recipient_name: string | null;
  background_color: string;
  canvas_data: {
    text: string;
    image?: string | null;
  };
  template_id: string | null;
  created_at: string;
}

interface LoveNoteCardProps {
  note: LoveNote;
  onDelete: (id: string) => void;
}

export default function LoveNoteCard({ note, onDelete }: LoveNoteCardProps) {
  const { background_color, canvas_data, recipient_name, created_at } = note;

  return (
    <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: background_color }}
      >
        {/* Decorative hearts background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 200 260" fill="white">
            <path d="M20 40C20 40 5 28 5 18C5 12 10 8 15 8C18 8 21 10 22 13C23 10 26 8 29 8C34 8 39 12 39 18C39 28 24 40 24 40Z" />
            <path d="M170 220C170 220 155 208 155 198C155 192 160 188 165 188C168 188 171 190 172 193C173 190 176 188 179 188C184 188 189 192 189 198C189 208 174 220 174 220Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3 text-center max-h-full overflow-hidden">
          {recipient_name && (
            <p className="text-white/90 text-xs font-medium tracking-widest uppercase">
              For {recipient_name}
            </p>
          )}

          {canvas_data.image && (
            <div className="w-16 h-16 relative flex-shrink-0">
              {canvas_data.image.startsWith("/love-notes/") ? (
                <Image
                  src={canvas_data.image}
                  alt="Love note image"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={canvas_data.image}
                  alt="Love note image"
                  className="w-full h-full object-contain rounded-lg drop-shadow-lg"
                />
              )}
            </div>
          )}

          <p className="text-white font-serif text-base leading-relaxed drop-shadow-md line-clamp-6">
            &ldquo;{canvas_data.text}&rdquo;
          </p>
        </div>

        {/* Date stamp */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span className="text-white/60 text-xs">
            {new Date(created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 hover:bg-black/50 rounded-full p-2"
          title="Delete note"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

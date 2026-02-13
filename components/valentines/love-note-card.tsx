"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

export interface LoveNote {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_email: string;
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
  onDelete?: (id: string) => void;
}

export default function LoveNoteCard({ note, onDelete }: LoveNoteCardProps) {
  const { background_color, canvas_data, recipient_name, created_at } = note;

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <div
        className="flex-1 flex flex-col items-center min-h-[280px]"
        style={{ backgroundColor: background_color }}
      >
        {/* Recipient */}
        {recipient_name && (
          <p className="text-white/90 text-xs font-medium tracking-wide pt-4">
            For {recipient_name}
          </p>
        )}

        {/* Image - centered, top, takes up at least half */}
        {canvas_data.image && (
          <div className="flex-1 w-full flex items-center justify-center p-8">
            <div className="w-3/4 max-w-[260px] aspect-square relative">
              {canvas_data.image.startsWith("/valentines/") ? (
                <Image
                  src={canvas_data.image}
                  alt="Valentine's note image"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={canvas_data.image}
                  alt="Valentine's note image"
                  className="w-full h-full object-contain rounded-lg drop-shadow-lg"
                />
              )}
            </div>
          </div>
        )}

        {/* Text - wrapping */}
        <div className="w-full px-6 pb-4 text-center">
          <p className="text-white font-serif text-lg leading-relaxed drop-shadow-md break-words whitespace-normal">
            &ldquo;{canvas_data.text}&rdquo;
          </p>

          {/* Date stamp */}
          <span className="mt-3 inline-block text-white/60 text-xs">
            {new Date(created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Delete button (only shown if onDelete is provided) */}
        {onDelete && (
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
        )}
      </div>
    </div>
  );
}

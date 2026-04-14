"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";

export interface LoveNote {
  id: string;
  user_id: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  message_text: string;
  background_color: string;
  image_url: string | null;
  template_id: string | null;
  created_at: string;
}

interface LoveNoteCardProps {
  note: LoveNote;
  onDelete?: (id: string) => void;
  onSelect?: (note: LoveNote) => void;
  /** When true, show only the card image (no text excerpt or date). Used for "Notes For You". */
  imageOnly?: boolean;
  /** When true, display sender name below the card. */
  showSender?: boolean;
}

export default function LoveNoteCard({
  note,
  onDelete,
  onSelect,
  imageOnly = false,
  showSender = false,
}: LoveNoteCardProps) {
  const { message_text, image_url, recipient_name, sender_name, created_at } = note;

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect ? () => onSelect(note) : undefined}
      onKeyDown={
        onSelect
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(note);
              }
            }
          : undefined
      }
      className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col ${onSelect ? "cursor-pointer" : ""}`}
    >
      <Image
        src={image_url || "/valentines/heart-red.svg"}
        alt={`Valentine for ${recipient_name}`}
        width={320}
        height={340}
        className="w-full shrink-0"
        style={{ objectFit: "cover" }}
      />
      {showSender && sender_name && (
        <div className="px-3 py-2 text-center">
          <p className="text-sm text-rose-600 font-medium">
            From: {sender_name}
          </p>
        </div>
      )}
      {!imageOnly && (
        <div className="flex-1 min-h-0 px-3 py-2 flex flex-col">
          <div className="overflow-y-auto flex-1 min-h-0 max-h-24 text-center">
            <p className="text-sm text-gray-600 leading-relaxed break-words">
              &ldquo;{message_text}&rdquo;
            </p>
          </div>
          <p className="text-center text-gray-500 text-xs mt-1 shrink-0">
            {new Date(created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(note.id);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
          title="Delete note"
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
}

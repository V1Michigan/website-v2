"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Heart, ImagePlus, X as XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import supabase from "@/utils/supabaseClient";
import type { Template } from "./starter-canvases";

const COLOR_PRESETS = [
  { name: "Rose Red", value: "#E11D48" },
  { name: "Hot Pink", value: "#EC4899" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Purple", value: "#9333EA" },
  { name: "Red", value: "#DC2626" },
  { name: "Orange Red", value: "#EA580C" },
  { name: "Green", value: "#16A34A" },
  { name: "Blue", value: "#2563EB" },
  { name: "Deep Rose", value: "#9F1239" },
];

interface CanvasEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: Template | null;
  userId: string;
  onSaved: () => void;
}

export default function CanvasEditor({
  open,
  onOpenChange,
  template,
  userId,
  onSaved,
}: CanvasEditorProps) {
  const [backgroundColor, setBackgroundColor] = useState(
    template?.backgroundColor ?? "#E11D48"
  );
  const [text, setText] = useState(template?.defaultText ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [imageData, setImageData] = useState<string | null>(
    template?.defaultImage ?? null
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens with a new template
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setBackgroundColor(template?.backgroundColor ?? "#E11D48");
      setText(template?.defaultText ?? "");
      setRecipientName("");
      setImageData(template?.defaultImage ?? null);
    }
    onOpenChange(newOpen);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSaving(true);

    try {
      const { error } = await supabase.from("love_notes").insert({
        user_id: userId,
        recipient_name: recipientName.trim() || null,
        background_color: backgroundColor,
        canvas_data: {
          text: text.trim(),
          image: imageData,
        },
        template_id: template?.id ?? null,
      });

      if (error) {
        console.error("Error saving love note:", error.message);
      } else {
        onSaved();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Unexpected error saving love note:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-700 font-serif text-2xl">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            {template ? `Edit: ${template.name}` : "Create Love Note"}
          </DialogTitle>
          <DialogDescription className="text-rose-500">
            Design your Valentine&apos;s card with a personal message and image.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Editor Controls */}
          <div className="space-y-5">
            {/* Recipient Name */}
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-rose-700 font-medium">
                To (optional)
              </Label>
              <Input
                id="recipient"
                placeholder="Who is this for?"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-300"
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-rose-700 font-medium">
                Your Message
              </Label>
              <Textarea
                id="message"
                placeholder="Write something from the heart..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-300 resize-none"
              />
            </div>

            {/* Background Color */}
            <div className="space-y-2">
              <Label className="text-rose-700 font-medium">
                Background Color
              </Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                      backgroundColor === color.value
                        ? "border-gray-800 ring-2 ring-offset-2 ring-rose-400 scale-110"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-rose-700 font-medium">
                Image (optional)
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {imageData && !imageData.startsWith("/valentines/") && (
                  <button
                    onClick={removeImage}
                    className="text-rose-400 hover:text-rose-600 transition-colors"
                    title="Remove image"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={saving || !text.trim()}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-2.5"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4 fill-white" />
                  Send Love Note
                </span>
              )}
            </Button>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <Label className="text-rose-700 font-medium">Preview</Label>
            <div
              className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-6 relative"
              style={{ backgroundColor }}
            >
              {/* Decorative hearts overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 200 260"
                  fill="white"
                >
                  <path d="M20 40C20 40 5 28 5 18C5 12 10 8 15 8C18 8 21 10 22 13C23 10 26 8 29 8C34 8 39 12 39 18C39 28 24 40 24 40Z" />
                  <path d="M160 30C160 30 145 18 145 8C145 2 150 -2 155 -2C158 -2 161 0 162 3C163 0 166 -2 169 -2C174 -2 179 2 179 8C179 18 164 30 164 30Z" />
                  <path d="M170 220C170 220 155 208 155 198C155 192 160 188 165 188C168 188 171 190 172 193C173 190 176 188 179 188C184 188 189 192 189 198C189 208 174 220 174 220Z" />
                  <path d="M10 200C10 200 -5 188 -5 178C-5 172 0 168 5 168C8 168 11 170 12 173C13 170 16 168 19 168C24 168 29 172 29 178C29 188 14 200 14 200Z" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                {recipientName && (
                  <p className="text-white/90 text-sm font-medium tracking-wide uppercase">
                    For {recipientName}
                  </p>
                )}

                {imageData && (
                  <div className="w-20 h-20 relative">
                    {imageData.startsWith("/valentines/") ? (
                      <Image
                        src={imageData}
                        alt="Love note image"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageData}
                        alt="Love note image"
                        className="w-full h-full object-contain rounded-lg drop-shadow-lg"
                      />
                    )}
                  </div>
                )}

                <p className="text-white font-serif text-lg leading-relaxed drop-shadow-md">
                  {text || "Your message here..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

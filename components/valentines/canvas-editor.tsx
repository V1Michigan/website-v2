"use client";

import React, { useState, useRef, useEffect } from "react";
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
  senderName: string;
  onSaved: () => void;
}

export default function CanvasEditor({
  open,
  onOpenChange,
  template,
  userId,
  senderName,
  onSaved,
}: CanvasEditorProps) {
  const [backgroundColor, setBackgroundColor] = useState(
    template?.backgroundColor ?? "#E11D48"
  );
  const [text, setText] = useState(template?.defaultText ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [imageData, setImageData] = useState<string | null>(
    template?.defaultImage ?? null
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form state whenever the template or open state changes
  useEffect(() => {
    if (open) {
      setBackgroundColor(template?.backgroundColor ?? "#E11D48");
      setText(template?.defaultText ?? "");
      setRecipientName("");
      setRecipientEmail("");
      setImageData(template?.defaultImage ?? null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, template]);

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
      const { data, error } = await supabase
        .from("love_notes")
        .insert({
          user_id: userId,
          recipient_name: recipientName.trim(),
          recipient_email: recipientEmail.trim().toLowerCase(),
          background_color: backgroundColor,
          canvas_data: {
            text: text.trim(),
            image: imageData,
          },
          template_id: template?.id ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving love note:", error.message);
      } else {
        // Send email notification to recipient
        try {
          await fetch("/api/love-notes/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: recipientEmail.trim().toLowerCase(),
              senderName,
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }

        // Clear form
        setBackgroundColor("#E11D48");
        setText("");
        setRecipientName("");
        setRecipientEmail("");
        setImageData(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <Label htmlFor="recipientName" className="text-rose-700 font-medium">
                Recipient Name <span className="text-rose-500">(required)</span>
              </Label>
              <Input
                id="recipientName"
                placeholder="Their name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-300"
                required
              />
            </div>

            {/* Recipient Email */}
            <div className="space-y-2">
              <Label htmlFor="recipientEmail" className="text-rose-700 font-medium">
                Recipient Email <span className="text-rose-500">(required)</span>
              </Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@umich.edu"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-300"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-rose-700 font-medium">
                Your Message
              </Label>
              <p className="text-xs text-rose-400">
                Write the main text for your card -- a short love note,
                compliment, or inside joke.
              </p>
              <Textarea
                id="message"
                placeholder="e.g. &quot;You light up every room you walk into&quot;"
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
              disabled={saving || !text.trim() || !recipientName.trim() || !recipientEmail.trim()}
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
                  Send Valentine's Note
                </span>
              )}
            </Button>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <Label className="text-rose-700 font-medium">Preview</Label>
            <div
              className="rounded-2xl overflow-hidden shadow-xl flex flex-col items-center min-h-[300px]"
              style={{ backgroundColor }}
            >
              {recipientName && (
                <p className="text-white/90 text-sm font-medium tracking-wide pt-4">
                  For {recipientName}
                </p>
              )}

              {imageData && (
                <div className="flex-1 w-full flex items-center justify-center p-6">
                  <div className="w-3/4 max-w-[200px] aspect-square relative">
                    {imageData.startsWith("/valentines/") ? (
                      <Image
                        src={imageData}
                        alt="Valentine's note image"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageData}
                        alt="Valentine's note image"
                        className="w-full h-full object-contain rounded-lg drop-shadow-lg"
                      />
                    )}
                  </div>
                </div>
              )}

              <div className="w-full px-6 pb-6 text-center">
                <p className="text-white font-serif text-lg leading-relaxed drop-shadow-md break-words whitespace-normal">
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

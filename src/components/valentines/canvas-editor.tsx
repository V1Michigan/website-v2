"use client";

import React, { useState, useRef, useEffect } from "react";
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
import supabase from "@/db/supabaseClient";
import type { Template } from "./starter-canvases";
import CanvasCard, { renderCardToBlob } from "./canvas-card";

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
  senderEmail: string;
  onSaved: () => void;
}

const BUCKET = "love-notes";

/** Max message length so text fits on the card (reserved message area). */
const MAX_MESSAGE_LENGTH = 400;

export default function CanvasEditor({
  open,
  onOpenChange,
  template,
  userId,
  senderName,
  senderEmail,
  onSaved,
}: CanvasEditorProps) {
  const [backgroundColor, setBackgroundColor] = useState(
    template?.backgroundColor ?? "#E11D48"
  );
  const [text, setText] = useState(template?.defaultText ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    template?.defaultImage ?? null
  );
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewSize, setPreviewSize] = useState({ width: 320, height: 400 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !open) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? {};
      if (width > 0 && height > 0) {
        setPreviewSize({ width: Math.round(width), height: Math.round(height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  // Sync form state whenever the template or open state changes
  useEffect(() => {
    if (open) {
      setBackgroundColor(template?.backgroundColor ?? "#E11D48");
      setText(
        (template?.defaultText ?? "").slice(0, MAX_MESSAGE_LENGTH)
      );
      setRecipientName("");
      setRecipientEmail("");
      setImageFile(null);
      setImagePreviewUrl(template?.defaultImage ?? null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, template]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSaving(true);

    try {
      let imageUrl: string | null = null;

      // Render full card (background + "For X" + image + text) to a PNG and upload
      const blob = await renderCardToBlob({
        backgroundColor,
        messageText: text.trim(),
        recipientName: recipientName.trim() || null,
        imageUrl: imagePreviewUrl,
      });
      const path = `${userId}/${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, {
          upsert: false,
          contentType: "image/png",
        });
      if (uploadError) {
        console.error("Error uploading card image:", uploadError.message);
      } else {
        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("love_notes").insert({
        user_id: userId,
        sender_name: senderName,
        sender_email: senderEmail,
        recipient_name: recipientName.trim(),
        recipient_email: recipientEmail.trim().toLowerCase(),
        message_text: text.trim(),
        background_color: backgroundColor,
        image_url: imageUrl,
        template_id: template?.id ?? null,
      });

      if (error) {
        console.error("Error saving love note:", error.message);
      } else {
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

        setBackgroundColor("#E11D48");
        setText("");
        setRecipientName("");
        setRecipientEmail("");
        setImageFile(null);
        if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(null);
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-700 font-serif text-2xl">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            {template ? `Edit: ${template.name}` : "Create Love Note"}
          </DialogTitle>
          <DialogDescription className="text-rose-500">
            Design your Valentine&apos;s card with a personal message and image.
            Sending a card will email the recipient so they can view it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:min-h-[480px] md:items-stretch">
          {/* Editor Controls */}
          <div className="space-y-5 overflow-y-auto">
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
                className="border-rose-200 focus:border-rose-400 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="border-rose-200 focus:border-rose-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-rose-700 font-medium">
                Your Message
              </Label>
              <p className="text-xs text-rose-400">
                Write the main text for your card — must fit on the card (
                currently {text.length} / {MAX_MESSAGE_LENGTH} characters).
              </p>
              <Textarea
                id="message"
                placeholder="e.g. &quot;You light up every room you walk into&quot;"
                value={text}
                onChange={(e) =>
                  setText(e.target.value.slice(0, MAX_MESSAGE_LENGTH))
                }
                maxLength={MAX_MESSAGE_LENGTH}
                rows={4}
                className="border-rose-200 focus:border-rose-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
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
                {imageFile && (
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
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Submit */}
            <p className="text-xs text-rose-500">
              Every card sends an email to the recipient at the address above.
            </p>
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

          {/* Live Preview - taller/wider, scrollable */}
          <div className="flex flex-col min-h-0 flex-1 md:min-h-[520px] w-full overflow-hidden">
            <Label className="text-rose-700 font-medium shrink-0 mb-1">
              Preview
            </Label>
            <div className="flex-1 min-h-0 overflow-auto">
              <div
                ref={previewRef}
                className="w-full min-w-[420px] min-h-[580px] flex items-center justify-center p-2"
              >
                <CanvasCard
                  backgroundColor={backgroundColor}
                  messageText={text || "Your message here..."}
                  imageUrl={imagePreviewUrl}
                  recipientName={recipientName}
                  width={previewSize.width}
                  height={previewSize.height}
                  className="shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

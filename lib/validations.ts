import { z } from "zod";

export const loveNoteEmailSchema = z.object({
  recipientEmail: z
    .string()
    .email("Invalid email address")
    .max(254, "Email address too long")
    .toLowerCase()
    .trim(),
  senderName: z
    .string()
    .min(1, "Sender name is required")
    .max(100, "Sender name too long")
    .trim()
    .refine((val) => val.length > 0, "Sender name cannot be empty"),
});

export const loveNoteSchema = z.object({
  recipientName: z
    .string()
    .min(1, "Recipient name is required")
    .max(100, "Recipient name too long")
    .trim(),
  recipientEmail: z
    .string()
    .email("Invalid email address")
    .max(254, "Email address too long")
    .toLowerCase()
    .trim(),
  messageText: z
    .string()
    .min(1, "Message is required")
    .max(400, "Message too long (max 400 characters)")
    .trim(),
  backgroundColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format")
    .default("#E11D48"),
  templateId: z.string().uuid().optional().nullable(),
});

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .trim(),
  role: z
    .string()
    .max(100, "Role too long")
    .trim(),
  shortBio: z
    .string()
    .max(500, "Short bio too long (max 500 characters)")
    .trim()
    .optional(),
  fullBio: z
    .string()
    .max(2000, "Full bio too long (max 2000 characters)")
    .trim()
    .optional(),
  tags: z
    .array(
      z
        .string()
        .max(50, "Tag too long")
        .regex(/^[a-zA-Z0-9\s-]+$/, "Tags can only contain letters, numbers, spaces, and hyphens")
    )
    .max(20, "Too many tags (max 20)")
    .optional(),
  linkedin: z
    .string()
    .url("Invalid LinkedIn URL")
    .max(255)
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url("Invalid Twitter URL")
    .max(255)
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .max(255)
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("Invalid website URL")
    .max(255)
    .optional()
    .or(z.literal("")),
});

export const searchQuerySchema = z.object({
  q: z
    .string()
    .max(100, "Search query too long")
    .trim()
    .optional(),
});

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.object({
          id: z.string(),
          name: z.string().max(100),
          price: z.number().int().positive().max(1000000),
          image: z.string().max(500),
        }),
        size: z.string().max(20),
        color: z.string().max(50),
        quantity: z.number().int().positive().max(99),
      })
    )
    .min(1, "Cart cannot be empty")
    .max(50, "Too many items in cart"),
});

export type LoveNoteEmail = z.infer<typeof loveNoteEmailSchema>;
export type LoveNote = z.infer<typeof loveNoteSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type CheckoutRequest = z.infer<typeof checkoutSchema>;

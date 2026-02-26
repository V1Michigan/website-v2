import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { loveNoteEmailSchema } from "@/lib/validations";
import { emailRateLimiter, getClientIdentifier } from "@/lib/rate-limit";
import { ZodError } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimit = emailRateLimiter.check(identifier);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    
    const validatedData = loveNoteEmailSchema.parse(body);
    const { recipientEmail, senderName } = validatedData;

    const safeSenderName = escapeHtml(senderName);
    const safeRecipientEmail = recipientEmail;

    const { error } = await resend.emails.send({
      from: "V1 @ Michigan <valentines@v1michigan.com>",
      to: safeRecipientEmail,
      subject: "You've received a Valentine! 💌",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; text-align: center;">
          <h1 style="color: #E11D48; font-size: 24px; margin-bottom: 16px;">You've got a Valentine's note!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Hey there :) You have received a letter from <strong>${safeSenderName}</strong>.
            Login at <a href="https://v1michigan.com/valentines" style="color: #E11D48;">v1michigan.com/valentines</a> to see it!
          </p>
          <p style="color: #9CA3AF; font-size: 14px; margin-top: 24px;">
            With love, V1 @ Michigan
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

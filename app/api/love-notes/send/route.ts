import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Set RESEND_API_KEY in .env.local (local) or in Vercel/hosting env vars (production).
// Get your key at https://resend.com/api-keys
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, senderName } = (await request.json()) as {
      recipientEmail: string;
      senderName: string;
    };

    if (!recipientEmail || !senderName) {
      return NextResponse.json(
        { error: "Missing recipientEmail or senderName" },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "V1 @ Michigan <valentines@v1michigan.com>",
      to: recipientEmail,
      subject: "You've received a Valentine! 💌",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; text-align: center;">
          <h1 style="color: #E11D48; font-size: 24px; margin-bottom: 16px;">You've got a Valentine's note!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Hey there :) You have received a letter from <strong>${senderName}</strong>.
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
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

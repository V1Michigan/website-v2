import type React from "react";
import "./globals.css";
import { Inter, Playfair_Display, Instrument_Serif } from "next/font/google";
import { cn } from "@/utils/cn";
import { CSPostHogProvider } from "@/components/shared/posthog-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { FlagsProvider } from "@/components/shared/flags-provider";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "V1 @ Michigan",
  description:
    "V1 is the premier student-run entrepreneurship organization at Michigan dedicated to empowering builders and innovators of tomorrow.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          playfair.variable,
          instrumentSerif.variable
        )}
      >
        <CSPostHogProvider>
          <AuthProvider>
            <FlagsProvider>{children}</FlagsProvider>
          </AuthProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}

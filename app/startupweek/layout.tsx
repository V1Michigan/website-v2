import type { Metadata } from "next";
import type { ReactNode } from "react";

const startupWeekPreviewImage = "https://v1michigan.com/startup-week-v1-preview.png";

export const metadata: Metadata = {
  title: "Startup Week | V1 @ Michigan",
  description: "Where the best startups hire the best builders.",
  openGraph: {
    title: "Startup Week | V1 @ Michigan",
    description: "Where the best startups hire the best builders.",
    url: "https://v1michigan.com/startupweek",
    images: [
      {
        url: startupWeekPreviewImage,
        alt: "V1 @ Michigan logo",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup Week | V1 @ Michigan",
    description: "Where the best startups hire the best builders.",
    images: [startupWeekPreviewImage],
  },
};

export default function StartupWeekLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}

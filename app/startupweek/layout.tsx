import type { Metadata } from "next";

const startupWeekPreviewImage = "https://v1michigan.com/excluded.png";

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
        alt: "People networking at startup event",
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
  children: React.ReactNode;
}>) {
  return children;
}

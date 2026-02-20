import type React from "react";

export const metadata = {
  title: "North Star Portfolio - V1 at Michigan",
  description: "Explore the portfolio of successful startups and companies from V1's North Star program.",
};

export default function NorthStarPortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

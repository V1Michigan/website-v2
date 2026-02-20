import type React from "react";

export const metadata = {
  title: "Startup Week - V1 at Michigan",
  description: "Join V1 Startup Week for tech talks, events, and networking opportunities with Michigan's startup community.",
};

export default function StartupWeekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

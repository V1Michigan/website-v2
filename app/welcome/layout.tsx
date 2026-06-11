import type React from "react";

export const metadata = {
  title: "Welcome - V1 at Michigan",
  description: "Welcome to V1 at Michigan. Redirecting to the home page...",
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

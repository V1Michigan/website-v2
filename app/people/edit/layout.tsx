import type React from "react";

export const metadata = {
  title: "Edit Profile - V1 at Michigan",
  description: "Edit your profile information in the V1 community directory.",
};

export default function EditPersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

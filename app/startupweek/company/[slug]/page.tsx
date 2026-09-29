import type { Metadata } from "next";
import CompanyPortal from "@/components/startup-week/company-portal";

export const metadata: Metadata = {
  title: "Startup Week Company Portal | V1 Michigan",
  robots: { index: false, follow: false },
};
export default function CompanyPage() { return <CompanyPortal />; }

import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "@/components/startup-week/company-portal.module.css";
import CompanyPortal from "@/components/startup-week/company-portal";

export const metadata: Metadata = {
  title: "Startup Week Company Portal | V1 Michigan",
  robots: { index: false, follow: false },
};
export default function CompanyPage() {
  return (
    <div className={`${styles.shell} flex h-dvh min-h-0 flex-col overflow-hidden bg-[#FAF7F2] text-[#444444]`}>
      <div className={`${styles.chrome} shrink-0`}><Header /></div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden"><CompanyPortal /></div>
      <div className={`${styles.chrome} shrink-0`}><Footer /></div>
    </div>
  );
}

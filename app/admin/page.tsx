import type { Metadata } from "next";
import AdminConsole from "@/components/startup-week/admin-console";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Startup Week Admin | V1 Michigan",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#444444]">
      <Header />
      <AdminConsole />
      <Footer />
    </div>
  );
}

import GoogleAuth from "@/components/auth/google-auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Sign In - V1 at Michigan",
  description: "Sign in to access the V1 community portal and manage your profile.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <GoogleAuth />
        </div>
      </main>
      <Footer />
    </div>
  );
}

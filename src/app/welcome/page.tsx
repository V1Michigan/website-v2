"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the index page
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FEF9F5] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Welcome! Redirecting...</p>
      </div>
    </div>
  );
}

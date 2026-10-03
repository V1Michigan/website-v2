"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailOtpForm from "./email-otp-form";

export default function EmailAuth() {
  const router = useRouter();
  return <Card className="mx-auto w-full max-w-md">
    <CardHeader>
      <CardTitle>Welcome to V1 Michigan</CardTitle>
      <CardDescription>Enter your email and we’ll send you a one-time sign-in code.</CardDescription>
    </CardHeader>
    <CardContent><EmailOtpForm onVerified={() => router.replace("/welcome")} /></CardContent>
  </Card>;
}

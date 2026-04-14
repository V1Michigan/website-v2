"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/utils/supabaseClient";
import { LogOut } from "lucide-react";

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to V1 Michigan</CardTitle>
        <CardDescription>
          Sign in with your Google account and connect with our community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>
        {message && (
          <p className="mt-4 text-sm text-red-600">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}

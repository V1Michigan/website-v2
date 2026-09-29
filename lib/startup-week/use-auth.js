"use client";

import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";

// Share the existing website client, login state and refreshed tokens.
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  useEffect(() => {
    let mounted = true;
    let authChanged = false;
    const callback = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const error = callback.get("error_description") || query.get("error_description");
    if (error) setAuthError(error);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      authChanged = true;
      if (mounted) { setSession(current); setLoading(false); }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted || authChanged) return;
      setSession(data.session);
      if (error) setAuthError(error.message);
      setLoading(false);
    }).catch(() => {
      if (mounted) { setAuthError("Unable to load your session. Please sign in again."); setLoading(false); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);
  const signIn = async () => {
    setSigningIn(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
      });
      if (error) throw error;
    } catch (error) {
      setAuthError(error.message || "Google sign-in failed. Please try again.");
      setSigningIn(false);
    }
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(error.message);
  };
  return { user: session?.user ?? null, token: session?.access_token ?? null,
    loading, signIn, signOut, authError, signingIn };
}

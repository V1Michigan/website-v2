"use client";

import { useEffect, useState } from "react";
import supabase, { authStorageKey } from "@/utils/supabaseClient";

// Share the existing website client, login state and refreshed tokens.
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
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
  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setAuthError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error?.name === "AuthSessionMissingError" || error?.code === "session_not_found") {
        // Supabase can reject logout before removing an already-invalid saved session.
        // Clear only this project's auth state and reload to discard its in-memory copy.
        await supabase.auth.stopAutoRefresh();
        for (const suffix of ["", "-code-verifier", "-user"]) {
          window.localStorage.removeItem(`${authStorageKey}${suffix}`);
        }
        window.location.reload();
        return;
      }
      if (error) throw error;
      setSession(null);
    } catch (error) {
      setAuthError(error.message || "Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };
  return { user: session?.user ?? null, token: session?.access_token ?? null,
    loading, signOut, authError, signingOut };
}

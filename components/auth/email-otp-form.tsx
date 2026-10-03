"use client";

import { useEffect, useId, useRef, useState } from "react";
import supabase from "@/utils/supabaseClient";

export default function EmailOtpForm({onVerified}: {onVerified?: () => void}) {
  const id = useId();
  const busy = useRef(false);
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [expiresAt, setExpiresAt] = useState(0);
  const [remaining, setRemaining] = useState(60);
  useEffect(() => {
    if (!expiresAt) return;
    const update = () => setRemaining(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    if (busy.current || cooldown) return;
    const address = (sentTo || email).trim().toLowerCase();
    const requestedAt = Date.now();
    busy.current = true; setPending(true); setError(""); setMessage("");
    try {
      const {error} = await supabase.auth.signInWithOtp({email: address, options: {shouldCreateUser: true}});
      if (error) throw error;
      setSentTo(address); setCode(""); setCooldown(60); setExpiresAt(requestedAt + 60000);
      setMessage("Code requested. Check your inbox and spam folder, and use the latest code.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send a code. Please try again.");
    } finally { busy.current = false; setPending(false); }
  }

  async function verifyCode() {
    if (busy.current) return;
    busy.current = true; setPending(true); setError(""); setMessage("");
    try {
      const {error} = await supabase.auth.verifyOtp({email: sentTo, token: code.trim(), type: "email"});
      if (error) throw error;
      setCode(""); setMessage("Signed in."); onVerified?.();
    } catch {
      setError("That code could not be verified. Check the latest email, try again, or request a new code.");
    } finally { busy.current = false; setPending(false); }
  }

  const button = "w-full rounded-md bg-yellow-400 px-4 py-3 text-sm font-semibold text-[#191919] hover:bg-yellow-300 disabled:opacity-50";
  const input = "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-[#444444] focus:outline-none focus:ring-2 focus:ring-yellow-400";
  return <div className="mx-auto w-full max-w-sm text-left">
    <form onSubmit={event => {event.preventDefault(); void (sentTo ? verifyCode() : sendCode());}} className="space-y-4">
      {sentTo ? <>
        <p className="break-words text-sm text-gray-600">Enter the code sent to <strong>{sentTo}</strong>.</p>
        <label htmlFor={`${id}-code`} className="block text-sm font-medium">Email code
          <input key="code" id={`${id}-code`} autoFocus required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ""))} disabled={pending} className={`${input} tracking-[0.3em]`} />
        </label>
        <p className="text-xs text-gray-500">{remaining > 0 ? `Code expires in about ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}.` : "This code may have expired. Request a new code if it no longer works."}</p>
      </> : <label htmlFor={`${id}-email`} className="block text-sm font-medium">Email address
        <input key="email" id={`${id}-email`} type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} disabled={pending} placeholder="you@company.com" className={input} />
      </label>}
      <button type="submit" disabled={pending || (!sentTo && cooldown > 0)} className={button}>{pending ? (sentTo ? "Verifying…" : "Sending…") : sentTo ? "Verify and sign in" : cooldown ? `Send code in ${cooldown}s` : "Send sign-in code"}</button>
    </form>
    {sentTo && <div className="mt-4 flex justify-between gap-3 text-sm">
      <button type="button" disabled={pending || cooldown > 0} onClick={() => void sendCode()} className="underline underline-offset-4 disabled:opacity-50">{cooldown ? `Resend in ${cooldown}s` : "Resend code"}</button>
      <button type="button" disabled={pending} onClick={() => {setSentTo(""); setExpiresAt(0); setCode(""); setError(""); setMessage("");}} className="underline underline-offset-4">Use a different email</button>
    </div>}
    {message && <p role="status" className="mt-4 text-sm text-gray-600">{message}</p>}
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
  </div>;
}

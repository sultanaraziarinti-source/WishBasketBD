"use client";
import { useState } from "react";
import Link from "next/link";
import AuthShell, { inputCls, labelCls } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setBusy(true);
    const err = await signUp({ firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email, password: form.password });
    setBusy(false);
    if (err) { setError(err); return; }
    setSuccess(true);
  };

  const field = (label: string, key: keyof typeof form, type = "text", ph = "") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} required value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph} className={inputCls} />
    </div>
  );

  return (
    <AuthShell title="Create your account" subtitle="Join Wish Basket BD — it's free!">
      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-heart/10 text-heart text-sm">{error}</div>}
      {success && <div className="mb-4 px-4 py-3 rounded-xl bg-sage text-brand text-sm">Account created! If we sent you a confirmation email, click the link in it first. Then <Link href="/login" className="font-bold underline">sign in</Link>.</div>}
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {field("First Name", "firstName", "text", "Rahim")}
          {field("Last Name", "lastName", "text", "Ahmed")}
        </div>
        {field("Email Address", "email", "email", "you@example.com")}
        {field("Password", "password", "password", "At least 6 characters")}
        {field("Confirm Password", "confirm", "password", "Repeat your password")}
        <button disabled={busy} className="w-full py-3.5 rounded-full bg-gold hover:bg-gold-dk text-brand-dk font-semibold transition-colors cursor-pointer disabled:opacity-60">{busy ? "Creating…" : "Create Account →"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand/60">
        Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

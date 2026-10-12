"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthShell, { inputCls, labelCls } from "@/components/AuthShell";

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return (
      <AuthShell title={`Hi, ${user.name.split(" ")[0]} 👋`} subtitle="You're already signed in.">
        <div className="space-y-3">
          <Link href="/account" className="block text-center py-3.5 rounded-full bg-brand text-cream font-semibold">Go to My Account</Link>
          <Link href="/shop" className="block text-center py-3.5 rounded-full border-2 border-sage text-brand font-semibold hover:bg-sage">Continue Shopping</Link>
        </div>
      </AuthShell>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await signIn(email, password);
    setBusy(false);
    if (err) { setError(err); return; }
    router.push("/account");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Wish Basket account">
      {error && <div className="mb-4 px-4 py-3 rounded-xl bg-heart/10 text-heart text-sm">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className={labelCls}>Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className={inputCls} />
        </div>
        <button disabled={busy} className="w-full py-3.5 rounded-full bg-brand hover:bg-brand-dk text-cream font-semibold transition-colors cursor-pointer disabled:opacity-60">{busy ? "Signing in…" : "Sign In →"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-brand/60">
        New to Wish Basket? <Link href="/signup" className="font-semibold text-gold-dk hover:underline">Create an account</Link>
      </p>
      <p className="mt-3 text-center text-xs text-brand/40">
        Store admin? <Link href="/admin/login" className="underline hover:text-brand">Admin login</Link>
      </p>
    </AuthShell>
  );
}

"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

const FEATURES = [
  ["🛡️", "Secure Access", "Admin-only management area"],
  ["🗂️", "Manage Categories", "Add, update and remove categories"],
  ["🛍️", "Manage Items", "Add products with photos and prices"],
  ["📦", "Orders & Customers", "Track orders and see who's buying"],
];

const input = "w-full pl-10 pr-4 py-3.5 border-2 border-sage rounded-xl text-sm focus:outline-none focus:border-brand bg-white";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Please enter both email and password."); return; }
    setBusy(true);
    const err = await login(email, password);
    setBusy(false);
    if (err) { setError(err); setPassword(""); return; }
    router.replace("/admin/manage");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center p-12 bg-brand-dk text-cream">
        <Link href="/" target="_blank" rel="noopener" title="Open store home page in a new tab" className="flex items-center gap-3 mb-2 w-fit">
          <span className="w-24 h-24 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg"><Image src="/logo.png" alt="Wish Basket BD" width={84} height={84} preload /></span>
          <span className="leading-none">
            <span className="block font-script text-4xl">Wish</span>
            <span className="block text-xs font-bold tracking-[0.3em] text-gold">BASKET BD</span>
          </span>
        </Link>
        <p className="text-cream/60 mb-10">Admin Control Panel</p>
        {FEATURES.map(([icon, title, desc]) => (
          <div key={title} className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-lg shrink-0">{icon}</div>
            <div><h4 className="font-bold">{title}</h4><p className="text-cream/60 text-sm">{desc}</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center p-8 bg-cream">
        <div className="w-full max-w-md">
          <Link href="/" target="_blank" rel="noopener" title="Open store home page in a new tab" className="md:hidden flex justify-center mb-6"><Image src="/logo.png" alt="Wish Basket BD" width={110} height={110} /></Link>
          <h1 className="text-3xl font-extrabold text-brand-dk mb-1">Admin sign in 🛡️</h1>
          <p className="text-brand/60 mb-8">Restricted area — administrators only</p>
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-heart/10 border border-heart/30 text-heart text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-brand mb-1.5">Admin Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand/40">✉</span>
                <input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" className={input} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand/40">🔒</span>
                <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" className={input} />
              </div>
            </div>
            <button disabled={busy} className="w-full py-3.5 rounded-xl bg-brand hover:bg-brand-dk text-cream font-bold text-sm cursor-pointer disabled:opacity-60">{busy ? "Signing in…" : "Sign In as Admin →"}</button>
          </form>
          <div className="mt-6 text-center text-sm">
            <Link href="/" className="font-bold text-gold-dk hover:underline">← Back to store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

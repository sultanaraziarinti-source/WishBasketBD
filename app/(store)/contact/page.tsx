"use client";
import { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { inputCls, labelCls } from "@/components/AuthShell";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";

export default function ContactPage() {
  const { settings, sendMessage } = useShop();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await sendMessage(form);
    setBusy(false);
    if (!res.ok) return toast("Couldn't send your message. Please try again.", "error");
    setForm({ name: "", phone: "", message: "" });
    toast("Thanks! We'll get back to you soon.");
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <PageBanner crumbs={[["Contact Us"]]} script="We'd love to hear from you" title="Contact Us" />

      <div className="mt-6 grid md:grid-cols-[1fr_1.3fr] gap-6">
        <div className="space-y-3">
          {[
            ["📞", "Hotline", settings.hotline],
            ["✉️", "Email", settings.email],
            ["📍", "Address", settings.address],
            ["🕘", "Hours", "Every day, 10am – 9pm"],
          ].map(([icon, label, value]) => (
            <div key={label} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-sage">
              <span className="w-12 h-12 rounded-full bg-sage flex items-center justify-center text-xl shrink-0">{icon}</span>
              <span><span className="block text-xs text-brand/60">{label}</span><span className="font-semibold text-brand">{value}</span></span>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="p-6 rounded-3xl bg-white border border-sage space-y-4">
          <h2 className="text-xl font-bold text-brand">Send us a message</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Your Name</label><input required value={form.name} onChange={set("name")} className={inputCls} /></div>
            <div><label className={labelCls}>Phone</label><input required type="tel" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Message</label><textarea required rows={5} value={form.message} onChange={set("message")} className={`${inputCls} h-auto py-3`} /></div>
          <button disabled={busy} className="w-full py-3.5 rounded-full bg-brand hover:bg-brand-dk text-cream font-semibold transition-colors cursor-pointer disabled:opacity-60">{busy ? "Sending…" : "Send Message"}</button>
        </form>
      </div>
    </div>
  );
}

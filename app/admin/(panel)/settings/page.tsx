"use client";
import { useState } from "react";
import { PageHead, btnPrimary, card, field, label } from "@/components/admin/ui";
import { useAdmin } from "@/context/AdminContext";
import { useShop } from "@/context/ShopContext";
import { useToast } from "@/context/ToastContext";
import { Settings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { settings, saveSettings } = useShop();
  const { changePassword } = useAdmin();
  const toast = useToast();
  const [s, setS] = useState<Settings>(settings);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  const text = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS(cur => ({ ...cur, [k]: e.target.value }));
  const money = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => setS(cur => ({ ...cur, [k]: Math.max(0, Number(e.target.value) || 0) }));

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveSettings(s);
    toast(res.ok ? "Store settings saved" : `Couldn't save: ${res.error}`, res.ok ? "success" : "error");
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return setPwError("New passwords do not match.");
    const err = await changePassword(pw.current, pw.next);
    if (err) return setPwError(err);
    setPwError("");
    setPw({ current: "", next: "", confirm: "" });
    toast("Admin password changed");
  };

  return (
    <>
      <PageHead title="Settings" sub="Store information, delivery charges and admin account" />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={saveStore} className={`${card} p-5 space-y-4`}>
          <h3 className="font-semibold text-brand">Store information</h3>
          <div><label className={label}>Announcement bar text</label><input value={s.announcement} onChange={text("announcement")} className={field} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={label}>Hotline</label><input value={s.hotline} onChange={text("hotline")} className={field} /></div>
            <div><label className={label}>Email</label><input type="email" value={s.email} onChange={text("email")} className={field} /></div>
          </div>
          <div><label className={label}>Address</label><input value={s.address} onChange={text("address")} className={field} /></div>

          <h3 className="pt-2 font-semibold text-brand">Delivery charges</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className={label}>Inside Dhaka (৳)</label><input type="number" min={0} value={s.deliveryInside} onChange={money("deliveryInside")} className={field} /></div>
            <div><label className={label}>Outside Dhaka (৳)</label><input type="number" min={0} value={s.deliveryOutside} onChange={money("deliveryOutside")} className={field} /></div>
            <div><label className={label}>Free delivery from (৳)</label><input type="number" min={0} value={s.freeDeliveryAt} onChange={money("freeDeliveryAt")} className={field} /></div>
          </div>
          <button className={btnPrimary}>Save settings</button>
        </form>

        <form onSubmit={savePw} className={`${card} p-5 space-y-4`}>
          <h3 className="font-semibold text-brand">Change admin password</h3>
          {pwError && <div className="px-3 py-2 rounded-lg bg-heart/10 text-heart text-sm">{pwError}</div>}
          <div><label className={label}>Current password</label><input type="password" required autoComplete="current-password" value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} className={field} /></div>
          <div><label className={label}>New password (min 8 characters)</label><input type="password" required autoComplete="new-password" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} className={field} /></div>
          <div><label className={label}>Confirm new password</label><input type="password" required autoComplete="new-password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} className={field} /></div>
          <button className={btnPrimary}>Update password</button>
        </form>
      </div>
    </>
  );
}

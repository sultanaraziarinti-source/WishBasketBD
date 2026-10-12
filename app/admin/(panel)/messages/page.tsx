"use client";
import { PageHead, btnDanger, card } from "@/components/admin/ui";
import { formatDate } from "@/lib/products";
import { useShop } from "@/context/ShopContext";

export default function AdminMessagesPage() {
  const { messages, setMessageRead, deleteMessage } = useShop();
  const unread = messages.filter(m => !m.read).length;

  const toggle = (id: number) => { const m = messages.find(x => x.id === id); if (m) setMessageRead(id, !m.read); };
  const remove = (id: number) => { if (window.confirm("Delete this message?")) deleteMessage(id); };
  const markAllRead = () => messages.filter(m => !m.read).forEach(m => setMessageRead(m.id, true));

  return (
    <>
      <PageHead title="Messages" sub={`${messages.length} messages from the Contact page · ${unread} unread`}
        action={unread > 0 && <button onClick={markAllRead} className="text-sm font-semibold text-brand underline cursor-pointer">Mark all read</button>} />
      {messages.length === 0 ? <div className={`${card} p-10 text-center text-brand/50 text-sm`}>No messages yet.</div> : (
        <ul className="space-y-3">
          {messages.map(m => (
            <li key={m.id} className={`${card} p-5 ${m.read ? "" : "border-l-4 border-l-gold"}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <b className="text-brand">{m.name}</b>
                <a href={`tel:${m.phone}`} className="text-sm text-brand/70 hover:underline">{m.phone}</a>
                {!m.read && <span className="px-2 py-0.5 rounded-full bg-gold-lt text-gold-dk text-[11px] font-bold">NEW</span>}
                <span className="ml-auto text-xs text-brand/50">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm text-brand/80 whitespace-pre-wrap">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => toggle(m.id)} className="text-xs font-semibold text-brand hover:underline cursor-pointer">{m.read ? "Mark unread" : "Mark read"}</button>
                <button onClick={() => remove(m.id)} className={btnDanger}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

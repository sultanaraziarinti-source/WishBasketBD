"use client";
import { useState } from "react";
import { formatTk } from "@/lib/products";

export interface Day { label: string; date: string; revenue: number; orders: number; }

// Single-series bar chart of daily revenue. Hover/focus a column for the exact figure; table view for screen readers.
export default function SalesChart({ days }: { days: Day[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(1, ...days.map(d => d.revenue));
  const nice = niceCeil(max);
  const ticks = [0, nice / 2, nice];
  const H = 180;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-brand">Revenue · last 7 days</h3>
          <p className="text-xs text-brand/50">Excludes cancelled orders</p>
        </div>
        <button onClick={() => setShowTable(s => !s)} className="text-xs font-semibold text-brand/70 hover:text-brand underline cursor-pointer">{showTable ? "Show chart" : "Show table"}</button>
      </div>

      {showTable ? (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-brand/60"><th className="py-1.5">Day</th><th className="text-right">Orders</th><th className="text-right">Revenue</th></tr></thead>
          <tbody>{days.map(d => <tr key={d.date} className="border-t border-sage"><td className="py-1.5">{d.date}</td><td className="text-right tabular-nums">{d.orders}</td><td className="text-right tabular-nums">{formatTk(d.revenue)}</td></tr>)}</tbody>
        </table>
      ) : (
        <div className="flex gap-2">
          <div className="relative w-12 shrink-0 text-[10px] text-brand/50 tabular-nums" style={{ height: H }}>
            {ticks.map(t => <span key={t} className="absolute right-1 -translate-y-1/2" style={{ top: H - (t / nice) * H }}>{shortTk(t)}</span>)}
          </div>
          <div className="flex-1">
            <div className="relative" style={{ height: H }}>
              {ticks.map(t => <div key={t} className={`absolute inset-x-0 ${t === 0 ? "border-t border-brand/30" : "border-t border-sage/70"}`} style={{ top: H - (t / nice) * H }} />)}
              <div className="absolute inset-0 flex items-end gap-[2px]">
                {days.map((d, i) => {
                  const h = (d.revenue / nice) * H;
                  const on = hover === i;
                  return (
                    <button key={d.date} type="button" aria-label={`${d.date}: ${formatTk(d.revenue)}, ${d.orders} orders`}
                      onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                      className="relative flex-1 h-full flex items-end justify-center cursor-default focus:outline-none">
                      <span className={`w-full max-w-10 rounded-t-[4px] transition-colors ${on ? "bg-brand-dk" : "bg-brand"}`} style={{ height: Math.max(d.revenue ? 2 : 0, h) }} />
                      {on && (
                        <span className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-brand-dk text-cream text-xs px-2.5 py-1.5 shadow-lg pointer-events-none" style={{ bottom: Math.min(h, H - 40) + 6 }}>
                          <b className="block">{formatTk(d.revenue)}</b>{d.date} · {d.orders} order{d.orders === 1 ? "" : "s"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-[2px] mt-1.5">
              {days.map(d => <span key={d.date} className="flex-1 text-center text-[11px] text-brand/60">{d.label}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function niceCeil(n: number) {
  const p = Math.pow(10, Math.floor(Math.log10(n)));
  const m = n / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

const shortTk = (n: number) => n >= 1000 ? `৳${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : `৳${n}`;

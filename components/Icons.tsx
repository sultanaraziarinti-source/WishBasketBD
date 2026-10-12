type P = { className?: string; filled?: boolean };

const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };

export const SearchIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const HeartIcon = ({ className = "w-5 h-5", filled }: P) => (
  <svg {...base} fill={filled ? "currentColor" : "none"} className={className}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" /></svg>
);
export const BagIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
export const UserIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const HomeIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
);
export const GridIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
);
export const MenuIcon = ({ className = "w-6 h-6" }: P) => (
  <svg {...base} className={className}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const CloseIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const ChevronIcon = ({ className = "w-5 h-5", dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg {...base} className={className}><path d={dir === "right" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} /></svg>
);
export const TruckIcon = ({ className = "w-5 h-5" }: P) => (
  <svg {...base} className={className}><path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>
);
export const PhoneIcon = ({ className = "w-4 h-4" }: P) => (
  <svg {...base} className={className}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
);
export const StarIcon = ({ className = "w-3.5 h-3.5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
);

import Image from "next/image";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-14">
      <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden bg-white border border-sage shadow-xl shadow-brand/5">
        <div className="hidden md:flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-sage to-cream">
          <Image src="/logo.png" alt="Wish Basket BD" width={260} height={260} />
          <p className="mt-4 font-script text-3xl text-brand">Bringing Happiness</p>
          <p className="text-gold-dk font-semibold tracking-wide">to Your Home ♥</p>
        </div>
        <div className="p-6 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-brand">{title}</h1>
          <p className="text-brand/60 mt-1 mb-6 text-sm">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export const inputCls = "w-full h-12 px-4 rounded-xl border-2 border-sage bg-cream/50 text-sm focus:outline-none focus:border-brand";
export const labelCls = "block text-sm font-medium text-brand mb-1.5";

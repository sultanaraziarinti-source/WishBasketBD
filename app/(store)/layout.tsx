import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-white">{children}</main>
      <Footer />
      <CartSidebar />
      <MobileBottomNav />
    </>
  );
}

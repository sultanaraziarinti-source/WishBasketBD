import type { Metadata } from "next";
import { Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-poppins" });
const script = Dancing_Script({ subsets: ["latin"], weight: ["700"], variable: "--font-script-face" });

export const metadata: Metadata = {
  title: "Wish Basket BD — Your Favorite Finds, Delivered with Care",
  description: "Home essentials, decor & crafts, kids items, gifts and plants — handpicked products with delivery all over Bangladesh.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${script.variable}`}>
      <body className="font-sans antialiased">
        <AdminProvider>
          <AuthProvider>
            <ShopProvider>
              <WishlistProvider>
                <CartProvider>
                  <ToastProvider>{children}</ToastProvider>
                </CartProvider>
              </WishlistProvider>
            </ShopProvider>
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  );
}

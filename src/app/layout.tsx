import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { CartProvider } from "@/context/CartContext";

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"), { ssr: false });
const MobileNav = dynamic(() => import("@/components/layout/MobileNav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), { ssr: false });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://buybookzs.com'),
  title: "BuyBookz",
  description: "Browse, discover, and purchase your favorite books with a premium reading experience.",
  icons: {
    icon: '/favicon.ico',
    apple: '/newlogo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <ToastProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
        <WhatsAppButton />
        <MobileNav />
      </body>
    </html>
  );
}

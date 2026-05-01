"use client";

import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"), { ssr: false });
const MobileNav = dynamic(() => import("@/components/layout/MobileNav"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"), { ssr: false });

export default function ClientLayout() {
  return (
    <>
      <WhatsAppButton />
      <MobileNav />
      <CartDrawer />
    </>
  );
}

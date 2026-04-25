import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms & Conditions | BuyBookz",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto space-y-10">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">BuyBookz</span>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-primary">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By using BuyBookz, you agree to the terms below for browsing, ordering, payments, and support.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground/80">
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Orders</h2>
            <p>All orders are subject to stock availability and confirmation from BuyBookz. We may cancel or limit any order if stock, pricing, or listing details are incorrect.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Pricing & Payment</h2>
            <p>All prices shown on the website are in Indian Rupees. Payments must be completed successfully before an order is processed for dispatch.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Shipping & Delivery</h2>
            <p>Delivery timelines may vary by location, courier availability, and public holidays. We will share support updates through our contact channels when needed.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Returns & Support</h2>
            <p>If you receive a damaged or incorrect item, contact us as soon as possible at bybookzbookz@gmail.com or +91 96772 01727 so we can help.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Contact</h2>
            <p>For any questions about these terms, contact BuyBookz by email at bybookzbookz@gmail.com, phone at +91 96772 01727, or WhatsApp at the same number.</p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}

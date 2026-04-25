import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | BuyBookz",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto space-y-10">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">BuyBookz</span>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-primary">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This policy explains how BuyBookz collects, uses, and protects your information.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-7 text-foreground/80">
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Information We Collect</h2>
            <p>We may collect your name, email address, phone number, delivery address, and order details when you register, contact us, or place an order.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">How We Use Information</h2>
            <p>We use your information to process orders, provide support, improve the website experience, and share important updates related to your purchases.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Data Protection</h2>
            <p>We take reasonable steps to protect your personal information, but no internet-based system can be guaranteed as fully secure.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Third-Party Services</h2>
            <p>We may use trusted third-party services for payments, hosting, analytics, and delivery support. Those services handle data according to their own privacy practices.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-primary">Contact</h2>
            <p>If you have any privacy-related questions, contact BuyBookz at bybookzbookz@gmail.com or +91 96772 01727.</p>
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}

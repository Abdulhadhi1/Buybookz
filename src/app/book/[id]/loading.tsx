import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FDFAF5] text-primary">
      <Navbar />
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="space-y-6">
            <div className="aspect-square w-full rounded-[2rem] bg-[#F4F1EA]" />
            <div className="flex space-x-4">
              <div className="w-24 h-24 rounded-2xl bg-[#F4F1EA]" />
              <div className="w-24 h-24 rounded-2xl bg-[#F4F1EA]" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-6 w-24 rounded-full bg-[#F4F1EA]" />
            <div className="h-16 w-full rounded-2xl bg-[#F4F1EA]" />
            <div className="h-8 w-40 rounded-full bg-[#F4F1EA]" />
            <div className="h-28 w-full rounded-[2rem] bg-[#F4F1EA]" />
            <div className="flex items-center gap-4">
              <div className="h-14 w-36 rounded-xl bg-[#F4F1EA]" />
              <div className="h-14 flex-1 rounded-xl bg-[#F4F1EA]" />
            </div>
            <div className="flex items-center gap-3 text-accent">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Loading Book</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

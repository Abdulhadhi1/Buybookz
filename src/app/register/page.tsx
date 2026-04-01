"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, ArrowLeft, Phone } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-secondary/30 flex items-center justify-center p-6">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center space-x-2 text-sm font-bold tracking-widest uppercase hover:text-accent transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-background rounded-[2.5rem] p-10 shadow-2xl border border-border"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join our premium book community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-6 py-3 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-6 py-3 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-sm"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-12 pr-6 py-3 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-sm"
                placeholder="+91 00000 00000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-6 py-3 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p className="text-destructive text-xs font-medium text-center bg-destructive/10 py-2 rounded-xl">
              {error}
            </motion.p>
          )}

          <button
            disabled={loading}
            className="w-full mt-4 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Join Community</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

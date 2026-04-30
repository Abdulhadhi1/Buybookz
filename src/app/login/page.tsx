"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Welcome back! Login successful", "success");
        if (data.user.role === "ADMIN") {
            router.push("/admin");
        } else {
            router.push("/");
        }
        setTimeout(() => {
            router.refresh();
        }, 100);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your BuyBookz account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-14 pr-6 py-4 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-14 pr-6 py-4 bg-secondary/50 rounded-full border border-transparent focus:border-accent focus:bg-background outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="text-destructive text-sm font-medium text-center bg-destructive/10 py-3 rounded-2xl"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Sign In</span>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-accent font-bold hover:underline">
            Register Now
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

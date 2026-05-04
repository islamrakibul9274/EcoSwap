"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="p-8 md:p-10 shadow-lg border-none">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-foreground/70">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <div className="flex justify-end">
            <Link href="#" className="text-sm font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Log In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/70">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

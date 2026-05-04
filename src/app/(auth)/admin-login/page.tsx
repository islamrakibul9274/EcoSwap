"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Shield, Lock } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        throw new Error(data.error || "Authentication failed");
      }

      if (data.user?.role !== "ADMIN") {
        throw new Error("Access denied. Admin privileges required.");
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="p-8 border-terracotta border-t-4 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-sm text-foreground/60 mt-2">Restricted access. Authorized personnel only.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Admin Email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Lock className="w-4 h-4 text-foreground/50" />}
            />
            <Input 
              label="Security Key (Password)" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4 text-foreground/50" />}
            />
            <Button type="submit" variant="primary" className="w-full h-12 text-base font-bold bg-terracotta hover:bg-terracotta/90 border-transparent" isLoading={loading}>
              Authenticate
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

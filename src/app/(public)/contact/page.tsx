"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto py-12 px-4 md:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Have a question about a swap? Need help with your account? We're here to help the EcoSwap community grow.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-8 h-full bg-cream border-surface-dim">
            <h3 className="font-heading text-2xl font-bold mb-6 flex items-center text-primary">
              <MessageSquare className="w-6 h-6 mr-3 text-terracotta" />
              Get in Touch
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-foreground/50 mb-1 flex items-center"><Mail className="w-4 h-4 mr-2" /> Support Email</p>
                <p className="font-semibold text-foreground">support@ecoswap.com</p>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground/50 mb-1">Response Time</p>
                <p className="font-semibold text-foreground">Usually within 24 hours</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-2">Message Sent!</h3>
                <p className="text-foreground/70 mb-6">Thanks for reaching out. We'll get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Your Name" required placeholder="Jane Doe" />
                  <Input label="Email Address" type="email" required placeholder="jane@example.com" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-foreground">Message</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full bg-white border border-[#c2c9bb] rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

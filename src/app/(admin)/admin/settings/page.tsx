"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Settings, Save, Globe, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Site Settings</h1>
          <p className="text-foreground/70">Configure global platform behavior and rules.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" /> General Config
          </h2>
          <Card className="p-6 grid md:grid-cols-2 gap-6">
            <Input label="Platform Name" defaultValue="EcoSwap Community" />
            <Input label="Contact Email" defaultValue="support@ecoswap.com" />
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-foreground mb-2 block">Site Description (SEO)</label>
              <textarea 
                className="w-full h-24 bg-white border border-[#c2c9bb] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                defaultValue="Join the largest community of plant lovers. Swap cuttings, share tips, and grow your indoor jungle sustainably."
              />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" /> Security & Registration
          </h2>
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-dim">
              <div>
                <p className="font-bold text-foreground">Allow Public Registration</p>
                <p className="text-xs text-foreground/60">If disabled, only admins can invite new users.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-dim">
              <div>
                <p className="font-bold text-foreground">Require Email Verification</p>
                <p className="text-xs text-foreground/60">Users must verify email before creating listings.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </Card>
        </motion.div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" isLoading={loading} className="px-8">
            <Save className="w-4 h-4 mr-2" /> Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

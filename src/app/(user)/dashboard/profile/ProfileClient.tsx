"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User as UserIcon, Mail, Sprout, Calendar, Settings, LogOut, Bell } from "lucide-react";
import { useState } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  memberSince: string;
  plantsCount: number;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
}

export default function ProfileClient({ user }: { user: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    notificationPreferences: user.notificationPreferences
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsEditing(false);
        // Ideally mutate SWR or force refresh here, but for now just state is enough
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-foreground/70">Manage your account settings and personal details.</p>
        </div>
        {/* <Button variant="outline" className="hidden md:flex text-red-600 border-red-200 hover:bg-red-50">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button> */}
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-cream border-4 border-surface-dim flex items-center justify-center mb-6 text-primary shadow-sm overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 opacity-50" />
              )}
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">{user.name}</h2>
            <p className="text-foreground/60 font-medium mb-6">{user.role}</p>

            <div className="w-full pt-6 border-t border-surface-dim flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60 flex items-center"><Sprout className="w-4 h-4 mr-2" /> Plants Listed</span>
                <span className="font-bold text-primary">{user.plantsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Joined</span>
                <span className="font-bold text-foreground">{new Date(user.memberSince).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-heading text-xl font-bold flex items-center text-foreground">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Account Details
              </h3>
              <Button variant={isEditing ? "ghost" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isSaving}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <form id="profile-form" onSubmit={handleSave} className="space-y-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                icon={<UserIcon className="w-4 h-4 text-foreground/50" />}
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                icon={<Mail className="w-4 h-4 text-foreground/50" />}
              />
            </form>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold flex items-center text-foreground">
                <Bell className="w-5 h-5 mr-2 text-primary" />
                Notification Preferences
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-surface-dim">
                <div>
                  <h4 className="font-semibold text-foreground">Email Notifications</h4>
                  <p className="text-sm text-foreground/60">Receive emails for new messages and swap updates.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.notificationPreferences.email}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: { ...formData.notificationPreferences, email: e.target.checked }
                    })}
                  />
                  <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50 peer-disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-semibold text-foreground">In-App Notifications</h4>
                  <p className="text-sm text-foreground/60">Receive real-time alerts inside the dashboard.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.notificationPreferences.inApp}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({
                      ...formData,
                      notificationPreferences: { ...formData.notificationPreferences, inApp: e.target.checked }
                    })}
                  />
                  <div className="w-11 h-6 bg-surface-dim peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-50 peer-disabled:opacity-50"></div>
                </label>
              </div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-8 flex justify-end"
              >
                <Button type="submit" form="profile-form" variant="primary" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save All Changes"}
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

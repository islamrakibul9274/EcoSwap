"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Sprout, ShieldAlert, Settings, LogOut, ArrowLeft } from "lucide-react";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { useState } from "react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Listings Manager", href: "/admin/listings", icon: Sprout },
  { name: "Moderation Queue", href: "/admin/reports", icon: ShieldAlert },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin-login";
    } catch {
      window.location.href = "/admin-login";
    }
  };

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-primary h-screen sticky top-0 hidden md:flex flex-col text-cream">
        <div className="p-6 h-20 border-b border-white/10 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">E</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">EcoAdmin</span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <p className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 mt-4">Management</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/admin");
              return (
                <Link key={item.name} href={item.href} className="block relative">
                  {isActive && (
                    <motion.div
                      layoutId="admin-sidebar-active"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                    isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  )}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </Link>
          <button 
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-semibold text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      <LogoutModal 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
}

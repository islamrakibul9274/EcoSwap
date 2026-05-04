"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Sprout, Heart, Send, MessageSquare, Bell, User, LogOut } from "lucide-react";
import { LogoutModal } from "@/components/ui/LogoutModal";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Plants", href: "/dashboard/plants", icon: Sprout },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { name: "Swap Requests", href: "/dashboard/swaps", icon: Send },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function UserSidebar() {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <aside className="w-64 flex-shrink-0 border-r border-surface-dim bg-white h-[calc(100vh-80px)] sticky top-20 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              E
            </div>
            <div>
              <h3 className="font-heading font-bold text-foreground">EcoSwap User</h3>
              <p className="text-xs text-foreground/60">Plant Enthusiast</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href} className="block relative">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                    isActive ? "text-primary" : "text-foreground/70 hover:text-foreground hover:bg-surface"
                  )}>
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-surface-dim">
          <button 
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
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

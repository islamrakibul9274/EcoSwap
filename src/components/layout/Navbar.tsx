"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Menu, X, User, LayoutDashboard, LogOut, Shield, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { pusherClient } from '@/lib/pusherClient';

const publicLinks = [
  { label: "Find Plants", href: "/plants" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Fetch auth state on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          // Fetch initial notification count
          fetch('/api/notifications')
            .then(r => r.json())
            .then(notifs => {
              if (Array.isArray(notifs)) {
                setUnreadNotifications(notifs.filter(n => !n.read).length);
              }
            }).catch(console.error);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Listen to Pusher for real-time notifications
  useEffect(() => {
    if (!user || !pusherClient) return;

    const channel = pusherClient.subscribe(`private-user-${user.id}`);

    channel.bind("new-notification", () => {
      setUnreadNotifications(prev => prev + 1);
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`private-user-${user.id}`);
      }
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    setLogoutOpen(false);
    window.location.href = "/login";
  };

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/admin-login';

  return (
    <>
      <nav className="w-full bg-cream border-b border-surface-dim sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-cream font-heading font-bold text-lg">E</span>
            </div>
            <span className="font-heading font-bold text-xl text-primary tracking-tight">EcoSwap</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-foreground">
            {publicLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              // Skeleton pulse while checking auth
              <div className="flex items-center gap-3">
                <div className="w-20 h-8 bg-surface-dim rounded-lg animate-pulse" />
                <div className="w-20 h-8 bg-surface-dim rounded-lg animate-pulse" />
              </div>
            ) : user ? (
              // Logged-in state
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard/notifications" 
                  className="relative p-2 text-foreground/70 hover:text-primary transition-colors"
                  aria-label={`Notifications ${unreadNotifications > 0 ? `(${unreadNotifications} unread)` : ''}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-terracotta rounded-full border-2 border-cream"></span>
                  )}
                </Link>

                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-surface transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-surface-dim py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-surface-dim">
                          <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                          <Link 
                            href="/dashboard" 
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-foreground/60" />
                            Dashboard
                          </Link>
                          <Link 
                            href="/dashboard/profile" 
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                          >
                            <User className="w-4 h-4 text-foreground/60" />
                            My Profile
                          </Link>
                          {user.role === 'ADMIN' && (
                            <Link 
                              href="/admin" 
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
                            >
                              <Shield className="w-4 h-4 text-foreground/60" />
                              Admin Panel
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-surface-dim">
                          <button 
                            onClick={() => { setDropdownOpen(false); setLogoutOpen(true); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              // Logged-out state
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cream border-t border-surface-dim overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {publicLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                      pathname === link.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-surface'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {!loading && (
                  <div className="pt-4 border-t border-surface-dim">
                    {user ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-foreground/60">{user.email}</p>
                          </div>
                        </div>
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-surface transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/dashboard/notifications" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-surface transition-colors">
                          <div className="flex items-center gap-3">
                            <Bell className="w-4 h-4" /> Notifications
                          </div>
                          {unreadNotifications > 0 && (
                            <span className="bg-terracotta text-white text-xs px-2 py-0.5 rounded-full">{unreadNotifications}</span>
                          )}
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-surface transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-surface transition-colors">
                            <Shield className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={() => { setMobileOpen(false); setLogoutOpen(true); }}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                          <Button variant="outline" className="w-full">Log In</Button>
                        </Link>
                        <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                          <Button variant="primary" className="w-full">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Click-outside overlay for dropdown */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}

      <LogoutModal 
        isOpen={logoutOpen} 
        onClose={() => setLogoutOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
}

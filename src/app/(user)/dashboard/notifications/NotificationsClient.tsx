"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Bell, MessageSquare, Repeat, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusherClient";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  read: boolean;
  link?: string;
}

export default function NotificationsClient({ initialNotifications, notifications: oldNotifs, currentUserId }: { initialNotifications?: Notification[], notifications?: Notification[], currentUserId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications || oldNotifs || []);

  useEffect(() => {
    if (!pusherClient) return;
    const channel = pusherClient.subscribe(`private-user-${currentUserId}`);

    channel.bind("new-notification", (newNotif: Notification) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`private-user-${currentUserId}`);
      }
    };
  }, [currentUserId]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'request': return <Repeat className="w-5 h-5 text-primary" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-terracotta" />;
      default: return <Info className="w-5 h-5 text-foreground/50" />;
    }
  };

  const markAsRead = async (id: string) => {
    const notif = notifications.find(n => n.id === id);
    if (!notif || notif.read) return;

    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id })
      });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      // Revert on error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // Real implementation would also call API to mark all as read
  };

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Notifications</h1>
          <p className="text-foreground/70">Stay up to date with your swaps and messages.</p>
        </div>
        <button onClick={markAllAsRead} className="text-sm font-semibold text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        {(!notifications || notifications.length === 0) ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Bell className="w-12 h-12 text-surface-dim mb-4" />
            <p className="text-foreground/60 font-medium">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-dim">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`p-6 flex gap-4 transition-colors cursor-pointer ${notif.read ? 'bg-white hover:bg-surface' : 'bg-primary/5 hover:bg-primary/10'}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-surface-dim' : 'bg-white shadow-sm'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-base ${notif.read ? 'text-foreground/80' : 'text-foreground'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-foreground/50 whitespace-nowrap ml-4">
                      {new Date(notif.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${notif.read ? 'text-foreground/60' : 'text-foreground/80'}`}>
                    {notif.message}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

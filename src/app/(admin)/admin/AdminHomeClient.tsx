"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { 
  Users, 
  Sprout, 
  ShieldAlert, 
  Activity, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";

interface Analytics {
  totals: {
    users: number;
    listings: number;
    swaps: number;
  };
  recentUsers: any[];
  categoryStats: any[];
  growthData: any[];
}

interface Log {
  _id: string;
  adminId: { name: string; role: string };
  action: string;
  details: string;
  createdAt: string;
}

interface AdminHomeClientProps {
  stats: {
    totalUsers: number;
    activeListings: number;
    pendingModeration: number;
    swapSuccessRate: string;
  };
}

export default function AdminHomeClient({ stats }: AdminHomeClientProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, lRes] = await Promise.all([
          fetch('/api/admin/analytics'),
          fetch('/api/admin/logs')
        ]);
        const aData = await aRes.json();
        const lData = await lRes.json();
        
        if (aRes.ok) setAnalytics(aData);
        if (lRes.ok) setLogs(lData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="h-8 w-64 bg-surface-dim rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface-dim rounded-3xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-surface-dim rounded-3xl animate-pulse" />
          <div className="h-96 bg-surface-dim rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: analytics?.totals.users || 0, icon: Users, color: "bg-blue-500" },
    { label: "Active Listings", value: analytics?.totals.listings || 0, icon: Sprout, color: "bg-green-500" },
    { label: "Successful Swaps", value: analytics?.totals.swaps || 0, icon: Activity, color: "bg-primary" },
    { label: "New Users (7d)", value: analytics?.growthData.reduce((acc, curr) => acc + curr.count, 0) || 0, icon: TrendingUp, color: "bg-amber-500" },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-primary mb-2 tracking-tight">System Insights</h1>
          <p className="text-foreground/60 font-medium italic">High-level metrics for the EcoSwap ecosystem.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-surface-dim">
           <Calendar className="w-4 h-4 text-primary" />
           <span className="text-sm font-bold text-foreground/60">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border-none bg-white">
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-4xl font-heading font-bold text-foreground mb-1 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-surface rounded-full group-hover:scale-110 transition-transform -z-0" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Logs */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
             <h2 className="font-heading text-2xl font-bold text-foreground tracking-tight">Admin Audit Trail</h2>
             <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Latest 50 Actions</span>
          </div>
          <Card className="p-0 overflow-hidden border-none shadow-sm bg-white">
            <div className="max-h-[500px] overflow-y-auto divide-y divide-surface-dim scrollbar-hide">
              {logs.length === 0 ? (
                <div className="p-12 text-center">
                   <AlertCircle className="w-12 h-12 text-surface-dim mx-auto mb-4" />
                   <p className="text-foreground/40 font-medium italic">No admin actions recorded yet.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {log.adminId.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {log.adminId.name} <span className="text-foreground/40 font-medium">({log.adminId.role})</span>
                        </p>
                        <p className="text-xs text-foreground/70 mt-0.5">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">
                          {new Date(log.createdAt).toLocaleString()}
                       </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Categories Distribution */}
        <div>
           <h2 className="font-heading text-2xl font-bold text-foreground mb-6 tracking-tight">Growth & Scale</h2>
           <Card className="p-8 border-none bg-primary text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <div>
                    <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">New Signups (7d)</h3>
                    <div className="flex items-end gap-2">
                       <p className="text-5xl font-bold">{analytics?.growthData.reduce((acc, curr) => acc + curr.count, 0) || 0}</p>
                       <TrendingUp className="w-8 h-8 text-white/40 mb-1" />
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Top Categories</p>
                    {analytics?.categoryStats.slice(0, 3).map((cat, idx) => (
                       <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                             <span>{cat._id}</span>
                             <span>{Math.round((cat.count / (analytics?.totals.listings || 1)) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full bg-white" style={{ width: `${(cat.count / (analytics?.totals.listings || 1)) * 100}%` }} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <ShieldAlert className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-12" />
           </Card>

           <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Recent Signups</h4>
              {analytics?.recentUsers.map((user, idx) => (
                 <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-surface-dim">
                    <div className="w-8 h-8 rounded-full bg-surface-dim flex items-center justify-center font-bold text-[10px] text-foreground/60 uppercase">
                       {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
                       <p className="text-[10px] text-foreground/40">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

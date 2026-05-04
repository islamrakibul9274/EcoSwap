"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Sprout, Send, Star } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  user: any;
  stats: {
    plantsCount: number;
    pendingRequestsCount: number;
    completedSwapsCount: number;
  };
  recentActivity: any[];
}

export default function DashboardClient({ user, stats, recentActivity }: DashboardClientProps) {
  const statCards = [
    { label: "My Plants", value: stats.plantsCount, icon: Sprout },
    { label: "Pending Requests", value: stats.pendingRequestsCount, icon: Send },
    { label: "Completed Swaps", value: stats.completedSwapsCount, icon: Star },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-foreground/70">Welcome back, {user.name}!</p>
        </div>
        <Link href="/dashboard/add">

          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Plant
          </Button>
        </Link>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
         <Card className="lg:col-span-8 p-8 border-none bg-primary text-white shadow-xl shadow-primary/20 overflow-hidden relative">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
                     {user.level || 1}
                  </div>
                  <div>
                     <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Level Progress</p>
                     <h3 className="text-xl font-bold">Community Sprout</h3>
                  </div>
                  <div className="ml-auto text-right">
                     <p className="text-xs font-bold text-white/60 mb-1">{user.xp || 0} / {(Math.pow(user.level || 1, 2)) * 100} XP</p>
                  </div>
               </div>
               
               <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((user.xp || 0) / (Math.pow(user.level || 1, 2) * 100)) * 100}%` }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
               </div>
            </div>
            {/* Background pattern */}
            <Sprout className="absolute -bottom-4 -right-4 w-48 h-48 text-white/5 rotate-12" />
         </Card>

         <Card className="lg:col-span-4 p-8 border-none bg-white shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4">Earned Badges</h4>
            <div className="flex flex-wrap gap-3">
               {user.badges && user.badges.length > 0 ? (
                 user.badges.map((badge: string, i: number) => (
                   <motion.div 
                     key={i}
                     whileHover={{ scale: 1.1 }}
                     className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-xl shadow-sm border border-surface-dim"
                     title={badge}
                   >
                     {badge.split(' ')[0]}
                   </motion.div>
                 ))
               ) : (
                 <p className="text-xs text-foreground/40 italic">Complete actions to earn badges!</p>
               )}
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-primary">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-sm font-semibold text-foreground/60">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Recent Activity</h2>
      {recentActivity.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-surface-dim bg-transparent shadow-none">
          <Sprout className="w-12 h-12 text-surface-dim mx-auto mb-4" />
          <p className="text-foreground/60 font-medium">No recent activity. List a new plant to get started!</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-surface-dim">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-surface transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{activity.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

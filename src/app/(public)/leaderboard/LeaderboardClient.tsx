"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Sprout, TrendingUp } from "lucide-react";

interface User {
  _id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: string[];
}

export default function LeaderboardClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/gamification/leaderboard');
        const data = await res.json();
        if (res.ok) setUsers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-amber-400" />;
      case 1: return <Medal className="w-6 h-6 text-slate-400" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700" />;
      default: return <span className="text-sm font-bold text-foreground/40">#{index + 1}</span>;
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto py-12 px-6">
      <div className="text-center mb-12">
         <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <TrendingUp className="w-4 h-4" />
            Top Community Swappers
         </div>
         <h1 className="font-heading text-4xl font-bold text-primary mb-4">Community Leaderboard</h1>
         <p className="text-foreground/60 max-w-lg mx-auto italic">
            Celebrating our most active plant enthusiasts and green thumbs.
         </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 bg-surface-dim rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 flex items-center gap-6 border-none shadow-sm hover:shadow-md transition-shadow ${index < 3 ? 'bg-white border-l-4 border-primary' : 'bg-white/50'}`}>
                <div className="w-10 flex items-center justify-center">
                   {getRankIcon(index)}
                </div>

                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-white shadow-sm overflow-hidden">
                   {user.avatar ? (
                     <img src={user.avatar} className="w-full h-full object-cover" />
                   ) : (
                     user.name.charAt(0)
                   )}
                </div>

                <div className="flex-1">
                   <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                     {user.name}
                     {index === 0 && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                   </h3>
                   <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                         <Sprout className="w-3 h-3" />
                         Level {user.level}
                      </div>
                      <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                         {user.xp} XP
                      </div>
                   </div>
                </div>

                <div className="hidden md:flex gap-2">
                   {(user.badges || []).slice(0, 3).map((badge, i) => (
                     <div key={i} className="px-2 py-1 bg-surface-dim rounded-lg text-[10px] font-bold" title={badge}>
                        {badge.split(' ')[0]}
                     </div>
                   ))}
                   {(user.badges || []).length > 3 && (
                     <div className="px-2 py-1 bg-surface-dim rounded-lg text-[10px] font-bold text-foreground/40">
                        +{(user.badges || []).length - 3}
                     </div>
                   )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

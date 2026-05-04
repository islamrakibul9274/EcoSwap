"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Search, 
  UserX, 
  Shield, 
  ShieldCheck, 
  User as UserIcon,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'Active' | 'Suspended';
  joined: string;
}

export default function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateUser = async (id: string, updates: Partial<UserData>) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-terracotta" />;
      case 'MODERATOR': return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      default: return <UserIcon className="w-4 h-4 text-foreground/40" />;
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl font-bold text-primary mb-2 tracking-tight">User Directory</h1>
          <p className="text-foreground/60 font-medium italic">Manage permissions and account statuses for all members.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-12 px-6 font-bold text-xs">
              Bulk Actions
           </Button>
           <Button variant="primary" className="h-12 px-6 font-bold text-xs shadow-lg shadow-primary/20">
              Export Database
           </Button>
        </div>
      </div>

      <Card className="p-4 flex flex-col lg:flex-row gap-4 border-none shadow-sm bg-white">
        <div className="flex-1">
          <Input 
            placeholder="Search by name, email or ID..." 
            icon={<Search className="w-4 h-4 text-foreground/30" />}
            className="h-12 bg-surface-dim/50 border-none rounded-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
             <select className="h-12 bg-surface-dim/50 border-none rounded-2xl pl-11 pr-8 text-xs font-bold focus:outline-none appearance-none cursor-pointer">
                <option>All Roles</option>
                <option>USER</option>
                <option>MODERATOR</option>
                <option>ADMIN</option>
             </select>
          </div>
          <select className="h-12 bg-surface-dim/50 border-none rounded-2xl px-6 text-xs font-bold focus:outline-none appearance-none cursor-pointer">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-none shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-dim text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                <th className="p-6">Member Information</th>
                <th className="p-6">Access Level</th>
                <th className="p-6">Account Status</th>
                <th className="p-6">Registration</th>
                <th className="p-6 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-surface/30 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-dim flex items-center justify-center font-bold text-foreground/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{user.name}</p>
                          <p className="text-xs text-foreground/40 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-xs font-bold text-foreground/70">{user.role}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/40 italic">
                         {new Date(user.joined).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        {user.role === 'USER' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                            onClick={() => updateUser(user.id, { role: 'MODERATOR' })}
                            isLoading={processingId === user.id}
                          >
                             Promote to Moderator
                          </Button>
                        ) : user.role === 'MODERATOR' ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200"
                            onClick={() => updateUser(user.id, { role: 'USER' })}
                            isLoading={processingId === user.id}
                          >
                             Demote to User
                          </Button>
                        ) : null}

                        {user.status === 'Active' ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl"
                            onClick={() => updateUser(user.id, { status: 'Suspended' })}
                            isLoading={processingId === user.id}
                            title="Suspend Account"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 text-green-400 hover:bg-green-50 hover:text-green-600 rounded-xl"
                            onClick={() => updateUser(user.id, { status: 'Active' })}
                            isLoading={processingId === user.id}
                            title="Reactivate Account"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <AlertCircle className="w-12 h-12 text-surface-dim mx-auto mb-4" />
                    <p className="text-foreground/40 font-medium italic">No members found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

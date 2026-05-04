"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  Leaf, 
  Clock, 
  MoreVertical,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

interface Report {
  _id: string;
  reporterId: { _id: string; name: string; email: string };
  targetType: 'LISTING' | 'USER';
  targetId: string;
  reason: string;
  status: 'Pending' | 'Resolved' | 'Dismissed';
  createdAt: string;
}

export default function ReportsClient() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (res.ok) setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (id: string, status: 'Resolved' | 'Dismissed') => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: `Action taken: ${status}` })
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-primary font-heading">Moderation Queue</h1>
            <p className="text-foreground/60">Review and resolve content flags from users.</p>
         </div>
         <div className="flex items-center gap-4 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">{reports.filter(r => r.status === 'Pending').length} Pending Reports</span>
         </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-surface-dim rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-surface-dim">
           <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
           </div>
           <h3 className="text-xl font-bold text-foreground mb-1">Queue is clear!</h3>
           <p className="text-foreground/50">Great job, everything is looking good.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {reports.map((report) => (
              <motion.div
                key={report._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className={`p-6 md:p-8 hover:shadow-md transition-shadow border-l-4 ${report.status === 'Pending' ? 'border-amber-400' : report.status === 'Resolved' ? 'border-green-400' : 'border-slate-200'}`}>
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Header */}
                    <div className="lg:w-64 space-y-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${report.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-surface text-foreground/40'}`}>
                        {report.status === 'Pending' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {report.status}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-1">Target Type</span>
                        <div className="flex items-center gap-2 font-bold text-sm">
                           {report.targetType === 'LISTING' ? <Leaf className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-blue-500" />}
                           {report.targetType}
                        </div>
                      </div>
                      <p className="text-[10px] text-foreground/40 font-medium italic">
                        Reported on {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-surface p-6 rounded-2xl relative">
                       <div className="absolute top-4 right-4">
                          <button className="p-2 hover:bg-surface-dim rounded-lg transition-colors text-foreground/40 hover:text-primary">
                             <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="mb-4">
                          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block mb-2">Reason for report</span>
                          <p className="text-sm font-medium text-foreground leading-relaxed italic">
                             "{report.reason}"
                          </p>
                       </div>
                       <div className="flex items-center gap-3 pt-4 border-t border-foreground/5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                             {report.reporterId.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-foreground">Reported by {report.reporterId.name}</p>
                             <p className="text-[10px] text-foreground/40">{report.reporterId.email}</p>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex flex-col justify-center gap-3">
                      {report.status === 'Pending' ? (
                        <>
                          <Button 
                            variant="primary" 
                            className="w-full h-12 font-bold text-xs"
                            onClick={() => handleAction(report._id, 'Resolved')}
                            isLoading={processingId === report._id}
                          >
                             Take Action
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full h-12 font-bold text-xs"
                            onClick={() => handleAction(report._id, 'Dismissed')}
                            isLoading={processingId === report._id}
                          >
                             Dismiss
                          </Button>
                        </>
                      ) : (
                        <div className="p-4 bg-surface rounded-xl text-center">
                           <p className="text-xs font-bold text-foreground/40 italic">
                             Resolved
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

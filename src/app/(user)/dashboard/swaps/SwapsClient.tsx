"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Leaf,
  ChevronRight,
  MoreVertical,
  Star,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusherClient";
import ReviewModal from "./ReviewModal";

interface Swap {
  _id: string;
  requesterId: { _id: string; name: string; avatar?: string };
  targetOwnerId: { _id: string; name: string; avatar?: string };
  targetListingId: { _id: string; name: string; imageUrl?: string };
  offeredListingId?: { _id: string; name: string; imageUrl?: string };
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
  createdAt: string;
}

export default function SwapsClient({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeSwapForReview, setActiveSwapForReview] = useState<Swap | null>(null);

  const fetchSwaps = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/swaps?type=${tab}`);
      const data = await res.json();
      if (res.ok) setSwaps(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [tab]);

  // Real-time updates
  useEffect(() => {
    if (!currentUserId || !pusherClient) return;

    const channel = pusherClient.subscribe(`private-user-${currentUserId}`);
    
    channel.bind('swap-update', () => {
      fetchSwaps(false); // Refetch without showing loading skeleton
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`private-user-${currentUserId}`);
      }
    };
  }, [currentUserId, tab]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/swaps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSwaps(prev => prev.map(s => s._id === id ? { ...s, status: status as any } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessingId(null);
    }
  };

  const handleChat = (swap: Swap) => {
    const otherUser = tab === 'received' ? swap.requesterId : swap.targetOwnerId;
    router.push(`/dashboard/messages?userId=${otherUser._id}`);
  };

  const handleDetails = (swap: Swap) => {
    router.push(`/plants/${swap.targetListingId._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'text-primary bg-primary/10';
      case 'Declined': return 'text-red-600 bg-red-50';
      case 'Completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-amber-600 bg-amber-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted': return <CheckCircle2 className="w-4 h-4" />;
      case 'Declined': return <XCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex p-1 bg-surface-dim rounded-2xl w-fit">
        <button
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'received' ? 'bg-white shadow-sm text-primary' : 'text-foreground/50 hover:text-foreground'}`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          Incoming Requests
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${tab === 'sent' ? 'bg-white shadow-sm text-primary' : 'text-foreground/50 hover:text-foreground'}`}
        >
          <ArrowUpRight className="w-4 h-4" />
          Sent Requests
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-surface-dim rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-surface-dim">
           <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-foreground/20" />
           </div>
           <h3 className="text-xl font-bold text-foreground mb-1">No swap requests yet</h3>
           <p className="text-foreground/50">Your plant trading journey starts here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {swaps.map((swap) => (
              <motion.div
                key={swap._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="p-6 md:p-8 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Status & Date */}
                    <div className="lg:w-48 space-y-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(swap.status)}`}>
                        {getStatusIcon(swap.status)}
                        {swap.status}
                      </div>
                      <p className="text-xs text-foreground/40 font-medium">
                        {new Date(swap.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Swap Content */}
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6 lg:gap-12">
                      {/* Target */}
                      <div className="flex-1 w-full text-center md:text-left">
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-3">Requested Plant</p>
                        <div className="flex items-center gap-4 bg-surface p-3 rounded-2xl">
                          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                             <img src={swap.targetListingId.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <p className="font-bold text-sm truncate">{swap.targetListingId.name}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowUpRight className={`w-5 h-5 text-primary transition-transform ${tab === 'received' ? 'rotate-180' : ''}`} />
                         </div>
                      </div>

                      {/* Offered */}
                      <div className="flex-1 w-full text-center md:text-left">
                        <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-3">Offered in Exchange</p>
                        {swap.offeredListingId ? (
                          <div className="flex items-center gap-4 bg-surface p-3 rounded-2xl border border-primary/10">
                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                               <img src={swap.offeredListingId.imageUrl} className="w-full h-full object-cover" />
                            </div>
                            <p className="font-bold text-sm truncate">{swap.offeredListingId.name}</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-20 bg-surface rounded-2xl border border-dashed border-foreground/10 text-xs text-foreground/40 font-medium italic">
                             Generic Interest / Cash
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-64 flex flex-col justify-center gap-3">
                      {tab === 'received' && swap.status === 'Pending' ? (
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-12 font-bold"
                            onClick={() => handleUpdateStatus(swap._id, 'Accepted')}
                            isLoading={processingId === swap._id}
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-12 font-bold text-red-600 border-red-100 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(swap._id, 'Declined')}
                            isLoading={processingId === swap._id}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : swap.status === 'Accepted' ? (
                        <Button 
                           variant="secondary" 
                           className="w-full h-12 font-bold"
                           onClick={() => handleUpdateStatus(swap._id, 'Completed')}
                           isLoading={processingId === swap._id}
                        >
                           Mark Completed
                        </Button>
                      ) : swap.status === 'Completed' ? (
                        <Button 
                          variant="outline" 
                          className="w-full h-12 font-bold gap-2"
                          onClick={() => {
                            setActiveSwapForReview(swap);
                            setReviewModalOpen(true);
                          }}
                        >
                           <Star className="w-4 h-4 text-amber-400" />
                           Leave Review
                        </Button>
                      ) : (
                        <div className="p-3 bg-surface rounded-xl text-center">
                           <p className="text-xs font-bold text-foreground/40 italic">
                             {swap.status === 'Declined' ? 'Request closed' : 'Waiting for owner'}
                           </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center gap-4 pt-2">
                        <button 
                          onClick={() => handleChat(swap)}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                           <MessageSquare className="w-3 h-3" /> Chat
                        </button>
                        <div className="w-1 h-1 rounded-full bg-foreground/10" />
                        <button 
                          onClick={() => handleDetails(swap)}
                          className="text-xs font-bold text-foreground/40 hover:text-foreground flex items-center gap-1"
                        >
                           <Info className="w-3 h-3" /> Details
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Bubble */}
                  <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/5 relative">
                     <div className="absolute -top-2 left-6 w-4 h-4 bg-primary/5 rotate-45" />
                     <p className="text-xs text-foreground/70 leading-relaxed italic">
                        "{swap.message}"
                     </p>
                     <div className="mt-3 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-[8px] flex items-center justify-center font-bold text-primary">
                           {tab === 'received' ? swap.requesterId.name.charAt(0) : swap.targetOwnerId.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold text-foreground/40">
                           From {tab === 'received' ? swap.requesterId.name : swap.targetOwnerId.name}
                        </span>
                     </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ReviewModal 
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        swapRequestId={activeSwapForReview?._id || ""}
        revieweeId={tab === 'received' ? activeSwapForReview?.requesterId._id || "" : activeSwapForReview?.targetOwnerId._id || ""}
        revieweeName={tab === 'received' ? activeSwapForReview?.requesterId.name || "" : activeSwapForReview?.targetOwnerId.name || ""}
        onSuccess={() => {
          alert("Review submitted successfully!");
        }}
      />
    </div>
  );
}

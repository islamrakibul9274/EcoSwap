"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  requesterName?: string;
  plantName: string;
  message: string;
  status: string;
  date: string;
}

interface RequestsClientProps {
  receivedRequests: Request[];
  sentRequests: Request[];
}

export default function RequestsClient({ receivedRequests: initialReceived, sentRequests: initialSent }: RequestsClientProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedRequests, setReceivedRequests] = useState(initialReceived);
  const [sentRequests, setSentRequests] = useState(initialSent);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const displayedRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  const handleAction = async (requestId: string, newStatus: 'Accepted' | 'Declined') => {
    setActionLoading(requestId);
    try {
      const res = await fetch(`/api/swap-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Optimistically update the UI
        setReceivedRequests(prev =>
          prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r)
        );
      }
    } catch (err) {
      console.error("Failed to update request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Swap Requests</h1>
        <p className="text-foreground/70">Manage your incoming and outgoing plant swap offers.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-surface-dim">
        <button 
          onClick={() => setActiveTab('received')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors ${activeTab === 'received' ? 'text-primary border-b-2 border-primary' : 'text-foreground/60 hover:text-foreground'}`}
        >
          Received Offers ({receivedRequests.length})
        </button>
        <button 
          onClick={() => setActiveTab('sent')}
          className={`pb-4 px-2 font-semibold text-sm transition-colors ${activeTab === 'sent' ? 'text-primary border-b-2 border-primary' : 'text-foreground/60 hover:text-foreground'}`}
        >
          Sent Offers ({sentRequests.length})
        </button>
      </div>

      {displayedRequests.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-surface-dim bg-transparent shadow-none">
          <Clock className="w-12 h-12 text-surface-dim mx-auto mb-4" />
          <p className="text-foreground/60 font-medium">No {activeTab} requests at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-foreground/50">{new Date(req.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {activeTab === 'received' ? (
                        <>{req.requesterName} requested your <span className="text-primary">{req.plantName}</span></>
                      ) : (
                        <>You requested <span className="text-primary">{req.plantName}</span></>
                      )}
                    </h3>
                    <p className="text-sm text-foreground/70 mt-2 bg-surface p-3 rounded-xl italic">&quot;{req.message}&quot;</p>
                  </div>
                  
                  {activeTab === 'received' && req.status === 'Pending' && (
                    <div className="flex gap-3 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        isLoading={actionLoading === req.id}
                        onClick={() => handleAction(req.id, 'Declined')}
                      >
                        <X className="w-4 h-4 mr-1" /> Decline
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        isLoading={actionLoading === req.id}
                        onClick={() => handleAction(req.id, 'Accepted')}
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
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

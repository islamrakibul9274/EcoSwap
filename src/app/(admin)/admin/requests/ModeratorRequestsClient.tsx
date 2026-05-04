"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Flag, Check, X, ShieldAlert } from "lucide-react";
import { useState } from "react";

interface RequestData {
  id: string;
  requester: string;
  target: string;
  status: string;
  plantName: string;
  date: string;
}

export default function ModeratorRequestsClient({ initialRequests }: { initialRequests: RequestData[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter(r => 
    r.id.toLowerCase().includes(search.toLowerCase()) || 
    r.requester.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Moderation Queue</h1>
          <p className="text-foreground/70">Review flagged swap requests and handle community disputes.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-red-50/50 border-red-100">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-red-900">{requests.length}</p>
              <p className="text-xs font-bold text-red-700">Open Tickets</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-surface-dim flex flex-col md:flex-row gap-4 bg-surface/30">
          <Input 
            placeholder="Search by request ID or username..." 
            icon={<Search className="w-4 h-4 text-foreground/50" />}
            className="md:max-w-md h-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-surface-dim text-sm text-foreground/70">
              <th className="p-4 font-bold">Request ID / Plant</th>
              <th className="p-4 font-bold">Parties Involved</th>
              <th className="p-4 font-bold">Issue Status</th>
              <th className="p-4 font-bold">Report Date</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-dim">
            {filteredRequests.map((req, i) => (
              <motion.tr 
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="hover:bg-surface/50 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <p className="font-bold text-sm text-foreground">{req.id.substring(0, 8)}...</p>
                    <p className="text-xs text-foreground/60">Target: {req.plantName}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <span className="font-semibold">{req.requester}</span>
                    <span className="text-foreground/50 mx-2">→</span>
                    <span className="font-semibold">{req.target}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center w-max gap-1 ${
                    req.status.includes('Spam') ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <Flag className="w-3 h-3" />
                    {req.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-foreground/70">
                  {new Date(req.date).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50">
                      <Check className="w-3 h-3 mr-1" /> Resolve
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50">
                      <X className="w-3 h-3 mr-1" /> Cancel Swap
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-foreground/50">
                  No flagged requests matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

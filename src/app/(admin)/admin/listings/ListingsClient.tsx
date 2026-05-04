"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Eye, Trash2, Ban } from "lucide-react";
import { useState } from "react";

interface ListingData {
  id: string;
  plantName: string;
  owner: string;
  type: string;
  status: string;
  date: string;
}

export default function ListingsClient({ initialListings }: { initialListings: ListingData[] }) {
  const [listings, setListings] = useState(initialListings);
  const [search, setSearch] = useState("");

  const filteredListings = listings.filter(l => 
    l.plantName.toLowerCase().includes(search.toLowerCase()) || 
    l.owner.toLowerCase().includes(search.toLowerCase()) ||
    l.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Listings Manager</h1>
          <p className="text-foreground/70">Moderate and manage all plant listings on the platform.</p>
        </div>
      </div>

      <Card className="mb-6 p-4 flex flex-col md:flex-row gap-4">
        <Input 
          placeholder="Search by plant name, owner, or ID..." 
          icon={<Search className="w-4 h-4 text-foreground/50" />}
          className="md:max-w-md h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="h-10 bg-surface border border-surface-dim rounded-lg px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Types</option>
            <option>Cutting</option>
            <option>Rooted Plant</option>
            <option>Full Plant</option>
            <option>Seeds</option>
          </select>
          <select className="h-10 bg-surface border border-surface-dim rounded-lg px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Flagged</option>
            <option>Removed</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-surface-dim text-sm text-foreground/70">
              <th className="p-4 font-bold">Plant / Listing</th>
              <th className="p-4 font-bold">Owner</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Date Listed</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-dim">
            {filteredListings.map((listing, i) => (
              <motion.tr 
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className={`hover:bg-surface/50 transition-colors ${listing.status === 'Flagged' ? 'bg-red-50/30' : ''}`}
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-dim overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=80&h=80&fit=crop&q=60"
                        alt={listing.plantName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{listing.plantName}</p>
                      <p className="text-xs text-foreground/50">ID: {listing.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-semibold text-foreground/80">
                  {listing.owner}
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold text-foreground/70 border border-surface-dim px-2 py-1 rounded-md">
                    {listing.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    listing.status === 'Active' ? 'bg-green-100 text-green-700' : 
                    listing.status === 'Flagged' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-foreground/70">
                  {new Date(listing.date).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Listing">
                      <Eye className="w-4 h-4 text-foreground/60" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Unpublish">
                      <Ban className="w-4 h-4 text-yellow-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete Permanent">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredListings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-foreground/50">
                  No listings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

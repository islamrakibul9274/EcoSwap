"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { X, Send, Leaf, Info, MessageSquare, Heart, Share2, Copy, Check } from "lucide-react";

interface Listing {
  _id: string;
  name: string;
  imageUrl?: string;
}

interface PlantDetailClientProps {
  plantId: string;
  plantName: string;
  ownerId: string;
  myListings: Listing[];
  initialWishlisted: boolean;
}

export default function PlantDetailClient({ plantId, plantName, myListings, initialWishlisted }: PlantDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(`Hi! I'm interested in swapping for your ${plantName}.`);
  const [offeredListingId, setOfferedListingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleWishlist = async () => {
    setWishlistLoading(true);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: plantId }),
      });
      if (res.ok) setIsWishlisted(!isWishlisted);
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this ${plantName} on EcoSwap! 🌿`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this ${plantName} on EcoSwap! 🌿 ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetListingId: plantId,
          offeredListingId: offeredListingId || undefined,
          message
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send request");

      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button 
            variant="primary" 
            className="flex-1 h-14 text-base font-bold shadow-lg shadow-primary/20"
            onClick={() => setIsModalOpen(true)}
          >
             Request Swap
          </Button>
          <button 
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-surface text-foreground/40 hover:text-red-400 hover:bg-red-50'}`}
          >
            <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-12 text-sm font-bold">
             <MessageSquare className="w-4 h-4 mr-2" />
             Message Owner
          </Button>
          
          <div className="relative">
            <button 
              onClick={() => setShowShareDropdown(!showShareDropdown)}
              className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showShareDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-xl border border-surface-dim p-2 z-20 origin-bottom-right"
                  >
                    <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button onClick={shareOnTwitter} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors text-[#1DA1F2]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                      Twitter
                    </button>
                    <button onClick={shareOnWhatsApp} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-surface transition-colors text-[#25D366]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WhatsApp
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {success ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Send className="w-10 h-10 text-primary animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">Request Sent!</h3>
                  <p className="text-foreground/60">The owner has been notified. You can track this in your dashboard.</p>
                </div>
              ) : (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Propose a Swap</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface rounded-full transition-colors">
                      <X className="w-6 h-6 text-foreground/40" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
                       <Info className="w-4 h-4" />
                       {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Message to Owner</label>
                      <textarea
                        rows={4}
                        className="w-full bg-surface border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        placeholder="Explain why you'd like to swap..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Offer one of your plants (Optional)</label>
                      <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {myListings.length === 0 ? (
                          <p className="text-xs text-foreground/50 italic p-4 bg-surface rounded-xl">You haven't listed any plants yet.</p>
                        ) : (
                          myListings.map((listing) => (
                            <div 
                              key={listing._id}
                              onClick={() => setOfferedListingId(offeredListingId === listing._id ? "" : listing._id)}
                              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${offeredListingId === listing._id ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent bg-surface hover:bg-surface-dim'}`}
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-dim">
                                 <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm font-bold flex-1">{listing.name}</span>
                              {offeredListingId === listing._id && <Leaf className="w-4 h-4 text-primary" />}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                      <Button type="button" variant="outline" className="flex-1 h-14" onClick={() => setIsModalOpen(false)}>
                         Cancel
                      </Button>
                      <Button type="submit" variant="primary" className="flex-1 h-14 font-bold" isLoading={loading}>
                         <Send className="w-4 h-4 mr-2" />
                         Send Request
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

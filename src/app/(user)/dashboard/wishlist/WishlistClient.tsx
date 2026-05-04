"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Leaf, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Listing {
  _id: string;
  name: string;
  imageUrl: string;
  type: string;
  category: string;
  ownerId: {
    _id: string;
    name: string;
  };
}

export default function WishlistClient() {
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/user/wishlist');
      const data = await res.json();
      if (res.ok) setWishlist(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id: string) => {
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      if (res.ok) {
        setWishlist(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-80 bg-surface-dim rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-surface-dim">
         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-300" />
         </div>
         <h3 className="text-xl font-bold text-foreground mb-1">Your wishlist is empty</h3>
         <p className="text-foreground/50 mb-8">Save plants you love and they'll appear here!</p>
         <Link href="/plants">
           <Button variant="primary" className="font-bold">Explore Marketplace</Button>
         </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {wishlist.map((plant) => (
          <motion.div
            key={plant._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="group overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-500">
               <div className="relative aspect-[4/3] overflow-hidden">
                 <img 
                    src={plant.imageUrl} 
                    alt={plant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => removeFromWishlist(plant._id)}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                       {plant.type}
                    </span>
                 </div>
               </div>

               <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{plant.name}</h3>
                    <div className="flex items-center gap-2 text-foreground/40 text-xs">
                       <MapPin className="w-3 h-3" />
                       <span>Local Swap</span>
                       <span className="mx-1">•</span>
                       <span className="font-medium text-foreground/60">{plant.ownerId.name}</span>
                    </div>
                  </div>

                  <Link href={`/plants/${plant._id}`}>
                    <Button variant="outline" className="w-full h-11 font-bold group/btn">
                       View Details
                       <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
               </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

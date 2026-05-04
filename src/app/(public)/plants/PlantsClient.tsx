"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MapPin, Search, Filter, SlidersHorizontal, ArrowUpDown, Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Plant {
  _id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  imageUrl?: string;
  ownerId?: {
    name: string;
    avatar?: string;
  };
}

export default function PlantsClient({ 
  initialPlants,
  initialWishlist = [] 
}: { 
  initialPlants: Plant[],
  initialWishlist?: string[]
}) {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [wishlist, setWishlist] = useState<string[]>(initialWishlist);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent, listingId: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        setWishlist(prev => 
          prev.includes(listingId) 
            ? prev.filter(id => id !== listingId) 
            : [...prev, listingId]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('keyword', search);
      if (type !== 'All') params.append('type', type);
      if (category !== 'All') params.append('category', category);
      params.append('sort', sort);
      if (location && sort === 'closest') {
        params.append('lat', location.lat.toString());
        params.append('lng', location.lng.toString());
      }

      const res = await fetch(`/api/listings/search?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlants(data);
      }
    } catch (error) {
      console.error("Failed to fetch plants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlants();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, type, category, sort, location]);

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setSort("closest");
        setGettingLocation(false);
      },
      () => {
        alert("Failed to get location. Please enable location permissions.");
        setGettingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-12">
      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-surface-dim shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text"
              placeholder="Search by plant name or description..."
              className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-none focus:ring-2 focus:ring-primary text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-12 px-4 bg-surface rounded-xl border-none text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="All">All Types</option>
              <option value="Cutting">Cutting</option>
              <option value="Rooted Plant">Rooted Plant</option>
              <option value="Full Plant">Full Plant</option>
            </select>

            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 px-4 bg-surface rounded-xl border-none text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Houseplants">Houseplants</option>
              <option value="Succulents">Succulents</option>
              <option value="Cacti">Cacti</option>
              <option value="Tropicals">Tropicals</option>
              <option value="Herbs">Herbs</option>
              <option value="Rare">Rare</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex bg-surface rounded-xl p-1">
              <button 
                onClick={() => setSort("newest")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sort === 'newest' ? 'bg-white shadow-sm text-primary' : 'text-foreground/50 hover:text-foreground'}`}
              >
                Newest
              </button>
              <button 
                onClick={handleGetLocation}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${sort === 'closest' ? 'bg-white shadow-sm text-primary' : 'text-foreground/50 hover:text-foreground'}`}
              >
                {gettingLocation ? (
                   <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                Nearby
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading && plants.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-[400px] bg-surface-dim rounded-2xl animate-pulse" />
           ))}
        </div>
      ) : plants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-surface-dim">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
             <Search className="w-8 h-8 text-foreground/20" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No plants found</h3>
          <p className="text-foreground/60 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
          <Button 
            variant="ghost" 
            className="mt-6"
            onClick={() => { setSearch(""); setType("All"); setCategory("All"); setSort("newest"); }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {plants.map((plant) => (
              <motion.div
                key={plant._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/plants/${plant._id}`}>
                  <Card interactive className="h-full flex flex-col group overflow-hidden">
                    <div className="h-56 bg-surface-dim overflow-hidden relative">
                      <img
                        src={plant.imageUrl || `https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop&q=80`}
                        alt={plant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <button 
                          onClick={(e) => toggleWishlist(e, plant._id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${wishlist.includes(plant._id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/80 backdrop-blur-sm text-foreground/40 hover:text-red-500 hover:bg-white'}`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(plant._id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                           {plant.type}
                         </span>
                         <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                           {plant.category}
                         </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 bg-white">
                      <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors">{plant.name}</h3>
                      <p className="text-sm text-foreground/70 mb-6 line-clamp-2 leading-relaxed">{plant.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-dim">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {plant.ownerId?.avatar ? (
                              <img src={plant.ownerId.avatar} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              plant.ownerId?.name?.charAt(0) || '?'
                            )}
                          </div>
                          <span className="text-xs font-semibold text-foreground/60">{plant.ownerId?.name || 'Community'}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold">Details</Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

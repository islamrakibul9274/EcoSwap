'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, ExternalLink, Leaf } from "lucide-react";
import Link from "next/link";

interface Plant {
  _id: string;
  name: string;
  type: string;
  category: string;
  status: 'Available' | 'Swapped' | 'Reserved';
  imageUrl: string;
  createdAt: string;
}

export default function MyPlantsClient({ initialPlants }: { initialPlants: Plant[] }) {
  const [plants, setPlants] = useState<Plant[]>(initialPlants);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlants(prev => prev.filter(p => p._id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-primary/10 text-primary';
      case 'Swapped': return 'bg-blue-50 text-blue-600';
      case 'Reserved': return 'bg-amber-50 text-amber-600';
      default: return 'bg-surface-dim text-foreground/40';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/add" className="group h-full">
          <Card className="h-full border-2 border-dashed border-surface-dim flex flex-col items-center justify-center p-8 bg-transparent hover:bg-white hover:border-primary/20 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
              <Plus className="w-8 h-8 text-primary/40 group-hover:text-primary/60" />
            </div>
            <h3 className="font-bold text-foreground/60 group-hover:text-primary transition-colors">Add New Plant</h3>
          </Card>
        </Link>

        {plants.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-2 flex flex-col items-center justify-center py-20 text-center">
            <Leaf className="w-12 h-12 text-surface-dim mb-4" />
            <p className="text-foreground/40 font-medium">You haven't listed any plants yet.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {plants.map((plant, index) => (
              <motion.div
                key={plant._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full flex flex-col group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img 
                      src={plant.imageUrl} 
                      alt={plant.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(plant.status)}`}>
                        {plant.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-foreground truncate flex-1">{plant.name}</h3>
                       <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{plant.category}</p>
                    </div>
                    
                    <p className="text-sm text-foreground/60 mb-6 flex-1">{plant.type}</p>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-surface-dim">
                      <Link href={`/dashboard/edit/${plant._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-10 gap-2">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-10 gap-2 text-red-600 border-red-100 hover:bg-red-50"
                        onClick={() => handleDelete(plant._id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                    
                    <Link href={`/plants/${plant._id}`} className="mt-3 block text-center py-2 text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1">
                       <ExternalLink className="w-3 h-3" /> View Public Page
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

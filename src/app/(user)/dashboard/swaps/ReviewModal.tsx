"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { X, Star, Send, Info } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  swapRequestId: string;
  revieweeId: string;
  revieweeName: string;
  onSuccess: () => void;
}

export default function ReviewModal({ isOpen, onClose, swapRequestId, revieweeId, revieweeName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swapRequestId,
          revieweeId,
          rating,
          comment
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-primary">Leave a Review</h3>
                <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                  <X className="w-6 h-6 text-foreground/40" />
                </button>
              </div>

              <p className="text-foreground/60 mb-8">
                How was your swap experience with <span className="font-bold text-foreground">{revieweeName}</span>?
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
                   <Info className="w-4 h-4" />
                   {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                          className={`w-10 h-10 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-foreground/10'}`} 
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Terrible'}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Your Feedback</label>
                  <textarea
                    rows={4}
                    className="w-full bg-surface border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Tell others about the plant quality, communication, etc..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1 h-14" onClick={onClose}>
                     Maybe Later
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1 h-14 font-bold" isLoading={loading}>
                     <Send className="w-4 h-4 mr-2" />
                     Submit
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import React from 'react';
import { Card } from "@/components/ui/Card";

export default function PlantLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Skeleton */}
        <div className="aspect-square rounded-3xl bg-surface-dim animate-pulse" />

        {/* Info Skeleton */}
        <div className="space-y-8">
          <div className="space-y-4">
             <div className="h-6 w-32 bg-surface-dim rounded-full animate-pulse" />
             <div className="h-12 w-3/4 bg-surface-dim rounded-2xl animate-pulse" />
             <div className="h-6 w-24 bg-surface-dim rounded-full animate-pulse" />
          </div>

          <Card className="p-8 space-y-4 bg-white/50 border-none animate-pulse">
             <div className="h-4 w-full bg-surface-dim rounded-lg" />
             <div className="h-4 w-5/6 bg-surface-dim rounded-lg" />
             <div className="h-4 w-4/6 bg-surface-dim rounded-lg" />
          </Card>

          <div className="grid grid-cols-2 gap-4">
             <div className="h-24 bg-surface-dim rounded-2xl animate-pulse" />
             <div className="h-24 bg-surface-dim rounded-2xl animate-pulse" />
          </div>

          <div className="flex gap-4">
             <div className="h-14 flex-1 bg-surface-dim rounded-2xl animate-pulse" />
             <div className="h-14 w-14 bg-surface-dim rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

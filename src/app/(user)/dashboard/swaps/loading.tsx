import React from 'react';
import { Card } from "@/components/ui/Card";

export default function SwapsLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-64 bg-surface-dim rounded-2xl animate-pulse" />
        <div className="h-4 w-48 bg-surface-dim rounded-lg animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex p-1 bg-surface-dim rounded-2xl w-fit">
        <div className="h-10 w-40 bg-white/50 rounded-xl animate-pulse" />
        <div className="h-10 w-40 rounded-xl animate-pulse" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-8 h-48 bg-white/50 border-none animate-pulse" />
        ))}
      </div>
    </div>
  );
}

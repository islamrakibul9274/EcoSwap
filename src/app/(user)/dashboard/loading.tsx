import React from 'react';
import { Card } from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-12">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-surface-dim rounded-2xl animate-pulse" />
          <div className="h-4 w-48 bg-surface-dim rounded-lg animate-pulse" />
        </div>
        <div className="h-12 w-32 bg-surface-dim rounded-2xl animate-pulse" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6 h-32 bg-white/50 border-none animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-48 bg-surface-dim rounded-xl animate-pulse" />
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 bg-white/50 border-none animate-pulse" />
          ))}
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-40 bg-surface-dim rounded-xl animate-pulse" />
          <Card className="h-96 bg-white/50 border-none animate-pulse" />
        </div>
      </div>
    </div>
  );
}

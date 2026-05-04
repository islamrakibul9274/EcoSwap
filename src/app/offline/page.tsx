"use client";

import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta mb-8 animate-bounce">
        <WifiOff className="w-12 h-12" />
      </div>
      <h1 className="font-heading text-4xl font-bold text-primary mb-4">You're Offline</h1>
      <p className="text-foreground/60 max-w-md mb-8">
        It looks like you've lost your connection. Some parts of EcoSwap may be unavailable until you're back online.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Try Reconnecting
        </Button>
        <Link href="/">
          <Button variant="ghost">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}

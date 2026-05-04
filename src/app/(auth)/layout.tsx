"use client";

import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  );
}

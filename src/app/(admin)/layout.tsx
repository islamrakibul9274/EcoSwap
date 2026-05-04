"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col w-full">
        <header className="h-16 md:h-20 bg-white border-b border-surface-dim px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="font-heading font-bold text-lg text-foreground">Admin Portal</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground">System Admin</p>
              <p className="text-xs text-foreground/60">admin@ecoswap.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              SA
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

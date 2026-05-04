"use client";

import { Navbar } from "@/components/layout/Navbar";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { PageTransition } from "@/components/layout/PageTransition";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto">
        <UserSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

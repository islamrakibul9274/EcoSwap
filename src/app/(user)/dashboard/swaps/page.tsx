import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import SwapsClient from "./SwapsClient";

export const metadata = {
  title: 'Swap Requests | EcoSwap',
  description: 'Manage your incoming and outgoing plant swap requests.',
};

export default async function SwapsPage() {
  const token = cookies().get('token')?.value;
  const payload = token ? await verifyToken(token) : null;

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Swap Requests</h1>
        <p className="text-foreground/60">Track your trades and manage incoming proposals from the community.</p>
      </div>

      <SwapsClient currentUserId={payload?.userId || ""} />
    </div>
  );
}

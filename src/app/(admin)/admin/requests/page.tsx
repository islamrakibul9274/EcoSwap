import connectToDatabase from "@/lib/db";
import SwapRequest from "@/models/SwapRequest";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import ModeratorRequestsClient from "./ModeratorRequestsClient";

export default async function ModeratorRequestsPage() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/admin-login');
  }

  const payload = await verifyToken(token) as any;
  if (!payload || (payload.role?.toUpperCase() !== 'ADMIN' && payload.role?.toUpperCase() !== 'MODERATOR')) {
    redirect('/admin-login');
  }

  await connectToDatabase();

  const flaggedRequestsRaw = await SwapRequest.find({
    status: { $in: ['Reported', 'Disputed', 'Spam'] }
  })
    .populate('requesterId', 'name')
    .populate('targetListingId', 'name ownerId')
    .sort({ createdAt: -1 })
    .lean();

  const flaggedRequests = flaggedRequestsRaw.map((req: any) => ({
    id: req._id.toString(),
    requester: req.requesterId?.name || "Unknown User",
    target: "Target Owner", // In a real app we'd populate the target owner's name deeply
    status: req.status,
    plantName: req.targetListingId?.name || "Unknown Plant",
    date: req.createdAt.toISOString()
  }));

  return <ModeratorRequestsClient initialRequests={flaggedRequests} />;
}

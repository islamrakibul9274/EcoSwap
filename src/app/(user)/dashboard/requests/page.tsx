import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import SwapRequest from "@/models/SwapRequest";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import RequestsClient from "./RequestsClient";

export default async function RequestsPage() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  await connectToDatabase();

  const user = await User.findById(payload.userId).lean() as any;
  if (!user) {
    redirect('/login');
  }

  // Find requests sent TO this user's listings
  const myListingIds = await Listing.find({ ownerId: user._id }).distinct('_id');
  const receivedRequestsRaw = await SwapRequest.find({ targetListingId: { $in: myListingIds } })
    .populate('requesterId', 'name')
    .populate('targetListingId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Find requests sent BY this user
  const sentRequestsRaw = await SwapRequest.find({ requesterId: user._id })
    .populate('targetListingId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const receivedRequests = receivedRequestsRaw.map((req: any) => ({
    id: req._id.toString(),
    requesterName: req.requesterId.name,
    plantName: req.targetListingId.name,
    message: req.message,
    status: req.status,
    date: req.createdAt.toISOString()
  }));

  const sentRequests = sentRequestsRaw.map((req: any) => ({
    id: req._id.toString(),
    plantName: req.targetListingId.name,
    message: req.message,
    status: req.status,
    date: req.createdAt.toISOString()
  }));

  return (
    <RequestsClient 
      receivedRequests={receivedRequests}
      sentRequests={sentRequests}
    />
  );
}

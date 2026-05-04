import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import SwapRequest from "@/models/SwapRequest";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function UserDashboard() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  await connectToDatabase();

  // Fetch real data for the dashboard
  const user = await User.findById(payload.userId).lean() as any;
  
  if (!user) {
    redirect('/login');
  }

  const plantsCount = await Listing.countDocuments({ ownerId: user._id });
  
  const pendingRequestsCount = await SwapRequest.countDocuments({ 
    targetListingId: { $in: await Listing.find({ ownerId: user._id }).distinct('_id') },
    status: 'Pending'
  });

  const completedSwapsCount = await SwapRequest.countDocuments({
    $or: [
      { requesterId: user._id, status: 'Completed' },
      { targetListingId: { $in: await Listing.find({ ownerId: user._id }).distinct('_id') }, status: 'Completed' }
    ]
  });

  // Simplified recent activity just taking the latest swap requests
  const recentActivityRaw = await SwapRequest.find({
    $or: [
      { requesterId: user._id },
      { targetListingId: { $in: await Listing.find({ ownerId: user._id }).distinct('_id') } }
    ]
  }).sort({ createdAt: -1 }).limit(5).populate('requesterId', 'name').lean();

  const recentActivity = recentActivityRaw.map((req: any) => ({
    id: req._id.toString(),
    message: req.requesterId._id.toString() === user._id.toString() 
      ? `You sent a swap request` 
      : `${req.requesterId.name} sent you a swap request`,
    date: req.createdAt
  }));

  const stats = {
    plantsCount,
    pendingRequestsCount,
    completedSwapsCount
  };

  return (
    <DashboardClient 
      user={{ id: user._id.toString(), name: user.name }} 
      stats={stats} 
      recentActivity={recentActivity} 
    />
  );
}

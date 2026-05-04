import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import SwapRequest from "@/models/SwapRequest";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import AdminHomeClient from "./AdminHomeClient";

export default async function AdminDashboard() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/admin-login');
  }

  const payload = await verifyToken(token) as any;
  if (!payload || payload.role?.toUpperCase() !== 'ADMIN') {
    redirect('/admin-login');
  }

  await connectToDatabase();

  const totalUsers = await User.countDocuments();
  const activeListings = await Listing.countDocuments();
  const pendingModeration = await SwapRequest.countDocuments({ status: { $in: ['Reported', 'Disputed', 'Spam'] } });

  const stats = {
    totalUsers,
    activeListings,
    pendingModeration,
    swapSuccessRate: "94%" // Keeping mock percentage for now
  };

  return <AdminHomeClient stats={stats} />;
}

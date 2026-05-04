import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
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

  const plantsCount = await Listing.countDocuments({ ownerId: user._id });

  const userData = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    memberSince: user.createdAt.toISOString(),
    plantsCount,
    notificationPreferences: user.notificationPreferences || { email: true, inApp: true }
  };

  return <ProfileClient user={userData} />;
}

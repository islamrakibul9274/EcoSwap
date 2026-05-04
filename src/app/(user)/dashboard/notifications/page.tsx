import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import NotificationsClient from "./NotificationsClient";

export default async function NotificationsPage() {
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

  const dbNotifications = await Notification.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const notifications = dbNotifications.map(n => ({
    id: n._id.toString(),
    title: n.title,
    message: n.message,
    type: n.type,
    date: n.createdAt.toISOString(),
    read: n.read,
    link: n.link
  }));

  return <NotificationsClient initialNotifications={notifications} currentUserId={user._id.toString()} />;
}

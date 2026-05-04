import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";

export default async function UserManagementPage() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/admin-login');
  }

  const payload = await verifyToken(token) as any;
  if (!payload || payload.role?.toUpperCase() !== 'ADMIN') {
    redirect('/admin-login');
  }

  await connectToDatabase();

  const usersRaw = await User.find().sort({ createdAt: -1 }).lean();

  const users = usersRaw.map((u: any) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    // Add a default status if none exists, in a real app you might have a status field in the schema
    status: u.status || "Active", 
    joined: u.createdAt.toISOString()
  }));

  return <UsersClient initialUsers={users} />;
}

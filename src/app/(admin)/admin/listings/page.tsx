import connectToDatabase from "@/lib/db";
import Listing from "@/models/Listing";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import ListingsClient from "./ListingsClient";

export default async function ListingsManagerPage() {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/admin-login');
  }

  const payload = await verifyToken(token) as any;
  if (!payload || payload.role?.toUpperCase() !== 'ADMIN') {
    redirect('/admin-login');
  }

  await connectToDatabase();

  const listingsRaw = await Listing.find()
    .populate('ownerId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const listings = listingsRaw.map((l: any) => ({
    id: l._id.toString(),
    plantName: l.name,
    owner: l.ownerId?.name || "Unknown User",
    type: l.type,
    status: l.status || "Active",
    date: l.createdAt.toISOString()
  }));

  return <ListingsClient initialListings={listings} />;
}

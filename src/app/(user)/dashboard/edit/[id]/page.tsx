import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Listing from "@/models/Listing";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import EditPlantClient from "./EditPlantClient";

export default async function EditPlantPage({ params }: { params: { id: string } }) {
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

  try {
    const listing = await Listing.findById(params.id).lean() as any;
    
    if (!listing || listing.ownerId.toString() !== user._id.toString()) {
      redirect('/dashboard'); // Not found or not owner
    }

    const plantData = {
      id: listing._id.toString(),
      name: listing.name,
      type: listing.type,
      category: listing.category || 'Houseplants',
      description: listing.description,
      imageUrl: listing.imageUrl,
      location: listing.location
    };

    return <EditPlantClient plant={plantData} />;
  } catch (e) {
    redirect('/dashboard'); // Invalid ID format
  }
}

import connectToDatabase from "@/lib/db";
import Listing from "@/models/Listing";
import PlantsClient from "./PlantsClient";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

export const dynamic = 'force-dynamic';

async function getInitialPlants() {
  try {
    await connectToDatabase();
    const plants = await Listing.find({ status: 'Available' })
      .populate('ownerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    
    // Serialize MongoDB objects
    return JSON.parse(JSON.stringify(plants));
  } catch (error) {
    console.error("Failed to fetch plants:", error);
    return [];
  }
}

export default async function PlantsPage() {
  const initialPlants = await getInitialPlants();
  
  const token = cookies().get('token')?.value;
  let userWishlist: string[] = [];
  
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      await connectToDatabase();
      const user = await User.findById(payload.userId).select('wishlist').lean() as any;
      if (user) {
        userWishlist = (user.wishlist || []).map((id: any) => id.toString());
      }
    }
  }

  return (
    <div className="w-full bg-cream py-12 min-h-[calc(100vh-80px)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-2">Plant Marketplace</h1>
          <p className="text-foreground/70 text-lg">Discover unique cuttings and plants from people in your neighborhood.</p>
        </div>

        <PlantsClient initialPlants={initialPlants} initialWishlist={userWishlist} />
      </div>
    </div>
  );
}

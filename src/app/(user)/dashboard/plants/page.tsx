import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import connectToDatabase from "@/lib/db";
import Listing from "@/models/Listing";
import { redirect } from "next/navigation";
import MyPlantsClient from "./MyPlantsClient";

export const metadata = {
  title: 'My Plants | EcoSwap',
  description: 'Manage your listed plants and swap history.',
};

export default async function MyPlantsPage() {
  const token = cookies().get('token')?.value;
  if (!token) redirect('/login');

  const payload = await verifyToken(token);
  if (!payload) redirect('/login');

  await connectToDatabase();

  const myPlants = await Listing.find({ ownerId: payload.userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">My Plants</h1>
          <p className="text-foreground/60">Manage your collection and see how your plants are doing.</p>
        </div>
      </div>

      <MyPlantsClient initialPlants={JSON.parse(JSON.stringify(myPlants))} />
    </div>
  );
}

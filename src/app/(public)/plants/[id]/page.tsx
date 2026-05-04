import connectToDatabase from "@/lib/db";
import Listing from "@/models/Listing";
import User from "@/models/User";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Leaf, User as UserIcon, MessageSquare, ArrowLeft, ShieldCheck, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { Metadata } from "next";
import PlantDetailClient from "./PlantDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const plant = await getPlant(params.id);
  if (!plant) return { title: 'Plant Not Found | EcoSwap' };

  return {
    title: `${plant.name} | EcoSwap`,
    description: `Swap your plants for ${plant.name}. ${plant.description.substring(0, 150)}...`,
    openGraph: {
      title: `${plant.name} | EcoSwap Marketplace`,
      description: `Available for swap in ${plant.category || 'Houseplants'}.`,
      images: [plant.imageUrl || ''],
    },
  };
}

async function getPlant(id: string) {
  try {
    await connectToDatabase();
    const plant = await Listing.findById(id).populate('ownerId', 'name avatar createdAt').lean();
    if (!plant) return null;
    return JSON.parse(JSON.stringify(plant));
  } catch {
    return null;
  }
}

async function getMyListings() {
  const token = cookies().get('token')?.value;
  if (!token) return [];
  const payload = await verifyToken(token);
  if (!payload) return [];
  
  await connectToDatabase();
  const listings = await Listing.find({ ownerId: payload.userId, status: 'Available' }).lean();
  return JSON.parse(JSON.stringify(listings));
}

async function getWishlistStatus(plantId: string) {
  const token = cookies().get('token')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  if (!payload) return false;

  await connectToDatabase();
  const user = await User.findById(payload.userId).lean() as any;
  if (!user || !user.wishlist) return false;
  
  return user.wishlist.some((id: any) => id.toString() === plantId);
}

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const [plant, myListings, isWishlisted] = await Promise.all([
    getPlant(params.id),
    getMyListings(),
    getWishlistStatus(params.id)
  ]);

  if (!plant) {
    notFound();
  }

  const formattedDate = new Date(plant.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-cream min-h-screen py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/plants" 
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-dim shadow-sm">
              <img 
                src={plant.imageUrl || `https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=600&fit=crop&q=80`}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                 <Leaf className="w-8 h-8 text-primary/20" />
              </div>
              {/* Future: multiple images would go here */}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {plant.type}
                </span>
                <span className="px-3 py-1 bg-surface-dim text-foreground/60 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {plant.category || 'Other'}
                </span>
              </div>
              <h1 className="font-heading text-4xl font-bold text-primary mb-4 leading-tight">{plant.name}</h1>
              <div className="flex items-center gap-2 text-foreground/60 mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Local Swap Available</span>
              </div>
            </div>

            <Card className="p-6 bg-white border-surface-dim">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Description
              </h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {plant.description}
              </p>
            </Card>

            {/* Owner Card */}
            <div className="p-6 rounded-2xl bg-surface border border-surface-dim">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {plant.ownerId?.avatar ? (
                    <img src={plant.ownerId.avatar} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    plant.ownerId?.name?.charAt(0) || '?'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{plant.ownerId?.name}</h4>
                  <p className="text-xs text-foreground/50">Member since {formattedDate}</p>
                </div>
                <div className="ml-auto">
                   <div className="flex items-center gap-1 text-primary">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                   </div>
                </div>
              </div>

              <PlantDetailClient 
                plantId={plant._id} 
                plantName={plant.name} 
                ownerId={plant.ownerId?._id} 
                myListings={myListings}
                initialWishlisted={isWishlisted}
              />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 text-primary/70 text-xs font-medium">
               <Info className="w-4 h-4 flex-shrink-0" />
               <p>Safety Tip: Always meet in public places and inspect the plant before completing a swap.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

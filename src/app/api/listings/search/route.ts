import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Listing from '@/models/Listing';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const maxDistance = searchParams.get('maxDistance') || '50000'; // Default 50km
    const sort = searchParams.get('sort') || 'newest';

    await connectToDatabase();

    let query: any = { status: 'Available' };

    // Keyword search (Regex on name and description)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Filters
    if (type && type !== 'All') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    // Geolocation search ($near)
    if (lat && lng && sort === 'closest') {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      };
    }

    let listingsQuery = Listing.find(query).populate('ownerId', 'name avatar');

    // Sorting
    if (sort === 'newest') {
      listingsQuery = listingsQuery.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      listingsQuery = listingsQuery.sort({ createdAt: 1 });
    }
    // Note: If sort is 'closest' and lat/lng are present, $near already handles the sorting.

    const listings = await listingsQuery.lean();

    return NextResponse.json(listings, { status: 200 });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: error.message || 'Failed to fetch search results' }, { status: 500 });
  }
}

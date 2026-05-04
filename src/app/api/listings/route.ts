import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Listing from '@/models/Listing';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { awardXP } from '@/lib/gamification';
import { detectSpam } from '@/lib/spam-detector';

// Fetch all available listings
// Fetch listings with optional filters
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status');

    let query: any = {};
    if (ownerId) query.ownerId = ownerId;
    if (status) query.status = status;
    else if (!ownerId) query.status = 'Available'; // Default for public feed
    
    const listings = await Listing.find(query)
      .populate('ownerId', 'name avatar')
      .sort({ createdAt: -1 });
      
    return NextResponse.json(listings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch listings' }, { status: 500 });
  }
}

// Create a new listing (requires authentication)
export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, type, category, description, imageUrl, location } = await request.json();

    if (!name || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Automated Spam Check
    if (detectSpam(name) || detectSpam(description)) {
      return NextResponse.json({ error: 'Our automated system flagged this content as spam. Please review and try again.' }, { status: 400 });
    }

    await connectToDatabase();

    const newListing = await Listing.create({
      ownerId: payload.userId,
      name,
      type,
      category: category || 'Other',
      description,
      imageUrl,
      location: location || { type: 'Point', coordinates: [0, 0] },
      status: 'Available'
    });

    // Award XP
    await awardXP(payload.userId, 'LIST_PLANT');

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create listing' }, { status: 500 });
  }
}

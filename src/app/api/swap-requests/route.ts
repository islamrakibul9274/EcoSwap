import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SwapRequest from '@/models/SwapRequest';
import Listing from '@/models/Listing';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// POST — create a new swap request
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

    const { targetListingId, message } = await request.json();

    if (!targetListingId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Verify the listing exists and is available
    const listing = await Listing.findById(targetListingId);
    if (!listing || listing.status !== 'Available') {
      return NextResponse.json({ error: 'Listing not available' }, { status: 400 });
    }

    // Prevent requesting your own listing
    if (listing.ownerId.toString() === payload.userId) {
      return NextResponse.json({ error: 'Cannot request your own listing' }, { status: 400 });
    }

    const newRequest = await SwapRequest.create({
      requesterId: payload.userId,
      targetListingId,
      message,
      status: 'Pending'
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

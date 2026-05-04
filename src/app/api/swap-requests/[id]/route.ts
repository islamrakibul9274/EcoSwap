import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SwapRequest from '@/models/SwapRequest';
import Listing from '@/models/Listing';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// PATCH — accept or decline a swap request
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!['Accepted', 'Declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be Accepted or Declined.' }, { status: 400 });
    }

    await connectToDatabase();

    const swapRequest = await SwapRequest.findById(params.id).populate('targetListingId');
    if (!swapRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Only the listing owner can accept/decline
    const listing = swapRequest.targetListingId as any;
    if (listing.ownerId.toString() !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    swapRequest.status = status;
    await swapRequest.save();

    // If accepted, mark the listing as Pending
    if (status === 'Accepted') {
      await Listing.findByIdAndUpdate(listing._id, { status: 'Pending' });
    }

    return NextResponse.json(swapRequest, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

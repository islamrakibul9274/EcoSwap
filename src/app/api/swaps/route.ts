import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SwapRequest from '@/models/SwapRequest';
import Listing from '@/models/Listing';
import Notification from '@/models/Notification';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { targetListingId, offeredListingId, message } = await request.json();

    if (!targetListingId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const targetListing = await Listing.findById(targetListingId);
    if (!targetListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (targetListing.ownerId.toString() === payload.userId) {
      return NextResponse.json({ error: 'You cannot swap with yourself' }, { status: 400 });
    }

    // Check if already requested
    const existing = await SwapRequest.findOne({
      requesterId: payload.userId,
      targetListingId,
      status: 'Pending'
    });
    if (existing) {
      return NextResponse.json({ error: 'Swap request already pending' }, { status: 400 });
    }

    const newSwap = await SwapRequest.create({
      requesterId: payload.userId,
      targetListingId,
      targetOwnerId: targetListing.ownerId,
      offeredListingId,
      message,
      status: 'Pending'
    });

    // Create Notification for the target owner
    const notification = await Notification.create({
      userId: targetListing.ownerId,
      type: 'SWAP_REQUEST',
      title: 'New Swap Request',
      message: `Someone wants to swap for your ${targetListing.name}!`,
      link: `/dashboard/swaps`,
      read: false
    });

    // Real-time notification via Pusher
    try {
      await pusherServer.trigger(`private-user-${targetListing.ownerId.toString()}`, 'new-notification', notification);
      await pusherServer.trigger(`private-user-${targetListing.ownerId.toString()}`, 'swap-update', { type: 'new' });
    } catch (e) {
      console.error("Pusher error:", e);
    }

    return NextResponse.json(newSwap, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received'; // 'sent' or 'received'

    await connectToDatabase();

    let query: any = {};
    if (type === 'sent') {
      query.requesterId = payload.userId;
    } else {
      query.targetOwnerId = payload.userId;
    }

    const swaps = await SwapRequest.find(query)
      .populate('requesterId', 'name avatar')
      .populate('targetOwnerId', 'name avatar')
      .populate('targetListingId', 'name imageUrl')
      .populate('offeredListingId', 'name imageUrl')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(swaps, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

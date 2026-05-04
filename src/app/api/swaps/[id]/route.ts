import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import SwapRequest from '@/models/SwapRequest';
import Listing from '@/models/Listing';
import Notification from '@/models/Notification';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { pusherServer } from '@/lib/pusher';
import { awardXP } from '@/lib/gamification';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { status } = await request.json(); // Accepted, Declined, Completed
    if (!['Accepted', 'Declined', 'Completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();

    const swap = await SwapRequest.findById(params.id)
      .populate('targetListingId')
      .populate('requesterId')
      .populate('targetOwnerId');

    if (!swap) {
      return NextResponse.json({ error: 'Swap request not found' }, { status: 404 });
    }

    const isOwner = swap.targetOwnerId._id.toString() === payload.userId;
    const isRequester = swap.requesterId._id.toString() === payload.userId;

    if (!isOwner && !isRequester && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only owner can accept/decline
    if (['Accepted', 'Declined'].includes(status) && !isOwner && payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Only the plant owner can accept or decline' }, { status: 403 });
    }

    swap.status = status;
    await swap.save();

    // Notify the other party
    const recipientId = isOwner ? swap.requesterId._id : swap.targetOwnerId._id;
    let notificationTitle = 'Swap Update';
    let notificationMessage = `Your swap request has been ${status.toLowerCase()}.`;

    if (status === 'Accepted') {
        notificationTitle = 'Swap Accepted!';
        notificationMessage = `${swap.targetOwnerId.name} accepted your swap request!`;
    } else if (status === 'Completed') {
        notificationTitle = 'Swap Completed!';
        notificationMessage = `The swap for ${swap.targetListingId.name} is now complete. Please leave a review!`;
        
        // Mark listing as swapped if completed
        await Listing.findByIdAndUpdate(swap.targetListingId._id, { status: 'Swapped' });

        // Award XP to both parties
        await awardXP(swap.requesterId._id.toString(), 'COMPLETE_SWAP');
        await awardXP(swap.targetOwnerId._id.toString(), 'COMPLETE_SWAP');
    }

    const notification = await Notification.create({
      userId: recipientId,
      type: 'SWAP_UPDATE',
      title: notificationTitle,
      message: notificationMessage,
      link: `/dashboard/swaps`,
      read: false
    });

    try {
      await pusherServer.trigger(`private-user-${recipientId.toString()}`, 'new-notification', notification);
      await pusherServer.trigger(`private-user-${recipientId.toString()}`, 'swap-update', { type: 'update', swapId: params.id, status });
    } catch (e) {
      console.error("Pusher error:", e);
    }

    return NextResponse.json(swap, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

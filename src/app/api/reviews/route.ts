import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';
import SwapRequest from '@/models/SwapRequest';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { awardXP } from '@/lib/gamification';

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { swapRequestId, revieweeId, rating, comment } = await request.json();

    if (!swapRequestId || !revieweeId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if swap is completed
    const swap = await SwapRequest.findById(swapRequestId);
    if (!swap || swap.status !== 'Completed') {
      return NextResponse.json({ error: 'You can only review completed swaps' }, { status: 400 });
    }

    // Check if user already reviewed this swap
    const existing = await Review.findOne({
      swapRequestId,
      reviewerId: payload.userId
    });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this swap' }, { status: 400 });
    }

    const review = await Review.create({
      swapRequestId,
      reviewerId: payload.userId,
      revieweeId,
      rating,
      comment
    });

    // Award XP to reviewer
    await awardXP(payload.userId, 'LEAVE_REVIEW');
    
    // Award XP to reviewee if 5 stars
    if (rating === 5) {
      await awardXP(revieweeId, 'RECEIVE_5_STAR');
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

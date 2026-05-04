import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { listingId } = await request.json();
    if (!listingId) return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const wishlist = user.wishlist || [];
    const index = wishlist.indexOf(listingId);

    if (index === -1) {
      wishlist.push(listingId);
    } else {
      wishlist.splice(index, 1);
    }

    user.wishlist = wishlist;
    await user.save();

    return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
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

    await connectToDatabase();
    const user = await User.findById(payload.userId).populate({
      path: 'wishlist',
      populate: { path: 'ownerId', select: 'name avatar' }
    });
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user.wishlist || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

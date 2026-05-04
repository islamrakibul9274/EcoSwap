import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Listing from '@/models/Listing';
import SwapRequest from '@/models/SwapRequest';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    
    const [userCount, listingCount, swapCount, recentUsers, categoryStats] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      SwapRequest.countDocuments({ status: 'Completed' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name createdAt'),
      Listing.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    // Simple growth simulation for a "chart" (last 7 days)
    const growthData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      totals: {
        users: userCount,
        listings: listingCount,
        swaps: swapCount
      },
      recentUsers,
      categoryStats,
      growthData
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

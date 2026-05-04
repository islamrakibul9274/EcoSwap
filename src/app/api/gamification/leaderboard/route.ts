import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch top 10 users by XP
    const topUsers = await User.find({})
      .select('name avatar level xp badges createdAt')
      .sort({ xp: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(topUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

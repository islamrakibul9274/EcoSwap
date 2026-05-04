import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import ActivityLog from '@/models/ActivityLog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();
    
    const logs = await ActivityLog.find({})
      .populate('adminId', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(logs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

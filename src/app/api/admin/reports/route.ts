import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Report from '@/models/Report';
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
    
    // Fetch all reports, populate reporter
    const reports = await Report.find({})
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(reports, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

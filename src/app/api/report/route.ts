import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Report from '@/models/Report';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { targetType, targetId, reason } = await request.json();
    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    
    const report = await Report.create({
      reporterId: payload.userId,
      targetType,
      targetId,
      reason,
      status: 'Pending'
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

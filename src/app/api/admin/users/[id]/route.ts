import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role, status } = await request.json();
    
    await connectToDatabase();
    
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updates: any = {};
    if (role && ['USER', 'MODERATOR', 'ADMIN'].includes(role)) {
      updates.role = role;
    }
    if (status && ['Active', 'Suspended'].includes(status)) {
      updates.status = status;
    }

    const updatedUser = await User.findByIdAndUpdate(params.id, updates, { new: true });

    // Log the action
    await ActivityLog.create({
      adminId: payload.userId,
      action: 'UPDATE_USER',
      targetType: 'USER',
      targetId: user._id,
      details: `Updated user ${user.name} (${user._id}). Role: ${role || 'unchanged'}, Status: ${status || 'unchanged'}`
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

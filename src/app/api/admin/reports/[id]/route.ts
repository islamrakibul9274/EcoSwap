import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Report from '@/models/Report';
import ActivityLog from '@/models/ActivityLog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'MODERATOR')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status, adminNotes } = await request.json();
    if (!['Resolved', 'Dismissed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await connectToDatabase();
    
    const report = await Report.findById(params.id);
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    report.status = status;
    report.adminNotes = adminNotes;
    await report.save();

    // Log the action
    await ActivityLog.create({
      adminId: payload.userId,
      action: status === 'Resolved' ? 'RESOLVE_REPORT' : 'DISMISS_REPORT',
      targetType: 'REPORT',
      targetId: report._id,
      details: `Report ${report._id} set to ${status}. Notes: ${adminNotes || 'None'}`
    });

    return NextResponse.json(report, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

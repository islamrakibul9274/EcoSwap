import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// GET — return current logged-in user info (or null)
export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token) as any;
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId).select('name email role avatar').lean() as any;

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

// PUT — update user profile and preferences
export async function PUT(req: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, notificationPreferences } = await req.json();

    await connectToDatabase();
    
    // Check if email is being updated and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: payload.userId } });
      if (existingUser) {
        return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { 
        $set: { 
          ...(name && { name }),
          ...(email && { email }),
          ...(notificationPreferences && { notificationPreferences })
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

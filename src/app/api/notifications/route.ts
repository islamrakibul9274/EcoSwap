import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const notifications = await Notification.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
    }

    await connectToDatabase();

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

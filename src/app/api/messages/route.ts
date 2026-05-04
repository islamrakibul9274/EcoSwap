import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Message from "@/models/Message";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { pusherServer } from "@/lib/pusher";
import mongoose from "mongoose";

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

    const url = new URL(req.url);
    const otherUserId = url.searchParams.get("userId");

    if (!otherUserId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await connectToDatabase();

    const messages = await Message.find({
      $or: [
        { senderId: payload.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: payload.userId }
      ]
    }).sort({ createdAt: 1 }).lean();

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const newMessage = await Message.create({
      senderId: new mongoose.Types.ObjectId(payload.userId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      content
    });

    // Trigger pusher event to a unique conversation channel or the receiver's personal channel
    // Using personal channel for simplicity in a system where notifications also happen
    // A more robust approach might use a dedicated conversation channel, but we'll trigger to receiver's private channel
    await pusherServer.trigger(
      `private-user-${receiverId}`,
      'new-message',
      newMessage
    );

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage({ searchParams }: { searchParams: { userId?: string } }) {
  const token = cookies().get('token')?.value;
  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login');
  }

  await connectToDatabase();

  const user = await User.findById(payload.userId).lean() as any;
  if (!user) {
    redirect('/login');
  }

  const targetUserId = searchParams.userId;

  // Fetch unique users this person has messaged or received messages from
  const recentMessagesRaw = await Message.find({
    $or: [{ senderId: user._id }, { receiverId: user._id }]
  })
    .populate('senderId', 'name avatar')
    .populate('receiverId', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

  // Process to get conversations
  const conversationsMap = new Map();
  
  recentMessagesRaw.forEach((msg: any) => {
    const isSender = msg.senderId._id.toString() === user._id.toString();
    const otherUser = isSender ? msg.receiverId : msg.senderId;
    const otherUserId = otherUser._id.toString();

    if (!conversationsMap.has(otherUserId)) {
      conversationsMap.set(otherUserId, {
        id: otherUserId,
        name: otherUser.name,
        avatar: otherUser.avatar,
        lastMessage: msg.content,
        timestamp: msg.createdAt.toISOString(),
        unread: !isSender && !msg.isRead ? 1 : 0
      });
    } else if (!isSender && !msg.isRead) {
      conversationsMap.get(otherUserId).unread += 1;
    }
  });

  // If there's a targetUserId but no conversation with them yet, fetch their info and add to map
  if (targetUserId && !conversationsMap.has(targetUserId)) {
    const targetUser = await User.findById(targetUserId).select('name avatar').lean();
    if (targetUser) {
      conversationsMap.set(targetUserId, {
        id: targetUserId,
        name: (targetUser as any).name,
        avatar: (targetUser as any).avatar,
        lastMessage: "No messages yet",
        timestamp: new Date().toISOString(),
        unread: 0
      });
    }
  }

  const conversations = Array.from(conversationsMap.values());

  return <MessagesClient conversations={conversations} currentUserId={user._id.toString()} initialActiveChat={targetUserId} />;
}

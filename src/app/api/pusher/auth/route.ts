import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

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

    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;

    const authResponse = pusherServer.authorizeChannel(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

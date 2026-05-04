import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Listing from '@/models/Listing';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

// GET a single listing by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const listing = await Listing.findById(params.id).populate('ownerId', 'name avatar');
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }
    return NextResponse.json(listing, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT — update a listing (owner only)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const listing = await Listing.findById(params.id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Only the owner or an ADMIN can edit
    if (listing.ownerId.toString() !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, type, category, description, imageUrl, location } = await request.json();

    if (name) listing.name = name;
    if (type) listing.type = type;
    if (category) listing.category = category;
    if (description) listing.description = description;
    if (imageUrl !== undefined) listing.imageUrl = imageUrl;
    if (location) listing.location = location;

    await listing.save();

    return NextResponse.json(listing, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — remove a listing (owner or admin)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const listing = await Listing.findById(params.id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.ownerId.toString() !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await listing.deleteOne();

    return NextResponse.json({ message: 'Listing deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

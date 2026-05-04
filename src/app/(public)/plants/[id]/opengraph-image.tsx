import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/db';
import Listing from '@/models/Listing';

// export const runtime = 'edge';
export const alt = 'Plant Listing | EcoSwap';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const plant = await Listing.findById(params.id).lean() as any;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fdfcf9',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #e5e7eb 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e5e7eb 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '40px',
              boxShadow: '0 20px 50px rgba(45, 68, 48, 0.1)',
              border: '2px solid #2d4430',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#2d4430',
                marginBottom: '20px',
              }}
            >
              {plant?.name || 'EcoSwap Listing'}
            </h1>
            <p
              style={{
                fontSize: '30px',
                color: '#6b7280',
                marginBottom: '40px',
              }}
            >
              {plant?.category || 'Houseplants'} • Available for Swap
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                padding: '20px 40px',
                backgroundColor: '#2d4430',
                borderRadius: '20px',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              Join the Community
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  } catch {
    return new ImageResponse(
      (
        <div style={{ backgroundColor: '#2d4430', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <h1>EcoSwap Community</h1>
        </div>
      ),
      { ...size }
    );
  }
}

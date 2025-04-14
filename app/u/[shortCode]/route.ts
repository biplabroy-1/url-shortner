import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/url';

export async function GET(req: NextRequest, { params }: { params: { shortCode: string } }) {
  try {
    const { shortCode } = await params;
    
    await connectDB();

    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Increment click count
    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    // Redirect to original URL
    return NextResponse.redirect(url.originalUrl);

  } catch (error) {
    console.error('Error redirecting to URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
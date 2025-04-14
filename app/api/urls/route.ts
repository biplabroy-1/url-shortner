import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/url';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all URLs for the user, sorted by creation date (newest first)
    const urls = await Url.find({ userId })
      .sort({ createdAt: -1 })
      .select('originalUrl shortCode clicks createdAt');

    // Calculate total clicks
    const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);

    return NextResponse.json({
      urls,
      totalUrls: urls.length,
      totalClicks
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
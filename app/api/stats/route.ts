import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/url';

export async function GET() {
  try {
    await connectDB();

    // Aggregate statistics
    const stats = await Url.aggregate([
      {
        $group: {
          _id: null,
          totalUrls: { $sum: 1 },
          totalClicks: { $sum: '$clicks' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 0,
          totalUrls: 1,
          totalClicks: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    // Format response
    const response = stats.length > 0 ? stats[0] : {
      totalUrls: 0,
      totalClicks: 0,
      uniqueUsers: 0
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
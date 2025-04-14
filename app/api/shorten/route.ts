import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Url from '@/lib/models/url';
import { generateShortCode, isValidUrl, normalizeUrl } from '@/lib/url-utils';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(url);

    await connectDB();

    // Check if URL already exists for this user
    const query = userId ? { originalUrl: normalizedUrl, userId } : { originalUrl: normalizedUrl, userId: null };
    const existingUrl = await Url.findOne(query);

    if (existingUrl) {
      return NextResponse.json({
        shortCode: existingUrl.shortCode,
        originalUrl: existingUrl.originalUrl
      });
    }

    // Generate a unique short code
    let shortCode = generateShortCode();
    let codeExists = await Url.findOne({ shortCode });

    // In the rare case of a collision, generate a new code
    while (codeExists) {
      shortCode = generateShortCode();
      codeExists = await Url.findOne({ shortCode });
    }

    // Create new URL document
    // Create new URL document
    const newUrl = await Url.create({
      originalUrl: normalizedUrl,
      shortCode,
      userId,
      expiresAt: userId ? null : new Date(Date.now() + 1 * 60 * 1000) // 10 minutes from now
    });


    return NextResponse.json({
      shortCode: newUrl.shortCode,
      originalUrl: newUrl.originalUrl
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
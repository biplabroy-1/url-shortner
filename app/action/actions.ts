"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import Url from "@/lib/models/url";
import connectDB from "@/lib/mongodb";
import { generateShortCode, normalizeUrl } from "@/lib/url-utils";

interface Res {
	shortCode?: string;
	originalUrl?: string;
	error?: string;
}

interface UrlDocument {
	_id: {
		toString: () => string;
	};
	originalUrl: string;
	shortCode: string;
	clicks: number;
	createdAt: Date;
}

export async function createShortUrl(url: string, path: string): Promise<Res> {
	try {
		const { userId } = await auth();

		const normalizedUrl = normalizeUrl(url);
		await connectDB();

		// Check if URL already exists for this user
		const query = userId
			? { originalUrl: normalizedUrl, userId }
			: { originalUrl: normalizedUrl, userId: null };
		const existingUrl = await Url.findOne(query);

		if (existingUrl) {
			return {
				shortCode: existingUrl.shortCode,
				originalUrl: existingUrl.originalUrl,
			};
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
		const newUrl = await Url.create({
			originalUrl: normalizedUrl,
			shortCode,
			userId,
			expiresAt: userId ? null : new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
		});

		revalidatePath(path);

		return {
			shortCode: newUrl.shortCode,
			originalUrl: newUrl.originalUrl,
		};
	} catch (error) {
		return { error: error as string };
	}
}

export async function getDashboardData(userId: string) {
	await connectDB();

	const urls = (await Url.find({ userId })
		.sort({ createdAt: -1 })
		.select("originalUrl shortCode clicks createdAt")) as UrlDocument[];

	const serializedUrls = urls.map((url) => ({
		_id: url._id.toString(),
		originalUrl: url.originalUrl,
		shortCode: url.shortCode,
		clicks: url.clicks,
		createdAt: new Date(url.createdAt).toLocaleDateString(),
	}));

	const totalClicks = serializedUrls.reduce(
		(sum, url) => sum + (url.clicks || 0),
		0,
	);

	return {
		urls: serializedUrls,
		totalUrls: serializedUrls.length,
		totalClicks,
	};
}

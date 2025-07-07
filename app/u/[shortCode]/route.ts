import { type NextRequest, NextResponse } from "next/server";
import Url from "@/lib/models/url";
import connectDB from "@/lib/mongodb";

export async function GET(req: NextRequest) {
	try {
		const shortCode = req.nextUrl.pathname.split("/").pop() || {};

		await connectDB();

		const url = await Url.findOne({ shortCode });

		if (!url) {
			return NextResponse.json({ error: "URL not found" }, { status: 404 });
		}

		// Increment click count
		await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

		// Redirect to original URL
		return NextResponse.redirect(url.originalUrl);
	} catch (error) {
		console.error("Error redirecting to URL:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

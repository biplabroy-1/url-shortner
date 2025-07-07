"use server"

import Url from "./models/url";
import connectDB from "./mongodb";

export async function getStats() {
    await connectDB();
    // Use absolute URL with the origin for server component fetch
    const result = await Url.aggregate([
        {
            $group: {
                _id: null,
                totalUrls: { $sum: 1 },
                totalClicks: { $sum: "$clicks" },
                uniqueUsers: { $addToSet: "$userId" },
            },
        },
        {
            $project: {
                _id: 0,
                totalUrls: 1,
                totalClicks: 1,
                uniqueUsers: { $size: "$uniqueUsers" },
            },
        },
    ]);
    return result[0];
}
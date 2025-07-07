import { ShortUrl } from "@/components/ShortUrl";
import { getStats } from "@/lib/dataLayer";

interface Stats {
	totalUrls: number;
	totalClicks: number;
	uniqueUsers: number;
}

export default async function Home() {
	let data: Stats | null = null;

	try {
		data = await getStats();
	} catch (err) {
		console.error("Error fetching stats:", err);
	}

	return (
		<main className="flex-1 flex items-center justify-center p-4">
			<div className="w-full max-w-3xl mx-auto space-y-12">
				<div className="text-center space-y-4">
					<h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
						Shorten Your URLs
					</h1>
					<p className="text-lg text-zinc-400">
						Transform long links into clean, manageable URLs in seconds
					</p>
				</div>

				<ShortUrl />

				<h2 className="text-2xl text-center font-bold text-white mb-4">
					Stats
				</h2>

				{/* Statistics Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
					<div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
						<h3 className="text-3xl font-bold text-white mb-2">
							{data?.totalUrls || "0"}
						</h3>
						<p className="text-zinc-400">URLs Shortened</p>
					</div>
					<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
						<h3 className="text-3xl font-bold text-white mb-2">
							{data?.totalClicks || "0"}
						</h3>
						<p className="text-zinc-400">Total Clicks</p>
					</div>
					<div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
						<h3 className="text-3xl font-bold text-white mb-2">
							{data?.uniqueUsers || "0"}
						</h3>
						<p className="text-zinc-400">Active Users</p>
					</div>
				</div>
			</div>
		</main>
	);
}

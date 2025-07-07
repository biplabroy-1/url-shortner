// components/ShortenForm.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { createShortUrl } from "@/app/action/actions";
import ButtonComponent from "@/components/button";
import { formatUrl, isValidUrl } from "@/lib/url-utils";

export function ShortenForm() {
	const [url, setUrl] = useState("");
	const [shortUrl, setShortUrl] = useState("");
	const [error, setError] = useState("");
	const { userId } = useAuth();

	const handleSubmit = async (FormData: FormData) => {
		const url = FormData.get("url") as string;
		if (!isValidUrl(url)) {
			setError("Invalid URL");
			return;
		}
		const { shortCode } = await createShortUrl(
			FormData.get("url") as string,
			"/",
		);
		if (shortCode) {
			setShortUrl(formatUrl(shortCode));
		}
	};

	return (
		<div className="space-y-4">
			<form action={handleSubmit} className="flex flex-col sm:flex-row gap-4">
				<input
					type="text"
					name="url"
					placeholder="Paste your long URL here..."
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					className="flex-1 px-4 py-3 rounded-lg text-white bg-zinc-700/50 border border-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
				/>
				<ButtonComponent />
			</form>
			{!userId ? (
				<p className="text-sm text-amber-400">
					Note: URLs created without an account will expire after 10 minutes
				</p>
			) : (
				""
			)}

			{error && (
				<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
					{error}
				</div>
			)}

			{shortUrl && (
				<div className="p-4 bg-zinc-700/50 rounded-lg space-y-2">
					<p className="text-sm text-zinc-400">Your shortened URL:</p>
					<div className="flex items-center gap-2">
						<input
							type="text"
							value={shortUrl}
							readOnly
							className="flex-1 text-white px-3 py-2 bg-zinc-600/50 rounded border border-zinc-600 text-sm"
						/>
						<button
							type="button"
							onClick={() => {
								window.open(`${shortUrl}`, "_blank");
							}}
							className="px-4 py-2 bg-transparent border border-gray-500 text-white hover:bg-white hover:text-black rounded text-sm transition-colors whitespace-nowrap"
						>
							Goto
						</button>
						<button
							type="button"
							onClick={() => navigator.clipboard.writeText(shortUrl)}
							className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
						>
							Copy
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

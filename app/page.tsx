"use client"

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatUrl } from "@/lib/url-utils";

interface Stats {
  totalUrls: number;
  totalClicks: number;
  uniqueUsers: number;
}

export default function Home() {
  const { userId } = useAuth();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    // Initial fetch
    fetchStats();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to shorten URL");
      }

      const data = await response.json();

      setShortUrl(formatUrl(data.shortCode));
      setUrl("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-white bg-zinc-700/50 border border-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleSubmit}
                disabled={isLoading || !url}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>
            {!userId && (
              <p className="text-sm text-amber-400">
                Note: URLs created without an account will expire after 10 minutes
              </p>
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
                    onClick={() => window.open(`${shortUrl}`, '_blank')}
                    className="px-4 py-2 bg-transparent border border-gray-500 text-white hover:bg-white hover:text-black rounded text-sm transition-colors whitespace-nowrap"
                  >
                    Goto
                  </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(shortUrl)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <Link
                  href="/dashboard"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View your shortened URLs →
                </Link>
              </div>
            </div>
        </div>

          <h2 className="text-2xl text-center font-bold text-white mb-4">Stats</h2>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.totalUrls || '0'}</h3>
            <p className="text-zinc-400">URLs Shortened</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.totalClicks || '0'}</h3>
            <p className="text-zinc-400">Total Clicks</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
            <h3 className="text-3xl font-bold text-white mb-2">{stats?.uniqueUsers || '0'}</h3>
            <p className="text-zinc-400">Active Users</p>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatUrl } from "@/lib/url-utils";
import { ShortenForm } from "./shortendForm";

interface UrlData {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

interface DashboardData {
  urls: UrlData[];
  totalUrls: number;
  totalClicks: number;
}

export function DashboardShell({ data }: { data: DashboardData }) {

  const handleCopy = async (shortCode: string) => {
    const shortUrl = formatUrl(shortCode);
    await navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Shorten New URL</h2>
        <ShortenForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">
            {data?.totalUrls || "0"}
          </h3>
          <p className="text-zinc-400">Your URLs</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">
            {data?.totalClicks || "0"}
          </h3>
          <p className="text-zinc-400">Total Clicks</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">
            {data?.urls.reduce((max, url) => Math.max(max, url.clicks), 0) ||
              "0"}
          </h3>
          <p className="text-zinc-400">Most Clicked</p>
        </div>
      </div>

      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your URLs</h2>
        <div className="space-y-4">
          {data?.urls.length === 0 ? (
            <div className="bg-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300">
                No URLs shortened yet. Create your first one above!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[32rem]">
              {data?.urls.map((url) => (
                <div
                  key={url._id}
                  className="bg-zinc-700/50 rounded-lg p-4 space-y-3 my-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 font-medium truncate">
                        {url.originalUrl}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Created {new Date(url.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm text-zinc-400 whitespace-nowrap">
                        {url.clicks} clicks
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formatUrl(url.shortCode)}
                      readOnly
                      className="flex-1 px-3 py-2 text-white bg-zinc-600/50 rounded border border-zinc-600 text-sm"
                    />
                    <Link
                      href={`/u/${url.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-transparent border border-gray-500 text-white hover:bg-white hover:text-black rounded text-sm transition-colors whitespace-nowrap"
                    >
                      Goto
                    </Link>
                    <Button
                      onClick={() => handleCopy(url.shortCode)}
                      className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}

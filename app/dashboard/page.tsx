'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { formatUrl } from '@/lib/url-utils';
import { useRouter } from 'next/navigation'

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

export default function DashboardPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [shortenError, setShortenError] = useState('');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch('/api/urls');
        if (!response.ok) {
          throw new Error('Failed to fetch URLs');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUrls();
    }
  }, [userId]);

  const handleSubmit = async () => {
    setIsShortening(true);
    setShortenError('');
    setShortUrl('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to shorten URL');
      }

      const data = await response.json();
      setShortUrl(formatUrl(data.shortCode));
      setUrl('');

      // Refresh the URL list
      const urlsResponse = await fetch('/api/urls');
      if (urlsResponse.ok) {
        const newData = await urlsResponse.json();
        setData(newData);
      }
    } catch (err) {
      setShortenError(err.message);
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopy = async (shortCode: string) => {
    const shortUrl = formatUrl(shortCode);
    await navigator.clipboard.writeText(shortUrl);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* URL Shortener Section */}
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Shorten New URL</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 text-white py-3 rounded-lg bg-zinc-700/50 border border-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={handleSubmit}
              disabled={isShortening || !url}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isShortening ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>

          {shortenError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {shortenError}
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
                  className="flex-1 px-3 py-2 text-white bg-zinc-600/50 rounded border border-zinc-600 text-sm"
                />
                <button
                  onClick={() => router.push(shortUrl)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
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
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">{data?.totalUrls || '0'}</h3>
          <p className="text-zinc-400">Your URLs</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">{data?.totalClicks || '0'}</h3>
          <p className="text-zinc-400">Total Clicks</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
          <h3 className="text-3xl font-bold text-white mb-2">
            {data?.urls.reduce((max, url) => Math.max(max, url.clicks), 0) || '0'}
          </h3>
          <p className="text-zinc-400">Most Clicked</p>
        </div>
      </div>

      {/* URL List Section */}
      <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Your URLs</h2>
        <div className="space-y-4">
          {data?.urls.length === 0 ? (
            <div className="bg-zinc-700/50 rounded-lg p-4">
              <p className="text-zinc-300">No URLs shortened yet. Create your first one above!</p>
            </div>
          ) : (
            data?.urls.map((url) => (
              <div key={url._id} className="bg-zinc-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 font-medium truncate">{url.originalUrl}</p>
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
                  <button
                    onClick={() => router.push(shortUrl)}
                    className="px-4 py-2 bg-transparent border border-gray-500 text-white hover:bg-white hover:text-black rounded text-sm transition-colors whitespace-nowrap"
                  >
                    Goto
                  </button>
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
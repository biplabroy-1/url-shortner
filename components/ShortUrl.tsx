import Link from "next/link";
import { ShortenForm } from "@/components/shortendForm";

export const ShortUrl = () => {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 space-y-6">
      <div className="space-y-4">
        <ShortenForm />

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
  );
};

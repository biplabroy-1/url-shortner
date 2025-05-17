import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const navbar = () => {
  const { userId } = auth();
  return (
    <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
        >
          URL Shortener
        </Link>
        <div className="flex items-center gap-4">
          {!userId ? (
            <>
              <SignInButton>
                <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Sign In
                </Button>
              </SignInButton>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default navbar;

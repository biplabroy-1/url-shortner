import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A simple and efficient URL shortening service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  return (
    <html lang="en">
      <ClerkProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-zinc-900 to-black`}
        >
          <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                URL Shortener
              </Link>
              <div className="flex items-center gap-4">
                {!userId ? (
                  <>
                    <SignInButton>
                      <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </>
                )}
              </div>
            </div>
          </nav>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}

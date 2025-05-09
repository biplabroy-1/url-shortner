import { nanoid } from "nanoid";

export function generateShortCode(): string {
  // Generate a short, unique code using nanoid
  return nanoid(8); // 8 characters should be sufficient for uniqueness
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  // Ensure URL has a protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
}

export function formatUrl(shortCode: string): string {
  const baseUrl = "https://url.globaltfn.tech";
  return `${baseUrl}/u/${shortCode}`;
}

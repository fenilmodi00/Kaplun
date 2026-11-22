import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Dev server treats localhost and 127.0.0.1 as different origins and returns 403 for
  // /_next/static chunks. The HTML still renders, so every button looks dead.
  allowedDevOrigins: ["127.0.0.1", "10.39.15.72", "dev.kaplun.tech"],
  // Native SQLite binding stays a plain Node package.
  serverExternalPackages: ["better-sqlite3", "esbuild"],
  // Migrations and seed teardowns are read at runtime on first DB open.
  outputFileTracingIncludes: { "/**": ["./db/migrations/**", "./seed/**"] },
};

export default nextConfig;

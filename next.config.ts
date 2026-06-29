import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "127.0.0.1",
        "192.168.56.1:3000",
        "192.168.56.1",
        "192.168.0.104:3000",
        "192.168.0.104"
      ],
    },
  },
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "192.168.56.1",
    "192.168.56.1:3000",
    "192.168.0.104",
    "192.168.0.104:3000"
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "rokbucket.rokomari.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      }
    ],
  },
};

export default nextConfig;

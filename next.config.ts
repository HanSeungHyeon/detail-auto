import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bypjbdwdfacspubgwmur.supabase.co",
      },
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
      },
    ],
  },
};

export default nextConfig;

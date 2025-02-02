import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "pbs.twimg.com", "img.clerk.com"], // Add the domain here
  },
};

export default nextConfig;

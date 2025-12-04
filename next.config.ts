import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "pbs.twimg.com",
      "img.clerk.com",
      "assets.leetcode.com",
      "avatars.githubusercontent.com",
    ], // Add the domain here
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("web-tree-sitter");
    }
    return config;
  },
  serverExternalPackages: ["web-tree-sitter"],
};

export default nextConfig;

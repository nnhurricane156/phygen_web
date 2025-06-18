import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // SVG configuration
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // Configure allowed image domains
  images: {
    domains: ['randomuser.me'],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "animate.co.id",
        pathname: "/storage/**",
      },
    ],
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9005",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "minio",
        port: "9005",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;

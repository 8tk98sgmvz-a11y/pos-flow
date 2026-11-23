import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@neondatabase/serverless', 'ws'],
};

export default nextConfig;

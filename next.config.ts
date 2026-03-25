import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.VERCEL ? ".next" : "/tmp/featuring_cjenm_next",
};

export default nextConfig;

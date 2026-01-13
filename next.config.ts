import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // or 'export' for static sites
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'super.universitaspertamina.ac.id',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.freepik.com',
        pathname: '/512/**',
      },
    ],
  },
};

export default nextConfig;

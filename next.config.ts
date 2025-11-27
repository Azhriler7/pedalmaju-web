import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  serverExternalPackages: ['firebase-admin'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
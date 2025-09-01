import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for static generation where possible
  output: 'standalone',
  
  // Ensure nodemailer works in serverless environment
  serverExternalPackages: ['nodemailer'],
  
  images: {
    unoptimized: false, 
  },
  
  // Enable compression
  compress: true,
  
  // Redirect trailing slashes
  trailingSlash: false,
  
  // Headers for better security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for static generation where possible
  output: 'standalone',
  
  // Ensure nodemailer works in serverless environment
  experimental: {
    serverComponentsExternalPackages: ['nodemailer']
  },
  
  images: {
    unoptimized: false, 
  },
  
  compress: true,
  
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
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'd',
  images: { 
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'example.com'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
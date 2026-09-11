import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/150',
      },
    ],
  },
}

export default nextConfig

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // In a Docker environment, the frontend needs to talk to the backend service name.
        destination: 'http://backend:3001/:path*',
      },
    ]
  },
  devServer: {
    allowedDevOrigins: [
      "https://3000-firebase-studio-1751100220887.cluster-6frnii43o5blcu522sivebzpii.cloudworkstations.dev",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

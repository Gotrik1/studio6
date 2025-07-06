import type {NextConfig} from 'next';

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
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /**
   * Rewrites are used as a development proxy to avoid CORS issues.
   * This is the Next.js equivalent of using a `proxy.conf.js` in frameworks like Angular.
   * It tells the Next.js development server to proxy any requests starting with `/api`
   * to our backend service (in this case, the Kong API Gateway).
   * This configuration only applies to development and is not used in production.
   */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5005',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lms-server.cosha.eu',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lms-project-r4hj.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
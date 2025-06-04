/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lms-server.cosha.eu',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

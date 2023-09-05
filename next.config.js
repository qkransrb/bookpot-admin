/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["api.local.bookpot.kr"],
  },
};

module.exports = nextConfig;

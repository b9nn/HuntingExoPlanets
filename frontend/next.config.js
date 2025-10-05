/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Allow production builds to complete even if there are TS type errors
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

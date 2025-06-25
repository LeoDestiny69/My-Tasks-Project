// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcMinify: true,
    forceSwcTransforms: true,
  },
};

export default nextConfig;
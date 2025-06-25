// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 

  images: {
    unoptimized: true, 
  },

  experimental: {
    swcMinify: true,
    forceSwcTransforms: true,
  },
};

export default nextConfig;
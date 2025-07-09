// frontend/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 

  images: {
    unoptimized: true, 
  },

  // experimental settings เดิมของคุณ
  experimental: {
    swcMinify: true,
    forceSwcTransforms: true,
  },
};

export default nextConfig;
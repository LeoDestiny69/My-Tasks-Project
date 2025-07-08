// frontend/next.config.mjs
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
  
  basePath: '/My-Tasks-Project', 
};

export default nextConfig;
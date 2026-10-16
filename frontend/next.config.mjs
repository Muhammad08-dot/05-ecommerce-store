/** @type {import('next').NextConfig} */
const config = {
  // Deploy as a fully static site (Netlify / Vercel). No server runtime.
  output: 'export',
  images: {
    // Remote Unsplash images can't be optimized without a server, so serve them directly.
    unoptimized: true,
  },
  trailingSlash: true,
};

export default config;

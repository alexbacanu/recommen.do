/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
    appDir: true,
  },
};

const withMDX = require("@next/mdx")();
module.exports = withMDX(nextConfig);

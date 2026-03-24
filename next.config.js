const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
};
 
module.exports = withNextIntl(nextConfig);

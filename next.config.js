/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Évite les erreurs si images absentes en dev
  },
};

module.exports = nextConfig;

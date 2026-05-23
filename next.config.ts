import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.pokemondb.net' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
};

export default config;

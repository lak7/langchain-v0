import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore server-side modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Handle LangChain module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'openai/package.json': require.resolve('openai/package.json'),
    };
    
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@langchain/openai', 'openai'],
  },
};

export default nextConfig;

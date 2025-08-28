/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for pages that need fresh data
  experimental: {
    // This ensures pages are rendered on each request
    isrMemoryCacheSize: 0,
  },
  
  // Force dynamic rendering for specific routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

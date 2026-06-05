/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // PATH-app related redirects (keep these alive)
      { source: "/path-app", destination: "/app", permanent: true },
      { source: "/path-app/about", destination: "/path", permanent: true },
      { source: "/path-app/story/:slug", destination: "/path", permanent: true },
      { source: "/trading", destination: "/path", permanent: true },
      { source: "/scorecard", destination: "/path", permanent: true },

      // Shelved-product paths → home (graceful 301)
      { source: "/services", destination: "/", permanent: true },
      { source: "/services/:slug*", destination: "/", permanent: true },
      { source: "/voice-agent", destination: "/", permanent: true },
      { source: "/content", destination: "/", permanent: true },
      { source: "/reports", destination: "/", permanent: true },
      { source: "/mcp", destination: "/", permanent: true },
      { source: "/studio", destination: "/", permanent: true },
      { source: "/video", destination: "/", permanent: true },
      { source: "/quote", destination: "/", permanent: true },
      { source: "/quote/:slug*", destination: "/", permanent: true },
      { source: "/for-businesses", destination: "/", permanent: true },
      { source: "/for-businesses/:slug*", destination: "/", permanent: true },
      { source: "/pricing", destination: "/", permanent: true },
      { source: "/work", destination: "/", permanent: true },
      { source: "/institute", destination: "/", permanent: true },
      { source: "/api-dashboard", destination: "/", permanent: true },
      { source: "/playbooks", destination: "/", permanent: true },
      { source: "/products", destination: "/", permanent: true },
      { source: "/products/:slug*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;

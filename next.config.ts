/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Move reactCompiler to the top level as requested by the warning
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/llms.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noarchive" }],
      },
      {
        source: "/llms-full.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noarchive" }],
      },
    ];
  },

  // 2. Remove 'productionBrowserSourceMaps' if it's still causing issues,
  // or just omit it (it defaults to false).

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eaahwakvnwqjlkulqnyz.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // 3. Allowed Dev Origins
  // Required for *.localhost:3000 tenant subdomain preview links to work
  // correctly in dev mode — without this, Next.js dev server's
  // cross-origin protection does not trust subdomain-based localhost
  // origins and will mangle the request host.
  allowedDevOrigins: ["localhost:3000", "*.localhost:3000"],

  devIndicators: {
    appIsrStatus: true,
  },
};

export default nextConfig;

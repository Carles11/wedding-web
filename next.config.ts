/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Move reactCompiler to the top level as requested by the warning
  reactCompiler: true,

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

  // 3. Update Dev Origins
  // In Next 15/16, this moved to the top level under 'devIndicators'
  // or is handled via the 'server' config. Try moving it here:
  devIndicators: {
    appIsrStatus: true,
  },

  // If you still need custom local domains,
  // Next 16 often handles this automatically via the CLI.
  // If 'allowedDevOrigins' causes a warning here, remove it.
};

export default nextConfig;

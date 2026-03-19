/** @type {import('next').NextConfig} */
const nextConfig = {
  productionSourceMaps: false,
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
  allowedDevOrigins: [
    "www.inesundcarles.localhost",
    "localhost:3000",
    // add other custom domains as needed
  ],
  reactCompiler: true,
};

export default nextConfig;

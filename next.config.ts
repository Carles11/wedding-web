/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use remotePatterns to support more robust media hosting and future-proof config
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;

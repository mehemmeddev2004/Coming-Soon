import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Alternatively, you can use the simpler domains list:
    // domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;

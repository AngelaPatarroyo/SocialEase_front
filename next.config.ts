import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // for Google profile images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", 
        
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.d3si.cl",
      },
      {
        protocol: "https",
        hostname: "www.bing.com",
      },
      {
        protocol: "https",
        hostname: "victorinoxstore.vtexassets.com",
      },
    ],
  },
}

export default nextConfig

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "d3si.cl",
            },
            {
                protocol: "https",
                hostname: "www.d3si.cl",
            },
            {
                protocol: "https",
                hostname: "bing.com",
            },
            {
                protocol: "https",
                hostname: "vtexassets.com",
            },
            {
                protocol: "https",
                hostname: "procircuit.cl",
            },
        ],
    },
}

export default nextConfig

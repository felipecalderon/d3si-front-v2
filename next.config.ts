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
        ],
        domains: [
            "victorinoxstore.vtexassets.com",
            // agrega aquí otros dominios si es necesario
        ],
    },
}

export default nextConfig

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [new URL("https://res.cloudinary.com/**"), new URL("https://www.d3si.cl/**")],
    },
}

export default nextConfig

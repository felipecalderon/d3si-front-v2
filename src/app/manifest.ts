import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "D3SI - App",
        short_name: "Sistema de Ventas",
        start_url: "https://desiapp-new.vercel.app/",
        scope: "https://desiapp-new.vercel.app/",
        description: "D3SI - Sistema gestión de Ventas",
        theme_color: "#2d51e1",
        background_color: "#2EC6FE",
        orientation: "portrait",
        display: "standalone",
        dir: "auto",
        lang: "es",
        icons: [
            { purpose: "maskable", sizes: "512x512", src: "icon512_maskable.png", type: "image/png" },
            { purpose: "any", sizes: "512x512", src: "icon512_rounded.png", type: "image/png" },
        ],
    }
}

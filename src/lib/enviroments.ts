// a futuro instalar ZOD para validar variables

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://desi-back-cloned-production.up.railway.app"
export const CDN_PRESET = process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET
export const CDN_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
export const CDN_KEY = process.env.CLOUD_API_KEY
export const CDN_SECRET = process.env.CLOUD_API_SECRET

// WooCommerce
export const WOO_URL = process.env.URL_WOO
export const WOO_KEY = process.env.CLIENT_WOO
export const WOO_SECRET = process.env.SECRET_WOO

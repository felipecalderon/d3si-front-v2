// a futuro instalar ZOD para validar

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://desi-back-cloned-production.up.railway.app"
export const CDN_PRESET = process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET
export const CDN_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
export const CDN_KEY = process.env.CLOUD_API_KEY
export const CDN_SECRET = process.env.CLOUD_API_SECRET
console.log("API_URL:", API_URL)
console.log("CDN APY KEY:", CDN_KEY)

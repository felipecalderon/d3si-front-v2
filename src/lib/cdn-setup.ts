import { CDN_KEY, CDN_NAME, CDN_SECRET, CDN_PRESET } from "@/lib/enviroments"
import { v2 } from "cloudinary"

v2.config({
    api_key: CDN_KEY,
    cloud_name: CDN_NAME,
    api_secret: CDN_SECRET,
})

export { v2 as cloudinary }

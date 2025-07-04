"use server"
import { cloudinary } from "@/utils/cdn-setup"
import { UploadApiResponse } from "cloudinary"
import { Readable } from "node:stream"

export const uploadImageCDN = async (
    fileArrayBuffer: ArrayBuffer,
    originalFileName?: string
): Promise<UploadApiResponse> => {
    // 1. Validate input
    if (!fileArrayBuffer || !(fileArrayBuffer instanceof ArrayBuffer)) {
        throw new Error("Invalid input: fileArrayBuffer must be an ArrayBuffer.")
    }

    // 2. Convert ArrayBuffer to Node.js Buffer
    // This is the crucial step for server-side processing
    const fileBuffer = Buffer.from(fileArrayBuffer)

    return new Promise((resolve, reject) => {
        // 3. Create a readable stream from the Node.js Buffer
        const readableStream = new Readable()
        readableStream.push(fileBuffer)
        readableStream.push(null) // Indicate end of stream

        // 4. Pipe the stream to Cloudinary's upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto", // Automatically detect if it's an image, video, or raw
                folder: "desi_v2", // Optional: Organize your uploads into folders
                // If you want to use the original file name as public_id (without extension)
                public_id: originalFileName ? originalFileName.split(".").slice(0, -1).join(".") : undefined,
                // Add any other upload options here, e.g., transformations, tags
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error)
                    return reject(error)
                }
                if (result) {
                    resolve(result)
                } else {
                    // This case should ideally not be hit if there's no error, but for type safety
                    reject(new Error("Cloudinary upload did not return a result."))
                }
            }
        )

        readableStream.pipe(uploadStream)
    })
}

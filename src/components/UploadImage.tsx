"use client"

import { uploadImageCDN } from "@/actions/upload/image"
import { CDN_KEY, CDN_NAME } from "@/lib/enviroments"
import { fileToArrayBuffer } from "@/utils/file-to-buffer"
import Image from "next/image"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const UploadImageToCloudinary = () => {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const [resultUrl, setResultUrl] = useState("")
    const [isPending, startTransition] = useTransition()

    const handleUpload = async () => {
        try {
            if (!file) {
                toast("Selecciona un archivo")
                return
            }
            startTransition(async () => {
                const buffer = await fileToArrayBuffer(file)
                const upload = await uploadImageCDN(buffer)
                setImageUrl(upload.url)
            })
        } catch (error) {
            console.error(error)
            toast("Error de red al subir imagen")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="p-4 max-w-md mx-auto border rounded">
            <h2 className="text-xl font-bold mb-4">Subir imagen</h2>

            <input
                title="file"
                type="file"
                onChange={(e) => {
                    setFile(e.target.files?.[0] || null)
                    setImageUrl("")
                }}
                className="mb-2"
            />

            <input
                type="text"
                placeholder="o pegá una URL de imagen"
                value={imageUrl}
                onChange={(e) => {
                    setImageUrl(e.target.value)
                    setFile(null)
                }}
                className="w-full p-2 border rounded mb-2"
            />

            <button onClick={handleUpload} disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {uploading ? "Subiendo..." : "Subir"}
            </button>

            {resultUrl && (
                <div className="mt-4">
                    <p className="text-sm">Imagen subida:</p>
                    <Image src={resultUrl} alt="Imagen subida" className="w-48 mt-2" />
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Ver imagen
                    </a>
                </div>
            )}
        </div>
    )
}

export default UploadImageToCloudinary

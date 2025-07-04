"use client"

import { useState } from "react"

const UploadImageToCloudinary = () => {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const [resultUrl, setResultUrl] = useState("")

    const handleUpload = async () => {
        if (!file && !imageUrl) {
            alert("Selecciona un archivo o pega una URL")
            return
        }

        setUploading(true)

        const formData = new FormData()
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUD_UPLOAD_PRESET!)
        formData.append("folder", "desi_v2")

        if (file) {
            formData.append("file", file)
        } else {
            formData.append("file", imageUrl)
        }

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await response.json()

            if (data.secure_url) {
                setResultUrl(data.secure_url)
                alert("Imagen subida con éxito")
            } else {
                console.error(data)
                alert("Error al subir la imagen")
            }
        } catch (error) {
            console.error(error)
            alert("Error de red al subir imagen")
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
                    <img src={resultUrl} alt="Imagen subida" className="w-48 mt-2" />
                    <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Ver imagen
                    </a>
                </div>
            )}
        </div>
    )
}

export default UploadImageToCloudinary

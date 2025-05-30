"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createMassiveProducts } from "@/actions/productsActions/createMassiveProducts"

type Size = {
    sizeNumber: string
    priceList: number
    priceCost: number
    sku: string
    stockQuantity: number
}

type FormData = {
    name: string
    image: string
    sizes: Size[]
}

export default function CreateProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState<FormData>({
        name: "",
        image: "",
        sizes: [
            {
                sizeNumber: "",
                priceList: 0,
                priceCost: 0,
                sku: "",
                stockQuantity: 0,
            },
        ],
    })

    const handleChange = (index: number, field: keyof Size, value: unknown) => {
        const newSizes = [...formData.sizes]
        newSizes[index] = { ...newSizes[index], [field]: value }
        setFormData({ ...formData, sizes: newSizes })
    }

    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { sizeNumber: "", priceList: 0, priceCost: 0, sku: "", stockQuantity: 0 }],
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createMassiveProducts({ products: [formData] })
            router.push("/inventory") // redirige al inventario
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            alert("Error al crear el producto")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-bold">Crear Producto</h1>

            <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />

            <input
                type="text"
                placeholder="URL de Imagen"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border px-4 py-2 rounded"
            />

            {formData.sizes.map((size, index) => (
                <div key={index} className="grid grid-cols-5 gap-2">
                    <input
                        type="text"
                        placeholder="Talla"
                        value={size.sizeNumber ?? ""}
                        onChange={(e) => handleChange(index, "sizeNumber", e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Precio Lista"
                        value={size.priceList}
                        onChange={(e) => handleChange(index, "priceList", Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Precio Costo"
                        value={size.priceCost}
                        onChange={(e) => handleChange(index, "priceCost", Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="text"
                        placeholder="SKU"
                        value={size.sku}
                        onChange={(e) => handleChange(index, "sku", e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={size.stockQuantity}
                        onChange={(e) => handleChange(index, "stockQuantity", Number(e.target.value))}
                        className="border px-2 py-1 rounded"
                    />
                </div>
            ))}

            <button type="button" onClick={addSize} className="text-blue-500 underline">
                + Agregar otra talla
            </button>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Guardar Producto
            </button>
        </form>
    )
}

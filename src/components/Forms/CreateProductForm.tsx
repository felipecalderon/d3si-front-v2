"use client"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Size, CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState<CreateProductFormData>({
        name: "",
        image: "",
        sizes: [
            {
                sizeNumber: null,
                priceList: 0,
                priceCost: 0,
                sku: "",
                stockQuantity: 0,
            },
        ],
    })

    const handleChange = (index: number, field: keyof Size, value: unknown) => {
        const newSizes = [...formData.sizes]
        if (field === "sizeNumber" && value === "") {
            newSizes[index] = { ...newSizes[index], [field]: null }
        } else {
            newSizes[index] = { ...newSizes[index], [field]: value }
        }
        setFormData({ ...formData, sizes: newSizes })
    }

    const addSize = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { sizeNumber: "", priceList: 0, priceCost: 0, sku: "", stockQuantity: 0 }],
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await createMassiveProducts(formData)
            if (result.success) {
                router.push("/inventory")
            } else {
                alert(result.error)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium mb-1">Nombre del producto</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border px-4 py-2 rounded"
                />
            </div>
            <div>
                <label className="block font-medium mb-1">URL de Imagen</label>
                <input
                    type="text"
                    placeholder="URL de Imagen"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border px-4 py-2 rounded"
                />
            </div>
            <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2">
                        <div>
                            <label className="block text-xs mb-1">Talla</label>
                            <input
                                type="text"
                                placeholder="Talla"
                                value={size.sizeNumber ?? ""}
                                onChange={(e) => handleChange(index, "sizeNumber", e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Precio Lista</label>
                            <input
                                type="number"
                                placeholder="Precio Lista"
                                value={size.priceList}
                                onChange={(e) => handleChange(index, "priceList", Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Precio Costo</label>
                            <input
                                type="number"
                                placeholder="Precio Costo"
                                value={size.priceCost}
                                onChange={(e) => handleChange(index, "priceCost", Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">SKU</label>
                            <input
                                type="text"
                                placeholder="SKU"
                                value={size.sku}
                                onChange={(e) => handleChange(index, "sku", e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1">Stock</label>
                            <input
                                type="number"
                                placeholder="Stock"
                                value={size.stockQuantity}
                                onChange={(e) => handleChange(index, "stockQuantity", Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addSize} className="text-blue-500 underline hover:text-blue-700">
                + Agregar otra talla
            </button>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded ${
                        isPending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isPending ? "Guardando..." : "Guardar Producto"}
                </button>
            </div>
        </form>
    )
}

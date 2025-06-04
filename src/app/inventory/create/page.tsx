"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
//import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"

type Size = {
    sizeNumber: string | null
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
        // Permitir null para sizeNumber si el input está vacío
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/crear-masivo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ products: [formData] }),
            })
            if (res.status === 404) {
                // Si el backend responde 404 pero el producto se guarda, igual redirige
                router.push("/inventory")
                return
            }
            if (!res.ok) {
                alert("Error al crear el producto")
                return
            }
            router.push("/inventory")
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            alert("Error al crear el producto")
        }
    }
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 flex-1">
                    <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
                        <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>

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
                                                onChange={(e) =>
                                                    handleChange(index, "priceList", Number(e.target.value))
                                                }
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1">Precio Costo</label>
                                            <input
                                                type="number"
                                                placeholder="Precio Costo"
                                                value={size.priceCost}
                                                onChange={(e) =>
                                                    handleChange(index, "priceCost", Number(e.target.value))
                                                }
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
                                                onChange={(e) =>
                                                    handleChange(index, "stockQuantity", Number(e.target.value))
                                                }
                                                className="border px-2 py-1 rounded w-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addSize}
                                className="text-blue-500 underline hover:text-blue-700"
                            >
                                + Agregar otra talla
                            </button>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                                >
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

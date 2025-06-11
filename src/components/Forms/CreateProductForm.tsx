"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Size, CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { ErrorState } from "@/interfaces/products/IMassiveProducts"

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState<CreateProductFormData>({
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

    const [errors, setErrors] = useState<ErrorState>({ sizes: [{}] })

    const validate = (data: CreateProductFormData): ErrorState => {
        const newErrors: ErrorState = { sizes: [] }
        if (!data.name.trim()) newErrors.name = "Falta llenar este campo"
        if (!data.image.trim()) newErrors.image = "Falta llenar este campo"
        data.sizes.forEach((size, i) => {
            const sizeErrors: Record<string, string> = {}
            if (!size.sizeNumber?.toString().trim()) sizeErrors.sizeNumber = "Falta llenar este campo"
            if (!size.priceList) sizeErrors.priceList = "Falta llenar este campo"
            if (!size.priceCost) sizeErrors.priceCost = "Falta llenar este campo"
            if (!size.sku.trim()) sizeErrors.sku = "Falta llenar este campo"
            if (size.stockQuantity === null || size.stockQuantity === undefined || isNaN(size.stockQuantity)) {
                sizeErrors.stockQuantity = "Falta llenar este campo"
            }
            newErrors.sizes[i] = sizeErrors
        })
        return newErrors
    }

    const hasErrors = (errs: ErrorState) => {
        if (errs.name || errs.image) return true
        return errs.sizes.some((sizeErr) => Object.keys(sizeErr).length > 0)
    }

    const handleChange = (index: number, field: keyof Size, value: unknown) => {
        const newSizes = [...formData.sizes]
        newSizes[index] = { ...newSizes[index], [field]: value }
        const newFormData = { ...formData, sizes: newSizes }
        setFormData(newFormData)
        setErrors(validate(newFormData))
    }

    const handleFieldChange = (field: keyof CreateProductFormData, value: string) => {
        const newFormData = { ...formData, [field]: value }
        setFormData(newFormData)
        setErrors(validate(newFormData))
    }

    const addSize = () => {
        const newSizes = [...formData.sizes, { sizeNumber: "", priceList: 0, priceCost: 0, sku: "", stockQuantity: 0 }]
        const newFormData = { ...formData, sizes: newSizes }
        setFormData(newFormData)
        setErrors(validate(newFormData))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validate(formData)
        setErrors(validationErrors)
        if (hasErrors(validationErrors)) {
            toast.error("Por favor corrige los errores antes de guardar.")
            return
        }
        startTransition(async () => {
            const result = await createMassiveProducts(formData)
            if (result.success) {
                toast.success("Producto guardado exitosamente.")
                router.push("/home/inventory")
            } else {
                toast.error(result.error || "Ocurrió un error al guardar.")
            }
        })
    }

    const removeSize = (index: number) => {
        if (formData.sizes.length === 1) return
        const newSizes = [...formData.sizes]
        newSizes.splice(index, 1)
        const newFormData = { ...formData, sizes: newSizes }
        setFormData(newFormData)
        setErrors(validate(newFormData))
    }

    const calculateMarkup = (priceCost: number, priceList: number): string => {
        if (priceCost === 0) return "N/A"
        const markup = ((priceList - priceCost) / priceCost) * 100
        return `${markup.toFixed(2)}%`
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block font-semibold mb-2 text-gray-700">Nombre del producto</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <label className="block font-semibold mb-2 text-gray-700">URL de Imagen</label>
                <input
                    type="text"
                    placeholder="URL de Imagen"
                    value={formData.image}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            <div className="space-y-4">
                {formData.sizes.map((size, index) => (
                    <div
                        key={index}
                        className="relative grid grid-cols-5 gap-3 border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm"
                    >
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Talla</label>
                            <input
                                type="text"
                                placeholder="Talla"
                                value={size.sizeNumber ?? ""}
                                onChange={(e) => handleChange(index, "sizeNumber", e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                            />
                            {errors.sizes[index]?.sizeNumber && (
                                <p className="text-red-500 text-xs mt-1">{errors.sizes[index]?.sizeNumber}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Precio Lista</label>
                            <input
                                type="number"
                                placeholder="Precio Lista"
                                value={size.priceList}
                                onChange={(e) => handleChange(index, "priceList", Number(e.target.value))}
                                className="border border-gray-300 px-2 py-1 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                            />
                            {errors.sizes[index]?.priceList && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.priceList}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Precio Costo</label>
                            <input
                                type="number"
                                placeholder="Precio Costo"
                                value={size.priceCost}
                                onChange={(e) => handleChange(index, "priceCost", Number(e.target.value))}
                                className="border border-gray-300 px-2 py-1 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                            />
                            {errors.sizes[index]?.priceCost && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.priceCost}</p>
                            )}
                        </div>

                        <div className="col-span-5 text-right text-sm text-gray-600 italic">
                            Markup: {calculateMarkup(size.priceCost, size.priceList)}
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">SKU</label>
                            <input
                                type="text"
                                placeholder="SKU"
                                value={size.sku}
                                onChange={(e) => handleChange(index, "sku", e.target.value)}
                                className="border border-gray-300 px-2 py-1 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                            />
                            {errors.sizes[index]?.sku && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.sku}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-600">Stock</label>
                            <input
                                type="number"
                                placeholder="Stock"
                                value={size.stockQuantity}
                                onChange={(e) => handleChange(index, "stockQuantity", Number(e.target.value))}
                                className="border border-gray-300 px-2 py-1 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                            />
                            {errors.sizes[index]?.stockQuantity && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.stockQuantity}</p>
                            )}
                        </div>

                        {formData.sizes.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeSize(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 shadow"
                                title="Eliminar esta talla"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addSize}
                className="flex items-center gap-1 text-green-700 font-semibold hover:underline hover:text-green-900 transition"
            >
                <span className="text-lg">+</span> Agregar otra talla
            </button>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || hasErrors(errors)}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition ${
                        isPending || hasErrors(errors) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isPending ? "Guardando..." : "Guardar Producto"}
                </button>
            </div>
        </form>
    )
}

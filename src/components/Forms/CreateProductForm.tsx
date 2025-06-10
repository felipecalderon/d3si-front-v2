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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium mb-1">Nombre del producto</label>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            <div>
                <label className="block font-medium mb-1">URL de Imagen</label>
                <input
                    type="text"
                    placeholder="URL de Imagen"
                    value={formData.image}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    className="w-full border px-4 py-2 rounded"
                />
                {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
            </div>

            <div className="space-y-3">
                {formData.sizes.map((size, index) => (
                    <div key={index} className="relative grid grid-cols-5 gap-2 border p-3 rounded">
                        <div>
                            <label className="block text-xs mb-1">Talla</label>
                            <input
                                type="text"
                                placeholder="Talla"
                                value={size.sizeNumber ?? ""}
                                onChange={(e) => handleChange(index, "sizeNumber", e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                            {errors.sizes[index]?.sizeNumber && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.sizeNumber}</p>
                            )}
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
                            {errors.sizes[index]?.priceList && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.priceList}</p>
                            )}
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
                            {errors.sizes[index]?.priceCost && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.priceCost}</p>
                            )}
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
                            {errors.sizes[index]?.sku && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.sku}</p>
                            )}
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
                            {errors.sizes[index]?.stockQuantity && (
                                <p className="text-red-500 text-xs">{errors.sizes[index]?.stockQuantity}</p>
                            )}
                        </div>

                        {formData.sizes.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeSize(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600"
                                title="Eliminar esta talla"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button type="button" onClick={addSize} className="text-blue-600 font-medium hover:underline">
                + Agregar otra talla
            </button>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || hasErrors(errors)}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded ${
                        isPending || hasErrors(errors) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isPending ? "Guardando..." : "Guardar Producto"}
                </button>
            </div>
        </form>
    )
}

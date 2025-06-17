"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { Size, CreateProductFormData, ErrorState } from "@/interfaces/products/ICreateProductForm"

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [products, setProducts] = useState<CreateProductFormData[]>([
        {
            name: "",
            image: "",
            genre: "",
            sizes: [
                {
                    sizeNumber: "",
                    priceList: 0,
                    priceCost: 0,
                    sku: "",
                    stockQuantity: 0,
                },
            ],
        },
    ])

    const [errors, setErrors] = useState<ErrorState[]>([{ sizes: [{}] }])

    const validate = (data: CreateProductFormData[]): ErrorState[] => {
        return data.map((product) => {
            const productErrors: ErrorState = { sizes: [] }
            if (!product.name.trim()) productErrors.name = "Falta llenar este campo"
            if (!product.image.trim()) productErrors.image = "Falta llenar este campo"
            if (!product.genre.trim()) productErrors.genre = "Falta llenar este campo"

            product.sizes.forEach((size) => {
                const sizeErrors: Record<string, string> = {}
                if (!size.sizeNumber?.trim()) sizeErrors.sizeNumber = "Falta llenar este campo"
                if (!size.priceList) sizeErrors.priceList = "Falta llenar este campo"
                if (!size.priceCost) sizeErrors.priceCost = "Falta llenar este campo"
                if (!size.sku.trim()) sizeErrors.sku = "Falta llenar este campo"
                if (size.stockQuantity === null || size.stockQuantity === undefined || isNaN(size.stockQuantity)) {
                    sizeErrors.stockQuantity = "Falta llenar este campo"
                }
                productErrors.sizes.push(sizeErrors)
            })

            return productErrors
        })
    }

    const hasErrors = (errs: ErrorState[]) => {
        return errs.some(
            (err) => err.name || err.image || err.genre || err.sizes.some((e) => Object.keys(e).length > 0)
        )
    }

    const handleProductChange = (productIndex: number, field: keyof CreateProductFormData, value: string) => {
        const newProducts = [...products]
        newProducts[productIndex] = { ...newProducts[productIndex], [field]: value }
        setProducts(newProducts)
        setErrors(validate(newProducts))
    }

    const handleSizeChange = (productIndex: number, sizeIndex: number, field: keyof Size, value: unknown) => {
        const newProducts = [...products]
        const newSizes = [...newProducts[productIndex].sizes]
        newSizes[sizeIndex] = { ...newSizes[sizeIndex], [field]: value }
        newProducts[productIndex].sizes = newSizes
        setProducts(newProducts)
        setErrors(validate(newProducts))
    }

    const addProduct = () => {
        setProducts([
            ...products,
            {
                name: "",
                image: "",
                genre: "",
                sizes: [
                    {
                        sizeNumber: "",
                        priceList: 0,
                        priceCost: 0,
                        sku: "",
                        stockQuantity: 0,
                    },
                ],
            },
        ])
        setErrors([...errors, { sizes: [{}] }])
    }

    const removeProduct = (index: number) => {
        if (products.length === 1) return
        const newProducts = [...products]
        const newErrors = [...errors]
        newProducts.splice(index, 1)
        newErrors.splice(index, 1)
        setProducts(newProducts)
        setErrors(newErrors)
    }

    const addSize = (productIndex: number) => {
        const newProducts = [...products]
        newProducts[productIndex].sizes.push({
            sizeNumber: "",
            priceList: 0,
            priceCost: 0,
            sku: "",
            stockQuantity: 0,
        })
        setProducts(newProducts)
        setErrors(validate(newProducts))
    }

    const removeSize = (productIndex: number, sizeIndex: number) => {
        if (products[productIndex].sizes.length === 1) return
        const newProducts = [...products]
        newProducts[productIndex].sizes.splice(sizeIndex, 1)
        setProducts(newProducts)
        setErrors(validate(newProducts))
    }

    const calculateMarkup = (priceCost: number, priceList: number): string => {
        if (priceCost === 0) return "N/A"
        const markup = (priceList - priceCost) / priceCost
        return markup.toFixed(2)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validate(products)
        setErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            toast.error("Corrige los errores antes de guardar.")
            return
        }

        startTransition(async () => {
            const result = await createMassiveProducts({ products })
            if (result.success) {
                toast.success("Productos guardados correctamente.")
                router.push("/home/inventory")
            } else {
                toast.error(result.error || "Error al guardar productos.")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {products.map((product, pIndex) => (
                <div
                    key={pIndex}
                    className="border dark:border-gray-700 border-gray-300 rounded-lg p-4 space-y-4 shadow"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-medium mb-1 dark:text-gray-400">Nombre</label>
                            <Input
                                value={product.name}
                                onChange={(e) => handleProductChange(pIndex, "name", e.target.value)}
                            />
                            {errors[pIndex]?.name && <p className="text-red-500 text-xs">{errors[pIndex].name}</p>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1 dark:text-gray-400">Imagen</label>
                            <Input
                                value={product.image}
                                onChange={(e) => handleProductChange(pIndex, "image", e.target.value)}
                            />
                            {errors[pIndex]?.image && <p className="text-red-500 text-xs">{errors[pIndex].image}</p>}
                        </div>
                        <div>
                            <label className="block font-medium mb-1 dark:text-gray-400">Género</label>
                            <Input
                                value={product.genre}
                                placeholder="Hombre, Mujer, Unisex."
                                onChange={(e) => handleProductChange(pIndex, "genre", e.target.value)}
                            />
                            {errors[pIndex]?.genre && <p className="text-red-500 text-xs">{errors[pIndex].genre}</p>}
                        </div>
                    </div>

                    {product.sizes.map((size, sIndex) => (
                        <div
                            key={sIndex}
                            className="grid grid-cols-5 gap-3 border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-slate-700 p-4 rounded-md relative"
                        >
                            <div>
                                <label className="block font-medium mb-1 dark:text-gray-400">Talla</label>
                                <Input
                                    placeholder="Talla"
                                    value={size.sizeNumber}
                                    onChange={(e) => handleSizeChange(pIndex, sIndex, "sizeNumber", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 dark:text-gray-400">Costo</label>
                                <Input
                                    type="number"
                                    placeholder="Costo"
                                    value={size.priceCost}
                                    onChange={(e) =>
                                        handleSizeChange(pIndex, sIndex, "priceCost", Number(e.target.value))
                                    }
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1 dark:text-gray-400">Precio</label>
                                <Input
                                    type="number"
                                    placeholder="Precio"
                                    value={size.priceList}
                                    onChange={(e) =>
                                        handleSizeChange(pIndex, sIndex, "priceList", Number(e.target.value))
                                    }
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1 dark:text-gray-400">SKU</label>
                                <Input
                                    placeholder="SKU"
                                    value={size.sku}
                                    onChange={(e) => handleSizeChange(pIndex, sIndex, "sku", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1 dark:text-gray-400">Stock</label>
                                <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={size.stockQuantity}
                                    onChange={(e) =>
                                        handleSizeChange(pIndex, sIndex, "stockQuantity", Number(e.target.value))
                                    }
                                />
                            </div>
                            <div className="col-span-5 text-right text-sm italic text-gray-600 dark:text-gray-300">
                                Markup: {calculateMarkup(size.priceCost, size.priceList)}
                            </div>
                            {product.sizes.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSize(pIndex, sIndex)}
                                    className="absolute top-1 right-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => addSize(pIndex)}
                        className="text-green-600 font-semibold text-sm hover:underline"
                    >
                        + Agregar talla
                    </button>

                    {products.length > 1 && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => removeProduct(pIndex)}
                                className="text-red-600 font-semibold text-sm hover:underline"
                            >
                                Eliminar producto
                            </button>
                        </div>
                    )}
                </div>
            ))}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button type="button" onClick={addProduct} className="text-blue-600 font-semibold hover:underline">
                    + Agregar otro producto
                </button>

                <button
                    type="submit"
                    disabled={isPending || hasErrors(errors)}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition ${
                        isPending || hasErrors(errors) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isPending ? "Guardando..." : "Guardar Productos"}
                </button>
            </div>
        </form>
    )
}

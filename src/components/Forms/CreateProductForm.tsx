"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { Size, CreateProductFormData, ErrorState } from "@/interfaces/products/ICreateProductForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Trash2, Package, DollarSign, Hash, Shirt, Image, Users, ArrowLeft, Save } from "lucide-react"

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [products, setProducts] = useState<CreateProductFormData[]>([
        {
            name: "",
            image: "",
            genre: "",
            category: "",
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

    const [errors, setErrors] = useState<ErrorState[]>([
        {
            sizes: [{}],
            category: "",
        },
    ])

    const validate = (data: CreateProductFormData[]): ErrorState[] => {
        return data.map((product) => {
            const productErrors: ErrorState = {
                sizes: [],
                category: "",
            }
            if (!product.name.trim()) productErrors.name = "Falta llenar este campo"
            if (!product.genre.trim()) productErrors.genre = "Falta llenar este campo"

            product.sizes.forEach((size) => {
                const sizeErrors: Record<string, string> = {}
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
                category: "",
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
        setErrors([
            ...errors,
            {
                sizes: [{}],
                category: "",
            },
        ])
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
        const markup = priceList / priceCost
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
        <div className="min-h-screen lg:p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.push("/home/inventory")}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inventario
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="lg:text-3xl text-xl font-bold text-gray-900 dark:text-white">
                                    Crear Productos
                                </h1>
                                <p className="text-gray-600 lg:text-base text-xs dark:text-gray-300 mt-1">
                                    Agrega múltiples productos con sus respectivas tallas y precios
                                </p>
                            </div>
                        </div>

                        <div className="flex lg:flex-row flex-col items-center gap-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>
                                    {products.length} producto{products.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>
                                    {products.reduce((acc, p) => acc + p.sizes.length, 0)} variante
                                    {products.reduce((acc, p) => acc + p.sizes.length, 0) !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {products.map((product, pIndex) => (
                        <div
                            key={pIndex}
                            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Product Header */}
                            <div className="bg-gradient-to-r from-blue-700 via-purple-500 to-indigo-600 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white">Producto {pIndex + 1}</h3>
                                            <p className="text-blue-100">
                                                {product.sizes.length} talla{product.sizes.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    {products.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(pIndex)}
                                            className="p-3 rounded-xl text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Product Basic Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Shirt className="w-4 h-4" />
                                            Nombre del producto
                                        </label>
                                        <Input
                                            value={product.name}
                                            onChange={(e) => handleProductChange(pIndex, "name", e.target.value)}
                                            placeholder="Ej: Zapatillas deportivas"
                                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                                errors[pIndex]?.name
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                        />
                                        {errors[pIndex]?.name && (
                                            <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                {errors[pIndex].name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Image className="w-4 h-4" />
                                            URL de imagen
                                        </label>
                                        <Input
                                            value={product.image}
                                            onChange={(e) => handleProductChange(pIndex, "image", e.target.value)}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                                errors[pIndex]?.image
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                        />
                                        {errors[pIndex]?.image && (
                                            <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                {errors[pIndex].image}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Users className="w-4 h-4" />
                                            Género
                                        </label>
                                        <Select
                                            value={product.genre}
                                            onValueChange={(value) => handleProductChange(pIndex, "genre", value)}
                                        >
                                            <SelectTrigger
                                                className={`h-12 text-base border-2 transition-all duration-200 ${
                                                    errors[pIndex]?.genre
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                        : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                                } bg-white dark:bg-slate-800`}
                                            >
                                                <SelectValue placeholder="Selecciona género" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600">
                                                <SelectItem value="Hombre">Hombre</SelectItem>
                                                <SelectItem value="Mujer">Mujer</SelectItem>
                                                <SelectItem value="Unisex">Unisex</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors[pIndex]?.genre && (
                                            <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                {errors[pIndex].genre}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Users className="w-4 h-4" />
                                        Categoría
                                    </label>
                                    <Select
                                        value={product.category}
                                        onValueChange={(value) => handleProductChange(pIndex, "category", value)}
                                    >
                                        <SelectTrigger
                                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                                errors[pIndex]?.category
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                            } bg-white dark:bg-slate-800`}
                                        >
                                            <SelectValue placeholder="Selecciona categoría" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600">
                                            <SelectItem value="Hombre">Hombre</SelectItem>
                                            <SelectItem value="Mujer">Mujer</SelectItem>
                                            <SelectItem value="Unisex">Unisex</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors[pIndex]?.category && (
                                        <p className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            {errors[pIndex].category}
                                        </p>
                                    )}
                                </div>

                                {/* Sizes Section */}
                                <div className="space-y-6">
                                    <div className="flex lg:flex-row flex-col items-center justify-between">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                                <Hash className="w-4 h-4 text-white" />
                                            </div>
                                            Tallas y Precios
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => addSize(pIndex)}
                                            className="flex lg:mt-0 mt-3 items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar talla
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {product.sizes.map((size, sIndex) => (
                                            <div
                                                key={sIndex}
                                                className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 transition-all hover:shadow-lg"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            Talla
                                                        </label>
                                                        <Input
                                                            placeholder="XL, 42, M..."
                                                            value={size.sizeNumber}
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    pIndex,
                                                                    sIndex,
                                                                    "sizeNumber",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.sizeNumber
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.sizeNumber && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].sizeNumber}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <DollarSign className="w-3 h-3" />
                                                            Costo Neto
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={size.priceCost}
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    pIndex,
                                                                    sIndex,
                                                                    "priceCost",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.priceCost
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.priceCost && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].priceCost}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <DollarSign className="w-3 h-3" />
                                                            Precio Plaza
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={size.priceList}
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    pIndex,
                                                                    sIndex,
                                                                    "priceList",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.priceList
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.priceList && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].priceList}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <Hash className="w-3 h-3" />
                                                            SKU
                                                        </label>
                                                        <Input
                                                            placeholder="ABC123"
                                                            value={size.sku}
                                                            onChange={(e) =>
                                                                handleSizeChange(pIndex, sIndex, "sku", e.target.value)
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.sku
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.sku && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].sku}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <Package className="w-3 h-3" />
                                                            Stock
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={size.stockQuantity}
                                                            onChange={(e) =>
                                                                handleSizeChange(
                                                                    pIndex,
                                                                    sIndex,
                                                                    "stockQuantity",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.stockQuantity
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-800`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.stockQuantity && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].stockQuantity}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Markup Display */}
                                                <div className="mt-6 pt-4 border-t-2 border-gray-200 dark:border-slate-500">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
                                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                Markup:{" "}
                                                                {calculateMarkup(size.priceCost, size.priceList)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remove Size Button */}
                                                {product.sizes.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSize(pIndex, sIndex)}
                                                        className="absolute top-4 right-4 p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                        title="Eliminar talla"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <button
                                type="button"
                                onClick={addProduct}
                                className="flex items-center gap-3 px-8 py-4 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar otro producto
                            </button>

                            <button
                                type="submit"
                                disabled={isPending || hasErrors(errors)}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                    isPending || hasErrors(errors)
                                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white"
                                }`}
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar Productos
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

/* eslint-disable jsx-a11y/alt-text */
"use client"

import type React from "react"

import { useState, useTransition, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import type { Size, CreateProductFormData, ErrorState } from "@/interfaces/products/ICreateProductForm"
import {
    Plus,
    Minus,
    Trash2,
    Package,
    DollarSign,
    Hash,
    Shirt,
    ImageIcon,
    Users,
    ArrowLeft,
    Save,
    ChevronDown,
} from "lucide-react"
import { getAllCategories } from "@/actions/categories/getAllCategories"
import type { ICategory } from "@/interfaces/categories/ICategory"
import { getAllChildCategories } from "@/actions/categories/getAllChildCategories"
import type { IChildCategory } from "@/interfaces/categories/ICategory"

interface CategoryOption {
    id: string
    label: string
    parentName: string
    childName: string
}

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [products, setProducts] = useState<CreateProductFormData[]>([
        {
            name: "",
            image: "",
            categoryID: "",
            genre: "",
            brand: "Otro",
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

    // Estados para autocompletado de categorías
    const [categories, setCategories] = useState<ICategory[]>([])
    const [childCategories, setChildCategories] = useState<IChildCategory[]>([])
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])
    const [categorySearches, setCategorySearches] = useState<string[]>([])
    const [showCategoryDropdowns, setShowCategoryDropdowns] = useState<boolean[]>([])
    const [filteredOptions, setFilteredOptions] = useState<CategoryOption[][]>([])
    const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
    // console.log(categoryOptions[0])
    useEffect(() => {
        Promise.all([getAllCategories(), getAllChildCategories()]).then(([cats, childCats]) => {
            setCategories(cats)
            setChildCategories(childCats)

            // Crear opciones combinadas para autocompletado
            const options: CategoryOption[] = []

            childCats.forEach((child) => {
                const parent = cats.find((cat) => cat.categoryID === child.parentID)
                if (parent) {
                    console.log(child)
                    options.push({
                        id: child.categoryID,
                        label: `${parent.name} > ${child.name}`,
                        parentName: parent.name,
                        childName: child.name,
                    })
                }
            })

            setCategoryOptions(options)
        })
    }, [])

    // Inicializar arrays de búsqueda cuando cambie el número de productos
    useEffect(() => {
        setCategorySearches((prev) => {
            const newSearches = [...prev]
            while (newSearches.length < products.length) {
                newSearches.push("")
            }
            return newSearches.slice(0, products.length)
        })

        setShowCategoryDropdowns((prev) => {
            const newDropdowns = [...prev]
            while (newDropdowns.length < products.length) {
                newDropdowns.push(false)
            }
            return newDropdowns.slice(0, products.length)
        })

        setFilteredOptions((prev) => {
            const newFiltered = [...prev]
            while (newFiltered.length < products.length) {
                newFiltered.push(categoryOptions)
            }
            return newFiltered.slice(0, products.length)
        })
    }, [products.length, categoryOptions])

    // Función mejorada para normalizar texto (quitar espacios extra y convertir a minúsculas)
    const normalizeText = (text: string) => {
        return text.toLowerCase().replace(/\s+/g, " ").trim()
    }

    // Manejar búsqueda de categorías con soporte para espacios
    const handleCategorySearch = (productIndex: number, searchValue: string) => {
        const newSearches = [...categorySearches]
        newSearches[productIndex] = searchValue
        setCategorySearches(newSearches)

        // Filtrar opciones con búsqueda mejorada
        const normalizedSearch = normalizeText(searchValue)
        const filtered = categoryOptions.filter((option) => {
            const normalizedLabel = normalizeText(option.label)
            const normalizedParent = normalizeText(option.parentName)
            const normalizedChild = normalizeText(option.childName)

            return (
                normalizedLabel.includes(normalizedSearch) ||
                normalizedParent.includes(normalizedSearch) ||
                normalizedChild.includes(normalizedSearch) ||
                // Búsqueda por palabras separadas
                normalizedSearch.split(" ").every((word) => normalizedLabel.includes(word))
            )
        })

        const newFiltered = [...filteredOptions]
        newFiltered[productIndex] = filtered
        setFilteredOptions(newFiltered)

        // Mostrar dropdown si hay texto
        const newDropdowns = [...showCategoryDropdowns]
        newDropdowns[productIndex] = searchValue.length > 0
        setShowCategoryDropdowns(newDropdowns)
    }

    // Seleccionar categoría del dropdown
    const handleCategorySelect = (productIndex: number, option: CategoryOption) => {
        const newProducts = [...products]
        newProducts[productIndex].categoryID = option.id
        setProducts(newProducts)

        const newSearches = [...categorySearches]
        newSearches[productIndex] = option.label
        setCategorySearches(newSearches)

        const newDropdowns = [...showCategoryDropdowns]
        newDropdowns[productIndex] = false
        setShowCategoryDropdowns(newDropdowns)

        setErrors(validate(newProducts))
    }

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            categoryRefs.current.forEach((ref, index) => {
                if (ref && !ref.contains(event.target as Node)) {
                    const newDropdowns = [...showCategoryDropdowns]
                    newDropdowns[index] = false
                    setShowCategoryDropdowns(newDropdowns)
                }
            })
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showCategoryDropdowns])

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
                if (size.sku && !/^1\d{11}$/.test(size.sku)) {
                    sizeErrors.sku = "El SKU debe iniciar con 1 y tener 12 dígitos numéricos"
                }
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

    // Función mejorada para manejar cambios de precio que se sincroniza entre tallas
    const handlePriceChange = (
        productIndex: number,
        sizeIndex: number,
        field: "priceCost" | "priceList",
        value: number
    ) => {
        const newProducts = [...products]
        const product = newProducts[productIndex]

        // Actualizar todas las tallas del producto con el nuevo valor
        product.sizes = product.sizes.map((size) => ({
            ...size,
            [field]: value,
        }))

        setProducts(newProducts)
        setErrors(validate(newProducts))
    }

    const handleSizeChange = (productIndex: number, sizeIndex: number, field: keyof Size, value: unknown) => {
        // Si es un cambio de precio, usar la función de sincronización
        if (field === "priceCost" || field === "priceList") {
            handlePriceChange(productIndex, sizeIndex, field, value as number)
            return
        }

        // Para otros campos, comportamiento normal
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
                categoryID: "",
                genre: "",
                brand: "Otro",
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
        const sizes = newProducts[productIndex].sizes
        // Copiar los precios de la primera talla existente
        const basePriceCost = sizes[0]?.priceCost ?? 0
        const basePriceList = sizes[0]?.priceList ?? 0

        newProducts[productIndex].sizes.push({
            sizeNumber: "",
            priceCost: basePriceCost,
            priceList: basePriceList,
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
        const productsWithSku = products.map((product) => ({
            ...product,
            sizes: product.sizes.map((size) => ({
                ...size,
                sku: size.sku.trim() === "" ? generateRandomSku() : size.sku,
            })),
        }))

        const validationErrors = validate(productsWithSku)
        setErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            toast.error("Corrige los errores antes de guardar.")
            return
        }

        startTransition(async () => {
            const result = await createMassiveProducts({ products: productsWithSku })
            if (result.success) {
                toast.success("Productos guardados correctamente.")
                router.push("/home/inventory")
            } else {
                toast.error(result.error || "Error al guardar productos.")
            }
        })
    }

    const handleSkuBlur = (productIndex: number, sizeIndex: number, value: string) => {
        if (value.trim() === "") {
            handleSizeChange(productIndex, sizeIndex, "sku", generateRandomSku())
        }
    }

    function generateRandomSku() {
        let sku = "1"
        for (let i = 0; i < 11; i++) {
            sku += Math.floor(Math.random() * 10).toString()
        }
        return sku
    }

    return (
        <div className="min-h-screen lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            onClick={() => router.push("/home/inventory")}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inventario
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-slate-700">
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
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
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
                                        <Button
                                            type="button"
                                            onClick={() => removeProduct(pIndex)}
                                            className="p-3 rounded-xl text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Product Basic Info */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold">
                                            <Shirt className="w-4 h-4" />
                                            Nombre del producto
                                        </Label>
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
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <ImageIcon className="w-4 h-4" />
                                            URL de imagen
                                        </Label>
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
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Users className="w-4 h-4" />
                                            Género
                                        </Label>
                                        <Select
                                            value={product.genre}
                                            onValueChange={(value) => handleProductChange(pIndex, "genre", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona género" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hombre">Hombre</SelectItem>
                                                <SelectItem value="Mujer">Mujer</SelectItem>
                                                <SelectItem value="Unisex">Unisex</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors[pIndex]?.genre && (
                                            <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                {errors[pIndex].genre}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category Autocomplete */}
                                <div className="space-y-3">
                                    <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Users className="w-4 h-4" />
                                        Categoría
                                    </Label>
                                    <div
                                        className="relative"
                                        ref={(el) => {
                                            categoryRefs.current[pIndex] = el
                                        }}
                                    >
                                        <Input
                                            value={categorySearches[pIndex] || ""}
                                            onChange={(e) => handleCategorySearch(pIndex, e.target.value)}
                                            placeholder="Buscar categoría... ej: Calzado Deportivo, Ropa Casual"
                                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                                errors[pIndex]?.category
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                        />
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

                                        {/* Dropdown de opciones */}
                                        {showCategoryDropdowns[pIndex] &&
                                            filteredOptions[pIndex] &&
                                            filteredOptions[pIndex].length > 0 && (
                                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                    {filteredOptions[pIndex].map((option, optIndex) => (
                                                        <Button
                                                            key={optIndex}
                                                            type="button"
                                                            onClick={() => handleCategorySelect(pIndex, option)}
                                                            className="w-full text-left px-4 py-3 dark:bg-slate-800 bg-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {option.parentName}
                                                                </div>
                                                                <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                                    {option.childName}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
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
                                        <Button
                                            type="button"
                                            onClick={() => addSize(pIndex)}
                                            className="flex lg:mt-0 mt-3 items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar talla
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        {product.sizes.map((size, sIndex) => (
                                            <div
                                                key={sIndex}
                                                className="relative bg-transparent dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 transition-all hover:shadow-lg"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                                    <div className="space-y-3 -mt-3">
                                                        <Label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            Talla
                                                        </Label>
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
                                                            } bg-white dark:bg-slate-900`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.sizeNumber && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].sizeNumber}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <DollarSign className="w-3 h-3" />
                                                            Costo Neto
                                                        </Label>
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
                                                            } bg-white dark:bg-slate-900`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.priceCost && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].priceCost}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <DollarSign className="w-3 h-3" />
                                                            Precio Plaza
                                                        </Label>
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
                                                            } bg-white dark:bg-slate-900`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.priceList && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].priceList}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <Hash className="w-3 h-3" />
                                                            SKU
                                                        </Label>
                                                        <Input
                                                            placeholder="ABC123"
                                                            value={size.sku}
                                                            onChange={(e) =>
                                                                handleSizeChange(pIndex, sIndex, "sku", e.target.value)
                                                            }
                                                            onBlur={(e) =>
                                                                handleSkuBlur(pIndex, sIndex, e.target.value)
                                                            }
                                                            className={`h-11 text-base border-2 transition-all duration-200 ${
                                                                errors[pIndex]?.sizes[sIndex]?.sku
                                                                    ? "border-red-300 focus:border-red-500"
                                                                    : "border-gray-300 dark:border-slate-500 focus:border-blue-500"
                                                            } bg-white dark:bg-slate-900`}
                                                        />
                                                        {errors[pIndex]?.sizes[sIndex]?.sku && (
                                                            <p className="text-red-500 text-xs">
                                                                {errors[pIndex].sizes[sIndex].sku}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-3">
                                                        <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                            <Package className="w-3 h-3" />
                                                            Stock
                                                        </Label>
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
                                                            } bg-white dark:bg-slate-900`}
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
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeSize(pIndex, sIndex)}
                                                        className="absolute top-4 right-4 p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                        title="Eliminar talla"
                                                    >
                                                        <Minus className="w-5 h-5" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                            <Button
                                type="button"
                                onClick={addProduct}
                                className="flex items-center gap-3 px-8 py-4 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar otro producto
                            </Button>

                            <Button
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
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

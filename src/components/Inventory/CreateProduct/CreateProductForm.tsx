"use client"

import * as XLSX from "xlsx"
import React, { useState, useRef, useEffect, useTransition } from "react"
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
import { CategoryManagementModal } from "@/components/Inventory/CategorySection/EditCategory/CategoryManagementModal"
import { Brand, Genre } from "@/interfaces/products/IProduct"

interface CategoryOption {
    id: string
    label: string
    parentName: string
    childName: string
}

export default function CreateProductForm() {
    // Estados principales deben ir arriba para evitar uso antes de declaración
    const [categories, setCategories] = useState<ICategory[]>([])
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])
    const [categorySearches, setCategorySearches] = useState<string[]>([])
    const [showCategoryDropdowns, setShowCategoryDropdowns] = useState<boolean[]>([])
    const [filteredOptions, setFilteredOptions] = useState<CategoryOption[][]>([])
    const categoryRefs = useRef<(HTMLDivElement | null)[]>([])
    const dropRef = useRef<HTMLDivElement>(null)

    // Columnas requeridas (deben coincidir con el Excel exportado)
    const REQUIRED_COLUMNS = [
        "Producto",
        "Género",
        "Marca",
        "Categoría",
        "TALLA",
        "PRECIO COSTO",
        "PRECIO PLAZA",
        "CÓDIGO EAN",
        "STOCK CENTRAL",
        "STOCK AGREGADO",
    ]

    // Normaliza texto para comparar categorías
    const normalize = (str: string) =>
        str
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .trim() || ""

    // Buscar categoryID por nombre (mejorado: busca en todas las subcategorías, tolerante a vacíos)
    const findCategoryIdByName = (catName: string) => {
        const norm = normalize(catName || "")
        if (!norm) return ""

        // 1. Coincidencia exacta en categoría padre
        const found = categories.find((cat) => normalize(cat.name) === norm)
        if (found) return found.categoryID

        // 2. Coincidencia exacta en cualquier subcategoría (nombre del hijo)
        for (const cat of categories) {
            if (cat.subcategories && Array.isArray(cat.subcategories)) {
                for (const subcat of cat.subcategories) {
                    if (normalize(subcat?.name || "") === norm) {
                        return subcat.categoryID || ""
                    }
                }
            }
        }

        // 3. Coincidencia parcial (incluye) en cualquier subcategoría
        for (const cat of categories) {
            if (cat.subcategories && Array.isArray(cat.subcategories)) {
                for (const subcat of cat.subcategories) {
                    if (normalize(subcat?.name || "").includes(norm)) {
                        return subcat.categoryID || ""
                    }
                }
            }
        }

        // 4. Coincidencia parcial (incluye) en categoría padre
        const foundPartial = categories.find((cat) => normalize(cat.name).includes(norm))
        if (foundPartial) return foundPartial.categoryID

        return ""
    }

    // Validar formato y datos del Excel
    function validateExcelRows(rows: any[]): string | null {
        if (!rows.length) return "El archivo está vacío."
        const cols = Object.keys(rows[0])
        for (const col of REQUIRED_COLUMNS) {
            if (!cols.includes(col)) return `Falta la columna obligatoria: ${col}`
        }
        // Columnas que pueden estar vacías porque tienen valor por defecto
        const ALLOW_EMPTY = ["Género", "Marca", "Categoría", "TALLA"]
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            for (const col of REQUIRED_COLUMNS) {
                if (ALLOW_EMPTY.includes(col)) continue
                if (row[col] === undefined || row[col] === null || row[col] === "") {
                    return `Fila ${i + 2}: Falta valor en columna "${col}".`
                }
            }
            // Validaciones extra (puedes agregar más)
            if (isNaN(Number(row["PRECIO COSTO"])) || isNaN(Number(row["PRECIO PLAZA"]))) {
                return `Fila ${i + 2}: Precio inválido.`
            }
            if (isNaN(Number(row["STOCK CENTRAL"]))) {
                return `Fila ${i + 2}: Stock central inválido.`
            }
        }
        return null
    }

    // Importar productos desde Excel (useCallback para dependencia estable)
    const handleExcelImport = React.useCallback(
        async (file: File) => {
            try {
                const data = await file.arrayBuffer()
                const workbook = XLSX.read(data)
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

                // Validar formato y datos
                const error = validateExcelRows(json)
                if (error) {
                    toast.error(error)
                    return
                }

                // Mapear los datos del Excel al formato de CreateProductFormData y sincronizar el input de búsqueda
                // Agrupar productos por nombre, imagen, categoría, género y marca
                const productMap = new Map<string, CreateProductFormData & { _catLabel: string }>()
                for (const row of json) {
                    const genre: Genre = row["Género"]?.trim() || "Unisex"
                    const brand: Brand = row["Marca"]?.trim() || "Otro"
                    let categoryName: string = row["Categoría"]?.trim() || "Calzado"
                    let catId = findCategoryIdByName(categoryName)
                    if (!catId) {
                        categoryName = "Otro"
                        catId = findCategoryIdByName("Otro")
                    }
                    let catLabel = categoryName
                    const option = categoryOptions.find((opt) => opt.id === catId)
                    if (option) catLabel = option.label
                    const sizeNumber = row["TALLA"]?.trim() || "NA"
                    const defaultImage =
                        "https://procircuit.cl/cdn/shop/files/Producto_sin_foto_e9abdc66-1532-404b-a9b1-b9685337c804.png?v=1713308305"
                    const image = row["Imagen"]?.trim() || defaultImage
                    const key = `${row["Producto"]}|${image}|${catId}|${genre}|${brand}`
                    const size = {
                        sizeNumber,
                        priceList: Number(row["PRECIO PLAZA"]),
                        priceCost: Number(row["PRECIO COSTO"]),
                        sku: row["CÓDIGO EAN"],
                        stockQuantity: Number(row["STOCK CENTRAL"]),
                    }
                    if (productMap.has(key)) {
                        productMap.get(key)!.sizes.push(size)
                    } else {
                        productMap.set(key, {
                            name: row["Producto"],
                            image,
                            categoryID: catId,
                            genre,
                            brand,
                            sizes: [size],
                            _catLabel: catLabel,
                        })
                    }
                }
                const importedProducts: CreateProductFormData[] = Array.from(productMap.values()).map(
                    ({ _catLabel, ...rest }) => rest
                )
                const importedCategorySearches: string[] = Array.from(productMap.values()).map((p) => p._catLabel)

                setProducts((prev) => {
                    // Si el primer producto está vacío, lo eliminamos
                    const isFirstEmpty =
                        prev.length === 1 && !prev[0].name && (!prev[0].sizes || !prev[0].sizes[0]?.sku)
                    if (isFirstEmpty) {
                        return [...importedProducts]
                    }
                    return [...prev, ...importedProducts]
                })
                // Sincronizar categorySearches exactamente con los productos importados
                setCategorySearches(importedCategorySearches)
                toast.success("Productos importados desde Excel.")
            } catch (err) {
                toast.error("Error al procesar el archivo Excel.")
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [categories, findCategoryIdByName, validateExcelRows]
    )

    // Handler para input file
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleExcelImport(file)
    }

    // Drag and drop
    useEffect(() => {
        const drop = dropRef.current
        if (!drop) return
        const handleDrop = (e: DragEvent) => {
            e.preventDefault()
            if (e.dataTransfer?.files?.length) {
                const file = e.dataTransfer.files[0]
                if (file.name.endsWith(".xlsx")) handleExcelImport(file)
                else toast.error("Solo se permiten archivos .xlsx")
            }
        }
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault()
        }
        drop.addEventListener("drop", handleDrop)
        drop.addEventListener("dragover", handleDragOver)
        return () => {
            drop.removeEventListener("drop", handleDrop)
            drop.removeEventListener("dragover", handleDragOver)
        }
    }, [categories, handleExcelImport])
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showModal, setShowModal] = useState(false)

    const [products, setProducts] = useState<CreateProductFormData[]>([
        {
            name: "",
            image: "",
            categoryID: "",
            genre: "Unisex",
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

    useEffect(() => {
        Promise.all([getAllCategories(), getAllChildCategories()]).then(([cats, childCats]) => {
            setCategories(cats)
            // Crear opciones combinadas para autocompletado
            const options: CategoryOption[] = []

            childCats.forEach((child) => {
                const parent = cats.find((cat) => cat.categoryID === child.parentID)
                if (parent) {
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
                /*SE COMENTA PORQUE EL INVENTARIO TIENE MUCHOS SKU ANTIGUOS QUE NO INICIAN CON 1
                if (size.sku && !/^1\d{11}$/.test(size.sku)) {
                    sizeErrors.sku = "El SKU debe iniciar con 1 y tener 12 dígitos numéricos"
                }*/
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
                genre: "Unisex",
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

        const productCleanBrand = productsWithSku.map((p) => {
            let brand = p.brand
            const brandType = {
                Otro: "Otro",
                D3SI: "D3SI",
            }

            if (!brandType[brand]) {
                brand = "Otro"
            }
            return {
                ...p,
                brand,
            }
        })
        const validationErrors = validate(productCleanBrand)
        setErrors(validationErrors)

        if (hasErrors(validationErrors)) {
            toast.error("Corrige los errores antes de guardar.")
            return
        }

        startTransition(async () => {
            const result = await createMassiveProducts({ products: productCleanBrand })
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
        <div className="lg:p-8">
            <div className="flex justify-end mb-4">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                        setProducts([])
                        setErrors([])
                    }}
                    disabled={products.length === 0}
                >
                    Eliminar todos los productos
                </Button>
            </div>
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

                {/* Importar desde Excel (input y drag-and-drop) */}
                <div
                    ref={dropRef}
                    className="mb-6 flex flex-col lg:flex-row items-start gap-4 border-2 border-dashed border-blue-400 rounded-xl p-4 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                    style={{ minHeight: 80 }}
                >
                    <div className="flex-1 flex flex-col gap-2">
                        <Label className="font-semibold text-gray-700 dark:text-gray-300">
                            Importar productos desde Excel (.xlsx):
                        </Label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Arrastra y suelta el archivo aquí o haz clic para seleccionarlo.
                        </span>
                    </div>
                    <Input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileInput}
                        className="max-w-xs"
                        style={{ display: "block" }}
                    />
                </div>

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
                {/* Form */}
                {/* Área de cards con scroll propio */}
                <div className="space-y-8 overflow-y-auto" style={{ maxHeight: "60vh", minHeight: "200px" }}>
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
                                            <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                {errors[pIndex].name}
                                            </div>
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

                                    <div className="space-y-3">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Package className="w-4 h-4" />
                                            Marca
                                        </Label>
                                        <Input
                                            value={product.brand}
                                            onChange={(e) => handleProductChange(pIndex, "brand", e.target.value)}
                                            placeholder="Ej: D3SI, Otro..."
                                            className="h-12 text-base border-2 transition-all duration-200 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Category Autocomplete */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            <Users className="w-4 h-4" />
                                            Categoría
                                        </Label>
                                        <Button
                                            type="button"
                                            onClick={() => setShowModal(true)}
                                            className="text-blue-600 hover:text-blue-800 bg-slate-200 dark:bg-slate-950 text-sm font-semibold flex items-center"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                        </Button>
                                        <CategoryManagementModal
                                            isOpen={showModal}
                                            onClose={() => setShowModal(false)}
                                            categories={categories}
                                        />
                                    </div>
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
                                                            onWheel={(e) => {
                                                                e.currentTarget.blur()
                                                            }}
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
                                                            onWheel={(e) => {
                                                                e.currentTarget.blur()
                                                            }}
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
                                                            onWheel={(e) => {
                                                                e.currentTarget.blur()
                                                            }}
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
                </div>

                {/* Action Buttons */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-8 mt-8">
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
                {/* Fin Action Buttons */}
            </div>
        </div>
    )
}

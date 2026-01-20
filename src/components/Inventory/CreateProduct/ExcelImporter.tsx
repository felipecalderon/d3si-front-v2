"use client"

import * as XLSX from "xlsx"
import React, { useRef, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProductFormStore } from "@/stores/product-form.store"
import { findCategoryIdByName, generateRandomSku } from "@/utils/product-form.utils"
import type { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import type { ICategory } from "@/interfaces/categories/ICategory"
import { Brand, Genre } from "@/interfaces/products/IProduct"

const REQUIRED_COLUMNS = [
    "Producto",
    "Género",
    "Marca",
    "Categoría",
    "Talla",
    "Precio Costo Neto",
    "Precio Plaza",
    "Código EAN",
    "Cantidad",
]

function validateExcelRows(rows: any[]): string | null {
    if (!rows.length) return "El archivo está vacío."
    const cols = Object.keys(rows[0])
    for (const col of REQUIRED_COLUMNS) {
        if (!cols.includes(col)) return `Falta la columna obligatoria: ${col}`
    }
    const ALLOW_EMPTY = ["Género", "Marca", "Categoría", "Talla", "Código EAN"]
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        for (const col of REQUIRED_COLUMNS) {
            if (ALLOW_EMPTY.includes(col)) continue
            if (row[col] === undefined || row[col] === null || row[col] === "") {
                return `Fila ${i + 2}: Falta valor en columna "${col}".`
            }
        }
        if (isNaN(Number(row["Precio Costo Neto"])) || isNaN(Number(row["Precio Plaza"]))) {
            return `Fila ${i + 2}: Precio inválido.`
        }
        if (isNaN(Number(row["Cantidad"]))) {
            return `Fila ${i + 2}: Stock central inválido.`
        }
    }
    return null
}

export function ExcelImporter({ categories }: { categories: ICategory[] }) {
    const setProducts = useProductFormStore((state) => state.setProducts)
    const dropRef = useRef<HTMLDivElement>(null)

    const handleExcelImport = useCallback(
        async (file: File) => {
            try {
                const data = await file.arrayBuffer()
                const workbook = XLSX.read(data)
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

                const error = validateExcelRows(json)
                if (error) {
                    toast.error(error)
                    return
                }

                const productMap = new Map<string, CreateProductFormData>()

                for (const row of json) {
                    const genre: Genre = !row["Género"] ? "Unisex" : row["Género"]
                    const brand: Brand = !row["Marca"] ? "Otro" : row["Marca"]
                    let categoryName: string = row["Categoría"]?.trim() || "Calzado"
                    let catId = findCategoryIdByName(categories, categoryName)
                    if (!catId) {
                        categoryName = "Otro"
                        catId = findCategoryIdByName(categories, "Otro")
                    }

                    const defaultImage = ""
                    const image = row["Imagen"]?.trim() || defaultImage
                    const productName = row["Producto"].replace(/\s+/g, " ").trim()
                    const key = `${productName}|${image}|${catId}|${genre}|${brand}`

                    const size = {
                        sizeNumber: String(row["Talla"]),
                        priceList: Number(row["Precio Plaza"]),
                        priceCost: Number(row["Precio Costo Neto"]),
                        sku: !!row["Código EAN"] ? row["Código EAN"] : generateRandomSku(),
                        stockQuantity: Number(row["Cantidad"]),
                        tempId: Math.random().toString(36).substring(7),
                    }

                    if (productMap.has(key)) {
                        productMap.get(key)!.sizes.push(size)
                    } else {
                        productMap.set(key, {
                            name: productName,
                            image,
                            categoryID: catId,
                            genre,
                            brand,
                            sizes: [size],
                            tempId: Math.random().toString(36).substring(7),
                        })
                    }
                }

                const importedProducts: CreateProductFormData[] = Array.from(productMap.values())
                setProducts(importedProducts)

                toast.success("Productos importados desde Excel.")
            } catch (err) {
                console.log(err)
                toast.error("Error al procesar el archivo Excel.")
            }
        },
        [categories, setProducts],
    )

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleExcelImport(file)
    }

    useEffect(() => {
        const drop = dropRef.current
        if (!drop) return

        const handleDrop = (e: DragEvent) => {
            e.preventDefault()
            if (e.dataTransfer?.files?.length) {
                const file = e.dataTransfer.files[0]
                if (file.name.endsWith(".xlsx")) {
                    handleExcelImport(file)
                } else {
                    toast.error("Solo se permiten archivos .xlsx")
                }
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
    }, [handleExcelImport])

    return (
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
    )
}

"use client"
// src/utils/exportInventoryToExcel.ts
import * as XLSX from "xlsx"
import { IProduct } from "@/interfaces/products/IProduct"
import { InventoryRow } from "@/interfaces/products/IInventoryRow"

type InventoryDataRow = InventoryRow

export function exportInventoryToExcel(products: IProduct[]) {
    const data: InventoryDataRow[] = []

    products.forEach((product) => {
        product.ProductVariations.forEach((variation) => {
            data.push({
                Producto: product.name,
                Imagen: product.image,
                Género: product.genre,
                Marca: product.brand,
                Categoría: product.Category?.name || "",
                Talla: variation.sizeNumber,
                Cantidad: variation.stockQuantity,
                "Precio Costo Neto": variation.priceCost,
                "Precio Plaza": variation.priceList,
                "Código EAN": variation.sku,
            } as InventoryDataRow)
        })
    })

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: false })
    const workbook = XLSX.utils.book_new()
    const wb = XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")

    const excelBuffer = XLSX.writeFile(workbook, "Listado-productos-d3si.xlsx")
}

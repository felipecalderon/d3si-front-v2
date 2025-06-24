"use client"
// src/utils/exportInventoryToExcel.ts
import * as XLSX from "xlsx"
import { IProduct } from "@/interfaces/products/IProduct"
import { InventoryRow } from "@/interfaces/products/IInventoryRow"

type InventoryDataRow = InventoryRow | { Producto?: string }

export function exportInventoryToExcel(products: IProduct[]) {
    const data: InventoryDataRow[] = []

    products.forEach((product) => {
        product.ProductVariations.forEach((variation) => {
            data.push({
                Producto: product.name,
                "CÓDIGO EAN": variation.sku,
                TALLA: variation.sizeNumber,
                "PRECIO COSTO": variation.priceCost,
                "PRECIO PLAZA": variation.priceList,
                "STOCK CENTRAL": variation.stockQuantity,
                "STOCK AGREGADO": variation.StoreProducts?.reduce((acc, sp) => acc + sp.quantity, 0) ?? 0,
            })
        })
    })

    // Agregamos el total al final como una fila separada
    data.push({})
    // data.push({ Producto: `Hay un total de ${totalStock} productos en stock central.` })

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: false })
    const workbook = XLSX.utils.book_new()
    const wb = XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario")

    const excelBuffer = XLSX.writeFile(workbook, "Listado-productos-d3si.xlsx")
}

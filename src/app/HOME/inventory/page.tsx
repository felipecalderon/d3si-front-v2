// src/app/home/inventory/page.tsx
/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { IProduct } from "@/interfaces/products/IProduct"
import InventoryActions from "@/components/Inventory/InventoryActions"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AddSizeModal } from "@/components/Modals/AddSizeModal"
import { deleteProduct } from "@/actions/products/deleteProduct"
import { toast } from "sonner"

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])

    // Estado para controlar qué producto tiene abierto el modal
    const [addSizeModalProductID, setAddSizeModalProductID] = useState<string | null>(null)

    useEffect(() => {
        getAllProducts().then(setRawProducts)
    }, [])

    const totalStockCentral = useMemo(
        () =>
            rawProducts.reduce(
                (total, product) =>
                    total + product.ProductVariations.reduce((sum, variation) => sum + variation.stockQuantity, 0),
                0
            ),
        [rawProducts]
    )

    const orderedProducts = useMemo(() => {
        if (!search.trim()) return rawProducts
        const lower = search.toLowerCase()
        return [
            ...rawProducts.filter(
                (product) =>
                    product.name.toLowerCase().includes(lower) ||
                    product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
            ),
            ...rawProducts.filter(
                (product) =>
                    !(
                        product.name.toLowerCase().includes(lower) ||
                        product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
                    )
            ),
        ]
    }, [search, rawProducts])

    function handleEditSize(product: IProduct) {
        console.log("Editar talla de:", product)
    }

    function handleDeleteProduct(product: IProduct) {
        const confirm = window.confirm(
            `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede revertir.`
        )
        if (!confirm) return

        toast.promise(deleteProduct(product.productID), {
            loading: "Eliminando producto...",
            success: () => {
                setRawProducts((prev) => prev.filter((p) => p.productID !== product.productID))
                return "Producto eliminado con éxito"
            },
            error: "Hubo un error al eliminar el producto",
        })
    }

    return (
        <main className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    placeholder="Buscar producto aquí..."
                    className="border px-4 py-2 rounded w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <InventoryActions products={rawProducts} />
                <p className="text-sm">
                    Hay un total de <strong>{totalStockCentral}</strong> productos en stock central.
                </p>
            </div>

            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Producto</th>
                            <th className="p-3">CÓDIGO EAN</th>
                            <th className="p-3">TALLA</th>
                            <th className="p-3">PRECIO COSTO</th>
                            <th className="p-3">PRECIO PLAZA</th>
                            <th className="p-3">STOCK CENTRAL</th>
                            <th className="p-3">STOCK AGREGADO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderedProducts.map((product) => {
                            const totalStockQuantity = product.ProductVariations.reduce(
                                (total, v) => total + v.stockQuantity,
                                0
                            )
                            return product.ProductVariations.map((variation, index) => {
                                const esPrimero = index === 0
                                return (
                                    <tr
                                        key={variation.variationID}
                                        className={`group ${
                                            esPrimero ? "border-t-4 border-t-blue-300" : "border-t"
                                        } text-base border-gray-200 text-gray-800`}
                                    >
                                        {esPrimero && (
                                            <td
                                                rowSpan={product.ProductVariations.length}
                                                className="py-1 px-3 text-left w-1/4 max-w-0"
                                            >
                                                <div className="relative w-full flex flex-col items-center">
                                                    {/* Botón de menú */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="absolute top-1 left-1 p-1 rounded hover:bg-gray-100">
                                                                <MoreVertical className="w-5 h-5 text-gray-600" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
                                                            <DropdownMenuItem onClick={() => handleEditSize(product)}>
                                                                Editar talla
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setAddSizeModalProductID(product.productID)
                                                                }
                                                            >
                                                                Agregar talla
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteProduct(product)}
                                                                className="text-red-600"
                                                            >
                                                                Eliminar producto
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>

                                                    <AddSizeModal
                                                        productID={product.productID}
                                                        open={addSizeModalProductID === product.productID}
                                                        onOpenChange={(open) => {
                                                            if (!open) setAddSizeModalProductID(null)
                                                        }}
                                                    />

                                                    {/* Imagen */}
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-40 h-30 object-cover rounded"
                                                    />
                                                    <span className="font-medium text-center">{product.name}</span>
                                                    <p className="flex gap-1 items-center text-white bg-blue-300 px-3 py-1 rounded-lg font-bold my-2">
                                                        {totalStockQuantity}
                                                    </p>
                                                </div>
                                            </td>
                                        )}
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">{variation.sku}</td>
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">
                                            {variation.sizeNumber}
                                        </td>
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">
                                            ${Number(variation.priceCost).toLocaleString("es-CL")}
                                        </td>
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">
                                            ${Number(variation.priceList).toLocaleString("es-CL")}
                                        </td>
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">
                                            <span
                                                className={
                                                    variation.stockQuantity === 0
                                                        ? "text-red-500"
                                                        : "font-bold text-green-600"
                                                }
                                            >
                                                {variation.stockQuantity}
                                            </span>
                                        </td>
                                        <td className="py-1 px-2 text-center hover:bg-gray-100">
                                            {variation.StoreProducts?.reduce((acc, sp) => acc + sp.quantity, 0) ?? 0}
                                        </td>
                                    </tr>
                                )
                            })
                        })}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

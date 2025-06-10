"use client"
import React, { useState, useMemo, useEffect } from "react"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { IProduct } from "@/interfaces/products/IProduct"
import InventoryActions from "@/components/Inventory/InventoryActions"

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])

    useEffect(() => {
        getAllProducts().then(setRawProducts)
    }, [])

    // Calcular el total de stock central sumando todas las variaciones
    const totalStockCentral = useMemo(
        () =>
            rawProducts.reduce(
                (total, product) =>
                    total + product.ProductVariations.reduce((sum, variation) => sum + variation.stockQuantity, 0),
                0
            ),
        [rawProducts]
    )

    // Ordenar productos: los que coinciden con el filtro van arriba
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

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar producto aquí..."
                            className="border px-4 py-2 rounded w-1/3"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <InventoryActions />
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
                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-40 h-30 object-cover"
                                                            />
                                                            <span className="font-medium text-center">
                                                                {product.name}
                                                            </span>
                                                            <p className="flex gap-1 items-center text-white bg-blue-300 px-3 py-1 rounded-lg font-bold my-2">
                                                                {totalStockQuantity}
                                                            </p>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="py-1 px-2 text-center hover:bg-gray-100">
                                                    {variation.sku}
                                                </td>
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
                                                    {/* Aquí podrías poner stock agregado si tienes */}
                                                    {variation.StoreProducts?.reduce(
                                                        (acc, sp) => acc + sp.quantity,
                                                        0
                                                    ) ?? 0}
                                                </td>
                                            </tr>
                                        )
                                    })
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

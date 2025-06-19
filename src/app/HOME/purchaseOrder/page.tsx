/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStore } from "@/interfaces/stores/IStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [pedido, setPedido] = useState<Record<string, number>>({})

    useEffect(() => {
        async function fetchData() {
            const [productsData, storesData] = await Promise.all([getAllProducts(), getAllStores()])
            setRawProducts(productsData)
            setStores(storesData)
            setIsLoading(false)
        }
        fetchData()
    }, [])

    const adminStoreIDs = useMemo(() => {
        return stores.filter((s) => s.isAdminStore).map((s) => s.storeID)
    }, [stores])

    const orderedProducts = useMemo(() => {
        if (!search.trim()) return rawProducts
        const lower = search.toLowerCase()
        return rawProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(lower) ||
                product.ProductVariations.some((v) => v.sku?.toLowerCase().includes(lower))
        )
    }, [search, rawProducts])

    const subtotal = useMemo(
        () =>
            rawProducts.reduce((total, product) => {
                return (
                    total +
                    product.ProductVariations.reduce((sub, variation) => {
                        const qty = pedido[variation.sku] || 0
                        return sub + qty * variation.priceList
                    }, 0)
                )
            }, 0),
        [pedido, rawProducts]
    )

    return (
        <main className="p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
                <Input
                    type="text"
                    placeholder="Buscar producto aquí..."
                    className="w-[50%] mr-1 border dark:bg-gray-800 bg-slate-300 px-4 py-2 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex gap-2 mr-2">
                    <Button>Agregar calzados</Button>
                    <Button variant="destructive">Quitar calzados</Button>
                </div>
                <p>Gestionando orden de compra para - se incluira listado de tienda</p>
            </div>
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div className="dark:bg-slate-800 bg-white shadow rounded overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PRODUCTO/NOMBRE</TableHead>
                                <TableHead>CÓDIGO EAN</TableHead>
                                <TableHead>TALLA</TableHead>
                                <TableHead>COSTO</TableHead>
                                <TableHead>DISPONIBLE CENTRAL</TableHead>
                                <TableHead>DISPONIBLE TIENDA</TableHead>
                                <TableHead>PEDIDO</TableHead>
                                <TableHead>SUBTOTAL</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderedProducts.map((product) =>
                                product.ProductVariations.map((variation, index) => {
                                    const esPrimero = index === 0
                                    const stockAgregado =
                                        variation.StoreProducts?.filter(
                                            (sp) => !adminStoreIDs.includes(sp.storeID)
                                        ).reduce((sum, sp) => sum + sp.quantity, 0) ?? 0

                                    return (
                                        <TableRow key={variation.variationID}>
                                            {esPrimero && (
                                                <TableCell
                                                    rowSpan={product.ProductVariations.length}
                                                    className="align-middle"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-24 h-20 object-cover rounded"
                                                        />
                                                        <span className="font-medium text-center">{product.name}</span>
                                                    </div>
                                                </TableCell>
                                            )}
                                            <TableCell className="text-center">{variation.sku}</TableCell>
                                            <TableCell className="text-center">{variation.sizeNumber}</TableCell>
                                            <TableCell className="text-center">{variation.priceList}</TableCell>
                                            <TableCell className="text-center">{variation.stockQuantity}</TableCell>
                                            <TableCell className="text-center">{stockAgregado}</TableCell>
                                            <TableCell className="text-center">
                                                <Input
                                                    type="number"
                                                    className="w-[40%] text-center"
                                                    value={pedido[variation.sku] || ""}
                                                    onChange={(e) =>
                                                        setPedido((prev) => ({
                                                            ...prev,
                                                            [variation.sku]: parseInt(e.target.value) || 0,
                                                        }))
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                ${(pedido[variation.sku] || 0) * (variation.priceList ?? 0)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex justify-end mt-4 px-6">
                        <p className="text-lg font-bold">Subtotal general: ${subtotal.toLocaleString("es-CL")}</p>
                    </div>
                </div>
            )}
        </main>
    )
}

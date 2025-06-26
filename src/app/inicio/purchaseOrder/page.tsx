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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { useRouter } from "next/navigation"

export default function PurchaseOrderPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [selectedStoreID, setSelectedStoreID] = useState<string>("")
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

    const handleAgregarCalzados = () => {
        setPedido((prev) => {
            const nuevoPedido = { ...prev }
            rawProducts.forEach((product) => {
                product.ProductVariations.forEach((variation) => {
                    const sku = variation.sku
                    nuevoPedido[sku] = (nuevoPedido[sku] || 0) + 1
                })
            })
            return nuevoPedido
        })
    }

    const handleQuitarCalzados = () => {
        setPedido((prev) => {
            const nuevoPedido = { ...prev }
            rawProducts.forEach((product) => {
                product.ProductVariations.forEach((variation) => {
                    const sku = variation.sku
                    nuevoPedido[sku] = Math.max((nuevoPedido[sku] || 0) - 1, 0)
                })
            })
            return nuevoPedido
        })
    }

    const router = useRouter()

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
                    <Button onClick={handleAgregarCalzados}>Agregar calzados</Button>
                    <Button variant="destructive" onClick={handleQuitarCalzados}>
                        Quitar calzados
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold">Gestionando orden de compra para:</span>
                <Select value={selectedStoreID} onValueChange={setSelectedStoreID}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Seleccionar tienda" />
                    </SelectTrigger>
                    <SelectContent>
                        {stores.map((store) => (
                            <SelectItem key={store.storeID} value={store.storeID}>
                                {store.name} - {store.city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                                        <TableRow
                                            key={variation.variationID}
                                            className={
                                                esPrimero
                                                    ? "border-t-2 border-blue-700 dark:border-white"
                                                    : "border-t-2 border-blue-700 dark:border-white"
                                            }
                                        >
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
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 px-6 gap-4">
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded w-full md:w-1/2 text-sm space-y-2">
                            <p>
                                <strong>Total de productos:</strong>{" "}
                                {Object.values(pedido).reduce((acc, curr) => acc + curr, 0)}
                            </p>
                            <p>
                                <strong>Total neto:</strong> ${subtotal.toLocaleString("es-CL")}
                            </p>
                            <p>
                                <strong>IVA (19%):</strong> ${(subtotal * 0.19).toLocaleString("es-CL")}
                            </p>
                            <p>
                                <strong>Total:</strong> ${(subtotal * 1.19).toLocaleString("es-CL")}
                            </p>
                        </div>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={async () => {
                                if (!selectedStoreID) {
                                    alert("Selecciona una tienda antes de continuar.")
                                    return
                                }

                                //este userID es hardcodeado, se debe obtener del contexto de usuario o sesión
                                const userID = "2f13abf6-bbb6-402b-a5b2-e368a89c79e9"

                                const orderedProducts = Object.entries(pedido)
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    .filter(([_, qty]) => qty > 0)
                                    .map(([sku, quantityOrdered]) => {
                                        const variation = rawProducts
                                            .flatMap((p) => p.ProductVariations)
                                            .find((v) => v.sku === sku)

                                        return variation
                                            ? {
                                                  variationID: variation.variationID,
                                                  quantityOrdered,
                                              }
                                            : null
                                    })
                                    .filter(Boolean) as {
                                    variationID: string
                                    quantityOrdered: number
                                }[]

                                if (orderedProducts.length === 0) {
                                    alert("Debes agregar al menos un producto con cantidad mayor a 0.")
                                    return
                                }

                                const res = await createOrder({
                                    storeID: selectedStoreID,
                                    userID,
                                    products: orderedProducts,
                                })

                                if (res.success) {
                                    router.push("/home/invoices")
                                } else {
                                    alert(res.error)
                                }
                            }}
                        >
                            ➡ Proceder a generar orden de compra
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}

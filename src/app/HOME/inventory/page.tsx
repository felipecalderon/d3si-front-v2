/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useMemo, useEffect } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { getAllStores } from "@/actions/stores/getAllStores"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStore } from "@/interfaces/stores/IStore"
import InventoryActions from "@/components/Inventory/InventoryActions"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AddSizeModal } from "@/components/Modals/AddSizeModal"
import { deleteProduct } from "@/actions/products/deleteProduct"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import TableSkeleton from "@/components/ListTable/TableSkeleton"
import { Input } from "@/components/ui/input"

export default function InventoryPage() {
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [rawProducts, setRawProducts] = useState<IProduct[]>([])
    const [stores, setStores] = useState<IStore[]>([])
    const [addSizeModalProductID, setAddSizeModalProductID] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<{
        sku: string
        field: "priceCost" | "priceList" | "stockQuantity" | "sizeNumber"
    } | null>(null)
    const [editValue, setEditValue] = useState<string>("")

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

    async function handleSaveEdit(product: IProduct, variationID: string) {
        const variation = product.ProductVariations.find((v) => v.variationID === variationID)
        if (!variation) return

        const updated = {
            name: product.name,
            image: product.image,
            genre: product.genre,
            sizes: [
                {
                    sku: variation.sku,
                    sizeNumber: editingField!.field === "sizeNumber" ? editValue : variation.sizeNumber,
                    priceList: editingField!.field === "priceList" ? parseFloat(editValue) : variation.priceList,
                    priceCost: editingField!.field === "priceCost" ? parseFloat(editValue) : variation.priceCost,
                    stockQuantity:
                        editingField!.field === "stockQuantity" ? parseFloat(editValue) : variation.stockQuantity,
                },
            ],
        }

        toast.promise(createMassiveProducts({ products: [updated] }), {
            loading: "Actualizando producto...",
            success: () => {
                setRawProducts((prev) =>
                    prev.map((p) =>
                        p.productID === product.productID
                            ? {
                                  ...p,
                                  ProductVariations: p.ProductVariations.map((v) =>
                                      v.variationID === variationID
                                          ? {
                                                ...v,
                                                [editingField!.field]:
                                                    editingField!.field === "sizeNumber"
                                                        ? editValue
                                                        : parseFloat(editValue),
                                            }
                                          : v
                                  ),
                              }
                            : p
                    )
                )
                setEditingField(null)
                return "Campo actualizado"
            },
            error: "Error al actualizar",
        })
    }

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
                <InventoryActions products={rawProducts} />
                <p className="text-sm">
                    Hay un total de <strong>{totalStockCentral}</strong> productos en stock central.
                </p>
            </div>
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div className="dark:bg-slate-800 bg-white shadow rounded overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>CÓDIGO EAN</TableHead>
                                <TableHead>TALLA</TableHead>
                                <TableHead>PRECIO COSTO</TableHead>
                                <TableHead>PRECIO PLAZA</TableHead>
                                <TableHead>STOCK CENTRAL</TableHead>
                                <TableHead>STOCK AGREGADO</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orderedProducts.map((product) => {
                                // Suma total del stock central para este producto
                                const totalStockQuantity = product.ProductVariations.reduce(
                                    (total, v) => total + v.stockQuantity,
                                    0
                                )

                                return product.ProductVariations.map((variation, index) => {
                                    const esPrimero = index === 0

                                    // Stock agregado = suma de StoreProducts en sucursales (no admin)
                                    const stockAgregado =
                                        variation.StoreProducts?.filter(
                                            (sp) => !adminStoreIDs.includes(sp.storeID)
                                        ).reduce((sum, sp) => sum + sp.quantity, 0) ?? 0

                                    return (
                                        <TableRow
                                            key={variation.variationID}
                                            className={`group ${
                                                esPrimero
                                                    ? "border-t-2 dark:border-t-gray-700 border-t-blue-300"
                                                    : "border-t"
                                            } text-base border-gray-200 dark:text-gray-300 text-gray-800`}
                                        >
                                            {esPrimero && (
                                                <TableCell
                                                    rowSpan={product.ProductVariations.length}
                                                    className="py-1 px-3 text-left w-1/4 max-w-0"
                                                >
                                                    <div className="relative w-full flex flex-col items-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    title="boton"
                                                                    className="absolute top-1 rounded-sm left-1 p-1 dark:hover:bg-gray-900 hover:bg-gray-100"
                                                                >
                                                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start">
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
                                                            name={product.name}
                                                            image={product.image}
                                                            genre={product.genre}
                                                            open={addSizeModalProductID === product.productID}
                                                            onOpenChange={(open) => {
                                                                if (!open) setAddSizeModalProductID(null)
                                                            }}
                                                            onAddSize={(newSize) => {
                                                                setRawProducts((prev) =>
                                                                    prev.map((p) =>
                                                                        p.productID === product.productID
                                                                            ? {
                                                                                  ...p,
                                                                                  ProductVariations: [
                                                                                      ...p.ProductVariations,
                                                                                      newSize,
                                                                                  ],
                                                                              }
                                                                            : p
                                                                    )
                                                                )
                                                            }}
                                                        />

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
                                                </TableCell>
                                            )}
                                            <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100">
                                                {variation.sku}
                                            </TableCell>
                                            <TableCell
                                                className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setEditingField({ sku: variation.sku, field: "sizeNumber" })
                                                    setEditValue(variation.sizeNumber)
                                                }}
                                            >
                                                {editingField?.sku === variation.sku &&
                                                editingField?.field === "sizeNumber" ? (
                                                    <div className="flex justify-center">
                                                        <Input
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            onBlur={() =>
                                                                handleSaveEdit(product, variation.variationID)
                                                            }
                                                            className="w-[40%] px-2 py-1 rounded border"
                                                            autoFocus
                                                        />
                                                    </div>
                                                ) : (
                                                    variation.sizeNumber
                                                )}
                                            </TableCell>

                                            {(
                                                ["priceCost", "priceList", "stockQuantity"] as Array<
                                                    "priceCost" | "priceList" | "stockQuantity"
                                                >
                                            ).map((field) => (
                                                <TableCell
                                                    key={field}
                                                    className="text-center dark:hover:bg-gray-900 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingField({ sku: variation.sku, field })
                                                        setEditValue(String(variation[field]))
                                                    }}
                                                >
                                                    {editingField?.sku === variation.sku &&
                                                    editingField?.field === field ? (
                                                        <div className="flex justify-center">
                                                            <Input
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                onBlur={() =>
                                                                    handleSaveEdit(product, variation.variationID)
                                                                }
                                                                className="w-[40%] px-2 py-1 rounded border"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    ) : field === "stockQuantity" ? (
                                                        <span
                                                            className={
                                                                variation.stockQuantity < 20
                                                                    ? "font-bold text-red-500"
                                                                    : "font-bold text-green-600"
                                                            }
                                                        >
                                                            {variation.stockQuantity}
                                                        </span>
                                                    ) : (
                                                        `$${Number(variation[field]).toLocaleString("es-CL")}`
                                                    )}
                                                </TableCell>
                                            ))}

                                            <TableCell className="text-center dark:hover:bg-gray-900 hover:bg-gray-100">
                                                {stockAgregado}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    )
}

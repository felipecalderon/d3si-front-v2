/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { MotionItem } from "@/components/Animations/motionItem"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { IProduct } from "@/interfaces/products/IProduct"

interface Props {
    items: Array<{ product: IProduct; variation: any; isFirst: boolean }>
    pedido: Record<string, number>
    adminStoreIDs: string[]
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export function PurchaseOrderTableBody({ items, pedido, adminStoreIDs, setPedido }: Props) {
    return (
        <tbody>
            {items.map(({ product, variation, isFirst }, index) => {
                const stockAgregado =
                    variation.StoreProducts?.reduce(
                        (sum: number, sp: any) => (!adminStoreIDs.includes(sp.storeID) ? sum + sp.quantity : sum),
                        0
                    ) ?? 0

                const pedidoQuantity = pedido[variation.sku] || 0
                const subtotalVariation = pedidoQuantity * (variation.priceList ?? 0)

                return (
                    <tr
                        key={`${product.productID}-${variation.variationID}`}
                        className={`group hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 ${
                            isFirst
                                ? "border-t-2 border-t-slate-200 dark:border-t-slate-400"
                                : "border-t border-gray-100 dark:border-gray-700"
                        } text-sm dark:text-gray-300 text-gray-800 h-16`}
                    >
                        {/* Producto */}
                        <td className="py-2 px-3 text-left w-1/4">
                            {isFirst ? (
                                <MotionItem key={`product-${product.productID}`} delay={index + 2}>
                                    <div className="w-full flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded border"
                                            />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {product.ProductVariations.length}
                                            </div>
                                        </div>
                                        <div className="font-medium text-sm block truncate">{product.name}</div>
                                    </div>
                                </MotionItem>
                            ) : (
                                <div className="w-12 h-12"></div>
                            )}
                        </td>

                        {/* SKU */}
                        <td className="text-center py-2">
                            <MotionItem key={`sku-${variation.variationID}`} delay={index + 2}>
                                <Badge variant="outline" className="font-mono text-xs">
                                    {variation.sku}
                                </Badge>
                            </MotionItem>
                        </td>

                        {/* Talla */}
                        <td className="text-center py-2">
                            <MotionItem key={`size-${variation.variationID}`} delay={index + 2}>
                                <Badge variant="secondary" className="font-bold text-sm">
                                    {variation.sizeNumber}
                                </Badge>
                            </MotionItem>
                        </td>

                        {/* Costo */}
                        <td className="w-32 text-center py-3">
                            <MotionItem key={`cost-${variation.variationID}`} delay={index + 2}>
                                <span className="font-semibold text-sm">
                                    ${Number(variation.priceList).toLocaleString("es-CL")}
                                </span>
                            </MotionItem>
                        </td>

                        {/* Disponible Central */}
                        <td className="w-32 text-center py-3">
                            <MotionItem key={`central-${variation.variationID}`} delay={index + 2}>
                                <Badge
                                    variant={variation.stockQuantity < 20 ? "destructive" : "default"}
                                    className="font-bold text-sm"
                                >
                                    {variation.stockQuantity}
                                </Badge>
                            </MotionItem>
                        </td>

                        {/* Disponible Tienda */}
                        <td className="w-32 text-center py-3">
                            <MotionItem key={`store-${variation.variationID}`} delay={index + 2}>
                                <Badge
                                    variant={stockAgregado > 0 ? "default" : "secondary"}
                                    className="font-semibold text-sm"
                                >
                                    {stockAgregado}
                                </Badge>
                            </MotionItem>
                        </td>

                        {/* Pedido */}
                        <td className="w-32 text-center py-3">
                            <MotionItem key={`order-${variation.variationID}`} delay={index + 2}>
                                <div className="flex justify-center">
                                    <Input
                                        type="number"
                                        className="w-16 h-8 text-center text-xs border-2"
                                        value={pedidoQuantity || ""}
                                        onChange={(e) => {
                                            const val = Number.parseInt(e.target.value) || 0
                                            setPedido((prev) => ({
                                                ...prev,
                                                [variation.sku]: val,
                                            }))
                                        }}
                                    />
                                </div>
                            </MotionItem>
                        </td>

                        {/* Subtotal */}
                        <td className="w-32 text-center py-3">
                            <MotionItem key={`subtotal-${variation.variationID}`} delay={index + 2}>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    ${subtotalVariation.toLocaleString("es-CL")}
                                </span>
                            </MotionItem>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    )
}

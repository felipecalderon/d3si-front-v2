import React from "react"

import { Package, Minus, Plus } from "lucide-react"
import { toPrice } from "@/utils/priceFormat"
import { OrderEditItem, useEditOrderStore } from "@/stores/order.store"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { toast } from "sonner"

interface Props {
    products: OrderEditItem[]
}

const ProductsTable: React.FC<Props> = ({ products }) => {
    const { user } = useAuth()
    const { actions } = useEditOrderStore()
    const { incrementQuantity, decrementQuantity, removeProduct } = actions
    const isAdmin = user?.role === Role.Admin
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No hay productos en esta orden.</p>
            </div>
        )
    }
    return (
        <div className="space-y-4">
            {/* Desktop Table */}
            <div className="block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                Nombre
                            </th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                Talla
                            </th>
                            <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                Cantidad
                            </th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                Subtotal
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, index) => (
                            <tr
                                key={item.variation.variationID}
                                className={`border-b border-gray-100 dark:border-gray-700 ${
                                    index % 2 === 0 ? "bg-gray-50 dark:bg-slate-700/50" : ""
                                }`}
                            >
                                <td className="py-3 px-2">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                        {item.variation.sku}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="px-2 py-1 rounded text-xs font-medium">
                                        {item.product.name || "-"}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span>{item.variation.sizeNumber}</span>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {isAdmin && (
                                            <button
                                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                                onClick={() => decrementQuantity(item.variation.sku)}
                                                title="Quitar uno"
                                            >
                                                <Minus className="w-4 h-4 text-red-600" />
                                            </button>
                                        )}
                                        <span className="font-semibold min-w-[24px] text-center block">
                                            {item.variation.quantity}
                                        </span>
                                        {isAdmin && (
                                            <button
                                                // disabled={item.variation.quantity <= item.variation.stockQuantity}
                                                className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900"
                                                onClick={() => {
                                                    if (item.variation.quantity <= item.variation.stockQuantity) {
                                                        return toast.error("No se pueden agregar más, no hay más stock")
                                                    } else if (item.variation.stockQuantity === 0) {
                                                        removeProduct(item.variation.sku)
                                                        return toast.error("Producto sin stock disponible")
                                                    }
                                                    incrementQuantity(item.variation.sku)
                                                }}
                                                title="Agregar uno"
                                            >
                                                <Plus className="w-4 h-4 text-green-600" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-right font-bold text-green-600 dark:text-green-400">
                                    {toPrice(Number(item.variation.priceCost) * item.variation.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductsTable

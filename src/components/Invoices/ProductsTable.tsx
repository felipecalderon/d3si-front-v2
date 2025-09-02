import React from "react"

import { Package, Minus, Plus } from "lucide-react"

interface Product {
    variationID: string
    sku: string
    sizeNumber: string | string[]
    availableSizes?: string[]
    Product?: { name?: string }
    OrderProduct?: { quantityOrdered?: number; subtotal?: number | string }
}

interface Props {
    products: Product[]
    isAdmin: boolean
    onRemove: (variationID: string) => void
    onIncrement?: (variationID: string) => void
    onSelectTallas?: (variationID: string, tallas: string[]) => void
}

const ProductsTable: React.FC<Props> = ({ products, isAdmin, onRemove, onIncrement, onSelectTallas }) => {
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
            <div className="hidden md:block overflow-x-auto">
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
                                key={item.variationID}
                                className={`border-b border-gray-100 dark:border-gray-700 ${
                                    index % 2 === 0 ? "bg-gray-50 dark:bg-slate-700/50" : ""
                                }`}
                            >
                                <td className="py-3 px-2">
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                        {item.sku}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <span className="px-2 py-1 rounded text-xs font-medium">
                                        {item.Product?.name || "-"}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <select
                                        className="min-w-[80px] border rounded px-2 py-1 text-xs bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-300"
                                        value={
                                            typeof item.sizeNumber === "string"
                                                ? item.sizeNumber
                                                : item.sizeNumber[0] || ""
                                        }
                                        onChange={(e) => {
                                            const selected = e.target.value
                                            if (onSelectTallas) onSelectTallas(item.variationID, [selected])
                                        }}
                                    >
                                        {(
                                            item.availableSizes ||
                                            (typeof item.sizeNumber === "string" ? [item.sizeNumber] : [])
                                        ).map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {isAdmin && (
                                            <button
                                                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                                onClick={() => onRemove(item.variationID)}
                                                title="Quitar uno"
                                            >
                                                <Minus className="w-4 h-4 text-red-600" />
                                            </button>
                                        )}
                                        <span className="font-semibold min-w-[24px] text-center block">
                                            {item.OrderProduct?.quantityOrdered ?? "-"}
                                        </span>
                                        {isAdmin && (
                                            <button
                                                className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900"
                                                onClick={() => onIncrement && onIncrement(item.variationID)}
                                                title="Agregar uno"
                                            >
                                                <Plus className="w-4 h-4 text-green-600" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-right font-bold text-green-600 dark:text-green-400">
                                    {item.OrderProduct &&
                                        (typeof item.OrderProduct.subtotal === "number"
                                            ? item.OrderProduct.subtotal.toLocaleString("es-CL", {
                                                  style: "currency",
                                                  currency: "CLP",
                                                  minimumFractionDigits: 0,
                                              })
                                            : Number(item.OrderProduct.subtotal).toLocaleString("es-CL", {
                                                  style: "currency",
                                                  currency: "CLP",
                                                  minimumFractionDigits: 0,
                                              }))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {products.map((item) => (
                    <div
                        key={item.variationID}
                        className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs font-mono">
                                {item.sku}
                            </span>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                Talla {item.sizeNumber}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Nombre</p>
                                <p className="font-medium">{item.Product?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Cantidad</p>
                                <p className="font-semibold">{item.OrderProduct?.quantityOrdered ?? "-"}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                                <p className="font-bold text-green-600 dark:text-green-400">
                                    {item.OrderProduct &&
                                        (typeof item.OrderProduct.subtotal === "number"
                                            ? item.OrderProduct.subtotal.toLocaleString("es-CL", {
                                                  style: "currency",
                                                  currency: "CLP",
                                                  minimumFractionDigits: 0,
                                              })
                                            : Number(item.OrderProduct.subtotal).toLocaleString("es-CL", {
                                                  style: "currency",
                                                  currency: "CLP",
                                                  minimumFractionDigits: 0,
                                              }))}
                                </p>
                            </div>
                        </div>
                        {isAdmin && (
                            <div className="mt-2 flex items-center gap-2 justify-end">
                                <button
                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                    onClick={() => onRemove(item.variationID)}
                                    title="Quitar uno"
                                >
                                    <Minus className="w-4 h-4 text-red-600" />
                                </button>
                                <span className="font-semibold min-w-[24px] text-center block">
                                    {item.OrderProduct?.quantityOrdered ?? "-"}
                                </span>
                                <button
                                    className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900"
                                    onClick={() => onIncrement && onIncrement(item.variationID)}
                                    title="Agregar uno"
                                >
                                    <Plus className="w-4 h-4 text-green-600" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductsTable

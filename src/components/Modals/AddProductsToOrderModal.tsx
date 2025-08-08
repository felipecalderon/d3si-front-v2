"use client"
import React, { useEffect, useState } from "react"
import { getAllProducts } from "@/actions/products/getAllProducts"

interface AddProductsToOrderModalProps {
    open: boolean
    onClose: () => void
    onConfirm: (selected: Record<string, { cantidad: number; producto: any; variation: any }>) => void
    initialSelected?: Record<string, { cantidad: number; producto: any; variation: any }>
}

export default function AddProductsToOrderModal({
    open,
    onClose,
    onConfirm,
    initialSelected,
}: AddProductsToOrderModalProps) {
    const [productosDisponibles, setProductosDisponibles] = useState<any[]>([])
    const [productosSeleccionados, setProductosSeleccionados] = useState<
        Record<string, { cantidad: number; producto: any; variation: any }>
    >(initialSelected || {})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            setLoading(true)
            getAllProducts()
                .then((prods) => setProductosDisponibles(prods))
                .finally(() => setLoading(false))
        }
    }, [open])

    const handleSeleccionarProducto = (variation: any, producto: any, cantidad: number) => {
        setProductosSeleccionados((prev) => {
            const key = variation.variationID
            if (cantidad > 0) {
                return { ...prev, [key]: { cantidad, producto, variation } }
            } else {
                const nuevo = { ...prev }
                delete nuevo[key]
                return nuevo
            }
        })
    }

    const handleConfirm = () => {
        onConfirm(productosSeleccionados)
        setProductosSeleccionados({})
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl" onClick={onClose}>
                    ×
                </button>
                <h2 className="text-lg font-bold mb-4">Agregar productos a la orden</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm mb-4">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2 px-2">SKU</th>
                                <th className="text-left py-2 px-2">Nombre</th>
                                <th className="text-left py-2 px-2">Talla</th>
                                <th className="text-center py-2 px-2">Cantidad</th>
                                <th className="text-center py-2 px-2">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : productosDisponibles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        No hay productos disponibles.
                                    </td>
                                </tr>
                            ) : (
                                productosDisponibles.map((prod: any) =>
                                    prod.ProductVariations?.map((variation: any) => {
                                        const key = variation.variationID
                                        const cantidad = productosSeleccionados[key]?.cantidad || 0
                                        return (
                                            <tr key={key} className="border-b border-gray-100 dark:border-gray-700">
                                                <td className="py-2 px-2">{variation.sku}</td>
                                                <td className="py-2 px-2">{prod.name}</td>
                                                <td className="py-2 px-2">{variation.sizeNumber}</td>
                                                <td className="py-2 px-2 text-center">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-center"
                                                        value={cantidad}
                                                        onChange={(e) =>
                                                            handleSeleccionarProducto(
                                                                variation,
                                                                prod,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td className="py-2 px-2 text-center">
                                                    <button
                                                        className="text-blue-600 hover:underline text-xs"
                                                        onClick={() => handleSeleccionarProducto(variation, prod, 0)}
                                                        disabled={cantidad === 0}
                                                    >
                                                        Quitar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={handleConfirm}
                        disabled={Object.keys(productosSeleccionados).length === 0}
                    >
                        Agregar a la orden
                    </button>
                </div>
            </div>
        </div>
    )
}

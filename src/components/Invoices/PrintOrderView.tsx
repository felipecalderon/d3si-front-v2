"use client"

import React from "react"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { toPrice } from "@/utils/priceFormat"

interface Props {
    order: IOrderWithStore
}

export const PrintOrderView = React.forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
    const discount = Number(order.discount || 0)
    const totalProducts = order.ProductVariations.reduce((acc, v) => acc + v.quantityOrdered, 0)
    return (
        <div ref={ref} className="p-8 text-black bg-white max-w-4xl mx-auto font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b-2 border-gray-800 pb-6">
                <div className="flex flex-col">
                    <img src="/brand/two-brands-color.png" alt="Logo" className="h-16 w-auto object-contain mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Orden de Compra</h1>
                </div>
                <div className="text-right">
                    <div className="mb-2">
                        <span className="block text-xs font-bold text-gray-500 uppercase">Folio</span>
                        <span className="text-xl font-mono font-bold text-gray-900">#{order.orderID.slice(-8)}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase">Fecha</span>
                        <span className="text-lg font-medium text-gray-900">{fecha}</span>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Store Info */}
                <div>
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b border-gray-300 pb-1">
                        Información de la Tienda
                    </h2>
                    <div className="text-sm text-gray-800 space-y-1">
                        <p className="font-bold text-lg">{order.Store?.name}</p>
                        <p>{order.Store?.address}</p>
                        <p>Tel: {order.Store?.phone}</p>
                    </div>
                </div>

                {/* Order Details */}
                <div>
                    <h2 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b border-gray-300 pb-1">
                        Detalles de la Orden
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-xs text-gray-500">Estado</span>
                            <span className="font-medium capitalize">{order.status}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500">Tipo</span>
                            <span className="font-medium capitalize">{order.type}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Productos</h2>
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b-2 border-gray-300">
                            <th className="py-2 px-3 text-left font-bold text-gray-700">SKU</th>
                            <th className="py-2 px-3 text-center font-bold text-gray-700">Talla</th>
                            <th className="py-2 px-3 text-center font-bold text-gray-700">Cantidad</th>
                            <th className="py-2 px-3 text-right font-bold text-gray-700">Costo Neto Unitario</th>
                            <th className="py-2 px-3 text-right font-bold text-gray-700">Subt. Neto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {order.ProductVariations.map((item) => (
                            <tr key={item.variationID}>
                                <td className="py-2 px-3 text-gray-800 font-mono">
                                    {item.Product.name} ({item.sku})
                                </td>
                                <td className="py-2 px-3 text-center text-gray-800">{item.sizeNumber}</td>
                                <td className="py-2 px-3 text-center text-gray-800 font-medium">
                                    {item.quantityOrdered}
                                </td>
                                <td className="py-2 px-3 text-right text-gray-800">
                                    ${toPrice(Number(item.priceCost))}
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-gray-900">
                                    ${toPrice(item.priceCost * item.quantityOrdered)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="text-end">Cantitad total de productos: {totalProducts}</div>
            <div className="flex justify-end border-t-2 border-gray-800 pt-4">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-2">
                        <span>Total Neto:</span>
                        <span>${toPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-2">
                        <span>IVA:</span>
                        <span>${toPrice(order.total * 0.19)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-2">
                        <span>SubTotal:</span>
                        <span>${toPrice(order.total * 1.19)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-2">
                        <span>Descuento:</span>
                        <span>${toPrice(order.discount)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-300 pt-2">
                        <span>Total:</span>
                        <span>${toPrice(order.total * 1.19 - order.discount)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
                <p>Este documento es un comprobante de orden de compra generado por el sistema Betty ERP by D3SI.</p>
            </div>
        </div>
    )
})

PrintOrderView.displayName = "PrintOrderView"

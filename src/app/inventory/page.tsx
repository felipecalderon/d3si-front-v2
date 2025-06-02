import React from "react"
//import { MoreVertical } from "lucide-react"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"
import { getAllProducts } from "@/actions/productsActions/getAllProducts"
import { ProductAPI } from "@/types/products"
import InventoryActions from "@/components/Inventory/InventoryActions"

export default async function InventoryPage() {
    const rawProducts: ProductAPI[] = await getAllProducts()

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
                        />
                        <InventoryActions />
                        <p className="text-sm">
                            Hay un total de <strong>{rawProducts.length}</strong> productos.
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
                                {rawProducts.map((product) => {
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

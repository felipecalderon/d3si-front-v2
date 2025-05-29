import React from "react"
import { MoreVertical } from "lucide-react"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"

export default function InventoryPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar a la izquierda */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col">
                {/* Navbar arriba */}
                <Navbar />

                {/* Contenido debajo del Navbar */}
                <main className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Buscar producto aquí..."
                            className="border px-4 py-2 rounded w-1/3"
                        />
                        <div className="flex gap-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded">Crear Producto</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded">Descargar Excel</button>
                        </div>
                        <p className="text-sm">
                            Hay un total de <strong>2376</strong> productos.
                        </p>
                    </div>

                    {/* Tabla */}
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
                                {/* Producto fila */}
                                <tr className="border-t hover:bg-gray-50">
                                    <td className="p-3 flex items-center gap-2 relative">
                                        <button className="absolute left-0">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        <img
                                            src="/zapatilla.jpg"
                                            alt="Producto"
                                            className="w-12 h-12 object-contain ml-5"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold">D3SI® Laniakea</p>
                                            <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                                559
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3">286592065697</td>
                                    <td className="p-3">36</td>
                                    <td className="p-3">$49.944</td>
                                    <td className="p-3">$89.900</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 rounded bg-yellow-200 text-yellow-900">198</span>
                                    </td>
                                    <td className="p-3 text-center">1</td>
                                </tr>
                                {/* Puedes repetir más filas o mapear desde un array */}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    )
}

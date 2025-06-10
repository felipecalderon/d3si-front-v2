import React from "react"
import { ArrowRightLeft, CreditCard, HandCoins, Wallet, FileText, FileCheck2, DollarSign } from "lucide-react"
import StatCard from "@/components/dashboard/StatCard"
import GaugeChart from "@/components/dashboard/GaugeChart"
import Sidebar from "@/components/Sidebar/Sidebar"
import Navbar from "@/components/Navbar/Navbar"
import Link from "next/link"

export default function HomePage() {
    return (
        <main className="flex h-screen bg-gray-100">
            <Sidebar />
            <section className="flex-1 p-6 overflow-auto">
                <Navbar />

                <div className="grid grid-cols-3 gap-6 items-start">
                    {/* Columna izquierda: Tarjetas principales */}
                    <div className="flex flex-col gap-4">
                        <StatCard icon={<FileText />} label="Boletas Emitidas" value="128" />
                        <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value="31" />
                        <StatCard icon={<DollarSign />} label="Facturación" value="$45.846.410" />
                    </div>

                    {/* Columna centro: Gráfica */}
                    <div className="flex justify-center items-center h-full">
                        <div className="w-full max-w-sm mx-auto">
                            <GaugeChart />
                        </div>
                    </div>

                    {/* Columna derecha: Tarjetas de ventas */}
                    <div className="flex flex-col gap-4">
                        <StatCard
                            icon={<DollarSign />}
                            label="Ventas del día"
                            value="$435.670"
                            color="text-green-600"
                        />
                        <StatCard
                            icon={<DollarSign />}
                            label="Ventas de ayer"
                            value="$635.800"
                            color="text-yellow-600"
                        />
                        <StatCard
                            icon={<DollarSign />}
                            label="Ventas Semana móvil"
                            value="$3.535.800"
                            color="text-red-600"
                        />
                    </div>
                </div>

                {/* Totales por método */}
                <div className="grid grid-cols-4 gap-4 mb-4 mt-5">
                    <div className="bg-white p-4 shadow rounded text-center">
                        <ArrowRightLeft className="mx-auto mb-2" />
                        <p>Débito</p>
                        <p className="text-sm">152 Pares - $11.1MM</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded text-center">
                        <CreditCard className="mx-auto mb-2" />
                        <p>Crédito</p>
                        <p className="text-sm">40 Pares - $1.6MM</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded text-center">
                        <HandCoins className="mx-auto mb-2" />
                        <p>Efectivo</p>
                        <p className="text-sm">192 Pares - $12.7MM</p>
                    </div>
                    <div className="bg-white p-4 shadow rounded text-center">
                        <Wallet className="mx-auto mb-2" />
                        <p>Total Caja</p>
                        <p className="text-lg font-bold">$435.670</p>
                    </div>
                </div>
                {/* Filtros y botón */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-4">
                        <select title="meses" className="px-4 py-2 bg-white rounded shadow border">
                            <option>Filtrar por mes</option>
                            <option>Enero</option>
                            <option>Febrero</option>
                            <option>Marzo</option>
                            <option>Abril</option>
                            <option>Mayo</option>
                            <option>Junio</option>
                            <option>Julio</option>
                            <option>Agosto</option>
                            <option>Septiembre</option>
                            <option>Octubre</option>
                            <option>Noviembre</option>
                            <option>Diciembre</option>
                        </select>
                        <select title="años" className="px-4 py-2 bg-white rounded shadow border">
                            <option>Filtrar por año</option>
                            <option>2025</option>
                            <option>2024</option>
                            <option>2023</option>
                        </select>
                    </div>
                    <Link href="/createsale">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
                            Vender 🛍️
                        </button>
                    </Link>
                </div>
                {/* Tabla de ventas */}
                <div className="bg-white rounded shadow overflow-auto">
                    <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-gray-200 text-left">
                            <tr>
                                <th className="p-3">Sucursal</th>
                                <th className="p-3">Fecha de Venta</th>
                                <th className="p-3">Venta con IVA</th>
                                <th className="p-3">Productos</th>
                                <th className="p-3">Tipo de Pago</th>
                                <th className="p-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="p-3">D3SI AVOCCO, Purén</td>
                                <td className="p-3">16-05-2025 - 10:02hrs</td>
                                <td className="p-3">$65.990</td>
                                <td className="p-3">[TXL] 1x casaca oneill cotele cafe</td>
                                <td className="p-3">Débito</td>
                                <td className="p-3">Pagado</td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-3">D3SI AVOCCO, Purén</td>
                                <td className="p-3">15-05-2025 - 17:22hrs</td>
                                <td className="p-3">$29.990</td>
                                <td className="p-3">[T48] 1x jeans potros ultra slim 09</td>
                                <td className="p-3">Crédito</td>
                                <td className="p-3">Pagado</td>
                            </tr>
                            {/* Puedes agregar más filas estáticas o dinámicas aquí */}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

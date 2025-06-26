"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRightLeft, CreditCard, HandCoins, Wallet, FileText, FileCheck2, DollarSign } from "lucide-react"
import StatCard from "@/components/dashboard/StatCard"
//import GaugeChart from "@/components/dashboard/GaugeChart"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { getSales } from "@/actions/sales/getSales"
import dynamic from "next/dynamic"

interface Sale {
    saleID: string
    total: number
    status: string
    createdAt: string
    paymentType?: string
    Store?: {
        name: string
    }
    SaleProducts?: {
        quantitySold: number
        unitPrice: number
        StoreProduct?: {
            ProductVariation?: {
                Product?: {
                    name: string
                }
            }
        }
    }[]
}

const HomePage = () => {
    const DynamicGaugeChart = dynamic(() => import("@/components/dashboard/GaugeChart"), { ssr: false })
    const storeID = "f3c9d8e0-ccaf-4300-a416-c3591c4d8b52" // ID hardcodeado por ahora
    const [sales, setSales] = useState<Sale[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const data = (await getSales(storeID)) as Sale[]
                setSales(data)
            } catch (error) {
                console.error("Error fetching sales:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSales()
    }, [])

    return (
        <>
            <div className="grid grid-cols-3 gap-6 items-start">
                <div className="flex flex-col gap-4">
                    <StatCard icon={<FileText />} label="Boletas Emitidas" value="128" />
                    <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value="31" />
                    <StatCard icon={<DollarSign />} label="Facturación" value="$45.846.410" />
                </div>

                <div className="flex justify-center items-center h-full">
                    <div className="w-full max-w-sm mx-auto">
                        <DynamicGaugeChart />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <StatCard icon={<DollarSign />} label="Ventas del día" value="$435.670" color="text-green-600" />
                    <StatCard icon={<DollarSign />} label="Ventas de ayer" value="$635.800" color="text-yellow-600" />
                    <StatCard
                        icon={<DollarSign />}
                        label="Ventas Semana móvil"
                        value="$3.535.800"
                        color="text-red-600"
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4 mt-5">
                <div className="dark:bg-gray-800 bg-white p-4 shadow rounded text-center">
                    <ArrowRightLeft className="mx-auto mb-2 text-blue-600" />
                    <p>Débito</p>
                    <p className="text-sm">152 Pares - $11.1MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-4 shadow rounded text-center">
                    <CreditCard className="mx-auto mb-2 text-blue-600" />
                    <p>Crédito</p>
                    <p className="text-sm">40 Pares - $1.6MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-4 shadow rounded text-center">
                    <HandCoins className="mx-auto mb-2 text-blue-600" />
                    <p>Efectivo</p>
                    <p className="text-sm">192 Pares - $12.7MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-4 shadow rounded text-center">
                    <Wallet className="mx-auto mb-2 text-blue-600" />
                    <p>Total Caja</p>
                    <p className="text-lg font-bold">$435.670</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                    <select title="meses" className="px-4 py-2 dark:bg-gray-800 bg-white rounded shadow border">
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
                    <select title="años" className="px-4 py-2 dark:bg-gray-800 bg-white rounded shadow border">
                        <option>Filtrar por año</option>
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                    </select>
                </div>
                <Link href="/home/createsale">
                    <button className="bg-yellow-400 text-black hover:bg-yellow-600 transition-all ease-in-out px-6 py-2 rounded">
                        Vender 🛍️
                    </button>
                </Link>
            </div>

            {/* Tabla de ventas */}
            <div className="dark:bg-gray-800 bg-white rounded shadow overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sucursal</TableHead>
                            <TableHead>Fecha de Venta</TableHead>
                            <TableHead>Venta con IVA</TableHead>
                            <TableHead>Productos</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Cargando ventas...</TableCell>
                            </TableRow>
                        ) : sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>No hay ventas para mostrar.</TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => {
                                const storeName = sale.Store?.name || "Sucursal"

                                const productsDescription =
                                    Array.isArray(sale.SaleProducts) && sale.SaleProducts.length > 0
                                        ? sale.SaleProducts.map((sp) => {
                                            const productName =
                                                sp?.StoreProduct?.ProductVariation?.Product?.name ?? "Producto"
                                            const quantity = sp.quantitySold ?? "-"
                                            const price = sp.unitPrice ?? "-"
                                            return `${quantity} x ${productName} ($${price})`
                                        }).join(", ")
                                        : "-"

                                return (
                                    <TableRow key={sale.saleID}>
                                        <TableCell>{storeName}</TableCell>
                                        <TableCell>
                                            {new Date(sale.createdAt).toLocaleString("es-AR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {typeof sale.total === "number"
                                                ? `$${sale.total.toLocaleString("es-AR")}`
                                                : "Sin dato"}
                                        </TableCell>
                                        <TableCell>{productsDescription}</TableCell>
                                        <TableCell className="text-green-600 font-medium">{sale.status}</TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default HomePage

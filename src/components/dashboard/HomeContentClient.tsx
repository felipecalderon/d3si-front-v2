"use client"

import dynamic from "next/dynamic"
import StatCard from "@/components/dashboard/StatCard"
import SalesTable from "@/components/ListTable/SalesTable"
import Link from "next/link"
import { ArrowRightLeft, CreditCard, HandCoins, Wallet, FileText, FileCheck2, DollarSign } from "lucide-react"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IResume } from "@/interfaces/sales/ISalesResume"

const GaugeChart = dynamic(() => import("@/components/dashboard/GaugeChart"), {
    ssr: false,
})

interface Props {
    sales: ISaleResponse[]
    resume: IResume
}

export default function HomeContentClient({ sales, resume }: Props) {
    return (
        <>
            <div className="grid grid-cols-3 gap-6 items-start">
                <div className="flex flex-col gap-4">
                    <StatCard
                        icon={<FileText />}
                        label="Boletas Emitidas"
                        value={resume.orders.month.count.toString()}
                    />
                    <StatCard
                        icon={<FileCheck2 />}
                        label="Facturas Emitidas"
                        value={resume.sales.month.count.toString()}
                    />
                    <StatCard
                        icon={<DollarSign />}
                        label="Facturación"
                        value={`$${resume.sales.month.amount.toLocaleString("es-CL")}`}
                    />
                </div>

                <div className="flex justify-center items-center h-full">
                    <div className="w-full max-w-sm mx-auto">
                        <GaugeChart />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <StatCard
                        icon={<DollarSign />}
                        label="Ventas del día"
                        value={`$${resume.sales.today.amount.toLocaleString("es-CL")}`}
                        color="text-green-600"
                    />
                    <StatCard
                        icon={<DollarSign />}
                        label="Ventas de ayer"
                        value={`$${resume.sales.yesterday.amount.toLocaleString("es-CL")}`}
                        color="text-yellow-600"
                    />
                    <StatCard
                        icon={<DollarSign />}
                        label="Ventas Semana móvil"
                        value={`$${resume.sales.last7.amount.toLocaleString("es-CL")}`}
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
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
                        Vender 🛍️
                    </button>
                </Link>
            </div>

            <SalesTable sales={sales} />
        </>
    )
}

"use client"

import dynamic from "next/dynamic"
import StatCard from "@/components/dashboard/StatCard"
import SalesTable from "@/components/ListTable/SalesTable"
import Link from "next/link"
import { ArrowRightLeft, CreditCard, HandCoins, Wallet, FileText, FileCheck2, DollarSign } from "lucide-react"
import { ISaleResponse } from "@/interfaces/sales/ISale"

const GaugeChart = dynamic(() => import("@/components/dashboard/GaugeChart"), {
    ssr: false,
})

interface Props {
    sales: ISaleResponse[]
}

export default function HomeContentClient({ sales }: Props) {
    return (
        <div className="space-y-6">
            {/* Stats Grid - Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Stats Column */}
                <div className="space-y-4 lg:space-y-6">
                    <StatCard icon={<FileText />} label="Boletas Emitidas" value="128" />
                    <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value="31" />
                    <StatCard icon={<DollarSign />} label="Facturación" value="$45.846.410" />
                </div>

                {/* Gauge Chart - Centered */}
                <div className="flex justify-center items-center order-first lg:order-none">
                    <div className="w-full max-w-xs sm:max-w-sm mx-auto">
                        <GaugeChart />
                    </div>
                </div>

                {/* Right Stats Column */}
                <div className="space-y-4 lg:space-y-6">
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

            {/* Payment Methods Grid - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <ArrowRightLeft className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Débito</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        152 Pares - $11.1MM
                    </p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <CreditCard className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Crédito</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        40 Pares - $1.6MM
                    </p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <HandCoins className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Efectivo</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        192 Pares - $12.7MM
                    </p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center col-span-2 md:col-span-1">
                    <Wallet className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Total Caja</p>
                    <p className="text-base sm:text-lg font-bold">$435.670</p>
                </div>
            </div>

            {/* Filters and Action Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <select 
                        title="meses" 
                        className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm min-w-0 flex-1 sm:flex-none"
                    >
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
                    <select 
                        title="años" 
                        className="px-3 py-2 dark:bg-gray-800 bg-white rounded-lg shadow border text-sm min-w-0 flex-1 sm:flex-none"
                    >
                        <option>Filtrar por año</option>
                        <option>2025</option>
                        <option>2024</option>
                        <option>2023</option>
                    </select>
                </div>
                
                <Link href="/home/createsale" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Vender 🛍️
                    </button>
                </Link>
            </div>

            {/* Sales Table */}
            <div className="overflow-hidden rounded-lg shadow">
                <SalesTable sales={sales} />
            </div>
        </div>
    )
}
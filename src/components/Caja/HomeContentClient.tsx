"use client"

import dynamic from "next/dynamic"
import SalesTable from "./Table/SalesTable"
import Link from "next/link"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { IResume } from "@/interfaces/sales/ISalesResume"
import Facturacion from "../Caja/Dashboard/Facturacion"
import Ventas from "../Caja/Dashboard/Ventas"
import Payment from "../Caja/Dashboard/PaymentMethods"
import Filters from "../Caja/Dashboard/Filters"

const GaugeChart = dynamic(() => import("@/components/Caja/VentasTotalesGrafico/GaugeChart"), {
    ssr: false,
})

interface Props {
    sales: ISaleResponse[]
    resume: IResume
}

export default function HomeContentClient({ sales, resume }: Props) {
    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Sección de estadísticas */}
            <div className="w-full">
                {/* Mobile y Tablet: Stack vertically */}
                <div className="block xl:hidden space-y-6">
                    {/* Gráfico primero en mobile/tablet */}
                    <div className="flex justify-center px-4">
                        <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                            <GaugeChart />
                        </div>
                    </div>

                    {/* Facturación y Ventas en grid 2 columnas en tablet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                        <div className="w-full">
                            <Facturacion resume={resume} />
                        </div>
                        <div className="w-full">
                            <Ventas resume={resume} />
                        </div>
                    </div>
                </div>

                {/* Desktop (XL+): Grid layout original */}
                <div className="hidden xl:grid xl:grid-cols-3 xl:gap-8 xl:items-start">
                    <div className="h-full flex flex-col justify-between gap-4">
                        <Facturacion resume={resume} />
                    </div>
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full max-w-[320px] mx-auto">
                            <GaugeChart />
                        </div>
                    </div>
                    <div className="h-full flex flex-col justify-between gap-4">
                        <Ventas resume={resume} />
                    </div>
                </div>
            </div>

            {/* Métodos de pago */}
            <div className="w-full">
                <Payment />
            </div>

            {/* Filtros + botón */}
            <div className="w-full px-4 md:px-0">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
                    <div className="w-full lg:flex-1 lg:max-w-none">
                        <Filters />
                    </div>

                    {/* Botón separado en mobile, inline en desktop */}
                    <div className="w-full lg:w-auto lg:flex-shrink-0 lg:hidden">
                        <Link href="/home/createsale" className="block w-full">
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Vender 🛍️
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="w-full px-4 md:px-0">
                <div className="overflow-hidden rounded-lg shadow">
                    <SalesTable sales={sales} />
                </div>
            </div>
        </div>
    )
}
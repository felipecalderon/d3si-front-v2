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
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Sección de estadísticas */}
            <div>
                {/* Mobile: Stack vertically */}
                <div className="block lg:hidden space-y-6">
                    {/* Gráfico primero en mobile */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-[280px] mx-auto">
                            <GaugeChart />
                        </div>
                    </div>

                    {/* Facturación */}
                    <div>
                        <Facturacion resume={resume} />
                    </div>

                    {/* Ventas */}
                    <div>
                        <Ventas resume={resume} />
                    </div>
                </div>

                {/* Desktop: Grid layout con altura igual */}
                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8 lg:items-start">
                    {/* Facturación */}
                    <div className="h-full flex flex-col justify-between gap-4">
                        <Facturacion resume={resume} />
                    </div>

                    {/* Gráfico - Centrado verticalmente */}
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full max-w-[300px] xl:max-w-[320px] mx-auto">
                            <GaugeChart />
                        </div>
                    </div>

                    {/* Ventas */}
                    <div className="h-full flex flex-col justify-between gap-4">
                        <Ventas resume={resume} />
                    </div>
                </div>
            </div>

            {/* Métodos de pago */}
            <Payment />

            {/* Filtros + botón */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-full sm:w-auto">
                    <Filters />
                </div>

                <Link href="/home/createsale" className="w-full sm:w-auto flex-shrink-0">
                    <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                        Vender 🛍️
                    </button>
                </Link>
            </div>

            {/* Tabla de ventas */}
            <div className="overflow-hidden rounded-lg shadow">
                <SalesTable sales={sales} />
            </div>
        </div>
    )
}
"use client"

import dynamic from "next/dynamic"
import SalesTable from "@/components/Caja/ListTable/SalesTable"
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
        <div>
            <div className="grid grid-cols-3 gap-6 items-start">
                {/* Facturación (izquierda) */}
                <Facturacion resume={resume} />
                
                {/* Gauge Chart - Centered */}
                <div className="flex justify-center items-center order-first lg:order-none">
                    <div className="w-full max-w-xs sm:max-w-sm mx-auto">
                        <GaugeChart />
                    </div>
                </div>
                {/* Ventas (derecha) */}
                <Ventas resume={resume} />
            </div>
            {/* Payment Methods Grid - Responsive */}
            <Payment />

            {/* Filters and Action Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
                <Filters/>

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

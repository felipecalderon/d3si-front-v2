"use client"

import React, { useMemo } from "react"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { toPrice } from "@/utils/priceFormat"
import { CreditCard, HandCoins } from "lucide-react"
import { useSalesFilters } from "@/stores/salesFilters.store"
import { parseISO } from "date-fns"

export default function DailyResumeCards({
    serverResume,
    allSales,
}: {
    serverResume: IResume
    allSales: ISaleResponse[]
}) {
    const { filters } = useSalesFilters()

    const { debitoCredito, efectivo } = useMemo(() => {
        // Si no hay filtros, usar servidor
        if (!filters) {
            return serverResume.totales.sales.month
        }

        // Filtrar ventas según filtros
        const { storeID, month, year } = filters
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ]

        let efectivoCount = 0
        let efectivoAmount = 0
        let debitoCount = 0
        let debitoAmount = 0

        for (const sale of allSales) {
            if (storeID && sale.storeID !== storeID) continue
            if (month || year) {
                const date = sale.createdAt ? parseISO(sale.createdAt as unknown as string) : null
                if (!date) continue
                if (month) {
                    const mName = monthNames[date.getMonth()]
                    if (mName !== month) continue
                }
                if (year) {
                    const y = date.getFullYear().toString()
                    if (y !== year) continue
                }
            }

            const amount = typeof sale.total === "number" ? sale.total : 0
            const paid = sale.status === "Pagado"

            if (!paid) continue

            // Todas las ventas web son con tarjeta
            if (sale.storeID === "web" || !(sale.paymentType && sale.paymentType.toLowerCase().includes("efectivo"))) {
                debitoCount += 1
                debitoAmount += amount
            } else {
                efectivoCount += 1
                efectivoAmount += amount
            }
        }

        return {
            debitoCredito: { count: debitoCount, amount: debitoAmount },
            efectivo: { count: efectivoCount, amount: efectivoAmount },
        }
    }, [filters, serverResume, allSales])

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <CreditCard className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Débito/Crédito</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {debitoCredito.count} Productos - ${toPrice(debitoCredito.amount)}
                        </p>
                    </div>
                </div>

                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <HandCoins className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Efectivo</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                            {efectivo.count} Productos - ${toPrice(efectivo.amount)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

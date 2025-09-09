"use client"

import React, { useMemo } from "react"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import SalesTable from "./SalesTable"
import { parseISO } from "date-fns"
import { useSalesFilters } from "@/stores/salesFilters.store"

export default function SalesSectionClient({ allSales }: { allSales: ISaleResponse[] }) {
    const { filters } = useSalesFilters()

    const filtered = useMemo(() => {
        if (!filters) return allSales
        const { storeID, month, year } = filters

        return allSales.filter((sale) => {
            if (storeID && sale.storeID !== storeID) return false

            if (month || year) {
                const date = sale.createdAt ? parseISO(String(sale.createdAt)) : null
                if (!date || isNaN(date.getTime())) return false

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
                if (month && monthNames[date.getMonth()] !== month) return false
                if (year && String(date.getFullYear()) !== year) return false
            }

            return true
        })
    }, [allSales, filters])

    return (
        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <SalesTable sales={filtered} />
        </div>
    )
}

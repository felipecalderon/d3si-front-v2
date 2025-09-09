"use client"

import React, { useMemo } from "react"
import { ISaleResponse } from "@/interfaces/sales/ISale"
import { useSalesFilters } from "@/stores/salesFilters.store"
import SalesTable from "./SalesTable"
import ResumeLeftSideChart from "./ResumeLeftSideChart"
import ResumeRightSideChart from "./ResumeRightSideChart"
import TotalSalesResumeGraph from "./TotalSalesResumeGraph"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { parseISO, isSameDay, subDays } from "date-fns"

function buildEmptyCountAmount() {
    return { count: 0, amount: 0 }
}

function computeResumeFromSales(allSales: ISaleResponse[], metaMensual: IResume["metaMensual"] | null): IResume {
    // Inicializar estructura
    const totales = {
        sales: {
            today: {
                total: buildEmptyCountAmount(),
                efectivo: buildEmptyCountAmount(),
                debitoCredito: buildEmptyCountAmount(),
            },
            yesterday: {
                total: buildEmptyCountAmount(),
                efectivo: buildEmptyCountAmount(),
                debitoCredito: buildEmptyCountAmount(),
            },
            last7: {
                total: buildEmptyCountAmount(),
                efectivo: buildEmptyCountAmount(),
                debitoCredito: buildEmptyCountAmount(),
            },
            month: {
                total: buildEmptyCountAmount(),
                efectivo: buildEmptyCountAmount(),
                debitoCredito: buildEmptyCountAmount(),
            },
        },
        orders: {
            today: buildEmptyCountAmount(),
            yesterday: buildEmptyCountAmount(),
            last7: buildEmptyCountAmount(),
            month: buildEmptyCountAmount(),
        },
    }

    const now = new Date()
    const today = now
    const yesterday = subDays(now, 1)
    const sevenAgo = subDays(now, 6) // last 7 days inclusive

    const isPaid = (s: ISaleResponse) => s.status === "Pagado"
    // Acumuladores para totales del "mes" basados en el conjunto de ventas de los filtros
    let monthCount = 0
    let monthAmount = 0
    let monthEfectivoCount = 0
    let monthEfectivoAmount = 0
    let monthDebitoCount = 0
    let monthDebitoAmount = 0

    for (const sale of allSales) {
        const date = sale.createdAt ? parseISO(sale.createdAt as unknown as string) : null
        if (!date) continue

        const amount = typeof sale.total === "number" ? sale.total : 0

        // Acumular para el "mes" (se asume que allSales ya está filtrado por mes/año cuando aplique)
        monthCount += 1
        monthAmount += amount
        if (isPaid(sale)) {
            // Todas las ventas 'web' son en tarjeta (débito/crédito)
            if (sale.storeID === "Web" || !(sale.paymentType && sale.paymentType.toLowerCase().includes("efectivo"))) {
                monthDebitoCount += 1
                monthDebitoAmount += amount
            } else {
                monthEfectivoCount += 1
                monthEfectivoAmount += amount
            }
        }

        // today
        if (isSameDay(date, today)) {
            totales.sales.today.total.count += 1
            totales.sales.today.total.amount += amount
            if (isPaid(sale)) {
                if (
                    sale.storeID === "Web" ||
                    !(sale.paymentType && sale.paymentType.toLowerCase().includes("efectivo"))
                ) {
                    totales.sales.today.debitoCredito.count += 1
                    totales.sales.today.debitoCredito.amount += amount
                } else {
                    totales.sales.today.efectivo.count += 1
                    totales.sales.today.efectivo.amount += amount
                }
            }
        }

        // yesterday
        if (isSameDay(date, yesterday)) {
            totales.sales.yesterday.total.count += 1
            totales.sales.yesterday.total.amount += amount
            if (isPaid(sale)) {
                if (
                    sale.storeID === "web" ||
                    !(sale.paymentType && sale.paymentType.toLowerCase().includes("efectivo"))
                ) {
                    totales.sales.yesterday.debitoCredito.count += 1
                    totales.sales.yesterday.debitoCredito.amount += amount
                } else {
                    totales.sales.yesterday.efectivo.count += 1
                    totales.sales.yesterday.efectivo.amount += amount
                }
            }
        }

        // last7
        if (date >= sevenAgo && date <= today) {
            totales.sales.last7.total.count += 1
            totales.sales.last7.total.amount += amount
            if (isPaid(sale)) {
                if (
                    sale.storeID === "web" ||
                    !(sale.paymentType && sale.paymentType.toLowerCase().includes("efectivo"))
                ) {
                    totales.sales.last7.debitoCredito.count += 1
                    totales.sales.last7.debitoCredito.amount += amount
                } else {
                    totales.sales.last7.efectivo.count += 1
                    totales.sales.last7.efectivo.amount += amount
                }
            }
        }
    }

    // Asignar los acumulados al objeto totales.month
    totales.sales.month.total.count = monthCount
    totales.sales.month.total.amount = monthAmount
    totales.sales.month.efectivo.count = monthEfectivoCount
    totales.sales.month.efectivo.amount = monthEfectivoAmount
    totales.sales.month.debitoCredito.count = monthDebitoCount
    totales.sales.month.debitoCredito.amount = monthDebitoAmount

    return { metaMensual: metaMensual ?? null, totales }
}

type Filters = { storeID?: string; month?: string; year?: string }

export default function SalesAndResumeSectionClient({
    allSales,
    serverResume,
}: {
    allSales: ISaleResponse[]
    serverResume: IResume
}) {
    const { filters } = useSalesFilters()

    const filteredSales = useMemo(() => {
        if (!filters) return allSales
        const { storeID, month, year } = filters!
        return allSales.filter((sale) => {
            if (storeID && sale.storeID !== storeID) return false
            if (month || year) {
                const date = sale.createdAt ? parseISO(sale.createdAt as unknown as string) : null
                if (!date) return false
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
                if (month) {
                    const mName = monthNames[date.getMonth()]
                    if (mName !== month) return false
                }
                if (year) {
                    const y = date.getFullYear().toString()
                    if (y !== year) return false
                }
            }
            return true
        })
    }, [allSales, filters])

    const clientResume = useMemo(() => {
        // Si no hay filtros, usamos el resumen server para mantener metaMensual y demás valores precisos
        if (!filters) return serverResume
        return computeResumeFromSales(filteredSales, serverResume.metaMensual)
    }, [filteredSales, filters, serverResume])

    return (
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* (Los filtros están en la parte superior por medio de FilterControls; se leen desde useSalesFilters) */}

            {/* Resúmenes y gráfico */}
            <div>
                <div className="block lg:hidden space-y-6">
                    <div className="flex justify-center">
                        <div className="w-full max-w-[280px] mx-auto">
                            <TotalSalesResumeGraph resume={clientResume} />
                        </div>
                    </div>
                    <div>
                        <ResumeLeftSideChart resume={clientResume} />
                    </div>
                    <div>
                        <ResumeRightSideChart resume={clientResume} />
                    </div>
                </div>

                <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                    <div className="h-full flex flex-col justify-between gap-4">
                        <ResumeLeftSideChart resume={clientResume} />
                    </div>
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full max-w-[300px] h-full xl:max-w-[320px] mx-auto">
                            <TotalSalesResumeGraph resume={clientResume} />
                        </div>
                    </div>
                    <div className="h-full flex flex-col justify-between gap-4">
                        <ResumeRightSideChart resume={clientResume} />
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div>
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SalesTable sales={filteredSales} />
                </div>
            </div>
        </div>
    )
}

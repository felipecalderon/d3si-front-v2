"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSignIcon } from "lucide-react"

interface FinancialSummaryProps {
    montoNeto: number
    totalDescuentos: number
    totalCargos: number
    subtotal: number
    iva: number
    montoTotal: number
}

export function FinancialSummary({
    montoNeto,
    totalDescuentos,
    totalCargos,
    subtotal,
    iva,
    montoTotal,
}: FinancialSummaryProps) {
    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <DollarSignIcon className="h-5 w-5 text-green-600" />
                    Resumen Financiero
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-slate-600 dark:text-slate-300">Monto Neto:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                            ${montoNeto.toFixed(2)}
                        </span>
                    </div>
                    {totalDescuentos > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                            <span className="text-red-600">Descuentos:</span>
                            <span className="font-semibold text-red-600">-${totalDescuentos.toFixed(2)}</span>
                        </div>
                    )}
                    {totalCargos > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                            <span className="text-red-600">Cargos:</span>
                            <span className="font-semibold text-red-600">+${totalCargos.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-slate-600 dark:text-slate-300">Subtotal:</span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-slate-600 dark:text-slate-300">IVA (19%): </span>
                        <span className="font-semibold text-slate-800 dark:text-white">${iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-600">
                        <span className="text-slate-600 dark:text-slate-300">Monto Total:</span>
                        <span className="font-bold text-slate-800 dark:text-white">${montoTotal.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
import React from "react"
import { CreditCard } from "lucide-react"
import { toPrice } from "@/utils/priceFormat"

interface Props {
    neto: number
    iva: number
    totalConIva: number
    totalQuotas?: number
    currentQuota?: number
}

const FinancialSummary: React.FC<Props> = ({ neto, iva, totalConIva, totalQuotas, currentQuota }) => {
    // Calcular si está pagando en cuotas
    const isPayingInInstallments = (totalQuotas ?? 0) > 0

    // Calcular el monto de la cuota
    const installmentAmount = isPayingInInstallments ? totalConIva / (totalQuotas ?? 1) : totalConIva
    const installmentNeto = isPayingInInstallments ? neto / (totalQuotas ?? 1) : neto
    const installmentIva = isPayingInInstallments ? iva / (totalQuotas ?? 1) : iva

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                <CreditCard className="w-5 h-5" />
                Desglose de Totales
            </h3>

            {/* Mostrar información de cuotas si aplica */}
            {isPayingInInstallments && (
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                        Pago en {totalQuotas} cuotas
                        {currentQuota && ` - Cuota actual: ${currentQuota}/${totalQuotas}`}
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">
                        {isPayingInInstallments ? "Neto por cuota" : "Neto"}
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${toPrice(installmentNeto)}</p>
                    {isPayingInInstallments && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total: ${toPrice(neto)}</p>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">
                        {isPayingInInstallments ? "IVA por cuota (19%)" : "IVA (19%)"}
                    </p>
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">${toPrice(installmentIva)}</p>
                    {isPayingInInstallments && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total: ${toPrice(iva)}</p>
                    )}
                </div>
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">
                        {isPayingInInstallments ? "Total por cuota" : "Total"}
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        ${toPrice(installmentAmount)}
                    </p>
                    {isPayingInInstallments && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total: ${toPrice(totalConIva)}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FinancialSummary
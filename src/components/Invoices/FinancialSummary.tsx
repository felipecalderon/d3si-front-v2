import React from "react"
import { CreditCard } from "lucide-react"

interface Props {
    neto: number
    iva: number
    totalConIva: number
}

const FinancialSummary: React.FC<Props> = ({ neto, iva, totalConIva }) => {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                <CreditCard className="w-5 h-5" />
                Desglose de Totales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Neto</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {neto.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">IVA (19%)</p>
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                        {iva.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {totalConIva.toLocaleString("es-CL", {
                            style: "currency",
                            currency: "CLP",
                            minimumFractionDigits: 2,
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FinancialSummary

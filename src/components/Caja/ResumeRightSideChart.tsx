import { DollarSign } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"

export default function ResumeRightSideChart({ resume }: { resume: IResume }) {
    const { sales } = resume.totales
    return (
        <div className="flex flex-col gap-6">
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ventas del día {sales.today.total.count}</p>
                    <p className={`text-xl dark:text-white font-bold`}>${toPrice(sales.today.total.amount)}</p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ventas de ayer {sales.yesterday.total.count}</p>
                    <p className={`text-sm dark:text-white font-bold`}>
                        Efectivo $<span className="text-xl">{toPrice(sales.yesterday.efectivo.amount)}</span>
                    </p>
                    <p className={`text-sm dark:text-white font-bold`}>
                        Débito/Crédito $<span className="text-xl">{toPrice(sales.yesterday.debitoCredito.amount)}</span>
                    </p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <DollarSign />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Ventas Mensuales {sales.month.total.count}</p>
                    <p className={`text-xl dark:text-white font-bold`}>${toPrice(sales.month.total.amount)}</p>
                </div>
            </div>
        </div>
    )
}

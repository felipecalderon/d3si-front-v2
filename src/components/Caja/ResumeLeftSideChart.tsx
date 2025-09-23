"use client"
import { FileText } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"
import { useAuth } from "@/stores/user.store"

export default function ResumeLeftSideChart({ resume }: { resume: IResume }) {
    const { orders, sales } = resume.totales
    const { user } = useAuth()

    if (user?.role !== "admin") return null
    return (
        <div className="flex flex-col gap-9">
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Boletas Emitidas</p>
                    <p className={`text-xl dark:text-white font-bold`}>{sales.month.total.count}</p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Facturas Emitidas</p>
                    <p className={`text-xl dark:text-white font-bold`}>{orders.month.count}</p>
                </div>
            </div>
            <div className="flex dark:bg-gray-800 bg-white shadow rounded p-4 items-center">
                <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                    <FileText />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Facturación mensual</p>
                    <p className={`text-xl dark:text-white font-bold`}>${toPrice(orders.month.amount)}</p>
                </div>
            </div>
        </div>
    )
}

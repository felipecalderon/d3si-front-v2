import { IResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"
import { CreditCard, HandCoins } from "lucide-react"

export default async function DailyResumeCards({ resume }: { resume: IResume }) {
    const { debitoCredito, efectivo } = resume.totales.sales.month
    return (
        <>
            <div className="flex lg:flex-row flex-col lg:justify-around gap-2">
                <div className="dark:bg-gray-800 flex lg:gap-x-7 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <CreditCard className="mx-auto my-auto  text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <div className="text-start w-44">
                        <p className="font-medium text-sm sm:text-base">Débito/Crédito</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {debitoCredito.count} Productos - ${toPrice(debitoCredito.amount)}
                        </p>
                    </div>
                </div>
                <div className="dark:bg-gray-800 flex lg:gap-x-7 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <HandCoins className="mx-auto  my-auto text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <div className="text-start w-44">
                        <p className="font-medium text-sm sm:text-base">Efectivo</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {efectivo.count} Productos - ${toPrice(efectivo.amount)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

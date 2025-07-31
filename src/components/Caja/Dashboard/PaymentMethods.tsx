import { getResume } from "@/actions/totals/getResume"
import { ArrowRightLeft, CreditCard, HandCoins, Wallet } from "lucide-react"

const Payment = async () => {
    let resume = await getResume()
    return (
        <>
            <div className="flex lg:flex-row flex-col lg:justify-around lg:gap-0 gap-4 lg:mt-0 mt-4 lg:ml-4">
                {/* <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <ArrowRightLeft className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Débito</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">152 Productos - $11.1MM</p>
                </div> */}
                <div className="dark:bg-gray-800 flex lg:gap-x-7 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <CreditCard className="mx-auto my-auto  text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <div className="text-start w-44">
                        <p className="font-medium text-sm sm:text-base">Débito/Crédito</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {resume?.totales.sales.month.debitoCredito.count} Productos - $
                            {resume?.totales.sales.month.debitoCredito.amount}
                        </p>
                    </div>
                </div>
                <div className="dark:bg-gray-800 flex lg:gap-x-7 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <HandCoins className="mx-auto  my-auto text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <div className="text-start w-44">
                        <p className="font-medium text-sm sm:text-base">Efectivo</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {resume?.totales.sales.month.efectivo.count} Productos - $
                            {resume?.totales.sales.month.efectivo.amount}
                        </p>
                    </div>
                </div>
                {/* <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center col-span-2 md:col-span-1">
                    <Wallet className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Total Caja</p>
                    <p className="text-base sm:text-lg font-bold">$435.670</p>
                </div> */}
            </div>
        </>
    )
}

export default Payment

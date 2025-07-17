import { ArrowRightLeft, CreditCard, HandCoins, Wallet } from "lucide-react"

const Payment = () => {
    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5 mb-5">
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <ArrowRightLeft className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Débito</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">152 Productos - $11.1MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <CreditCard className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Crédito</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">40 Productos - $1.6MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center">
                    <HandCoins className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Efectivo</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">192 Productos - $12.7MM</p>
                </div>
                <div className="dark:bg-gray-800 bg-white p-3 sm:p-4 shadow rounded-lg text-center col-span-2 md:col-span-1">
                    <Wallet className="mx-auto mb-2 text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="font-medium text-sm sm:text-base">Total Caja</p>
                    <p className="text-base sm:text-lg font-bold">$435.670</p>
                </div>
            </div>
        </>
    )
}

export default Payment

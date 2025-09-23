import { getSales } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { mapWooOrderToSale } from "@/utils/mappers/woocommerceToSale"
import ResumeDebitCreditPayment from "@/components/Caja/DailyResumeCards"
import FilterControls from "@/components/Caja/FilterControls"
import SellButton from "@/components/ui/sell-button"
import ResumeLeftSideChart from "@/components/Caja/ResumeLeftSideChart"
import TotalSalesResumeGraph from "@/components/Caja/TotalSalesResumeGraph"
import ResumeRightSideChart from "@/components/Caja/ResumeRightSideChart"
import SalesTable from "@/components/Caja/SalesTable"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"
import { salesToResume } from "@/utils/saleToResume"
import { Suspense } from "react"
import SalesAndResumeSkeleton from "@/components/skeletons/SalesAndResume"
import { totalDebitoCredito } from "@/utils/totalsDebitoCredito"

export const dynamic = "force-dynamic"

interface SearchParams {
    searchParams: Promise<{
        storeID: string
        date: string
    }>
}

const HomePage = async ({ searchParams }: SearchParams) => {
    const { storeID = "", date = "" } = await searchParams
    const [year, month, day] = date.split("-").map(Number)
    const newDate = day ? new Date(year, month - 1, day) : new Date()
    const yyyyDate = formatDateToYYYYMMDD(newDate)

    if (!storeID) return null

    const [sales, wooOrders, resume] = await Promise.all([
        getSales(storeID, yyyyDate),
        getWooCommerceOrders(newDate),
        getResume(storeID, yyyyDate),
    ])
    const wooSales = wooOrders.map(mapWooOrderToSale)
    const allSales = [...sales, ...wooSales]

    const wooResume = salesToResume(wooSales, newDate)
    const allSalesResume = totalDebitoCredito([resume.totales.sales, wooResume])

    return (
        <>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                {/* Seccion superior */}

                <div className="flex flex-col sm:flex-row flex-wrap item-center sm:items-start justify-between gap-2">
                    <SellButton />
                    <FilterControls />
                    <ResumeDebitCreditPayment resume={resume} />
                </div>

                {/* Sección de estadísticas + tabla (se sincroniza con filtros) */}
                <div className="space-y-6 sm:space-y-8 lg:space-y-10">
                    {/* Resúmenes y gráfico */}
                    <Suspense fallback={<SalesAndResumeSkeleton />}>
                        <div className="block space-y-6 sm:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                            <ResumeLeftSideChart resume={resume} />
                            <TotalSalesResumeGraph resume={resume} />
                            <ResumeRightSideChart sales={allSalesResume} />
                        </div>
                    </Suspense>

                    {/* Tabla */}
                    <div>
                        <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <SalesTable sales={allSales} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage

import { getSales } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { mapWooOrderToSale } from "@/utils/mappers/woocommerceToSale"
import ResumeDebitCreditPayment from "@/components/Caja/DailyResumeCards"
import FilterControls from "@/components/Caja/FilterControls"
import SalesAndResumeSectionClient from "@/components/Caja/SalesAndResumeSectionClient"
import SellButton from "@/components/ui/sell-button"

export const dynamic = "force-dynamic"

interface SearchParams {
    searchParams: Promise<{
        storeID: string
    }>
}

const HomePage = async ({ searchParams }: SearchParams) => {
    const { storeID } = await searchParams
    if (!storeID) return null

    const [sales, resume] = await Promise.all([getSales(storeID), getResume(storeID)])
    // Traemos ventas de WooCommerce
    const wooOrders = await getWooCommerceOrders()
    const wooSales = wooOrders.map(mapWooOrderToSale)
    // Combinamos todas las ventas
    const allSales = [...sales, ...wooSales]

    return (
        <>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                {/* Seccion superior */}
                <div className="flex flex-col sm:flex-row flex-wrap item-center sm:items-start justify-between gap-2">
                    <SellButton />
                    <FilterControls />
                    <ResumeDebitCreditPayment serverResume={resume} allSales={allSales} />
                </div>

                {/* Sección de estadísticas + tabla (se sincroniza con filtros) */}
                <SalesAndResumeSectionClient allSales={allSales} serverResume={resume} />
            </div>
        </>
    )
}

export default HomePage

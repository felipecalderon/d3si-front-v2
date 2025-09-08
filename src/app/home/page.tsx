import { getSales } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import { getWooCommerceOrders } from "@/actions/woocommerce/getWooOrder"
import { mapWooOrderToSale } from "@/utils/mappers/woocommerceToSale"
//import SalesTable from "@/components/Caja/SalesTable"
import ResumeLeftSideChart from "@/components/Caja/ResumeLeftSideChart"
import ResumeRightSideChart from "@/components/Caja/ResumeRightSideChart"
import DailyResumeCards from "@/components/Caja/DailyResumeCards"
import TotalSalesResumeGraph from "@/components/Caja/TotalSalesResumeGraph"
import FilterControls from "@/components/Caja/FilterControls"
import SalesSectionClient from "@/components/Caja/SalesSectionClient"

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
                <div className="w-full flex  lg:flex-row flex-col">
                    {/* Filtros + botón vender */}
                    <div className="lg:w-3/6">
                        <div className="sm:w-auto">
                            {/*Aqui es donde quiero los botones de los filtros con la logica creada*/}
                            <FilterControls />
                        </div>
                    </div>

                    {/* Métodos de pago */}
                    <div className="lg:w-3/6">
                        <DailyResumeCards resume={resume} />
                    </div>
                </div>

                {/* Sección de estadísticas */}
                {resume && (
                    <div>
                        {/* Mobile: Stack vertically */}
                        <div className="block lg:hidden space-y-6">
                            {/* Gráfico primero en mobile */}
                            <div className="flex justify-center">
                                <div className="w-full max-w-[280px] mx-auto">
                                    <TotalSalesResumeGraph resume={resume} />
                                </div>
                            </div>

                            {/* Facturación */}
                            <div>
                                <ResumeLeftSideChart resume={resume} />
                            </div>

                            {/* Ventas */}
                            <div>
                                <ResumeRightSideChart resume={resume} />
                            </div>
                        </div>

                        {/* Desktop: Grid layout con altura igual */}
                        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                            {/* Facturación */}
                            <div className="h-full flex flex-col justify-between gap-4">
                                <ResumeLeftSideChart resume={resume} />
                            </div>

                            {/* Gráfico - Centrado verticalmente */}
                            <div className="h-full flex justify-center items-center">
                                <div className="w-full max-w-[300px] h-full xl:max-w-[320px] mx-auto">
                                    <TotalSalesResumeGraph resume={resume} />
                                </div>
                            </div>

                            {/* Ventas */}
                            <div className="h-full flex flex-col justify-between gap-4">
                                <ResumeRightSideChart resume={resume} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de ventas */}
                {allSales.length > 0 && <SalesSectionClient allSales={allSales} />}
            </div>
        </>
    )
}

export default HomePage

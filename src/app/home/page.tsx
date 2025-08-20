import { getSales } from "@/actions/sales/getSales"
import { getResume } from "@/actions/totals/getResume"
import SalesTable from "@/components/Caja/Table/SalesTable"
import Facturacion from "@/components/Caja/Dashboard/Facturacion"
import Ventas from "@/components/Caja/Dashboard/Ventas"
import Payment from "@/components/Caja/Dashboard/PaymentMethods"
import Filters from "@/components/Caja/Dashboard/Filters"
import GaugeChart from "@/components/Caja/VentasTotalesGrafico/GaugeChart"

interface SerchParams {
    searchParams: Promise<{
        storeID: string
    }>
}

const HomePage = async ({ searchParams }: SerchParams) => {
    const { storeID } = await searchParams
    if (!storeID) return null
    const [sales, resume] = await Promise.all([getSales(storeID), getResume()])

    return (
        <>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                {/* Seccion superior */}
                <div className="w-full flex  lg:flex-row flex-col">
                    {/* Filtros + botón vender */}
                    <div className="lg:w-3/6">
                        <div className="sm:w-auto">
                            <Filters />
                        </div>
                    </div>

                    {/* Métodos de pago */}
                    <div className="lg:w-3/6">
                        <Payment />
                    </div>
                </div>

                {/* Sección de estadísticas */}
                <div>
                    {/* Mobile: Stack vertically */}
                    <div className="block lg:hidden space-y-6">
                        {/* Gráfico primero en mobile */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-[280px] mx-auto">
                                <GaugeChart />
                            </div>
                        </div>

                        {/* Facturación */}
                        <div>
                            <Facturacion resume={resume} />
                        </div>

                        {/* Ventas */}
                        <div>
                            <Ventas resume={resume} />
                        </div>
                    </div>

                    {/* Desktop: Grid layout con altura igual */}
                    <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                        {/* Facturación */}
                        <div className="h-full flex flex-col justify-between gap-4">
                            <Facturacion resume={resume} />
                        </div>

                        {/* Gráfico - Centrado verticalmente */}
                        <div className="h-full flex justify-center items-center">
                            <div className="w-full max-w-[300px] h-full xl:max-w-[320px] mx-auto">
                                <GaugeChart />
                            </div>
                        </div>

                        {/* Ventas */}
                        <div className="h-full flex flex-col justify-between gap-4">
                            <Ventas resume={resume} />
                        </div>
                    </div>
                </div>

                {/* Tabla de ventas */}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SalesTable sales={sales} />
                </div>
            </div>
        </>
    )
}

export default HomePage

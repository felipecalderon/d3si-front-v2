import { getSales } from "@/actions/sales/getSales"
import { getResume } from "@/actions/sales/getResume"
import SalesTable from "@/components/ListTable/SalesTable"
import Link from "next/link"
import Facturacion from "@/components/dashboard/Facturacion"
import Ventas from "@/components/dashboard/Ventas"
import Payment from "@/components/dashboard/PaymentMethods"
import Filters from "@/components/dashboard/Filters"
import Grafico from "@/components/dashboard/Grafico"

const HomePage = async () => {
    const storeID = "f3c9d8e0-ccaf-4300-a416-c3591c4d8b52"
    const [sales, resume] = await Promise.all([getSales(storeID), getResume()])

    return (
        <>
            <div className="space-y-10 px-4 sm:px-6 md:px-8 py-6">
                {/* Sección de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Facturación */}
                    <Facturacion resume={resume} />

                    {/* Gráfico */}
                    <div className="flex justify-center items-center order-first lg:order-none">
                        <div className="w-full max-w-xs sm:max-w-sm mx-auto">
                            <Grafico />
                        </div>
                    </div>

                    {/* Ventas */}
                    <Ventas resume={resume} />
                </div>

                {/* Métodos de pago */}
                <div>
                    <Payment />
                </div>

                {/* Filtros + botón */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <Filters />

                    <Link href="/home/createsale" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors">
                            Vender 🛍️
                        </button>
                    </Link>
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

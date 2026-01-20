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
import { getAllOrders } from "@/actions/orders/getAllOrders"
import { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChartBarIcon } from "lucide-react"
import { SaleForm } from "@/components/CreateSale/SaleForm"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getAllStores } from "@/actions/stores/getAllStores"

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
    const now = new Date()
    const newDate = day ? new Date(year, month - 1, day) : new Date(now.getTime() - 3 * 60 * 60 * 1000)
    const yyyyDate = formatDateToYYYYMMDD(newDate)

    if (!storeID) return null

    const allStores = await getAllStores()
    const isSpecialFilter = ["all", "propias", "consignadas"].includes(storeID)

    // Determinar qué tienda usar para los gráficos (por defecto la primera si es un filtro especial)
    const chartStoreID = isSpecialFilter ? allStores[0]?.storeID : storeID
    // Determinar qué tienda usar para la API de ventas (vacío para traer todas si es especial)
    const apiSalesStoreID = isSpecialFilter ? "" : storeID

    const [sales, wooOrders, resume, allOrders, allProducts] = await Promise.all([
        getSales(apiSalesStoreID || "", yyyyDate),
        getWooCommerceOrders(newDate),
        getResume(chartStoreID || "", yyyyDate),
        getAllOrders(),
        getAllProducts(),
    ])
    const wooSales = wooOrders.map(mapWooOrderToSale)

    // Filtrar las ventas para la tabla según el filtro especial
    const tableSales = sales.filter((sale) => {
        if (storeID === "all") return true
        if (storeID === "propias") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isAdminStore === true
        }
        if (storeID === "consignadas") {
            const store = allStores.find((s) => s.storeID === sale.storeID)
            return store?.isAdminStore === false
        }
        return sale.storeID === storeID
    })

    // Las ventas Web (WooCommerce) se consideran "propias"
    const filteredWooSales = storeID === "all" || storeID === "propias" ? wooSales : []

    const allSales = [...tableSales, ...filteredWooSales]
    const purchaseOrders: (IOrderWithStore & { isOrder: true })[] = allOrders
        .filter((order) => {
            if (storeID === "all") return true
            const store = allStores.find((s) => s.storeID === order.storeID)
            if (storeID === "propias") return store?.isAdminStore === true
            if (storeID === "consignadas") return store?.isAdminStore === false
            return order.storeID === storeID
        })
        .filter((order) => {
            // Si es filtro "all" o "consignadas", incluimos todo.
            // Si es "propias", evitamos las de consignación pura si es necesario.
            // Por defecto, permitimos todas las OC en la vista global.
            return true
        })
        .map((order) => ({ ...order, isOrder: true }))

    const items = [...allSales, ...purchaseOrders]

    const wooResume = salesToResume(wooSales, newDate)

    // Importante: para los gráficos (resume), usamos solo las ventas de la tienda seleccionada (o la default)
    const chartSales = isSpecialFilter ? sales.filter((s) => s.storeID === chartStoreID) : sales

    const localSalesResume = salesToResume(chartSales, newDate)
    const patchedSalesResume = { ...resume.totales.sales }

    // Corregimos discrepancias en los totales del backend (que a veces ignora ventas anuladas parcialmente)
    // usando nuestra lógica local para la fecha seleccionada.
    const diffAmount = localSalesResume.today.total.amount - patchedSalesResume.today.total.amount
    const diffCount = localSalesResume.today.total.count - patchedSalesResume.today.total.count
    const diffEfectivoAmount = localSalesResume.today.efectivo.amount - patchedSalesResume.today.efectivo.amount
    const diffEfectivoCount = localSalesResume.today.efectivo.count - patchedSalesResume.today.efectivo.count
    const diffDebitoAmount = localSalesResume.today.debitoCredito.amount - patchedSalesResume.today.debitoCredito.amount
    const diffDebitoCount = localSalesResume.today.debitoCredito.count - patchedSalesResume.today.debitoCredito.count

    if (diffAmount !== 0 || diffCount !== 0) {
        patchedSalesResume.today = localSalesResume.today

        // Aplicamos la diferencia al mes
        patchedSalesResume.month.total.amount += diffAmount
        patchedSalesResume.month.total.count += diffCount
        patchedSalesResume.month.efectivo.amount += diffEfectivoAmount
        patchedSalesResume.month.efectivo.count += diffEfectivoCount
        patchedSalesResume.month.debitoCredito.amount += diffDebitoAmount
        patchedSalesResume.month.debitoCredito.count += diffDebitoCount

        // Aplicamos la diferencia a los últimos 7 días
        patchedSalesResume.last7.total.amount += diffAmount
        patchedSalesResume.last7.total.count += diffCount
        patchedSalesResume.last7.efectivo.amount += diffEfectivoAmount
        patchedSalesResume.last7.efectivo.count += diffEfectivoCount
        patchedSalesResume.last7.debitoCredito.amount += diffDebitoAmount
        patchedSalesResume.last7.debitoCredito.count += diffDebitoCount

        resume.totales.sales = patchedSalesResume
    }

    const allSalesResume = totalDebitoCredito([resume.totales.sales, wooResume])

    return (
        <>
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                {/* Seccion superior */}

                <div className="flex flex-col sm:flex-row flex-wrap item-center sm:items-start justify-between gap-2">
                    {/* <SellButton /> */}
                    <FilterControls />
                    <ResumeDebitCreditPayment resume={resume} />
                </div>

                {/* Resúmenes y gráfico */}
                <Suspense fallback={<SalesAndResumeSkeleton />}>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex gap-3 items-center">
                                    <ChartBarIcon /> Panel de estadísticas globales
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="block space-y-6 sm:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-4 lg:items-start">
                                <ResumeLeftSideChart resume={resume} />
                                <TotalSalesResumeGraph resume={resume} />
                                <ResumeRightSideChart sales={allSalesResume} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Suspense>

                {/* Modulo para vender */}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SaleForm initialProducts={allProducts} />
                </div>

                {/* Tabla de ventas*/}
                <div className="overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <SalesTable items={items} />
                </div>
            </div>
        </>
    )
}

export default HomePage

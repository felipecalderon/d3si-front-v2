import { getWooSingleOrder } from "@/actions/woocommerce/getWooOrder"
import AnularVentaWebControl from "@/components/Caja/AnularVentaWebControl"
import PrintSaleButton from "@/components/Caja/PrintSaleButton"
import SingleSaleTable from "@/components/Caja/SingleSaleTable"
import { mapOrderToSaleBasic } from "@/utils/mappers/orderWooToSale"
import { toPrice } from "@/utils/priceFormat"
import { MapPin, Phone, Receipt, ShoppingBag, Store } from "lucide-react"
import Link from "next/link"

interface PropsSaleWoo {
    params: Promise<{
        saleID: string
    }>
}
export default async function WebSalePage({ params }: PropsSaleWoo) {
    const { saleID } = await params
    const sale = await getWooSingleOrder(saleID)
    if (!sale) return <p>No se pudo obtener detalle de la venta</p>
    const mappedSale = mapOrderToSaleBasic(sale)
    return (
        <div className="bg-white min-h-screen dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
            <div className="max-w-5xl mx-auto print-container">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
                    <Link href={"/home"}>
                        <button className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:underline text-base font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                            Regresar a la lista de ventas
                        </button>
                    </Link>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Detalles de la venta
                    </h1>
                </div>
                <div className="space-y-6 pt-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            Información de la Tienda
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Origen</p>
                                    <p className="font-medium">{mappedSale.Store.name || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                                    <p className="font-medium">
                                        {mappedSale.Store.location + " " + mappedSale.Store.address || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                    <p className="font-medium">{mappedSale.Store.phone || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="w-4 h-4 text-orange-600 dark:text-orange-400 font-bold">@</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                    <p className="font-medium">{mappedSale.Store.email || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Número de productos solicitados */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    N° Productos solicitados
                                </span>
                            </div>
                            <p className="text-lg font-semibold">
                                {mappedSale.SaleProducts.reduce((acc, act) => act.quantitySold + acc, 0)}
                            </p>
                        </div>
                        {/* Fecha de emisión */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Fecha de emisión
                                </span>
                            </div>
                            <p className="text-lg font-semibold">
                                {new Date(mappedSale.createdAt).toLocaleDateString("es-CL", {
                                    timeZone: "America/Santiago",
                                })}{" "}
                                |{" "}
                                {new Date(mappedSale.createdAt).toLocaleTimeString("es-CL", {
                                    timeZone: "America/Santiago",
                                })}
                            </p>
                        </div>
                        {/* Vencimiento del Pago */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Tipo de Pago:
                                </span>
                            </div>
                            <p className="text-lg font-semibold">{mappedSale.paymentType}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <SingleSaleTable products={mappedSale.SaleProducts} />
                        </div>
                    </div>
                    {mappedSale.Return && (
                        <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-950/50 dark:to-red-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">
                                        Esta venta fue anulada: {mappedSale.Return.reason}
                                    </p>
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">
                                        El día:{" "}
                                        {new Date(mappedSale.Return.createdAt).toLocaleDateString("es-CL", {
                                            timeZone: "America/Santiago",
                                        })}{" "}
                                        a las:{" "}
                                        {new Date(mappedSale.Return.createdAt).toLocaleTimeString("es-CL", {
                                            timeZone: "America/Santiago",
                                        })}
                                    </p>
                                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                        Observación: {mappedSale.Return.additionalNotes}
                                    </p>
                                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                                        Gestionado por: {mappedSale.Return.User.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Neto</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {toPrice(mappedSale.total / 1.19)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">IVA (19%)</p>
                                <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                    {toPrice(mappedSale.total * 0.19)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {toPrice(mappedSale.total)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                        <PrintSaleButton sale={mappedSale} />
                        <AnularVentaWebControl sale={sale} />
                    </div>
                </div>
            </div>
        </div>
    )
}

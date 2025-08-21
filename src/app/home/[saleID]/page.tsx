import { CreditCard, MapPin, Package, Phone, Receipt, ShoppingBag, Store } from "lucide-react"

interface PropsSale {
    params: Promise<{
        saleID: string
    }>
}
export default async function SingleSalePage({ params }: PropsSale) {
    const { saleID } = await params
    return (
        <div className="bg-white min-h-screen dark:bg-slate-900 text-gray-900 dark:text-gray-100 p-4">
            <div className="max-w-5xl mx-auto print-container">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
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
                        Regresar a las órdenes de compra
                    </button>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        Detalles de la Orden de Compra
                    </h1>
                </div>
                <div className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Número de productos solicitados */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    N° Productos solicitados
                                </span>
                            </div>
                            <p className="text-lg font-semibold">9</p>
                        </div>
                        {/* Fecha de emisión */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Fecha de emisión
                                </span>
                            </div>
                            <p className="text-lg font-semibold">18-08-2025</p>
                        </div>
                        {/* Vencimiento del Pago */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Vencimiento del Pago
                                </span>
                            </div>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={"2025-08-18"}
                            />
                        </div>
                    </div>
                    {/* Inputs y selects adicionales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {/* Input DTE */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                N° de DTE
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={""}
                                placeholder="Sin DTE"
                            />
                        </div>
                        {/* Estado del pago */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Estado del pago1
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={"Pagado"}
                            >
                                <option value="Pagado" disabled>
                                    Pagado
                                </option>
                            </select>
                        </div>
                        {/* Llegada de mercadería */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Llegada de mercadería
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={"2025-08-18"}
                                disabled
                            />
                        </div>
                    </div>
                    {/* Inputs de cuotas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Cuota actual
                                </label>
                                <button type="button" className="text-xs text-blue-600 hover:underline ml-2">
                                    Editar
                                </button>
                            </div>
                            <input
                                type="number"
                                min={0}
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={0}
                                placeholder="Sin cuota"
                            />
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Total de cuotas
                            </label>
                            <input
                                type="number"
                                min={1}
                                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                value={0}
                                placeholder="Sin cuota"
                            />
                        </div>
                    </div>
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
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                    <p className="font-medium">{false || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                                    <p className="font-medium">{false || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                    <p className="font-medium">{false || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="w-4 h-4 text-orange-600 dark:text-orange-400 font-bold">@</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                    <p className="font-medium">{false || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="w-4 h-4 text-orange-600 dark:text-orange-400 font-bold">🏙️</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ciudad</p>
                                    <p className="font-medium">{false || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos 0
                            </h3>
                        </div>
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400">No hay productos en esta orden.</p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                            <CreditCard className="w-5 h-5" />
                            Desglose de Totales
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Neto</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {Number(150000).toLocaleString("es-CL", {
                                        style: "currency",
                                        currency: "CLP",
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">IVA (19%)</p>
                                <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                    {Number(150000).toLocaleString("es-CL", {
                                        style: "currency",
                                        currency: "CLP",
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {Number(150000).toLocaleString("es-CL", {
                                        style: "currency",
                                        currency: "CLP",
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">
                            Imprimir
                        </button>

                        <button className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow">
                            Actualizar Orden
                        </button>
                        <button className=" bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow">
                            Eliminar OC
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

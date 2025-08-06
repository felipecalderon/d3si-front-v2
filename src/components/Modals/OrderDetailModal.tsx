"use client"
import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { IOrderWithStore } from "@/interfaces/orders/IOrderWithStore"
import { Calendar, CreditCard, MapPin, Phone, Receipt, ShoppingBag, Store, Tag, Percent, Package } from "lucide-react"

interface Props {
    open: boolean
    onClose: () => void
    order: IOrderWithStore | null
}

export default function OrderDetailModal({ open, onClose, order }: Props) {
    // Calcular totales de productos
    const neto = order?.ProductVariations?.reduce((acc, item) => acc + item.quantityOrdered * item.priceCost, 0) || 0
    const iva = neto * 0.19
    const totalConIva = neto + iva
    // Estado de pago
    const paymentStates = ["Pendiente", "Enviado", "Anulado"]
    const [paymentStatus, setPaymentStatus] = React.useState(order?.status || "Pendiente")
    React.useEffect(() => {
        if (open && order?.status) {
            setPaymentStatus(order.status)
        }
    }, [open, order?.status])
    // DTE
    const generateRandomDTE = () => Math.floor(10000000 + Math.random() * 90000000).toString()
    const [dteNumber, setDteNumber] = React.useState("")
    React.useEffect(() => {
        if (open) {
            setDteNumber(generateRandomDTE())
        }
    }, [open])
    // Llegada de mercadería
    const [arrivalDate, setArrivalDate] = React.useState("")
    // Cuotas
    const [currentQuota, setCurrentQuota] = React.useState(0)
    const [totalQuotas, setTotalQuotas] = React.useState(1)

    React.useEffect(() => {
        if (order && order.status && paymentStatus === "Pendiente") {
            setPaymentStatus(order.status)
        }
    }, [order, paymentStatus])

    React.useEffect(() => {
        if (currentQuota === totalQuotas && paymentStatus !== "Pagado") {
            setPaymentStatus("Pagado")
        }
    }, [currentQuota, totalQuotas, paymentStatus])

    if (!order) return null

    const fecha = new Date(order.createdAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <div className="bg-white max-h-[90vh] overflow-y-auto dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-md p-4">
                    <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <Receipt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            Detalles de la Orden de Compra
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-6">
                        {/* Información Principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Número de productos solicitados */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        N° Productos solicitados
                                    </span>
                                </div>
                                <p className="text-lg font-semibold">{order.ProductVariations?.length || 0}</p>
                            </div>

                            {/* Fecha de emisión */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Fecha de emisión
                                    </span>
                                </div>
                                <p className="text-lg font-semibold">{fecha}</p>
                            </div>

                            {/* Vencimiento del Pago */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Vencimiento del Pago
                                    </span>
                                </div>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                    value={arrivalDate}
                                    onChange={(e) => setArrivalDate(e.target.value)}
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
                                    value={dteNumber}
                                    onChange={(e) => setDteNumber(e.target.value)}
                                    placeholder="Ingrese folio DTE"
                                />
                            </div>

                            {/* Estado del pago */}
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Estado del pago
                                </label>
                                <select
                                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                    disabled={paymentStatus === "Pagado"}
                                >
                                    {paymentStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
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
                                    value={arrivalDate}
                                    onChange={(e) => setArrivalDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Inputs de cuotas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Cuota actual
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                                    value={currentQuota}
                                    onChange={(e) => setCurrentQuota(Number(e.target.value))}
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
                                    value={totalQuotas}
                                    onChange={(e) => setTotalQuotas(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* Información Financiera */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-900 dark:text-blue-100">
                                <CreditCard className="w-5 h-5" />
                                Desglose de Totales
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Neto</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        ${neto.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">IVA (19%)</p>
                                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                                        ${iva.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                        ${totalConIva.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Tienda */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Store className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                Información de la Tienda
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Store className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
                                        <p className="font-medium">{order.Store?.name || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
                                        <p className="font-medium">{order.Store?.address || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                        <p className="font-medium">{order.Store?.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Productos */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                                Productos ({order.ProductVariations?.length || 0})
                            </h3>
                            {order.ProductVariations && order.ProductVariations.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Desktop Table */}
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                                        SKU
                                                    </th>
                                                    <th className="text-left py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                                        Talla
                                                    </th>
                                                    <th className="text-center py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                                        Cantidad
                                                    </th>
                                                    <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                                        Precio Costo.
                                                    </th>
                                                    <th className="text-right py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                                                        TOTAL.
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.ProductVariations.map((item, index) => (
                                                    <tr
                                                        key={item.variationID}
                                                        className={`border-b border-gray-100 dark:border-gray-700 ${
                                                            index % 2 === 0 ? "bg-gray-50 dark:bg-slate-700/50" : ""
                                                        }`}
                                                    >
                                                        <td className="py-3 px-2">
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                                                {item.sku}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                                {item.sizeNumber}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-2 text-center">
                                                            <span className="font-semibold">
                                                                {item.quantityOrdered}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-2 text-right font-medium">
                                                            ${item.priceCost.toFixed(2)}
                                                        </td>
                                                        <td className="py-3 px-2 text-right font-bold text-green-600 dark:text-green-400">
                                                            ${(item.quantityOrdered * item.priceCost).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="md:hidden space-y-3">
                                        {order.ProductVariations.map((item) => (
                                            <div
                                                key={item.variationID}
                                                className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs font-mono">
                                                        {item.sku}
                                                    </span>
                                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                        Talla {item.sizeNumber}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Cantidad</p>
                                                        <p className="font-semibold">{item.quantityOrdered}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Precio Unit.</p>
                                                        <p className="font-medium">${item.priceCost.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                                                        <p className="font-bold text-green-600 dark:text-green-400">
                                                            ${(item.quantityOrdered * item.priceCost).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">No hay productos en esta orden.</p>
                                </div>
                            )}
                        </div>
                        {/* Botones de acción */}
                        <div className="flex flex-col md:flex-row gap-3 justify-end mt-6">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                                onClick={() => window.print()}
                            >
                                Imprimir
                            </button>
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
                                // TODO: Implementar lógica de actualización
                            >
                                Actualizar Orden
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
                                // TODO: Implementar lógica de eliminación
                            >
                                Eliminar OC
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

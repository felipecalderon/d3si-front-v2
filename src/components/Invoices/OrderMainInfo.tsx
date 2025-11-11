import React from "react"
import { Input } from "../ui/input"
import { useEditOrderStore } from "@/stores/order.store"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"

interface Props {
    cantidadTotalProductos: number
    fecha: string
}

const OrderMainInfo: React.FC<Props> = ({ cantidadTotalProductos, fecha }) => {
    const paymentStates = ["Pendiente", "Enviado", "Anulado"]
    const { user } = useAuth()
    const { actions, ...editedOrder } = useEditOrderStore()
    const { updateOrderStringField } = actions
    const isAdmin = user?.role === Role.Admin

    return (
        <>
            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Número de productos solicitados */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            N° Productos solicitados
                        </span>
                    </div>
                    <p className="text-lg font-semibold">{cantidadTotalProductos}</p>
                </div>
                {/* Fecha de emisión */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha de emisión</span>
                    </div>
                    <p className="text-lg font-semibold">{fecha}</p>
                </div>
                {/* Vencimiento del Pago */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Vencimiento del Pago
                        </span>
                    </div>
                    <Input
                        type="date"
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={editedOrder.expiration ? formatDateToYYYYMMDD(new Date(editedOrder.expiration)) : ""}
                        onChange={(e) => updateOrderStringField("expiration", e.target.value)}
                        disabled={!isAdmin}
                    />
                </div>
            </div>
            {/* Inputs y selects adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Input DTE */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">N° de DTE</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        placeholder="Sin DTE"
                        value={editedOrder.dte || ""}
                        onChange={(e) => updateOrderStringField("dte", e.target.value)}
                        disabled={!isAdmin}
                    />
                </div>
                {/* Estado del pago */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Estado del pago
                    </label>
                    <select
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={editedOrder.status}
                        onChange={(e) => updateOrderStringField("status", e.target.value)}
                        disabled={editedOrder.status === "Pagado" || !isAdmin}
                    >
                        {paymentStates.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                        <option value="Pagado">Pagado</option>
                    </select>
                </div>
                {/* Llegada de mercadería */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Llegada de mercadería
                    </label>
                    <Input
                        type="date"
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        // value={arrivalDate}
                        // onChange={(e) => setArrivalDate(e.target.value)}
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
                    </div>
                    <input
                        type="number"
                        min={1}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                        max={Number(editedOrder.endQuote ?? 0)}
                        value={Number(editedOrder.startQuote ?? 0)}
                        placeholder={editedOrder.startQuote ? "Sin cuota" : "Pago único"}
                        disabled={!isAdmin}
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val < 0 || val > Number(editedOrder.endQuote ?? 0)) return
                            updateOrderStringField("startQuote", e.target.value)
                        }}
                    />
                    {/* {editCurrentQuota && canEditCurrentQuota && (
                        <p className="text-xs text-gray-500 mt-1">Máximo: {maxCurrentQuota} cuotas</p>
                    )} */}
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total de cuotas
                        </label>
                    </div>
                    <input
                        type="number"
                        min={1}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={editedOrder.endQuote ?? ""}
                        placeholder="Sin cuota"
                        disabled={!isAdmin}
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (isNaN(val)) return
                            if (val < 0) return
                            updateOrderStringField("endQuote", e.target.value)
                            if (!editedOrder.startQuote || Number(editedOrder.startQuote ?? 0) === 0) {
                                updateOrderStringField("startQuote", "1")
                            } else if (Number(editedOrder.startQuote ?? 0) > Number(editedOrder.endQuote ?? 0)) {
                                updateOrderStringField("startQuote", editedOrder.endQuote)
                            }
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default OrderMainInfo

import React from "react"

interface Props {
    cantidadTotalProductos: number
    fecha: string
    arrivalDate: string
    setArrivalDate: (v: string) => void
    isAdmin: boolean
    dteNumber: string
    setDteNumber: (v: string) => void
    paymentStatus: string
    setPaymentStatus: (v: string) => void
    paymentStates: string[]
    currentQuota: number | undefined
    setCurrentQuota: (v: number | undefined) => void
    totalQuotas: number | undefined
    setTotalQuotas: (v: number | undefined) => void
    editQuotas: boolean
    setEditQuotas: (v: boolean) => void
}

const OrderMainInfo: React.FC<Props> = ({
    cantidadTotalProductos,
    fecha,
    arrivalDate,
    setArrivalDate,
    isAdmin,
    dteNumber,
    setDteNumber,
    paymentStatus,
    setPaymentStatus,
    paymentStates,
    currentQuota,
    setCurrentQuota,
    totalQuotas,
    setTotalQuotas,
    editQuotas,
    setEditQuotas,
}) => {
    // Si las cuotas coinciden, el estado debe ser 'Pagado' y el select debe estar deshabilitado
    React.useEffect(() => {
        if (
            typeof currentQuota === "number" &&
            typeof totalQuotas === "number" &&
            currentQuota > 0 &&
            totalQuotas > 0 &&
            currentQuota === totalQuotas &&
            paymentStatus !== "Pagado"
        ) {
            setPaymentStatus("Pagado")
        }
    }, [currentQuota, totalQuotas, setPaymentStatus, paymentStatus])

    const isPagado =
        typeof currentQuota === "number" &&
        typeof totalQuotas === "number" &&
        currentQuota > 0 &&
        totalQuotas > 0 &&
        currentQuota === totalQuotas

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
                    <input
                        type="date"
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
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
                        value={dteNumber || ""}
                        onChange={(e) => setDteNumber(e.target.value)}
                        placeholder="Sin DTE"
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
                        value={isPagado ? "Pagado" : paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        disabled={isPagado || !isAdmin}
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
                    <input
                        type="date"
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
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
                        {isAdmin && (
                            <button
                                type="button"
                                className="text-xs text-blue-600 hover:underline ml-2"
                                onClick={() => setEditQuotas(!editQuotas)}
                            >
                                {editQuotas ? "Cancelar" : "Editar"}
                            </button>
                        )}
                    </div>
                    <input
                        type="number"
                        min={0}
                        max={typeof totalQuotas === "number" ? totalQuotas : undefined}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100"
                        value={currentQuota ?? ""}
                        placeholder="Sin cuota"
                        disabled={!editQuotas || !isAdmin}
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val < 0) return
                            if (typeof totalQuotas === "number" && val > totalQuotas) return
                            setCurrentQuota(Number.isNaN(val) ? undefined : val)
                        }}
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
                        value={totalQuotas ?? ""}
                        placeholder="Sin cuota"
                        disabled={!editQuotas || !isAdmin}
                        onChange={(e) => {
                            const val = Number(e.target.value)
                            if (val < 1) return
                            setTotalQuotas(Number.isNaN(val) ? undefined : val)
                        }}
                    />
                </div>
            </div>
        </>
    )
}

export default OrderMainInfo

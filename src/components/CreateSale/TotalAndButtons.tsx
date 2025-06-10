interface TotalAndButtonsProps {
    tipoPago: string
    setTipoPago: (tipo: string) => void
    total: number
    handleSubmit: () => void
}

export const TotalAndButtons = ({ tipoPago, setTipoPago, total, handleSubmit }: TotalAndButtonsProps) => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="pago" className="text-gray-700 font-medium">
                Tipo de pago:
            </label>
            <select
                id="pago"
                value={tipoPago}
                onChange={(e) => setTipoPago(e.target.value)}
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="EFECTIVO">Efectivo</option>
                <option value="DÉBITO">Débito</option>
                <option value="CRÉDITO">Crédito</option>
            </select>
        </div>

        <p className="text-xl font-semibold text-gray-800">Total: ${total.toLocaleString()}</p>

        <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
            Finalizar Venta
        </button>
    </div>
)

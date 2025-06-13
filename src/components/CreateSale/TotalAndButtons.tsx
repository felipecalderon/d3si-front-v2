import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface TotalAndButtonsProps {
    tipoPago: string
    setTipoPago: (tipo: string) => void
    total: number
    handleSubmit: () => void
}

export const TotalAndButtons = ({ tipoPago, setTipoPago, total, handleSubmit }: TotalAndButtonsProps) => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <label htmlFor="pago" className="dark:text-slate-700 text-gray-700 font-medium">
                Tipo de pago:
            </label>
            <Select
                value={tipoPago}
                onValueChange={(value) => setTipoPago(value)}
                >
                <SelectTrigger className="p-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="DÉBITO">Débito</SelectItem>
                    <SelectItem value="CRÉDITO">Crédito</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <p className="text-xl font-semibold dark:text-white text-gray-800">Total: ${total.toLocaleString()}</p>

        <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
        >
            Finalizar Venta
        </button>
    </div>
)

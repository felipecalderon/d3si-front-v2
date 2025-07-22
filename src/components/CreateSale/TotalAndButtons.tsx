"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"

interface TotalAndButtonsProps {
    tipoPago: string
    setTipoPago: (tipo: string) => void
    total: number
    handleSubmit: () => Promise<boolean>
    resumen: IProductoEnVenta[]
}

export const TotalAndButtons = ({ tipoPago, setTipoPago, total, handleSubmit, resumen }: TotalAndButtonsProps) => {
    const [ventaFinalizada, setVentaFinalizada] = useState(false)
    const router = useRouter()

    const finalizarVenta = async () => {
        const exito = await handleSubmit()
        if (exito) {
            setVentaFinalizada(true)
        }
    }

    return (
        <div className="flex flex-col gap-6 mt-4">
            {ventaFinalizada ? (
                <div className="bg-white dark:bg-slate-800 p-6 rounded shadow text-center">
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
                        ¡Venta finalizada con éxito!
                    </h2>
                    <p className="text-gray-800 dark:text-gray-100 mb-4">
                        Tipo de pago: <strong>{tipoPago}</strong>
                    </p>

                    <div className="max-h-60 overflow-y-auto mb-4">
                        <table className="w-full text-sm text-left border rounded">
                            <thead className="bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                                <tr>
                                    <th className="p-2">Producto</th>
                                    <th className="p-2 text-center">Cantidad</th>
                                    <th className="p-2 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-900 dark:text-gray-100">
                                {resumen.map((prod) => (
                                    <tr key={prod.storeProductID}>
                                        <td className="p-2">{prod.nombre}</td>
                                        <td className="p-2 text-center">{prod.cantidad}</td>
                                        <td className="p-2 text-right">${(prod.cantidad * prod.precio).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        Total: ${resumen.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2)}
                    </p>

                    <button
                        onClick={() => router.push("/home")}
                        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Volver al inicio
                    </button>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex lg:flex-row flex-col items-center gap-2">
                        <label htmlFor="pago" className="dark:text-slate-700 text-gray-700 font-medium">
                            Tipo de pago:
                        </label>
                        <Select value={tipoPago} onValueChange={(value) => setTipoPago(value)}>
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

                    <p className="text-xl font-semibold dark:text-white text-gray-800">
                        Total: ${total.toLocaleString()}
                    </p>

                    <button
                        onClick={finalizarVenta}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        Finalizar Venta
                    </button>
                </div>
            )}
        </div>
    )
}

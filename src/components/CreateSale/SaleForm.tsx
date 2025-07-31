"use client"
import { useState } from "react"
import { getProductById } from "@/actions/products/getProductById"
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import { ScanInput } from "@/components/CreateSale/ScanInput"
import { CartTable } from "@/components/CreateSale/CartTable"
import { postSale } from "@/actions/sales/postSale"
import { toast } from "sonner"
import { useTienda } from "@/stores/tienda.store"
import { PaymentType } from "@/interfaces/sales/ISale"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const SaleForm = () => {
    const [productos, setProductos] = useState<IProductoEnVenta[]>([])
    const [codigo, setCodigo] = useState("")
    const [tipoPago, setTipoPago] = useState<PaymentType>("Efectivo")
    const [resumen, setResumen] = useState<IProductoEnVenta[]>([])
    const [isAdding] = useState(false)
    const { storeSelected } = useTienda()
    const [ventaFinalizada, setVentaFinalizada] = useState(false)
    const router = useRouter()

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!codigo) return
        if (!storeSelected) return toast("Debes elegir una tienda")

        const storeID = storeSelected.storeID

        try {
            const productoEncontrado = await getProductById(storeID, codigo)
            if (!productoEncontrado) {
                toast("Producto no encontrado")
                return
            }

            const stockDisponible = productoEncontrado.stockQuantity ?? 0

            if (stockDisponible <= 0) {
                toast("No hay stock disponible para este producto.")
                return
            }

            setProductos((prev) => {
                const index = prev.findIndex((p) => p.storeProductID === productoEncontrado.storeProductID)
                if (index !== -1) {
                    const updated = [...prev]
                    const cantidadActual = updated[index].cantidad

                    if (cantidadActual + 1 > stockDisponible) {
                        toast("No se puede agregar más, stock insuficiente.")
                        return prev
                    }

                    updated[index].cantidad += 1
                    return updated
                }

                return [
                    ...prev,
                    {
                        storeProductID: productoEncontrado.storeProductID,
                        nombre: productoEncontrado.name,
                        precio: Number(productoEncontrado.priceList),
                        storeID,
                        image: productoEncontrado.image || "",
                        cantidad: 1,
                        stockDisponible: stockDisponible,
                    },
                ]
            })

            setCodigo("")
        } catch (err) {
            console.error(err)
            toast("Error al buscar producto")
        }
    }

    const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

    const handleSubmit = async () => {
        if (productos.length === 0) {
            toast("Agrega al menos un producto.")
            return false
        }

        try {
            const storeID = productos[0]?.storeID || ""

            const productosParaBackend = productos.map((prod) => ({
                storeProductID: prod.storeProductID,
                quantitySold: prod.cantidad,
            }))

            const res = await postSale({
                storeID,
                paymentType: tipoPago,
                products: productosParaBackend,
            })

            if (res) {
                toast("Venta registrada con éxito")
                setResumen(productos)
                setProductos([])
                setVentaFinalizada(true)
                return true
            } else {
                toast("Error al registrar la venta")
                return false
            }
        } catch (err) {
            console.error(err)
            toast("Error al enviar la venta")
            return false
        }
    }

    const handleDelete = (id: string) => {
        setProductos((prev) => prev.filter((prod) => prod.storeProductID !== id))
    }

    const handleCantidadChange = (id: string, cantidad: number) => {
        setProductos((prev) => {
            return prev.map((prod) => (prod.storeProductID === id ? { ...prod, cantidad } : prod))
        })
    }

    return (
        <>
            <ScanInput codigo={codigo} setCodigo={setCodigo} handleAddProduct={handleAddProduct} isAdding={isAdding} />
            <CartTable productos={productos} onDelete={handleDelete} onCantidadChange={handleCantidadChange} />
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
                                            <td className="p-2 text-right">
                                                ${(prod.cantidad * prod.precio).toFixed(2)}
                                            </td>
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
                            <Select value={tipoPago} onValueChange={(value: PaymentType) => setTipoPago(value)}>
                                <SelectTrigger className="p-2 border bg-transparent border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Seleccionar tipo de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                    <SelectItem value="Debito">Débito</SelectItem>
                                    <SelectItem value="Credito">Crédito</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <p className="text-xl font-semibold dark:text-white text-gray-800">
                            Total: ${total.toLocaleString()}
                        </p>

                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                        >
                            Vender
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

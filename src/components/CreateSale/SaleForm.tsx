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
import { IProduct } from "@/interfaces/products/IProduct"
import { toPrice } from "@/utils/priceFormat"
import { Button } from "../ui/button"

export const SaleForm = ({ initialProducts }: { initialProducts: IProduct[] }) => {
    const [productos, setProductos] = useState<IProductoEnVenta[]>([])
    const [codigo, setCodigo] = useState("")
    const [loading, setLoading] = useState(false)
    const [tipoPago, setTipoPago] = useState<PaymentType>("Efectivo")
    const [resumen, setResumen] = useState<IProductoEnVenta[]>([])
    const [isAdding] = useState(false)
    const { storeSelected } = useTienda()
    const router = useRouter()

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!codigo) return
        if (!storeSelected) return toast("Debes elegir una tienda")

        const storeID = storeSelected.storeID

        try {
            const productoEncontrado = await getProductById(initialProducts, storeID, codigo)
            if (!productoEncontrado) {
                return
            }

            // Si es de la tienda central (admin) saca del stock global, sino, utiliza el stock propio.
            const stockDisponible = storeSelected.isAdminStore
                ? productoEncontrado.stockQuantity
                : productoEncontrado.quantity

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
            return toast("Agrega al menos un producto.")
        }
        setLoading(true)
        try {
            const productosParaBackend = productos.map((prod) => ({
                storeProductID: prod.storeProductID,
                quantitySold: prod.cantidad,
            }))
            if (!storeSelected) return toast.error("No se pudo cargar la tienda")
            const res = await postSale({
                storeID: storeSelected.storeID,
                paymentType: tipoPago,
                products: productosParaBackend,
            })

            if (res) {
                setResumen(productos)
                setProductos([])
                router.refresh()
                router.push("/home")
                return toast(res.message)
            } else {
                return toast("Error al registrar la venta")
            }
        } catch (err) {
            console.error(err)
            return toast("Error al enviar la venta")
        } finally {
            setLoading(false)
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
                <div className="flex flex-col md:flex-row items-center justify-between md:justify-end gap-4 md:gap-8">
                    <p className="text-xl font-semibold dark:text-white text-gray-800">Total: ${toPrice(total)}</p>
                    <div className="flex md:flex-row flex-col items-center gap-2">
                        <label
                            htmlFor="pago"
                            className="dark:text-slate-300 text-gray-700 font-medium whitespace-nowrap flex-shrink-0"
                        >
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
                    <Button
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                    >
                        Vender
                    </Button>
                </div>
            </div>
        </>
    )
}

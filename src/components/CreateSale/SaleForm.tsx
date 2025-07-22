"use client"
import { useState } from "react"
import { getProductById } from "@/actions/products/getProductById"
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import { ScanInput } from "@/components/CreateSale/ScanInput"
import { CartTable } from "@/components/CreateSale/CartTable"
import { TotalAndButtons } from "@/components/CreateSale/TotalAndButtons"
import { postSale } from "@/actions/sales/postSale"
import { toast } from "sonner"
import { useTienda } from "@/stores/tienda.store"

export const SaleForm = () => {
    const [productos, setProductos] = useState<IProductoEnVenta[]>([])
    const [codigo, setCodigo] = useState("")
    const [tipoPago, setTipoPago] = useState("EFECTIVO")
    const [resumen, setResumen] = useState<IProductoEnVenta[]>([])
    const [isAdding] = useState(false)
    const { storeSelected } = useTienda()

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!codigo) return
        if (!storeSelected) return toast("Debes elegir una tienda")

        const storeID = storeSelected.storeID
        const isAdmin = storeSelected?.isAdminStore ?? false

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
            toast("Agregá al menos un producto.")
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
                paymentType: "Efectivo",
                products: productosParaBackend,
            })

            if (res) {
                toast("Venta registrada con éxito")
                setResumen(productos)
                setProductos([])
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
            <TotalAndButtons
                tipoPago={tipoPago}
                setTipoPago={setTipoPago}
                total={total}
                handleSubmit={handleSubmit}
                resumen={resumen}
            />
        </>
    )
}

import { useEffect, useState } from "react"
import { getProductById } from "@/actions/products/getProductById"
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import { ScanInput } from "@/components/CreateSale/ScanInput"
import { CartTable } from "@/components/CreateSale/CartTable"
import { TotalAndButtons } from "@/components/CreateSale/TotalAndButtons"
import { postSale } from "@/actions/sales/postSale"
import { toast } from "sonner"

export const SaleForm = () => {
    const [productos, setProductos] = useState<IProductoEnVenta[]>([])
    const [codigo, setCodigo] = useState("")
    const [tipoPago, setTipoPago] = useState("EFECTIVO")

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!codigo) return
        const storeID = "f3c9d8e0-ccaf-4300-a416-c3591c4d8b52" //Datos agregados manualmente para pruebas
        try {
            const productoEncontrado = await getProductById(storeID, codigo)
            if (!productoEncontrado) {
                toast("Producto no encontrado")
                return
            }

            setProductos((prev) => {
                const index = prev.findIndex((p) => p.storeProductID === codigo)
                if (index !== -1) {
                    const updated = [...prev]
                    updated[index].cantidad += 1
                    return updated
                }
                return [
                    ...prev,
                    {
                        storeProductID: productoEncontrado.variationID,
                        nombre: productoEncontrado.sku,
                        precio: Number(productoEncontrado.priceList),
                        storeID: "",
                        cantidad: 1,
                    } as IProductoEnVenta,
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
            return
        }

        try {
            const res = await postSale({
                products: productos,
                tipoPago,
                storeID: "",
            })

            if (res) {
                toast("Venta registrada con éxito")
                setProductos([])
            } else {
                toast("Error al registrar la venta")
            }
        } catch (err) {
            console.error(err)
            toast("Error al enviar la venta")
        }
    }

    const handleDelete = (id: string) => {
        setProductos((prev) => prev.filter((prod) => prod.storeProductID !== id))
    }

    useEffect(() => {
        console.log(productos)
    }, [productos])

    return (
        <>
            <ScanInput codigo={codigo} setCodigo={setCodigo} handleAddProduct={handleAddProduct} />
            <CartTable productos={productos} onDelete={handleDelete} />
            <TotalAndButtons tipoPago={tipoPago} setTipoPago={setTipoPago} total={total} handleSubmit={handleSubmit} />
        </>
    )
}

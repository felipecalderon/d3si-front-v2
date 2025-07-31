import { FlattenedProduct } from "@/interfaces/products/IFlatternProduct"
import { IStore } from "@/interfaces/stores/IStore" 
import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"

export const handleAddProductByFlattened = (
    producto: FlattenedProduct,
    storeSelected: IStore | null,
    setProductos: React.Dispatch<React.SetStateAction<IProductoEnVenta[]>>,
    toast: (msg: string) => void
) => {
    const storeID = storeSelected?.storeID
    if (!storeID) {
        toast("Tienda no seleccionada")
        return
    }

    const stockDisponible = producto.totalStock ?? 0

    if (stockDisponible <= 0) {
        toast("No hay stock disponible para este producto.")
        return
    }

    setProductos((prev) => {
        const index = prev.findIndex((p) => p.storeProductID === producto.id)
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
                storeProductID: producto.id,
                nombre: producto.name,
                precio: Number(producto.priceList),
                storeID,
                image: producto.image || "",
                cantidad: 1,
                stockDisponible: stockDisponible,
            },
        ]
    })
}

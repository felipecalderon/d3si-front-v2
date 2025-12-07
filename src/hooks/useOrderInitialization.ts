import { useEffect } from "react"
import { useEditOrderStore } from "@/stores/order.store"
import { ISingleOrderResponse } from "@/interfaces/orders/IOrder"
import { useLoadingToaster } from "@/stores/loading.store"
import { toast } from "sonner"

export const useOrderInitialization = (order: ISingleOrderResponse) => {
    const { actions } = useEditOrderStore()
    const { addProduct, updateOrderStringField, clearCart } = actions
    const { activeToastId, setToastId } = useLoadingToaster()

    // Carga la orden en el store global de zustand
    useEffect(() => {
        clearCart()
        const { ProductVariations, newProducts, Store, ...restOrder } = order
        const arrFields = Object.entries(restOrder)

        arrFields.forEach(([field, value]) => {
            // Aseguramos que discount se trate correctamente si viene como número
            if (field === "discount" && typeof value === "number") {
                updateOrderStringField(field as any, value)
            } else {
                updateOrderStringField(field as any, value)
            }
        })

        order.ProductVariations.forEach((v) => {
            const variationWithQuantity = {
                ...v,
                quantity: v.OrderProduct.quantityOrdered,
                priceCost: v.OrderProduct.priceCost,
            }
            addProduct(v.Product, variationWithQuantity)
        })
    }, [order, addProduct, updateOrderStringField, clearCart])

    useEffect(() => {
        if (activeToastId) {
            console.log(activeToastId)
            toast.success("Orden cargada!", { id: activeToastId })
            setToastId(null)
        }
    }, [activeToastId, setToastId])
}

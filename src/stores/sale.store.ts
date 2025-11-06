import { create } from "zustand"
import { toast } from "sonner"
import { useTienda } from "./tienda.store"
import { PaymentType } from "@/interfaces/sales/ISale"
import { IProduct } from "@/interfaces/products/IProduct"
import { IStoreProduct } from "@/interfaces/products/IProductVariation"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"

interface SaleItem {
    product: IProduct
    variation: IVariationWithQuantity
    storeProduct: IStoreProduct
}

interface SaleState {
    cartItems: SaleItem[]
    paymentMethod: PaymentType
    loading: boolean
    actions: {
        addProduct: (product: IProduct, variation: IVariationWithQuantity, storeProduct: IStoreProduct) => void
        removeProduct: (sku: string) => void
        updateQuantity: (sku: string, quantity: number) => void
        setPaymentMethod: (method: PaymentType) => void
        clearCart: () => void
    }
}

export const useSaleStore = create<SaleState>((set, get) => ({
    cartItems: [],
    paymentMethod: "Efectivo",
    loading: false,
    actions: {
        addProduct: (product, variation, storeProduct) => {
            const { storeSelected } = useTienda.getState()
            if (!storeSelected) {
                toast.error("Debes elegir una tienda")
                return
            } // Es importante verificar el stock en el carrito, no solo en la variación que se pasa
            const { cartItems } = get()

            const existingItem = cartItems.find((p) => p.variation.sku === variation.sku) // Stock a comparar: si ya existe, usamos su stock actual, si no, usamos el stock de la variación pasada.
            const stockQuantity = existingItem ? existingItem.variation.stockQuantity : variation.stockQuantity
            const currentQuantity = existingItem ? existingItem.variation.quantity : 0
            if (currentQuantity + 1 > stockQuantity) {
                toast("No se puede agregar más, stock insuficiente.")
                return
            }

            if (existingItem) {
                // El producto YA existe, aumentamos la cantidad en 1.
                const newCartItems = cartItems.map((item) => {
                    if (item.variation.sku === variation.sku) {
                        return {
                            ...item,
                            variation: {
                                ...item.variation, // **AQUÍ ESTÁ EL CAMBIO CLAVE:** Aumentar la cantidad dentro de `variation`
                                quantity: item.variation.quantity + 1,
                            },
                        }
                    }
                    return item
                })
                set({ cartItems: newCartItems })
            } else {
                // El producto NO existe, se agrega con cantidad 1.
                const newCartItems = [
                    ...cartItems,
                    {
                        product,
                        storeProduct,
                        variation: { ...variation, quantity: 1 },
                    },
                ]
                set({ cartItems: newCartItems })
            }
        },
        removeProduct: (sku) => {
            set((state) => {
                const newCartItems = state.cartItems.filter((item) => item.variation.sku !== sku)
                return { cartItems: newCartItems }
            })
        },
        updateQuantity: (sku, quantity) => {
            set((state) => {
                const newCartItems = state.cartItems.map((item) =>
                    item.variation.sku === sku ? { ...item, variation: { ...item.variation, quantity } } : item
                )
                console.log(newCartItems)
                return { cartItems: newCartItems }
            })
        },
        setPaymentMethod: (method) => {
            set({ paymentMethod: method })
        },
        clearCart: () => {
            set({ cartItems: [] })
        },
    },
}))

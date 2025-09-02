import { create } from "zustand"
import { ISaleCartItem } from "@/interfaces/sales/ISaleCartItem"
import { PaymentType } from "@/interfaces/sales/ISale"
import { IProduct } from "@/interfaces/products/IProduct"
import { toast } from "sonner"
import { getProductById } from "@/actions/products/getProductById"
import { postSale } from "@/actions/sales/postSale"
import { useTienda } from "./tienda.store"

interface BackendResponseNewSale {
    message: string
    saleID: string
    total: number
}

interface SaleState {
    cartItems: ISaleCartItem[]
    paymentMethod: PaymentType
    loading: boolean
    total: number
    actions: {
        addProduct: (productCode: string, initialProducts: IProduct[]) => void
        removeProduct: (id: string) => void
        updateQuantity: (id: string, quantity: number) => void
        setPaymentMethod: (method: PaymentType) => void
        submitSale: () => Promise<BackendResponseNewSale | undefined>
        clearCart: () => void
    }
}

export const useSaleStore = create<SaleState>((set, get) => ({
    cartItems: [],
    paymentMethod: "Efectivo",
    loading: false,
    total: 0,
    actions: {
        addProduct: (productCode, initialProducts) => {
            const { storeSelected } = useTienda.getState()
            if (!storeSelected) {
                toast.error("Debes elegir una tienda")
                return
            }

            const foundProduct = getProductById(initialProducts, storeSelected.storeID, productCode)
            if (!foundProduct) {
                return // Toast is handled inside getProductById
            }

            const availableStock = storeSelected.isAdminStore ? foundProduct.stockQuantity : foundProduct.quantity
            if (availableStock <= 0) {
                toast("No hay stock disponible para este producto.")
                return
            }

            set((state) => {
                const existingItem = state.cartItems.find((p) => p.storeProductID === foundProduct.storeProductID)
                let newCartItems = []

                if (existingItem) {
                    if (existingItem.quantity + 1 > availableStock) {
                        toast("No se puede agregar más, stock insuficiente.")
                        return { cartItems: state.cartItems }
                    }
                    newCartItems = state.cartItems.map((item) =>
                        item.storeProductID === foundProduct.storeProductID
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                } else {
                    newCartItems = [
                        ...state.cartItems,
                        {
                            storeProductID: foundProduct.storeProductID,
                            name: foundProduct.name,
                            price: Number(foundProduct.priceList),
                            image: foundProduct.image || "",
                            quantity: 1,
                            availableStock: availableStock,
                            size: foundProduct.sizeNumber,
                        },
                    ]
                }
                const newTotal = newCartItems.reduce((acc, p) => acc + p.price * p.quantity, 0)
                return { cartItems: newCartItems, total: newTotal }
            })
        },
        removeProduct: (id) => {
            set((state) => {
                const newCartItems = state.cartItems.filter((item) => item.storeProductID !== id)
                const newTotal = newCartItems.reduce((acc, p) => acc + p.price * p.quantity, 0)
                return { cartItems: newCartItems, total: newTotal }
            })
        },
        updateQuantity: (id, quantity) => {
            set((state) => {
                const newCartItems = state.cartItems.map((item) =>
                    item.storeProductID === id ? { ...item, quantity } : item
                )
                const newTotal = newCartItems.reduce((acc, p) => acc + p.price * p.quantity, 0)
                return { cartItems: newCartItems, total: newTotal }
            })
        },
        setPaymentMethod: (method) => {
            set({ paymentMethod: method })
        },
        submitSale: async () => {
            const { cartItems, paymentMethod } = get()
            const { storeSelected } = useTienda.getState()

            if (cartItems.length === 0) {
                toast.error("Agrega al menos un producto.")
                return
            }
            if (!storeSelected) {
                toast.error("No se pudo cargar la tienda")
                return
            }

            set({ loading: true })
            try {
                const productsForBackend = cartItems.map((item) => ({
                    storeProductID: item.storeProductID,
                    quantitySold: item.quantity,
                }))

                const res = await postSale({
                    storeID: storeSelected.storeID,
                    paymentType: paymentMethod,
                    products: productsForBackend,
                })

                if (res) {
                    get().actions.clearCart()
                    toast.success(res.message)
                    return res
                } else {
                    toast.error("Error al registrar la venta")
                    return
                }
            } catch (err) {
                console.error(err)
                toast.error("Error al enviar la venta")
                return
            } finally {
                set({ loading: false })
            }
        },
        clearCart: () => {
            set({ cartItems: [], total: 0 })
        },
    },
}))

import { create } from "zustand"
import { IProduct } from "@/interfaces/products/IProduct"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"

export interface OrderEditItem {
    product: IProduct
    variation: IVariationWithQuantity
}

interface OrderState {
    orderID: string
    storeID: string
    userID: string
    total: number
    status: string
    type: string
    discount: number | string | null
    dte: string | null
    startQuote: string | null
    endQuote: string | null
    expiration: string | null
    expirationPeriod: string
    createdAt: string
    updatedAt: string
    newProducts: OrderEditItem[]
    actions: {
        updateOrderStringField: (
            field: keyof Omit<OrderState, "actions" | "newProducts">,
            value: string | number | null
        ) => void
        addProduct: (product: IProduct, variation: IVariationWithQuantity) => void
        removeProduct: (sku: string) => void
        updateQuantity: (sku: string, quantity: number) => void
        incrementQuantity: (sku: string) => void
        decrementQuantity: (sku: string) => void
        clearCart: () => void
    }
}

export const useEditOrderStore = create<OrderState>((set, get) => ({
    orderID: "",
    storeID: "",
    userID: "",
    total: 0,
    status: "",
    type: "",
    discount: 0,
    dte: null,
    startQuote: null,
    endQuote: null,
    expiration: null,
    expirationPeriod: "",
    createdAt: "",
    updatedAt: "",
    newProducts: [],
    actions: {
        updateOrderStringField: (field, value) =>
            set((state) => {
                const newState: Partial<OrderState> = {
                    [field]: value,
                    updatedAt: new Date().toISOString(),
                }

                // Si el campo actualizado es 'discount', se recalcula el total
                if (field === "discount") {
                    // Permitimos string o number para discount
                    const newDiscount = value
                    newState.total = calculateTotal(state.newProducts, newDiscount as number | string | null)
                }

                return newState
            }),

        addProduct: (product, variation) =>
            set((state) => {
                const existingItemIndex = state.newProducts.findIndex((item) => item.variation.sku === variation.sku)
                let updatedProducts: OrderEditItem[]

                if (existingItemIndex > -1) {
                    updatedProducts = [...state.newProducts]
                    const currentQuantity = updatedProducts[existingItemIndex].variation.quantity
                    updatedProducts[existingItemIndex].variation.quantity = currentQuantity + variation.quantity
                } else {
                    const newItem: OrderEditItem = { product, variation }
                    updatedProducts = [...state.newProducts, newItem]
                }

                return {
                    newProducts: updatedProducts,
                    total: calculateTotal(updatedProducts, state.discount), // Total calculado
                    updatedAt: new Date().toISOString(),
                }
            }),

        removeProduct: (sku) =>
            set((state) => {
                const updatedProducts = state.newProducts.filter((item) => item.variation.sku !== sku)
                return {
                    newProducts: updatedProducts,
                    total: calculateTotal(updatedProducts, state.discount), // Total calculado
                    updatedAt: new Date().toISOString(),
                }
            }),

        updateQuantity: (sku, quantity) =>
            set((state) => {
                const updatedProducts = state.newProducts.map((item) => {
                    if (item.variation.sku === sku) {
                        const newQuantity = Math.max(0, quantity)
                        return {
                            ...item,
                            variation: {
                                ...item.variation,
                                quantity: newQuantity,
                            },
                        }
                    }
                    return item
                })
                // .filter((item) => item.variation.quantity > 0)

                return {
                    newProducts: updatedProducts,
                    total: calculateTotal(updatedProducts, state.discount), // Total calculado
                    updatedAt: new Date().toISOString(),
                }
            }),

        incrementQuantity: (sku) => {
            const state = get()
            const item = state.newProducts.find((i) => i.variation.sku === sku)
            if (item) {
                // Llama a updateQuantity con la cantidad actual + 1
                state.actions.updateQuantity(sku, item.variation.quantity + 1)
            }
        },

        decrementQuantity: (sku) => {
            const state = get()
            const item = state.newProducts.find((i) => i.variation.sku === sku)
            if (item) {
                // Llama a updateQuantity con la cantidad actual - 1
                state.actions.updateQuantity(sku, item.variation.quantity - 1)
            }
        },

        clearCart: () =>
            set((state) => ({
                newProducts: [],
                total: 0,
                updatedAt: new Date().toISOString(),
            })),
    },
}))

const calculateTotal = (products: OrderEditItem[], discount: number | string | null): number => {
    const subtotal = products.reduce((acc, item) => {
        return acc + Math.round(item.variation.priceCost) * item.variation.quantity
    }, 0)
    const discountValue = Number(discount) || 0
    return Math.max(0, subtotal - discountValue)
}

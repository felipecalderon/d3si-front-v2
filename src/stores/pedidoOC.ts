"use client"
import { IVariationWithQuantity } from "@/interfaces/orders/IOrder"
import { IProduct } from "@/interfaces/products/IProduct"
import { create } from "zustand"

interface NewPedido {
    product: IProduct
    variation: IVariationWithQuantity
}

interface PurchaseOrderState {
    pedido: NewPedido[]
    addOrUpdatePedido: (item: NewPedido) => void
    removeFromPedido: (index: number) => void
    clearPedido: () => void
}

export const usePedidoOC = create<PurchaseOrderState>((set) => ({
    pedido: [],

    addOrUpdatePedido: (item: NewPedido) => {
        set((state) => {
            // Verificar si ya existe el producto+variación
            const existingIndex = state.pedido.findIndex(
                (p) =>
                    p.product.productID === item.product.productID &&
                    p.variation.variationID === item.variation.variationID
            )

            // Si existe, actualiza la cantidad
            if (existingIndex !== -1) {
                const updated = [...state.pedido]
                updated[existingIndex].variation.quantity = item.variation.quantity
                updated[existingIndex].variation.priceCost = item.variation.priceCost
                return { pedido: updated.filter((p) => p.variation.quantity > 0) }
            }

            // Si no existe, lo agrega
            return { pedido: [...state.pedido, item] }
        })
    },

    removeFromPedido: (index: number) => {
        set((state) => ({
            pedido: state.pedido.filter((_, i) => i !== index),
        }))
    },

    clearPedido: () => {
        set({ pedido: [] })
    },
}))

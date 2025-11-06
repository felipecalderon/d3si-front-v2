"use client"

import { useAuth } from "@/stores/user.store"
import { toPrice } from "@/utils/priceFormat"
import { usePedidoOC } from "@/stores/pedidoOC"
import { OrderReviewDrawer } from "./OrderReviewDrawer"

export function PurchaseOrderSummary() {
    const { user } = useAuth()
    const { pedido } = usePedidoOC()

    if (!user) return null

    const neto = pedido.reduce((acc, curr) => {
        return acc + curr.variation.priceCost * curr.variation.quantity
    }, 0)

    const totalProducts = pedido.reduce((acc, curr) => {
        return acc + curr.variation.quantity
    }, 0)

    return (
        <>
            {pedido.length > 0 && <OrderReviewDrawer />}
            <div className="w-full">
                <div className="flex md:justify-around items-center gap-4">
                    {/* Cuadro resumen con fondo verde */}
                    <div className="p-1 rounded-md justify-around align-baseline flex text-sm bg-green-600 text-white shadow-sm w-full ">
                        <div className="flex flex-col-reverse text-center">
                            <span>Total productos:</span>
                            <span className="font-bold">{totalProducts}</span>
                        </div>
                        <div className="flex flex-col-reverse text-center">
                            <span>Neto:</span>
                            <span className="font-bold">${toPrice(neto)}</span>
                        </div>
                        <div className="flex flex-col-reverse text-center">
                            <span>IVA (19%):</span>
                            <span className="font-bold">${toPrice(neto * 0.19)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white pt-2 mt-2">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-yellow-200">${toPrice(Math.round(neto * 1.19))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

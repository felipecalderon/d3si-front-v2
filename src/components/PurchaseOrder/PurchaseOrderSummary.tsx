"use client"

import React, { useMemo } from "react"
import { useAuth } from "@/stores/user.store"
import { toPrice } from "@/utils/priceFormat"
import { usePedidoOC } from "@/stores/pedidoOC"
import { OrderReviewDrawer } from "./OrderReviewDrawer"
import { useTienda } from "@/stores/tienda.store"
import { Role } from "@/lib/userRoles"
import { useTerceroProducts } from "@/stores/terceroCost.store"

export function PurchaseOrderSummary() {
    const { user } = useAuth()
    const { pedido } = usePedidoOC()
    const { storeSelected } = useTienda()
    const { calculateThirdPartyPrice } = useTerceroProducts()

    const { totalProducts, neto } = useMemo(() => {
        const isAdmin = storeSelected?.role === Role.Admin

        const calculatedTotals = pedido.reduce(
            (acc, curr) => {
                // Determinar el precio de costo correcto basado en el rol de la tienda
                const priceCostCorrecto = isAdmin
                    ? curr.variation.priceCost
                    : calculateThirdPartyPrice(curr.variation).brutoCompra / 1.19

                // Aumentar el neto
                acc.neto += priceCostCorrecto * curr.variation.quantity

                // Aumentar la cantidad total de productos
                acc.totalProducts += curr.variation.quantity

                return acc
            },
            { totalProducts: 0, neto: 0 }
        )

        return calculatedTotals
    }, [pedido, storeSelected, calculateThirdPartyPrice])

    // Cálculos derivados simples
    const iva = neto * 0.19
    const totalConIva = Math.round(neto * 1.19)

    if (!user) return null

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
                            {/* Usar 'neto' calculado correctamente */}
                            <span className="font-bold">${toPrice(neto)}</span>
                        </div>
                        <div className="flex flex-col-reverse text-center">
                            <span>IVA (19%):</span>
                            {/* Usar 'iva' calculado correctamente */}
                            <span className="font-bold">${toPrice(iva)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white pt-2 mt-2">
                            <span className="font-bold">Total:</span>
                            {/* Usar 'totalConIva' calculado correctamente */}
                            <span className="font-bold text-yellow-200">${toPrice(totalConIva)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

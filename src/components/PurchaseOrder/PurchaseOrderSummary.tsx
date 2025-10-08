"use client"

import { MotionItem } from "@/components/Animations/motionItem"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { IProduct } from "@/interfaces/products/IProduct"
import { useAuth } from "@/stores/user.store"
import { Role } from "@/lib/userRoles"
import { toPrice } from "@/utils/priceFormat"

interface Props {
    totalProductsInOrder: number
    subtotal: number
    isLoading: boolean
    selectedStoreID: string
    pedido: Record<string, number>
    rawProducts: IProduct[]
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
    router: any
}

export function PurchaseOrderSummary({
    totalProductsInOrder,
    subtotal,
    isLoading,
    selectedStoreID,
    pedido,
    rawProducts,
    setPedido,
    router,
}: Props) {
    const { user } = useAuth()
    if (!user) return null

    const isAdmin = user.role === Role.Admin
    const isSpecialRole = [Role.Vendedor, Role.Consignado, Role.Tercero].includes(user.role)

    const IVA = 1.19

    // === Función para calcular el precio de compra del tercero (con IVA) ===
    const calculateThirdPartyPrice = (
        priceList: number,
        markupTerceroMin = 1.5,
        markupTerceroMax = 3.0,
        step = 0.01
    ) => {
        for (
            let markupFlotante = markupTerceroMin * IVA;
            markupFlotante <= markupTerceroMax * IVA;
            markupFlotante += step
        ) {
            const costoNetoTercero = priceList / markupFlotante
            const brutoCompra = costoNetoTercero * IVA
            const markupTercero = priceList / brutoCompra
            if (markupTercero >= markupTerceroMin && markupTercero <= markupTerceroMax) {
                return { brutoCompra }
            }
        }
        return null
    }

    // === Calcular neto de la orden según el rol ===

    let netoIncluyeIVA = false

    const neto = Object.entries(pedido).reduce((acc, [sku, qty]) => {
        if (!qty) return acc
        const variation = rawProducts.flatMap((p) => p.ProductVariations).find((v) => v.sku === sku)
        if (!variation) return acc

        // ADMIN usa priceCost sin IVA
        if (isAdmin) {
            return acc + (Number(variation.priceCost) || 0) * qty
        }

        // TERCERO usa el brutoCompra (ya incluye iva)
        if (user.role === Role.Tercero) {
            netoIncluyeIVA = true
            const third = calculateThirdPartyPrice(Number(variation.priceList))
            const brutoCompra = third ? third.brutoCompra : (Number(variation.priceCost) || 0) * IVA
            return acc + brutoCompra * qty
        }

        // OTROS ROLES usan priceCost normal
        if (isSpecialRole) {
            return acc + (Number(variation.priceCost) || 0) * qty
        }

        return acc
    }, 0)

    return (
        <div className="w-full">
            <div className="flex md:justify-around items-center gap-4">
                {/* Cuadro resumen con fondo verde */}
                <div className="p-1 rounded-md justify-around align-baseline flex text-sm bg-green-600 text-white shadow-sm w-full ">
                    <div className="flex flex-col-reverse text-center">
                        <span>Total productos:</span>
                        <span className="font-bold">{totalProductsInOrder}</span>
                    </div>
                    <div className="flex flex-col-reverse text-center">
                        <span>Neto:</span>
                        <span className="font-bold">${toPrice(netoIncluyeIVA ? neto / 1.19 : neto)}</span>
                    </div>
                    <div className="flex flex-col-reverse text-center">
                        <span>IVA (19%):</span>
                        <span className="font-bold">${toPrice(netoIncluyeIVA ? neto - neto / 1.19 : neto * 0.19)}</span>
                    </div>
                    <div className="flex justify-between border-t border-white pt-2 mt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-yellow-200">
                            ${toPrice(Math.round(netoIncluyeIVA ? neto : neto * 1.19))}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 items-end">
                    <Button
                        size="sm"
                        className="h-10 px-6"
                        disabled={isLoading || totalProductsInOrder === 0 || !selectedStoreID}
                        onClick={async () => {
                            try {
                                const products = Object.entries(pedido)
                                    .filter(([, qty]) => qty > 0)
                                    .map(([sku, quantityOrdered]) => {
                                        const variation = rawProducts
                                            .flatMap((p) => p.ProductVariations)
                                            .find((v) => v.sku === sku)
                                        return variation
                                            ? { variationID: variation.variationID, quantityOrdered }
                                            : null
                                    })
                                    .filter(Boolean) as { variationID: string; quantityOrdered: number }[]

                                await createOrder({
                                    storeID: selectedStoreID,
                                    userID: user.userID,
                                    products,
                                })

                                setPedido({})
                                toast.success("Orden creada con éxito")
                                if (router.push) router.push("/home/invoices")
                            } catch {
                                toast.error("Error al crear la orden")
                            }
                        }}
                    >
                        <MotionItem delay={0}>Crear orden</MotionItem>
                    </Button>
                </div>
            </div>
        </div>
    )
}

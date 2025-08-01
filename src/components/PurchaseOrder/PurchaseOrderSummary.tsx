"use client"

import { MotionItem } from "@/components/Animations/motionItem"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { IProduct } from "@/interfaces/products/IProduct"

interface Props {
    totalProductsInOrder: number
    subtotal: number
    isLoading: boolean
    selectedStoreID: string
    pedido: Record<string, number>
    rawProducts: IProduct[]
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        <span className="font-bold">${subtotal.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex flex-col-reverse text-center">
                        <span>IVA (19%):</span>
                        <span className="font-bold">${(subtotal * 0.19).toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between border-t border-white pt-2 mt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-yellow-200">${(subtotal * 1.19).toLocaleString("es-CL")}</span>
                    </div>
                </div>
                <div className="flex gap-2 items-end">
                    <div className="text-sm font-semibold">
                        <p>Subtotal: ${subtotal.toLocaleString("es-CL")}</p>
                    </div>
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
                                    userID: "2f13abf6-bbb6-402b-a5b2-e368a89c79e9",
                                    products,
                                })

                                router.refresh()
                                setPedido({})
                                toast.success("Orden creada con éxito")
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

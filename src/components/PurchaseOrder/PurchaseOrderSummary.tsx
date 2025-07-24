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
        <div className="mt-6 space-y-4">
            <div className="flex justify-center lg:justify-end">
                <p className="text-lg font-bold">Subtotal general: ${subtotal.toLocaleString("es-CL")}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="p-4 space-y-2 text-sm border rounded-lg bg-white dark:bg-slate-900">
                    <div className="flex justify-between">
                        <span className="font-medium">Total de productos:</span>
                        <span className="font-bold">{totalProductsInOrder}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Total neto:</span>
                        <span className="font-bold">${subtotal.toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">IVA (19%):</span>
                        <span className="font-bold">${(subtotal * 0.19).toLocaleString("es-CL")}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-green-600">${(subtotal * 1.19).toLocaleString("es-CL")}</span>
                    </div>
                </div>

                <Button
                    size="lg"
                    disabled={isLoading || totalProductsInOrder === 0 || !selectedStoreID}
                    onClick={async () => {
                        try {
                            const products = Object.entries(pedido)
                                .filter(([, qty]) => qty > 0)
                                .map(([sku, quantityOrdered]) => {
                                    const variation = rawProducts
                                        .flatMap((p) => p.ProductVariations)
                                        .find((v) => v.sku === sku)
                                    return variation ? { variationID: variation.variationID, quantityOrdered } : null
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
    )
}

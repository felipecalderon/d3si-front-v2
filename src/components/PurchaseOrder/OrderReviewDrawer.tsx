"use client"

import * as React from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { toPrice } from "@/utils/priceFormat"
import { useMemo, useState } from "react"
import { ScrollArea } from "../ui/scroll-area"
import { createOrder } from "@/actions/orders/purchaseOrder"
import { useAuth } from "@/stores/user.store"
import { useTienda } from "@/stores/tienda.store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { usePedidoOC } from "@/stores/pedidoOC"

interface Item {
    product: IProduct
    variation: IProductVariation
    quantity: number
    price: number
}
export function OrderReviewDrawer({ items }: { items: Item[] }) {
    const [isLoading, setLoading] = useState(false)
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }, [items])
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const router = useRouter()
    const { addOrUpdatePedido } = usePedidoOC()
    const submitOC = async () => {
        try {
            setLoading(true)
            // TODO: NO Mapear, sino pasar todo items (trabajar en back)
            await createOrder({
                storeID: storeSelected?.storeID || "",
                userID: user?.userID || "",
                products: items.map((p) => ({
                    variationID: p.variation.variationID,
                    quantityOrdered: p.quantity,
                })),
            })

            toast.success("Orden creada con éxito")
            if (router.push) router.push("/home/invoices")
        } catch {
            toast.error("Error al crear la orden")
        } finally {
            setLoading(false)
        }
    }
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="fixed bottom-16 left-[50%] z-50">
                    <ChevronUp className="w-5 h-5 animate-bounce mx-auto" />
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Revisar mi orden
                    </Button>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-3xl">
                    <DrawerHeader>
                        <DrawerTitle>Resumen de tu orden</DrawerTitle>
                        <DrawerDescription>Estos son los productos que serán agregados en la OC.</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Talla</TableHead>
                                    <TableHead className="text-right">Cantidad</TableHead>
                                    <TableHead className="text-right">Precio</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.variation.sku}>
                                        <TableCell className="font-medium">{item.product.name}</TableCell>
                                        <TableCell>{item.variation.sizeNumber}</TableCell>
                                        <TableCell className="text-right w-10">
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const numberValue = Number(e.target.value)
                                                    addOrUpdatePedido({
                                                        ...item,
                                                        quantity: numberValue,
                                                    })
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">{toPrice(item.price)}</TableCell>
                                        <TableCell className="text-right">
                                            {toPrice(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={4} className="text-right font-bold">
                                        Total:
                                    </TableCell>
                                    <TableCell className="text-right font-bold">{toPrice(total)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <DrawerFooter className="flex flex-row gap-2 justify-center">
                        <DrawerClose asChild>
                            <Button variant="outline">Minimizar</Button>
                        </DrawerClose>
                        <Button
                            className="bg-blue-600 hover:bg-blue-500"
                            disabled={isLoading || items.length === 0}
                            onClick={submitOC}
                        >
                            {isLoading ? "Creando OC..." : "Crear orden de compra"}
                        </Button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

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

export function OrderReviewDrawer() {
    const [isLoading, setLoading] = useState(false)
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const router = useRouter()
    const { addOrUpdatePedido, pedido } = usePedidoOC()
    const total = useMemo(() => {
        return pedido.reduce((sum, item) => sum + item.variation.priceCost * item.variation.quantity, 0)
    }, [pedido])
    const submitOC = async () => {
        try {
            setLoading(true)
            await createOrder({
                storeID: storeSelected?.storeID || "",
                userID: user?.userID || "",
                newProducts: pedido.map((p) => p.variation), // Variaciones con prop.quantity (extenido)
                discount: 0, // Aún no se aplica en backend
                dte: "", // Numero de factura, debe ser string
                startQuote: null, // Cuota actual del pago: numero entero menor o igual a endQuote
                endQuote: null, // Cuota final del pago (cantidad de cuotas totales)
                expiration: null, // Date (string) o Null: Fecha de vencimiento
                expirationPeriod: "MENSUAL",
                status: "Pendiente",
                type: "OCD",
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
                                {pedido.map((item) => {
                                    return (
                                        <TableRow key={item.variation.sku}>
                                            <TableCell className="font-medium">{item.product.name}</TableCell>
                                            <TableCell>{item.variation.sizeNumber}</TableCell>
                                            <TableCell className="text-right w-10">
                                                <Input
                                                    type="number"
                                                    value={item.variation.quantity}
                                                    onChange={(e) => {
                                                        addOrUpdatePedido({
                                                            ...item,
                                                            product: item.product,
                                                            variation: {
                                                                ...item.variation,
                                                                quantity: Number(e.target.value),
                                                            },
                                                        })
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {toPrice(item.variation.priceCost)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {toPrice(item.variation.priceCost * item.variation.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
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
                            disabled={isLoading || pedido.length === 0}
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

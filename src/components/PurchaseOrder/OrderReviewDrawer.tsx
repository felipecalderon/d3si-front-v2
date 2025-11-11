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
import { Role } from "@/lib/userRoles"
import { useTerceroProducts } from "@/stores/terceroCost.store"

export function OrderReviewDrawer() {
    const [isLoading, setLoading] = useState(false)
    const { user } = useAuth()
    const { storeSelected } = useTienda()
    const router = useRouter()
    const { addOrUpdatePedido, pedido } = usePedidoOC()
    const { calculateThirdPartyPrice } = useTerceroProducts()

    const pedidoConPrecioCalculado = useMemo(() => {
        const isAdmin = storeSelected?.role === Role.Admin

        return pedido.map((item) => {
            const priceCostTer = isAdmin
                ? item.variation.priceCost // Precio de costo normal para TIENDA admin
                : calculateThirdPartyPrice(item.variation).brutoCompra // Precio de tercero para otros roles de TIENDAS

            const subtotal = priceCostTer * item.variation.quantity

            return {
                ...item,
                priceCostTer, // almacenado para usarlo en la tabla y en el total
                subtotal, // Precalculo del subtotal
            }
        })
    }, [pedido, storeSelected, calculateThirdPartyPrice])

    const total = useMemo(() => {
        return pedidoConPrecioCalculado.reduce((sum, item) => sum + item.subtotal, 0)
    }, [pedidoConPrecioCalculado])

    const submitOC = async () => {
        try {
            setLoading(true)
            const newProductsTercero = pedidoConPrecioCalculado.map((item) => ({
                ...item.variation,
                priceCost: item.priceCostTer,
            }))

            await createOrder({
                storeID: storeSelected?.storeID || "",
                userID: user?.userID || "",
                newProducts: newProductsTercero,
                discount: 0,
                dte: "",
                startQuote: null,
                endQuote: null,
                expiration: null,
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
                                {pedidoConPrecioCalculado.map((item) => {
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
                                            <TableCell className="text-right">{toPrice(item.priceCostTer)}</TableCell>
                                            <TableCell className="text-right">{toPrice(item.subtotal)}</TableCell>
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

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toPrice } from "@/utils/priceFormat"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface OrderReviewModalProps {
    isOpen: boolean
    onClose: () => void
    items: Array<{
        product: IProduct
        variation: IProductVariation
        quantity: number
        price: number
    }>
}

export function OrderReviewModal({ isOpen, onClose, items }: OrderReviewModalProps) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="ml-2 text-xl font-bold">Resumen de tu orden</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
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
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{toPrice(item.price)}</TableCell>
                                    <TableCell className="text-right">{toPrice(item.price * item.quantity)}</TableCell>
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
                </div>
            </DialogContent>
        </Dialog>
    )
}

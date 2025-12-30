import { useSaleStore } from "@/stores/sale.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Input } from "../ui/input"
import { toPrice } from "@/utils/priceFormat"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export const CartTable = () => {
    const { cartItems, actions } = useSaleStore()
    const { removeProduct, updateQuantity } = actions

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">El carrito está vacío</p>
                <p>Agrega productos para comenzar una venta.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto mb-6 rounded-lg border ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left">Producto</TableHead>
                        <TableHead className="text-center">Cantidad</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cartItems.map((item) => (
                        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50" key={item.variation.sku}>
                            <TableCell className="flex items-center gap-3 p-2">
                                {item.product.image && (
                                    <Image
                                        width={100}
                                        height={100}
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                )}
                                <span>
                                    {item.product.name} - {item.variation.sizeNumber}
                                </span>
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <div>
                                    <Input
                                        title="Cantidad"
                                        type="number"
                                        min={0}
                                        max={item.storeProduct.quantity}
                                        value={item.variation.quantity}
                                        onWheel={(e) => {
                                            e.currentTarget.blur()
                                        }}
                                        onChange={(e) => {
                                            if (item.storeProduct.quantity === 0) {
                                                return toast.error("Stock agotado, solicite a central")
                                            }
                                            updateQuantity(item.variation.sku, Number(e.target.value))
                                        }}
                                        className="w-16 text-center rounded border border-gray-300 p-1"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">Stock: {item.storeProduct.quantity}</p>
                                </div>
                            </TableCell>

                            <TableCell className="p-2 text-center">${toPrice(item.variation.priceList)}</TableCell>
                            <TableCell className="p-2 text-center">
                                ${toPrice(item.variation.priceList * item.variation.quantity)}
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <button
                                    title="Eliminar"
                                    onClick={() => removeProduct(item.variation.sku)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

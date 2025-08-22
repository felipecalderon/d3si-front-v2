import { useSaleStore } from "@/stores/sale.store"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Input } from "../ui/input"
import { toPrice } from "@/utils/priceFormat"
import { Trash2 } from "lucide-react"

export const CartTable = () => {
    const { cartItems, actions } = useSaleStore()
    const { removeProduct, updateQuantity } = actions

    const handleQuantityChange = (id: string, newQuantity: number) => {
        const item = cartItems.find((i) => i.storeProductID === id)
        if (item && newQuantity > item.availableStock) {
            return // Or show a toast message
        }
        if (newQuantity <= 0) {
            return removeProduct(id)
        }
        updateQuantity(id, newQuantity)
    }

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
                    {cartItems.map((producto) => (
                        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50" key={producto.storeProductID}>
                            <TableCell className="flex items-center gap-3 p-2">
                                {producto.image && (
                                    <Image
                                        width={100}
                                        height={100}
                                        src={producto.image}
                                        alt={producto.name}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                )}
                                <span>
                                    {producto.name} - {producto.size}
                                </span>
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <div>
                                    <Input
                                        title="Cantidad"
                                        type="number"
                                        min={0}
                                        max={producto.availableStock}
                                        value={producto.quantity}
                                        onWheel={(e) => {
                                            e.currentTarget.blur()
                                        }}
                                        onChange={(e) =>
                                            handleQuantityChange(producto.storeProductID, Number(e.target.value))
                                        }
                                        className="w-16 text-center rounded border border-gray-300 p-1"
                                    />

                                    <p className="text-xs text-gray-500 mt-1">Stock: {producto.availableStock}</p>
                                </div>
                            </TableCell>

                            <TableCell className="p-2 text-center">${toPrice(producto.price)}</TableCell>
                            <TableCell className="p-2 text-center">
                                ${toPrice(producto.price * producto.quantity)}
                            </TableCell>
                            <TableCell className="p-2 text-center">
                                <button
                                    title="Eliminar"
                                    onClick={() => removeProduct(producto.storeProductID)}
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

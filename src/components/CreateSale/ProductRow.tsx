import { FC } from "react"
import { Trash2 } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"

interface Producto {
    nombre: string
    precio: number
    cantidad: number
    storeProductID: string
}

interface ProductRowProps {
    producto: Producto
    onDelete: (id: string) => void
}

const ProductRow: FC<ProductRowProps> = ({ producto, onDelete }) => {
    const { nombre, precio, cantidad, storeProductID } = producto
    const subtotal = (precio * cantidad).toFixed(2)

    return (
        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50">
            <TableCell className="p-2">{nombre}</TableCell>
            <TableCell className="p-2 text-center">{cantidad}</TableCell>
            <TableCell className="p-2 text-center">${precio.toFixed(2)}</TableCell>
            <TableCell className="p-2 text-center">${subtotal}</TableCell>
            <TableCell className="p-2 text-center">
                <button
                title="delete"
                onClick={() => onDelete(storeProductID)}
                className="text-red-600 hover:text-red-800"
                >
                <Trash2 size={18} />
                </button>
            </TableCell>
        </TableRow>
    )
}

export default ProductRow

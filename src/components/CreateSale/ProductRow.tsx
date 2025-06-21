import { FC } from "react"
import { Trash2 } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"

interface Producto {
    nombre: string
    precio: number
    cantidad: number
    storeProductID: string
    image: string
}

interface ProductRowProps {
    producto: Producto
    onDelete: (id: string) => void
    onCantidadChange: (id: string, cantidad: number) => void  // nuevo prop
}

const ProductRow: FC<ProductRowProps> = ({ producto, onDelete, onCantidadChange }) => {
    const { nombre, precio, cantidad, storeProductID, image } = producto
    const subtotal = (precio * cantidad).toFixed(2)

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newCantidad = parseInt(e.target.value)
        if (isNaN(newCantidad) || newCantidad < 1) newCantidad = 1
        onCantidadChange(storeProductID, newCantidad)
    }

    return (
        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50">
            <TableCell className="flex items-center gap-3 p-2">
                <img src={image} alt={nombre} className="w-10 h-10 object-cover rounded" />
                <span>{nombre}</span>
            </TableCell>
            <TableCell className="p-2 text-center">
                <input title="candidad"
                    type="number"
                    min={1}
                    value={cantidad}
                    onChange={handleCantidadChange}
                    className="w-16 text-center rounded border border-gray-300 p-1"
                />
            </TableCell>
            <TableCell className="p-2 text-center">${precio.toFixed(2)}</TableCell>
            <TableCell className="p-2 text-center">${subtotal}</TableCell>
            <TableCell className="p-2 text-center">
                <button
                    title="Eliminar"
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

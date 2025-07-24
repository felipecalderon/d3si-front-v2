import { FC } from "react"
import { Trash2 } from "lucide-react"
import { TableRow, TableCell } from "@/components/ui/table"

interface Producto {
    nombre: string
    precio: number
    cantidad: number
    storeProductID: string
    image: string
    stockDisponible: number
}

interface ProductRowProps {
    producto: Producto
    onDelete: (id: string) => void
    onCantidadChange: (id: string, cantidad: number) => void
}

const ProductRow: FC<ProductRowProps> = ({ producto, onDelete, onCantidadChange }) => {
    const { nombre, precio, cantidad, storeProductID, image } = producto
    const subtotal = (precio * cantidad).toFixed(2)

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newCantidad = parseInt(e.target.value)
        if (isNaN(newCantidad) || newCantidad < 1) newCantidad = 1
        if (newCantidad > producto.stockDisponible) {
            newCantidad = producto.stockDisponible
        }
        onCantidadChange(storeProductID, newCantidad)
    }

    return (
        <TableRow className="hover:bg-muted/50 dark:hover:bg-gray-700/50">
            <TableCell className="flex items-center gap-3 p-2">
                <img src={image} alt={nombre} className="w-10 h-10 object-cover rounded" />
                <span>{nombre}</span>
            </TableCell>
            <TableCell className="p-2 text-center">
                <div>
                    <input
                        title="Cantidad"
                        type="number"
                        min={1}
                        max={producto.stockDisponible}
                        value={cantidad}
                        onChange={handleCantidadChange}
                        className="w-16 text-center rounded border border-gray-300 p-1"
                    />

                    <p className="text-xs text-gray-500 mt-1">Stock: {producto.stockDisponible}</p>
                </div>
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

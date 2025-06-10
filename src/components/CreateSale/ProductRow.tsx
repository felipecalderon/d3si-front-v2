import { FC } from "react"
import { Trash2 } from "lucide-react"

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
        <tr className="border-b hover:bg-gray-50">
            <td className="p-2">{nombre}</td>
            <td className="p-2 text-center">{cantidad}</td>
            <td className="p-2 text-center">${precio.toFixed(2)}</td>
            <td className="p-2 text-center">${subtotal}</td>
            <td className="p-2 text-center">
                <button
                    title="delete"
                    onClick={() => onDelete(storeProductID)}
                    className="text-red-600 hover:text-red-800"
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    )
}

export default ProductRow

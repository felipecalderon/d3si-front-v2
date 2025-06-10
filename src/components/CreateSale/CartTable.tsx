//CartTable.tsx	Tabla de productos agregados al pedido

import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import ProductRow from "@/components/CreateSale/ProductRow"

interface CartTableProps {
    productos: IProductoEnVenta[]
    onDelete: (id: string) => void
}

export const CartTable = ({ productos, onDelete }: CartTableProps) => (
    <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-center">Cantidad</th>
                    <th className="p-3 text-right">Precio</th>
                    <th className="p-3 text-right">Subtotal</th>
                    <th className="p-3 text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
                {productos.map((producto) => (
                    <ProductRow key={producto.storeProductID} producto={producto} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    </div>
)

import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import ProductRow from "@/components/CreateSale/ProductRow"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CartTableProps {
    productos: IProductoEnVenta[]
    onDelete: (id: string) => void
    onCantidadChange: (id: string, cantidad: number) => void
}

export const CartTable = ({ productos, onDelete, onCantidadChange }: CartTableProps) => (
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
                {productos.map((producto, index) => (
                    <ProductRow
                        key={`${producto.storeProductID}-${index}`}
                        producto={producto}
                        onDelete={onDelete}
                        onCantidadChange={onCantidadChange}
                    />
                ))}
            </TableBody>
        </Table>
    </div>
)

//CartTable.tsx	Tabla de productos agregados al pedido

import { IProductoEnVenta } from "@/interfaces/products/IProductoEnVenta"
import ProductRow from "@/components/CreateSale/ProductRow"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

interface CartTableProps {
    productos: IProductoEnVenta[]
    onDelete: (id: string) => void
}

export const CartTable = ({ productos, onDelete }: CartTableProps) => (
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
        {productos.map((producto) => (
          <ProductRow key={producto.storeProductID} producto={producto} onDelete={onDelete} />
        ))}
      </TableBody>
    </Table>
  </div>
)

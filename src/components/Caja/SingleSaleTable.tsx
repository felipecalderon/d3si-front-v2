import { toPrice } from "@/utils/priceFormat"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ISaleProduct } from "@/interfaces/sales/ISale"

export default function SingleSaleTable({ products }: { products: ISaleProduct[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-slate-800">
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Total Neto</TableHead>
                    <TableHead>Total con IVA</TableHead>
                    <TableHead align="center">Cantidad</TableHead>
                    <TableHead>Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((p, i) => {
                    return (
                        <TableRow
                            key={p.unitPrice}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{p.StoreProduct.ProductVariation.Product.name}</TableCell>
                            <TableCell>{toPrice(p.unitPrice / 1.19)}</TableCell>
                            <TableCell>{toPrice(p.unitPrice)}</TableCell>
                            <TableCell align="center">{p.quantitySold}</TableCell>
                            <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                {toPrice(p.subtotal)}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

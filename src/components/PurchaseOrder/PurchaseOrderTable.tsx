"use client"

import { PurchaseOrderTableBody } from "./PurchaseOrderTableBody"
import { IProduct } from "@/interfaces/products/IProduct"

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentItems: Array<{ product: IProduct; variation: any; isFirst: boolean }>
    pedido: Record<string, number>
    adminStoreIDs: string[]
    setPedido: React.Dispatch<React.SetStateAction<Record<string, number>>>
}

export function PurchaseOrderTable({ currentItems, pedido, adminStoreIDs, setPedido }: Props) {
    return (
        <div className="flex-1 dark:bg-slate-900 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto h-full">
                <table className="w-full table-fixed">
                    <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                        <tr>
                            {["Producto", "SKU", "TALLA", "COSTO", "CENTRAL", "TIENDA", "PEDIDO", "SUBTOTAL"].map(
                                (label) => (
                                    <th key={label} className="whitespace-nowrap text-center font-semibold">
                                        {label}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <PurchaseOrderTableBody
                        items={currentItems}
                        pedido={pedido}
                        adminStoreIDs={adminStoreIDs}
                        setPedido={setPedido}
                    />
                </table>
            </div>
        </div>
    )
}

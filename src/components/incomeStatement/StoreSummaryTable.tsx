"use client"

import { Card } from "@/components/ui/card"

const stores = [
    { tienda: "Sucursal Centro", beneficio: 120000, margen: 25 },
    { tienda: "Sucursal Norte", beneficio: 95000, margen: 22 },
    { tienda: "Sucursal Sur", beneficio: 78000, margen: 18 },
]

export default function StoreSummaryTable() {
    return (
        <Card className="p-4 mb-4">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-white">Resumen por tienda</h3>
            <div className="grid grid-cols-3 text-sm font-semibold text-gray-600 dark:text-gray-300 border-b pb-1 mb-2">
                <span>Tienda</span>
                <span className="text-right">Beneficio</span>
                <span className="text-right">% Margen</span>
            </div>
            {stores.map((store) => (
                <div key={store.tienda} className="grid grid-cols-3 text-sm py-1 border-b last:border-none">
                    <span>{store.tienda}</span>
                    <span className="text-right text-green-700 dark:text-green-300">
                        ${store.beneficio.toLocaleString()}
                    </span>
                    <span className="text-right text-blue-700 dark:text-blue-300">{store.margen}%</span>
                </div>
            ))}
        </Card>
    )
}

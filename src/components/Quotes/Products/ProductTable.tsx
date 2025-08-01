"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2Icon, DollarSignIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface ProductTableProps {
    selectedProducts: {
        product: IProduct
        variation?: IProductVariation
        quantity: number
        availableModels: string
        unitPrice: number
        isCustomProduct?: boolean
    }[]
    onQuantityChange: (productId: string, quantity: number) => void
    onModelsChange: (productId: string, models: string) => void
    onUnitPriceChange: (productId: string, price: number) => void
    onRemoveProduct: (productId: string) => void
}

export function ProductTable({
    selectedProducts,
    onQuantityChange,
    onModelsChange,
    onUnitPriceChange,
    onRemoveProduct,
}: ProductTableProps) {
    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">Detalle de Cotización</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-700">
                                <TableHead className="font-semibold">Item</TableHead>
                                <TableHead className="font-semibold">Modelos Disponibles</TableHead>
                                <TableHead className="font-semibold">Cantidad</TableHead>
                                <TableHead className="font-semibold">Precio Neto Unitario</TableHead>
                                <TableHead className="font-semibold">Subtotal Neto</TableHead>
                                <TableHead className="font-semibold"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedProducts.map((sp) => (
                                <TableRow
                                    key={sp.product.productID}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <TableCell className="font-medium">{sp.product.name}</TableCell>
                                    <TableCell>
                                        <Input
                                            placeholder="Ej: XS, S, M, L, XL o 32, 36, 38, 40"
                                            value={sp.availableModels}
                                            onChange={(e) => onModelsChange(sp.product.productID, e.target.value)}
                                            className="w-40 bg-white dark:bg-slate-700 text-sm"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={sp.quantity}
                                            onChange={(e) =>
                                                onQuantityChange(sp.product.productID, Number(e.target.value))
                                            }
                                            className="w-20 bg-white dark:bg-slate-700"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <DollarSignIcon className="h-4 w-4 text-green-600" />
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={sp.unitPrice}
                                                onChange={(e) =>
                                                    onUnitPriceChange(sp.product.productID, Number(e.target.value))
                                                }
                                                className="w-24 bg-white dark:bg-slate-700 text-sm"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold text-green-600">
                                        ${(sp.quantity * sp.unitPrice).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemoveProduct(sp.product.productID)}
                                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                        >
                                            <Trash2Icon size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2Icon, DollarSignIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface ProductTableProps {
    selectedProducts: {
        product: IProduct
        variation: IProductVariation
        quantity: number
    }[]
    onQuantityChange: (variationId: string, quantity: number) => void
    onRemoveProduct: (variationId: string) => void
}

export function ProductTable({ selectedProducts, onQuantityChange, onRemoveProduct }: ProductTableProps) {
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
                                <TableHead className="font-semibold">Talla</TableHead>
                                <TableHead className="font-semibold">Cantidad</TableHead>
                                <TableHead className="font-semibold">Precio Neto Unitario</TableHead>
                                <TableHead className="font-semibold">Subtotal Neto</TableHead>
                                <TableHead className="font-semibold"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedProducts.map((sp) => (
                                <TableRow
                                    key={sp.variation.variationID}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <TableCell className="font-medium">{sp.product.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{sp.variation.sizeNumber || "N/A"}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={sp.quantity}
                                            onChange={(e) =>
                                                onQuantityChange(sp.variation.variationID, Number(e.target.value))
                                            }
                                            className="w-20 bg-white dark:bg-slate-700"
                                        />
                                    </TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        <DollarSignIcon className="h-4 w-4 text-green-600" />
                                        {sp.variation.priceList}
                                    </TableCell>
                                    <TableCell className="font-semibold text-green-600">
                                        ${(sp.quantity * Number(sp.variation.priceList || 0)).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemoveProduct(sp.variation.variationID)}
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
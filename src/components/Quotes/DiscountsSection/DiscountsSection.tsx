"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PercentIcon, Trash2Icon } from "lucide-react"

interface Discount {
    id: number
    type: "Descuento" | "Cargo"
    description: string
    percentage: number
}

interface DiscountsSectionProps {
    discounts: Discount[]
    montoNeto: number
    onDiscountsChange: (discounts: Discount[]) => void
}

export function DiscountsSection({ discounts, montoNeto, onDiscountsChange }: DiscountsSectionProps) {
    const [discountType, setDiscountType] = useState<"Descuento" | "Cargo">("Descuento")
    const [discountDescription, setDiscountDescription] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState("")

    const handleAddDiscount = () => {
        if (!discountDescription || !discountPercentage) return
        const newDiscounts = [
            ...discounts,
            {
                id: Date.now(),
                type: discountType,
                description: discountDescription,
                percentage: Number(discountPercentage),
            },
        ]
        onDiscountsChange(newDiscounts)
        setDiscountDescription("")
        setDiscountPercentage("")
    }

    const handleRemoveDiscount = (id: number) => {
        const newDiscounts = discounts.filter((d) => d.id !== id)
        onDiscountsChange(newDiscounts)
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <PercentIcon className="h-5 w-5 text-orange-600" />
                    Descuentos / Cargos
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Descripción
                        </label>
                        <Input
                            placeholder="Ej: descuento por volumen"
                            value={discountDescription}
                            onChange={(e) => setDiscountDescription(e.target.value)}
                            className="bg-white dark:bg-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Tipo</label>
                        <Select
                            value={discountType}
                            onValueChange={(value) =>
                                setDiscountType(value === "Descuento" ? "Descuento" : "Cargo")
                            }
                        >
                            <SelectTrigger className="bg-white dark:bg-slate-700">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Descuento">Descuento</SelectItem>
                                <SelectItem value="Cargo">Cargo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Porcentaje
                        </label>
                        <div className="flex items-center gap-1">
                            <Input
                                placeholder="0-100"
                                className="bg-white dark:bg-slate-700"
                                type="number"
                                min={0}
                                max={100}
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                            />
                            <PercentIcon size={16} className="text-muted-foreground" />
                        </div>
                    </div>
                    <Button onClick={handleAddDiscount} className="bg-green-600 hover:bg-green-700 text-white">
                        Agregar
                    </Button>
                </div>

                {discounts.length > 0 && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-700">
                                    <TableHead className="font-semibold">Tipo</TableHead>
                                    <TableHead className="font-semibold">Descripción</TableHead>
                                    <TableHead className="font-semibold">Porcentaje</TableHead>
                                    <TableHead className="font-semibold"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {discounts.map((d) => (
                                    <TableRow key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <TableCell>
                                            <Badge
                                                variant={d.type === "Descuento" ? "default" : "destructive"}
                                                className={
                                                    d.type === "Descuento"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {d.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{d.description}</TableCell>
                                        <TableCell className="font-semibold">{d.percentage}%</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveDiscount(d.id)}
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
                )}
            </CardContent>
        </Card>
    )
}
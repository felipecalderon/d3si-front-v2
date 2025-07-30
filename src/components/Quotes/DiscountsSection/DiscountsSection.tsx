"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PercentIcon, DollarSignIcon, Trash2Icon, AlertTriangleIcon } from "lucide-react"

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
    const [discountValue, setDiscountValue] = useState("")
    const [showNetAmountWarning, setShowNetAmountWarning] = useState(false)

    // Calcular el total de descuentos actuales
    const totalDiscountPercentage = discounts
        .filter((d) => d.type === "Descuento")
        .reduce((acc, d) => acc + d.percentage, 0)

    const handleAddDiscount = () => {
        if (!discountDescription || !discountValue) return

        const numericValue = Number(discountValue)

        // Si es descuento, verificar que no exceda el monto neto
        if (discountType === "Descuento") {
            const newTotalDiscountPercentage = totalDiscountPercentage + numericValue
            if (newTotalDiscountPercentage >= 100) {
                setShowNetAmountWarning(true)
                setTimeout(() => setShowNetAmountWarning(false), 3000)
                return
            }
        }

        const newDiscounts = [
            ...discounts,
            {
                id: Date.now(),
                type: discountType,
                description: discountDescription,
                percentage: numericValue,
            },
        ]
        onDiscountsChange(newDiscounts)
        setDiscountDescription("")
        setDiscountValue("")
        setShowNetAmountWarning(false)
    }

    const handleRemoveDiscount = (id: number) => {
        const newDiscounts = discounts.filter((d) => d.id !== id)
        onDiscountsChange(newDiscounts)
        setShowNetAmountWarning(false)
    }

    const handleTypeChange = (value: string) => {
        setDiscountType(value as "Descuento" | "Cargo")
        setDiscountValue("") // Reset value when changing type
        setShowNetAmountWarning(false)
    }

    const isCargoType = discountType === "Cargo"
    const valueLabel = isCargoType ? "Costo" : "Porcentaje"
    const valuePlaceholder = isCargoType ? "Ej: 5000" : "0-100"
    const valueIcon = isCargoType ? DollarSignIcon : PercentIcon

    // Función para calcular el porcentaje de un cargo respecto al monto neto
    const calculateCargoPercentage = (cargoAmount: number) => {
        if (montoNeto <= 0) return 0
        return Math.round((cargoAmount / montoNeto) * 100 * 100) / 100 // Redondear a 2 decimales
    }

    // Función para calcular el monto de un descuento
    const calculateDiscountAmount = (discountPercentage: number) => {
        return Math.round(montoNeto * (discountPercentage / 100) * 100) / 100 // Redondear a 2 decimales
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
                {/* Aviso cuando el descuento excede el monto neto */}
                {showNetAmountWarning && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
                        <AlertTriangleIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">El descuento excede el monto neto</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Descripción</label>
                        <Input
                            placeholder="Ej: descuento por volumen"
                            value={discountDescription}
                            onChange={(e) => setDiscountDescription(e.target.value)}
                            className="bg-white dark:bg-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Tipo</label>
                        <Select value={discountType} onValueChange={handleTypeChange}>
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
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{valueLabel}</label>
                        <div className="flex items-center gap-1">
                            <Input
                                placeholder={valuePlaceholder}
                                className="bg-white dark:bg-slate-700"
                                type="number"
                                min={0}
                                max={isCargoType ? undefined : 100}
                                value={discountValue}
                                onChange={(e) => setDiscountValue(e.target.value)}
                            />
                            {React.createElement(valueIcon, {
                                size: 16,
                                className: "text-muted-foreground",
                            })}
                        </div>
                    </div>
                    <Button
                        onClick={handleAddDiscount}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={montoNeto <= 0 && discountType === "Descuento"}
                    >
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
                                    <TableHead className="font-semibold">Monto</TableHead>
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
                                        <TableCell className="font-semibold">
                                            {d.type === "Descuento"
                                                ? `${d.percentage}%`
                                                : `${calculateCargoPercentage(d.percentage)}%`}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {d.type === "Descuento"
                                                ? `$${calculateDiscountAmount(d.percentage).toLocaleString("es-CL")}`
                                                : `$${d.percentage.toLocaleString("es-CL")}`}
                                        </TableCell>
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
"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { UploadIcon, PlusIcon, PercentIcon, Trash2Icon } from "lucide-react"
import { format } from "date-fns"

export default function QuotesPage() {
    const [discounts, setDiscounts] = useState<
        { id: number; type: "Descuento" | "Cargo"; description: string; percentage: number }[]
    >([])

    const [vencimientoCantidad, setVencimientoCantidad] = useState("30")
    const [vencimientoPeriodo, setVencimientoPeriodo] = useState<"dias" | "semanas" | "meses">("dias")

    const [discountType, setDiscountType] = useState<"Descuento" | "Cargo">("Descuento")
    const [discountDescription, setDiscountDescription] = useState("")
    const [discountPercentage, setDiscountPercentage] = useState("")

    const handleAddDiscount = () => {
        if (!discountDescription || !discountPercentage) return
        setDiscounts([
            ...discounts,
            {
                id: Date.now(),
                type: discountType,
                description: discountDescription,
                percentage: Number(discountPercentage),
            },
        ])
        setDiscountDescription("")
        setDiscountPercentage("")
    }

    const handleRemoveDiscount = (id: number) => {
        setDiscounts(discounts.filter((d) => d.id !== id))
    }

    const periodoLabel = {
        dias: Number(vencimientoCantidad) === 1 ? "día" : "días",
        semanas: Number(vencimientoCantidad) === 1 ? "semana" : "semanas",
        meses: Number(vencimientoCantidad) === 1 ? "mes" : "meses",
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mr-3">
                        VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS
                    </h2>
                    <p>ALMARGO 593, PURÉN, LA ARAUCANÍA</p>
                    <p>alejandro.contreras@d3si.cl</p>
                </div>
                <div className="w-full max-w-xs">
                    <div className="border border-[#002147] rounded-md p-4 space-y-1">
                        <p>
                            <strong>R.U.T.:</strong> 77.058.146-K
                        </p>
                        <p>
                            <strong>COTIZACIÓN ELECTRÓNICA</strong>
                        </p>
                        <p>
                            <strong>N° 5100</strong>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <div>
                    <p>
                        <span className="font-semibold">Emisión:</span> {format(new Date(), "dd/MM/yyyy")}
                    </p>
                    <p>
                        <span className="font-semibold">Vencimiento:</span> {vencimientoCantidad}{" "}
                        {periodoLabel[vencimientoPeriodo]}
                    </p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Vencimiento</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Cantidad"
                                className="w-20"
                                type="number"
                                min={1}
                                value={vencimientoCantidad}
                                onChange={(e) => setVencimientoCantidad(e.target.value)}
                            />
                            <Select
                                value={vencimientoPeriodo}
                                onValueChange={(value) => setVencimientoPeriodo(value as "dias" | "semanas" | "meses")}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Periodo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dias">Días</SelectItem>
                                    <SelectItem value="semanas">Semanas</SelectItem>
                                    <SelectItem value="meses">Meses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Datos del cliente */}
            <Card>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <Input placeholder="RUT" />
                    <Input placeholder="Razón Social" />
                    <Input placeholder="Giro" />
                    <Input placeholder="Comuna" />
                    <Input placeholder="Email" />
                </CardContent>
            </Card>

            {/* Subir imagen */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Subir Imagen</label>
                <Button variant="outline" className="flex gap-2">
                    <UploadIcon size={16} />
                    Elegir Archivo
                </Button>
            </div>

            {/* Ingresar producto */}
            <div className="w-full border rounded-md p-4 flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <PlusIcon size={16} /> Ingrese producto
                </span>
                <Button variant="outline">Seleccionar Producto</Button>
            </div>

            {/* Detalle de cotización */}
            <div className="space-y-2">
                <h3 className="font-semibold">Detalle de Cotización</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Modelos Disponibles</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio Neto Unitario</TableHead>
                            <TableHead>Subtotal Neto</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>{/* Aquí se renderizarán los productos seleccionados */}</TableBody>
                </Table>
            </div>

            {/* Descuentos / Cargos */}
            <div className="space-y-4">
                <h3 className="font-semibold">Descuentos / Cargos</h3>
                <div className="flex flex-wrap gap-2">
                    <Input
                        placeholder="Descripción Ej: descuento por volumen"
                        className="flex-1 min-w-[180px]"
                        value={discountDescription}
                        onChange={(e) => setDiscountDescription(e.target.value)}
                    />
                    <Select
                        value={discountType}
                        onValueChange={(value) => setDiscountType(value === "Descuento" ? "Descuento" : "Cargo")}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Descuento/Cargo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Descuento">Descuento</SelectItem>
                            <SelectItem value="Cargo">Cargo</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center gap-1">
                        <Input
                            placeholder="0-100"
                            className="w-[80px]"
                            type="number"
                            min={0}
                            max={100}
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                        />
                        <PercentIcon size={16} className="text-muted-foreground" />
                    </div>
                    <Button onClick={handleAddDiscount}>Agregar</Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Porcentaje</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discounts.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.type}</TableCell>
                                <TableCell>{d.description}</TableCell>
                                <TableCell>{d.percentage}%</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDiscount(d.id)}>
                                        <Trash2Icon size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Otras observaciones */}
            <div>
                <label className="text-sm font-medium">Otras Observaciones</label>
                <Textarea placeholder="Observaciones adicionales" />
            </div>

            {/* Totales y datos bancarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bancos */}
                <Card>
                    <CardContent className="space-y-2 py-4">
                        <h4 className="font-semibold">Datos de Transferencia Bancaria</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p>
                                    <strong>Banco Chile</strong>
                                </p>
                                <p>Cta Cte: 144 032</p>
                                <p>Razón Social</p>
                                <p>RUT</p>
                                <p>Email</p>
                            </div>
                            <div>
                                <p>
                                    <strong>Banco Estado</strong>
                                </p>
                                <p>Cta Cte: 629</p>
                                <p>Razón Social</p>
                                <p>RUT</p>
                                <p>Email</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Totales */}
                <Card>
                    <CardContent className="space-y-2 py-4">
                        <h4 className="font-semibold">Resumen</h4>
                        <div className="space-y-1 text-sm">
                            <p>Monto Neto: $0</p>
                            <p>Descuentos: $0</p>
                            <p>Cargos: $0</p>
                            <p>Subtotal: $0</p>
                            <p>IVA (19%): $0</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Botón imprimir */}
            <div className="text-right">
                <Button>Imprimir</Button>
            </div>
        </div>
    )
}

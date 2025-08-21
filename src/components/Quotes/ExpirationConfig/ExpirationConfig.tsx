"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"

interface ExpirationConfigProps {
    vencimientoCantidad: string
    vencimientoPeriodo: "dias" | "semanas" | "meses"
    periodoLabel: { [key: string]: string }
    nroCotizacion: number
    onCantidadChange: (cantidad: string) => void
    onPeriodoChange: (periodo: "dias" | "semanas" | "meses") => void
}

export function ExpirationConfig({
    vencimientoCantidad,
    vencimientoPeriodo,
    periodoLabel,
    nroCotizacion,
    onCantidadChange,
    onPeriodoChange,
}: ExpirationConfigProps) {
    return (
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-medium">Vencimiento:</span>
                            <span>
                                {vencimientoCantidad} {periodoLabel[vencimientoPeriodo]}
                            </span>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex gap-6">
                        <Card className="w-full sm:w-auto bg-slate-50 dark:bg-slate-700">
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Configurar Vencimiento
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Cantidad"
                                            className="w-20"
                                            type="number"
                                            min={1}
                                            value={vencimientoCantidad}
                                            onWheel={(e) => {
                                                e.currentTarget.blur()
                                            }}
                                            onChange={(e) => onCantidadChange(e.target.value)}
                                        />
                                        <Select
                                            value={vencimientoPeriodo}
                                            onValueChange={(value) =>
                                                onPeriodoChange(value as "dias" | "semanas" | "meses")
                                            }
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
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-600 bg-blue-50 dark:bg-blue-950/50">
                            <CardContent className="p-6 text-center space-y-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                    R.U.T.: 77.058.146-K
                                </Badge>
                                <div className="space-y-1">
                                    <p className="font-semibold text-slate-800 dark:text-white">
                                        COTIZACIÓN ELECTRÓNICA
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600">N° {nroCotizacion}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

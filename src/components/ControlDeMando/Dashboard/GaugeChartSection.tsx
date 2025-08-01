"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"
import { updateMeta } from "@/actions/totals/updateMeta"
import { toast } from "sonner"

const DynamicGaugeChart = dynamic(() => import("@/components/Caja/VentasTotalesGrafico/GaugeChart"), { ssr: false })

export default function GaugeChartSection() {
    const [meta, setMeta] = useState("")
    const [open, setOpen] = useState(false)

    const handleAgregarMeta = async () => {
        if (!meta || isNaN(Number(meta)) || Number(meta) <= 0) {
            toast.error("Ingresá un monto válido para la meta")
            return
        }

        try {
            const date = new Date()
            const utcDate = formatDateToYYYYMMDD(date)
            const resultado = await updateMeta(utcDate, Number(meta))

            if (resultado) {
                toast.success(`Meta de $${Number(meta).toLocaleString()} agregada correctamente`)
                setOpen(false)
                setMeta("")
                window.location.href = "http://localhost:3000/home/controlDeMando"
            } else {
                toast.error("No se pudo guardar la meta. Intentá nuevamente.")
            }
        } catch (error) {
            console.error("Error al guardar la meta:", error)
            toast.error("Ocurrió un error al guardar la meta.")
        }
    }

    return (
        <div className="lg:col-span-4 lg:mb-0 mb-10 lg:row-span-4 lg:col-start-4">
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center relative dark:text-white text-sm md:text-base">
                        Ventas totales del presente mes / Meta
                        {/* Popover trigger */}
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    className="mt-2 absolute top-4 bg-green-500 hover:bg-green-700 text-white left-20"
                                    onClick={() => setOpen(!open)}
                                >
                                    Agregar Meta del Mes
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-4 shadow-xl border rounded-lg bg-white dark:bg-slate-900">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                                    Ingresar monto de la meta
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Ej: 500000"
                                    value={meta}
                                    onChange={(e) => setMeta(e.target.value)}
                                    className="mb-3"
                                />
                                <Button
                                    onClick={handleAgregarMeta}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Agregar
                                </Button>
                            </PopoverContent>
                        </Popover>
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-center items-center h-48 md:h-full">
                        <div className="w-full max-w-sm mx-auto">
                            <DynamicGaugeChart />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

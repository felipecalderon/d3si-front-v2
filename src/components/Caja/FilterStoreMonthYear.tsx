"use client"
import { useState } from "react"
import { useTienda } from "@/stores/tienda.store"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Filters = {
    storeID?: string
    month?: string
    year?: string
}

export default function FilterStoreMonthYear({ onChange }: { onChange?: (filters: Filters) => void }) {
    const { stores, storeSelected } = useTienda()
    const [storeFilter, setStoreFilter] = useState<string | undefined>(undefined)
    const [monthFilter, setMonthFilter] = useState<string | undefined>(undefined)
    const [yearFilter, setYearFilter] = useState<string | undefined>(undefined)

    const emitChange = (next: Filters) => {
        onChange?.(next)
    }

    return (
        <div className="w-full">
            {/* Mobile: Stack vertically */}
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-1 w-full">
                {/* Botón Vender - Solo visible en desktop dentro de filters */}
                <div className="hidden lg:block lg:flex-shrink-0">
                    <Link href={`/home/createsale?storeID=${storeSelected?.storeID}`}>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors whitespace-nowrap">
                            Vender 🛍️
                        </Button>
                    </Link>
                </div>

                {/* Contenedor de selectores */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-1 w-full lg:flex-1">
                    {/* Tiendas */}
                    <div className="w-full sm:w-1/3 lg:w-auto lg:min-w-[160px]">
                        <Select
                            value={storeFilter}
                            onValueChange={(val: string) => {
                                const v = val || undefined
                                setStoreFilter(v)
                                emitChange({ storeID: v, month: monthFilter, year: yearFilter })
                            }}
                        >
                            <SelectTrigger className="dark:bg-slate-900 bg-white shadow-lg w-full">
                                <SelectValue placeholder="Filtrar tienda" />
                            </SelectTrigger>
                            <SelectContent>
                                {stores.map((store) => (
                                    <SelectItem key={store.storeID} value={store.storeID}>
                                        {store.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Meses */}
                    <div className="w-full sm:w-1/3 lg:w-auto lg:min-w-[140px]">
                        <Select
                            value={monthFilter}
                            onValueChange={(val: string) => {
                                const v = val || undefined
                                setMonthFilter(v)
                                emitChange({ storeID: storeFilter, month: v, year: yearFilter })
                            }}
                        >
                            <SelectTrigger className="dark:bg-slate-900 bg-white shadow-lg w-full">
                                <SelectValue placeholder="Filtrar mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    "Enero",
                                    "Febrero",
                                    "Marzo",
                                    "Abril",
                                    "Mayo",
                                    "Junio",
                                    "Julio",
                                    "Agosto",
                                    "Septiembre",
                                    "Octubre",
                                    "Noviembre",
                                    "Diciembre",
                                ].map((mes) => (
                                    <SelectItem key={mes} value={mes}>
                                        {mes}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Años */}
                    <div className="w-full sm:w-1/3 lg:w-auto lg:min-w-[140px]">
                        <Select
                            value={yearFilter}
                            onValueChange={(val: string) => {
                                const v = val || undefined
                                setYearFilter(v)
                                emitChange({ storeID: storeFilter, month: monthFilter, year: v })
                            }}
                        >
                            <SelectTrigger className="dark:bg-slate-900 bg-white shadow-lg w-full">
                                <SelectValue placeholder="Filtrar por año" />
                            </SelectTrigger>
                            <SelectContent>
                                {["2025", "2024", "2023"].map((año) => (
                                    <SelectItem key={año} value={año}>
                                        {año}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Botón limpiar filtros */}
                    <div className="w-full sm:w-auto lg:w-auto lg:min-w-[140px] flex items-center">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                                setStoreFilter(undefined)
                                setMonthFilter(undefined)
                                setYearFilter(undefined)
                                emitChange({})
                            }}
                        >
                            Limpiar filtros ✨
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

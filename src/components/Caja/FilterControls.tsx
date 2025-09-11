"use client"

import { useTienda } from "@/stores/tienda.store"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSalesFilters } from "@/stores/salesFilters.store"

const FilterControls = () => {
    const { stores } = useTienda()
    const { setFilters } = useSalesFilters()
    const [storeIDFil, setStoreFilter] = useState<string | undefined>(undefined)
    const [monthFil, setMonthFilter] = useState<string | undefined>(undefined)
    const [yearFil, setYearFilter] = useState<string | undefined>(undefined)

    useEffect(() => {
        setFilters({ month: monthFil, storeID: storeIDFil, year: yearFil })
    }, [storeIDFil, monthFil, yearFil])
    return (
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-1 lg:flex-1">
            {/* Tiendas */}
            <Select
                value={storeIDFil}
                onValueChange={(val: string) => {
                    setStoreFilter(val)
                }}
            >
                <SelectTrigger className="dark:bg-slate-900 bg-white">
                    <SelectValue placeholder="Tienda" />
                </SelectTrigger>
                <SelectContent>
                    {stores.map((store) => (
                        <SelectItem key={store.storeID} value={store.storeID}>
                            {store.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Meses */}
            <Select
                value={monthFil}
                onValueChange={(val: string) => {
                    setMonthFilter(val)
                }}
            >
                <SelectTrigger className="dark:bg-slate-900 bg-white">
                    <SelectValue placeholder="Mes" />
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

            {/* Años */}
            <Select
                value={yearFil}
                onValueChange={(val: string) => {
                    setYearFilter(val)
                }}
            >
                <SelectTrigger className="dark:bg-slate-900 bg-white">
                    <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                    {["2025", "2024", "2023"].map((año) => (
                        <SelectItem key={año} value={año}>
                            {año}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Botón limpiar filtros */}
            <Button
                variant="outline"
                onClick={() => {
                    setStoreFilter(undefined)
                    setMonthFilter(undefined)
                    setYearFilter(undefined)
                }}
            >
                Limpiar filtros ✨
            </Button>
        </div>
    )
}

export default FilterControls

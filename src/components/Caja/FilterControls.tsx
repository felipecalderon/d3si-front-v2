"use client"

import { useTienda } from "@/stores/tienda.store"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { es } from "react-day-picker/locale"

const FilterControls = () => {
    const { stores } = useTienda()

    const path = usePathname()
    const params = useSearchParams()
    const router = useRouter()

    const dateParam = params.get("date")
    const storeIDParam = params.get("storeID")

    const [year, month, day] = dateParam
        ? dateParam.split("-").map(Number)
        : [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]

    const dateObj = new Date(year, month - 1, day, 23, 59, 59, 999)
    const [date, setDate] = useState<Date>(dateObj)
    const [storeIDFil, setStoreFilter] = useState<string | undefined>(undefined)

    const handleDateChange = (date: Date | undefined) => {
        const newDate = date ?? new Date()
        const params = new URLSearchParams({ storeID: storeIDParam ?? "", date: format(newDate, "yyyy-MM-dd") })
        router.push(`${path}?${params.toString()}`)
        setDate(date ? date : new Date())
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-1 lg:flex-1">
            <Select
                value={storeIDParam || ""}
                onValueChange={(val: string) => {
                    const newParams = new URLSearchParams(params.toString())
                    newParams.set("storeID", val)
                    router.push(`${path}?${newParams.toString()}`)
                }}
            >
                <SelectTrigger className="w-full sm:w-[200px] dark:bg-slate-900 bg-white">
                    <SelectValue placeholder="Seleccionar Tienda" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las tiendas</SelectItem>
                    <SelectItem value="propias">Tiendas Propias</SelectItem>
                    <SelectItem value="consignadas">Tiendas Consignadas</SelectItem>
                    <hr className="my-2 border-gray-100 dark:border-gray-800" />
                    {stores.map((store) => (
                        <SelectItem key={store.storeID} value={store.storeID}>
                            {store.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder={format(date, "dd-MM-yyyy")}>
                        {date ? format(date, "dd-MM-yyyy") : ""}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="p-2">
                    <Calendar
                        mode="single"
                        locale={es}
                        selected={date}
                        onSelect={handleDateChange}
                        className="rounded-md"
                        captionLayout="dropdown"
                    />
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                onClick={() => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    handleDateChange(today)
                    setStoreFilter(undefined)
                }}
            >
                Resetear fecha ✨
            </Button>
        </div>
    )
}

export default FilterControls

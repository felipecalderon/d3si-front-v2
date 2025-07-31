"use client"
import { useTienda } from "@/stores/tienda.store"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Filters = () => {
    const { stores } = useTienda()

    return (
        <div className="w-full">
            <div className="flex lg:flex-row flex-col gap-2 w-full">
                {/* Vender */}
                <Link href="/home/createsale" className="sm:w-auto flex-shrink-0">
                    <Button className="sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-lg font-semibold shadow-md transition-colors whitespace-nowrap">
                        Vender 🛍️
                    </Button>
                </Link>
                {/* Tiendas */}
                <Select>
                    <SelectTrigger className="dark:bg-slate-900 lg:w-38 w-full bg-white shadow-lg">
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
                {/* Meses */}
                <Select>
                    <SelectTrigger className="dark:bg-slate-900 lg:w-38 w-full bg-white shadow-lg">
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
                {/* Años */}
                <Select>
                    <SelectTrigger className="dark:bg-slate-900 lg:w-38 w-full bg-white shadow-lg">
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
        </div>
    )
}

export default Filters

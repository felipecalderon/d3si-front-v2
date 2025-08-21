"use client"
import { useTienda } from "@/stores/tienda.store"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Filters = () => {
    const { stores, storeSelected } = useTienda()

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
                        <Select>
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
                        <Select>
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
                        <Select>
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
                </div>
            </div>
        </div>
    )
}

export default Filters

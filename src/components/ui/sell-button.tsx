"use client"

import Link from "next/link"
import { Button } from "./button"
import { useTienda } from "@/stores/tienda.store"

export default function SellButton() {
    const { storeSelected } = useTienda()
    return (
        <Link href={`/home/createsale?storeID=${storeSelected?.storeID}`}>
            <Button
                disabled={!storeSelected}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors whitespace-nowrap"
            >
                Vender 🛍️
            </Button>
        </Link>
    )
}

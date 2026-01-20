"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AnularVentaModal } from "@/components/Modals/AnularVentaModal"
import { ISaleResponse } from "@/interfaces/sales/ISale"

interface AnularVentaControlProps {
    sale: ISaleResponse
}

export default function AnularVentaControl({ sale }: AnularVentaControlProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Calcular si aún quedan productos por anular
    const totalSold = sale.SaleProducts.reduce((acc, p) => acc + (p.quantitySold || 0), 0)
    const totalAnulated = sale.Return?.ProductAnulations?.reduce((acc, p) => acc + (p.returnedQuantity || 0), 0) || 0
    const hasProductsLeft = totalSold > totalAnulated

    return (
        <>
            <Button variant="destructive" onClick={() => setIsModalOpen(true)} disabled={!hasProductsLeft}>
                {!hasProductsLeft ? "Venta Anulada" : "Anular Productos"}
            </Button>
            <AnularVentaModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} sale={sale} />
        </>
    )
}

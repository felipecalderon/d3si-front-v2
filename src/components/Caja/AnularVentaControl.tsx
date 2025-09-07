"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AnularVentaModal } from "@/components/Modals/AnularVentaModal"

interface AnularVentaControlProps {
    saleId: string
    status: string
}

export default function AnularVentaControl({ saleId, status }: AnularVentaControlProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <Button variant="destructive" onClick={() => setIsModalOpen(true)} disabled={status === "Anulado"}>
                {status === "Anulado" ? "Venta Anulada" : "Anular Venta"}
            </Button>
            <AnularVentaModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} saleId={saleId} />
        </>
    )
}

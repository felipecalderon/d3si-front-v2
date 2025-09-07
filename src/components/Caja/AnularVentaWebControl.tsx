"use client"

import { useState, useTransition } from "react"
import { SaleStatus, WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { updateWooOrder } from "@/actions/woocommerce/updateWooOrder"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AnularVentaControlProps {
    sale: WooCommerceOrder
}

export default function AnularVentaWebControl({ sale }: AnularVentaControlProps) {
    const [localStatus, setLocalStatus] = useState<SaleStatus>(sale.status)
    const [isLoading, startTransition] = useTransition()
    const router = useRouter()

    const options: SaleStatus[] = [
        "shipping-progress",
        "cancelled",
        "completed",
        "failed",
        "on-hold",
        "pending",
        "processing",
        "refunded",
        "trash",
    ]

    const statusDictionary: Record<SaleStatus, string> = {
        "shipping-progress": "En proceso de envío",
        "on-hold": "En espera",
        cancelled: "Cancelado",
        completed: "Completado",
        failed: "Fallado",
        pending: "Pendiente",
        processing: "Procesando",
        refunded: "Devuelto",
        trash: "Eliminado",
    }

    const onSubmitUpdate = async () => {
        const partialOrder: Partial<WooCommerceOrder> = {
            id: Number(sale.id) as number,
            status: localStatus,
        }
        startTransition(async () => {
            const updatedOrder = await updateWooOrder(partialOrder)
            if (updatedOrder) {
                router.refresh()
                toast.success("Venta actualizada con éxito")
            } else {
                toast.error("Hubo un error al actualizar la venta")
            }
        })
    }

    const onValueChange = (value: SaleStatus) => {
        setLocalStatus(value)
    }

    return (
        <>
            <Select onValueChange={onValueChange} defaultValue={sale.status}>
                <SelectTrigger className="w-fit">
                    <SelectValue placeholder={`Cambiar estado: ${statusDictionary[sale.status]}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Selecciona un estado</SelectLabel>
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {statusDictionary[option]}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Button
                disabled={localStatus === sale.status || isLoading}
                onClick={onSubmitUpdate}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 shadow"
            >
                {isLoading ? "Actualizando..." : "Guardar"}
            </Button>
        </>
    )
}

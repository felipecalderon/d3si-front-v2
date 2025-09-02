"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { anularSale, AnularSale } from "@/actions/sales/anularSale"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/stores/user.store"
import { toast } from "sonner"

interface AnularVentaModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    saleId: string
}

const initialState: AnularSale["nullNote"] = {
    clientEmail: "",
    reason: "",
    type: "DEVOLUCION",
    returnedQuantity: 1,
    processedBy: "",
    additionalNotes: "",
}

export function AnularVentaModal({ isOpen, setIsOpen, saleId }: AnularVentaModalProps) {
    const { user } = useAuth()
    const [formState, setFormState] = useState(initialState)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormState((prev) => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: "GARANTIA" | "DEVOLUCION") => {
        setFormState((prev) => ({ ...prev, type: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const processedBy = user?.userID || "Usuario Desconocido"
        const returnedQuantity = Number(formState.returnedQuantity)

        if (isNaN(returnedQuantity) || returnedQuantity <= 0) {
            setError("La cantidad devuelta debe ser un número mayor a cero.")
            return
        }

        const submissionData: AnularSale = {
            saleID: saleId,
            nullNote: { ...formState, processedBy, returnedQuantity },
        }
        console.log(submissionData)
        startTransition(async () => {
            try {
                const data = await anularSale(submissionData)
                if (data.ok) {
                    toast("Venta anulada correctamente")
                    setIsOpen(false)
                    router.push("/home")
                } else {
                    toast.error("No se pudo anular la venta")
                }
            } catch (err: any) {
                setError(err.message || "Ocurrió un error al anular la venta.")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-lg p-6">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Anular Venta</DialogTitle>
                        <DialogDescription>
                            Completa el formulario para procesar la anulación de la venta.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="clientEmail">Email del Cliente</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                placeholder="cliente@example.com"
                                value={formState.clientEmail}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="type">Tipo de Anulación</Label>
                            <Select onValueChange={handleSelectChange} defaultValue={formState.type}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVOLUCION">Devolución</SelectItem>
                                    <SelectItem value="GARANTIA">Garantía</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label htmlFor="reason">Motivo Principal</Label>
                            <Textarea
                                id="reason"
                                placeholder="Ej: Producto defectuoso, talla equivocada..."
                                value={formState.reason}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="hidden">
                            <Label htmlFor="returnedQuantity">Cantidad Devuelta</Label>
                            <Input
                                id="returnedQuantity"
                                type="hidden"
                                min="1"
                                placeholder="0"
                                value={formState.returnedQuantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="hidden">
                            <Label htmlFor="processedBy">Procesado Por</Label>
                            <Input id="processedBy" type="hidden" value={user?.name || ""} readOnly disabled />
                        </div>
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label htmlFor="additionalNotes">Notas Adicionales</Label>
                            <Textarea
                                id="additionalNotes"
                                placeholder="Añade cualquier detalle extra aquí..."
                                value={formState.additionalNotes}
                                onChange={handleInputChange}
                            />
                        </div>
                        {error && <p className="col-span-2 text-red-500 text-sm">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={isPending}>
                            {isPending ? "Procesando..." : "Confirmar Anulación"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

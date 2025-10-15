"use client"

import { useState, useTransition } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnularSale, anularSale } from "@/actions/sales/anularSale"

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
import { ISendSaleReturn } from "@/interfaces/sales/ISale"
import { getSingleSale } from "@/actions/sales/getSales"

interface AnularVentaModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    saleId: string
}

const initialState: AnularSale["nullNote"] = {
    clientEmail: "",
    reason: "",
    type: "DEVOLUCION",
    processedBy: "",
    additionalNotes: "",
}

export function AnularVentaModal({ isOpen, setIsOpen, saleId }: AnularVentaModalProps) {
    const { user } = useAuth()
    const [formState, setFormState] = useState(initialState)
    const [saleProducts, setSaleProducts] = useState<any[] | null>(null)
    // selectedProducts maps product id -> quantity to return
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({})
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

    const handleToggleProduct = (id: string) => {
        setSelectedProducts((prev) => {
            const next = { ...prev }
            if (next[id] !== undefined) {
                delete next[id]
            } else {
                next[id] = 1
            }
            return next
        })
    }

    const handleProductQuantityChange = (id: string, quantity: number) => {
        setSelectedProducts((prev) => {
            const next = { ...prev }
            if (quantity <= 0) {
                delete next[id]
            } else {
                next[id] = quantity
            }
            return next
        })
    }

    useEffect(() => {
        // Cargar los productos de la venta origen cuando el modal se abra
        if (!isOpen) return
        const load = async () => {
            try {
                const sale = await getSingleSale(saleId)
                setSaleProducts(sale.SaleProducts || [])
            } catch (err) {
                setSaleProducts([])
            }
        }
        load()
    }, [isOpen, saleId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const processedBy = user?.userID || "Usuario Desconocido"

        const nullNoteData = { ...formState }

        // Build returnedProducts array from selectedProducts map
        const returnedProducts: { storeProductID: string; quantity: number }[] = []
        if (saleProducts) {
            for (const [key, qty] of Object.entries(selectedProducts)) {
                const prod = saleProducts.find((p: any) => p.SaleProductID === key || p.storeProductID === key)
                if (prod) {
                    const storeProductID =
                        prod.storeProductID ||
                        prod.StoreProduct?.Product?.id ||
                        prod.StoreProduct?.Product?.productID ||
                        prod.SaleProductID ||
                        key

                    returnedProducts.push({
                        storeProductID,
                        quantity: qty || prod.quantitySold || prod.quantity || 1,
                    })
                } else {
                    // fallback: push key as id with its quantity
                    returnedProducts.push({ storeProductID: key, quantity: qty })
                }
            }
        }

        const submissionData: AnularSale = {
            saleID: saleId,
            nullNote: {
                ...nullNoteData,
                processedBy,
                returnedProducts,
            },
        }

        console.log("AnularSale payload:", submissionData)

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
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEVOLUCION">Devolución</SelectItem>
                                    <SelectItem value="GARANTIA">Garantía</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Lista de productos: permitir seleccionar múltiples con checkbox y cantidad por producto */}
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label>Productos a anular</Label>
                            <div className="max-h-56 overflow-auto border rounded-md p-2">
                                {saleProducts && saleProducts.length ? (
                                    saleProducts.map((p: any) => {
                                        const key = p.SaleProductID || p.storeProductID
                                        const qty = p.quantitySold || p.quantity || 1
                                        const name =
                                            p.StoreProduct?.Product?.name ||
                                            p.StoreProduct?.Product?.title ||
                                            p.StoreProduct?.Product?.productName ||
                                            `Producto ${key}`
                                        const selected = selectedProducts[key] !== undefined
                                        return (
                                            <div key={key} className="flex items-center justify-between gap-2 py-1">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        id={`chk_${key}`}
                                                        type="checkbox"
                                                        className="w-4 h-4"
                                                        checked={selected}
                                                        onChange={() => handleToggleProduct(key)}
                                                    />
                                                    <label htmlFor={`chk_${key}`} className="text-sm">
                                                        {`${name} — Cant: ${qty}`}
                                                    </label>
                                                </div>
                                                <div className="w-28">
                                                    <input
                                                        aria-label={`Cantidad a anular para ${name}`}
                                                        className="w-full rounded border px-2 py-1 text-sm"
                                                        type="number"
                                                        min={1}
                                                        max={qty}
                                                        value={selected ? selectedProducts[key] : 1}
                                                        onChange={(e) => {
                                                            const v = Number(e.target.value || 1)
                                                            const valid = isNaN(v) ? 1 : Math.max(1, Math.min(v, qty))
                                                            handleProductQuantityChange(key, valid)
                                                        }}
                                                        disabled={!selected}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-sm text-gray-600">No hay productos</p>
                                )}
                            </div>
                        </div>

                        {/* Nota: la cantidad por producto se gestiona en la lista anterior por cada producto seleccionado */}
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
                        {/* deprecated hidden returnedQuantity removed to avoid id conflicts with visible input */}
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

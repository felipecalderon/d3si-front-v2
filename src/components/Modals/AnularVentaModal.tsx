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
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [returnedQuantity, setReturnedQuantity] = useState<number>(1)
    const [selectedProductLabel, setSelectedProductLabel] = useState<string | null>(null)
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

    const handleProductChange = (value: string) => {
        setSelectedProduct(value)
        // set default returned quantity to 1 (but will be constrained by max in the input)
        setReturnedQuantity(1)
        // also set a friendly label for the selected product (if available)
        const prod = saleProducts?.find((p: any) => p.SaleProductID === value || p.storeProductID === value)
        const name =
            prod?.StoreProduct?.Product?.name ||
            prod?.StoreProduct?.Product?.title ||
            prod?.StoreProduct?.Product?.productName ||
            `Producto ${prod?.SaleProductID || prod?.storeProductID}`
        setSelectedProductLabel(name || null)
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

        let returnedProducts: { storeProductID: string; quantity: number }[] = []
        if (selectedProduct && saleProducts) {
            const prod = saleProducts.find(
                (p: any) => p.SaleProductID === selectedProduct || p.storeProductID === selectedProduct
            )
            if (prod) {
                const storeProductID =
                    prod.storeProductID ||
                    prod.StoreProduct?.Product?.id ||
                    prod.StoreProduct?.Product?.productID ||
                    prod.SaleProductID ||
                    selectedProduct

                returnedProducts = [
                    {
                        storeProductID,
                        quantity: returnedQuantity || prod.quantitySold || prod.quantity || 1,
                    },
                ]
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
                        {/* Select de productos de la venta origen */}
                        <div className="col-span-2 grid w-full gap-1.5">
                            <Label htmlFor="productToReturn">Producto a anular</Label>
                            <Select
                                onValueChange={(val) => handleProductChange(val)}
                                value={selectedProduct || undefined}
                                defaultValue={undefined}
                            >
                                <SelectTrigger id="productToReturn" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            saleProducts && saleProducts.length
                                                ? "Selecciona un producto"
                                                : "No hay productos"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {saleProducts && saleProducts.length ? (
                                        saleProducts.map((p: any) => {
                                            const qty = p.quantitySold || p.quantity || 1
                                            const name =
                                                p.StoreProduct?.Product?.name ||
                                                p.StoreProduct?.Product?.title ||
                                                p.StoreProduct?.Product?.productName ||
                                                `Producto ${p.SaleProductID || p.storeProductID}`
                                            return (
                                                <SelectItem
                                                    key={p.SaleProductID || p.storeProductID}
                                                    value={p.SaleProductID || p.storeProductID}
                                                >
                                                    {`${name} — Cant: ${qty}`}
                                                </SelectItem>
                                            )
                                        })
                                    ) : (
                                        <SelectItem value="__none__" disabled>
                                            No hay productos
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Cantidad a devolver: solo visible si hay producto seleccionado */}
                        {/* Mostrar nombre legible del producto seleccionado */}
                        {selectedProductLabel && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Producto seleccionado: <span className="font-semibold">{selectedProductLabel}</span>
                                </p>
                            </div>
                        )}
                        {selectedProduct && (
                            <div className="col-span-2 sm:col-span-1 grid w-full gap-1.5">
                                <Label htmlFor="returnedQuantity">Cantidad a anular</Label>
                                <Input
                                    id="returnedQuantity"
                                    type="number"
                                    min={1}
                                    value={returnedQuantity}
                                    onChange={(e) => {
                                        const v = Number(e.target.value || 1)
                                        const prod = saleProducts?.find(
                                            (p: any) =>
                                                p.SaleProductID === selectedProduct ||
                                                p.storeProductID === selectedProduct
                                        )
                                        const max = prod?.quantitySold || prod?.quantity || 1
                                        if (isNaN(v) || v < 1) return setReturnedQuantity(1)
                                        if (v > max) return setReturnedQuantity(max)
                                        setReturnedQuantity(v)
                                    }}
                                    max={
                                        saleProducts?.find(
                                            (p: any) =>
                                                p.SaleProductID === selectedProduct ||
                                                p.storeProductID === selectedProduct
                                        )
                                            ? saleProducts.find(
                                                  (p: any) =>
                                                      p.SaleProductID === selectedProduct ||
                                                      p.storeProductID === selectedProduct
                                              ).quantitySold ||
                                              saleProducts.find(
                                                  (p: any) =>
                                                      p.SaleProductID === selectedProduct ||
                                                      p.storeProductID === selectedProduct
                                              ).quantity ||
                                              1
                                            : 1
                                    }
                                />
                            </div>
                        )}
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

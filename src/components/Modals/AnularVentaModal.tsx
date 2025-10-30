"use client"

import { useState, useTransition } from "react"
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
import { ISaleProduct, ISaleResponse } from "@/interfaces/sales/ISale"

// Definir una interfaz para el producto con la cantidad a devolver
interface SelectedProductReturn extends ISaleProduct {
    quantityToReturn: number
}

interface AnularVentaModalProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    sale: ISaleResponse
}

const initialState: AnularSale["nullNote"] = {
    clientEmail: "",
    reason: "",
    type: "DEVOLUCION",
    processedBy: "",
    additionalNotes: "",
    ProductAnulations: [],
}

export function AnularVentaModal({ isOpen, setIsOpen, sale }: AnularVentaModalProps) {
    const { user } = useAuth()
    const [formState, setFormState] = useState(initialState)
    // Estado para manejar los productos seleccionados con la cantidad a devolver
    const [selectedProducts, setSelectedProducts] = useState<SelectedProductReturn[]>([])
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

    /**
     * 🔄 Maneja la selección de un producto (marcar/desmarcar).
     * Si se selecciona, se añade al estado con la cantidad máxima vendida como cantidad a devolver.
     * Si se deselecciona, se elimina del estado.
     */
    const handleToggleProduct = (product: ISaleProduct) => {
        const key = product.storeProductID // Usamos storeProductID como clave única
        setSelectedProducts((prev) => {
            const isSelected = prev.some((p) => p.storeProductID === key)
            if (isSelected) {
                // Deseleccionar: eliminar el producto
                return prev.filter((p) => p.storeProductID !== key)
            } else {
                // Seleccionar: añadir con la cantidad máxima vendida como valor inicial [VER QUE DICE ALE]
                const qty = product.quantitySold || 1
                return [...prev, { ...product, quantityToReturn: qty }]
            }
        })
    }

    /**
     * 🔢 Maneja el cambio de cantidad a anular para un producto seleccionado.
     */
    const handleProductQuantityChange = (product: ISaleProduct, newQuantity: number | string | null) => {
        const qtySold = product.quantitySold || 1
        let finalQuantity: number

        // Validación y ajuste de la cantidad
        if (newQuantity === null || newQuantity === "" || Number(newQuantity) === 0) {
            setSelectedProducts((prev) => prev.filter((p) => p.storeProductID !== product.storeProductID))
        } else {
            // Aseguramos que la cantidad esté entre 1 y la cantidad vendida
            const v = Number(newQuantity)
            finalQuantity = Math.max(1, Math.min(v, qtySold))
        }

        setSelectedProducts((prev) => {
            const key = product.storeProductID
            const existingProductIndex = prev.findIndex((p) => p.storeProductID === key)

            if (existingProductIndex !== -1) {
                // Si el producto ya estaba seleccionado, actualizamos la cantidad
                const updatedProducts = [...prev]
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantityToReturn: finalQuantity,
                }
                return updatedProducts
            } else {
                // Si no estaba seleccionado (esto no debería ocurrir si se usa el checkbox correctamente),
                // lo añadimos y lo marcamos como seleccionado
                return [...prev, { ...product, quantityToReturn: finalQuantity }]
            }
        })
    }

    // Función para manejar el valor del input, permitiendo valores intermedios (ej. un usuario escribiendo "2")
    const handleQuantityInput = (product: ISaleProduct, rawValue: string) => {
        const v = rawValue === "" ? null : Number(rawValue)
        // Solo llamamos a la función de cambio si es un número válido o un string vacío (permitiendo entrada parcial)
        if (v) {
            handleProductQuantityChange(product, rawValue)
        } else {
            setSelectedProducts((prev) => prev.filter((p) => p.storeProductID !== product.storeProductID))
        }
    }

    const handleQuantityBlur = (product: ISaleProduct, rawValue: string) => {
        const qtySold = product.quantitySold || 1
        const v = Number(rawValue)
        // Validación final (entre 1 y qtySold)
        const clamped = Math.max(1, Math.min(v, qtySold))
        handleProductQuantityChange(product, clamped)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (selectedProducts.length === 0) {
            setError("Debes seleccionar al menos un producto para anular o devolver.")
            toast.error("Selecciona al menos un producto.")
            return
        }

        const processedBy = user?.userID || "Usuario Desconocido"

        const nullNoteData = { ...formState }

        const returnedProducts = selectedProducts
            .filter((p) => p.quantityToReturn > 0)
            .map((p) => ({
                storeProductID: p.storeProductID,
                quantity: p.quantityToReturn,
            }))

        if (returnedProducts.length === 0) {
            setError("Los productos seleccionados deben tener una cantidad a anular mayor a cero.")
            toast.error("Ajusta la cantidad a anular de los productos seleccionados.")
            return
        }

        const submissionData: AnularSale = {
            saleID: sale.saleID,
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
                                {sale.SaleProducts.map((p) => {
                                    // Usamos un identificador único para el producto
                                    const key = p.storeProductID
                                    const qty = p.quantitySold || 1
                                    const name =
                                        p.StoreProduct?.ProductVariation?.Product?.name || "Producto Desconocido"

                                    // Lógica de estado para el producto
                                    const selectedProduct = selectedProducts.find((sp) => sp.storeProductID === key)
                                    const selected = !!selectedProduct
                                    // Si está seleccionado, usamos quantityToReturn; si no, 1 o el valor que quieras
                                    const quantityValue = selected
                                        ? selectedProduct.quantityToReturn === 0
                                            ? ""
                                            : selectedProduct.quantityToReturn
                                        : qty

                                    return (
                                        <div key={key} className="flex items-center justify-between gap-2 py-1">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id={`chk_${key}`}
                                                    type="checkbox"
                                                    className="w-4 h-4"
                                                    checked={selected}
                                                    onChange={() => handleToggleProduct(p)}
                                                />
                                                <label htmlFor={`chk_${key}`} className="text-sm">
                                                    {`${name} (${qty})`}
                                                </label>
                                            </div>
                                            <div className="w-28">
                                                <input
                                                    aria-label={`Cantidad a anular para ${name}`}
                                                    className="w-full rounded-md border px-2 py-1 text-sm bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    type="number"
                                                    min={0}
                                                    max={qty}
                                                    value={quantityValue}
                                                    onChange={(e) => handleQuantityInput(p, e.target.value)}
                                                    onBlur={(e) => handleQuantityBlur(p, e.target.value)}
                                                    disabled={!selected}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
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
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || selectedProducts.length === 0}
                        >
                            {isPending ? "Procesando..." : "Confirmar Anulación"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

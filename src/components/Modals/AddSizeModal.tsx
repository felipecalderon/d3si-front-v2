//src/components/Modals/AddSizeModal.tsx
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { fetcher } from "@/lib/fetcher"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"

interface AddSizeModalProps {
    productID: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddSizeModal({ productID, open, onOpenChange }: AddSizeModalProps) {
    const [form, setForm] = useState({
        sizeNumber: "",
        priceList: "",
        sku: "",
        stockQuantity: "",
        markup: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const body = new URLSearchParams({
                parentProductID: productID,
                ...form,
            })

            await fetcher("/products/calzado", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            })

            toast.success("Talla agregada exitosamente")
            setForm({ sizeNumber: "", priceList: "", sku: "", stockQuantity: "", markup: "" })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Error al agregar talla")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle className="text-lg font-semibold mb-4">Agregar Talla</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mb-4">
                    Ingresa los datos para agregar una nueva talla al producto.
                </DialogDescription>
                <div className="space-y-3">
                    <div>
                        <Label>Talla</Label>
                        <Input name="sizeNumber" value={form.sizeNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Precio Lista</Label>
                        <Input name="priceList" value={form.priceList} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>SKU</Label>
                        <Input name="sku" value={form.sku} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Stock</Label>
                        <Input name="stockQuantity" value={form.stockQuantity} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Markup</Label>
                        <Input name="markup" value={form.markup} onChange={handleChange} />
                    </div>
                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full mt-3">
                        {isLoading ? "Agregando..." : "Agregar talla"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

//src/components/Modals/AddSizeModal.tsx
"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { IProduct } from "@/interfaces/products/IProduct"
import { MassiveCreateProductData } from "@/interfaces/products/ICreateProductForm"

interface AddSizeModalProps {
    productID: string
    name: string
    image: string
    genre: string
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddSize: (newSize: IProduct["ProductVariations"][0]) => void
}

export function AddSizeModal({ open, onOpenChange, name, image, genre, onAddSize, productID }: AddSizeModalProps) {
    const [form, setForm] = useState({
        sizeNumber: "",
        priceList: "",
        priceCost: "",
        sku: "",
        stockQuantity: "",
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const payload = {
                products: [
                    {
                        name,
                        image,
                        genre,
                        sizes: [
                            {
                                sizeNumber: form.sizeNumber,
                                priceList: parseFloat(form.priceList),
                                priceCost: parseFloat(form.priceCost),
                                sku: form.sku,
                                stockQuantity: parseInt(form.stockQuantity),
                            },
                        ],
                    },
                ],
            } as MassiveCreateProductData
            const res = await createMassiveProducts(payload)

            if (res.success) {
                toast.success("Talla agregada exitosamente")
                onAddSize({
                    productID,
                    sizeNumber: form.sizeNumber,
                    priceCost: parseFloat(form.priceCost),
                    priceList: parseFloat(form.priceList),
                    sku: form.sku,
                    stockQuantity: parseInt(form.stockQuantity),
                    variationID: crypto.randomUUID(),
                    StoreProducts: [],
                    Stores: [],
                    createdAt: "",
                    updatedAt: "",
                })

                setForm({ sizeNumber: "", priceCost: "", priceList: "", sku: "", stockQuantity: "" })
                onOpenChange(false)
            } else {
                toast.error(res.error ?? "Error desconocido al agregar talla")
            }
        } catch {
            toast.error("Error al agregar talla")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle className="text-lg font-semibold mb-4 text-black">Agregar Talla</DialogTitle>
                <DialogDescription className="text-sm mb-4 text-black">
                    Ingresa los datos para agregar una nueva talla al producto.
                </DialogDescription>
                <div className="space-y-3">
                    <div>
                        <Label className="text-black">Talla</Label>
                        <Input name="sizeNumber" value={form.sizeNumber} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="text-black">Precio Costo</Label>
                        <Input name="priceCost" value={form.priceCost} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="text-black">Precio Lista</Label>
                        <Input name="priceList" value={form.priceList} onChange={handleChange} />
                    </div>

                    <div>
                        <Label className="text-black">SKU</Label>
                        <Input name="sku" value={form.sku} onChange={handleChange} />
                    </div>
                    <div>
                        <Label className="text-black">Stock</Label>
                        <Input name="stockQuantity" value={form.stockQuantity} onChange={handleChange} />
                    </div>

                    <Button onClick={handleSubmit} disabled={isLoading} className="w-full mt-3">
                        {isLoading ? "Agregando..." : "Agregar talla"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

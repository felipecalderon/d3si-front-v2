"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { createMassiveProducts } from "@/actions/products/createMassiveProducts"
import { CreateProductFormData, Size } from "@/interfaces/products/ICreateProductForm"

export default function CreateProductForm() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [products, setProducts] = useState<CreateProductFormData[]>([
        {
            name: "",
            image: "",
            sizes: [{ sizeNumber: null, priceList: 0, priceCost: 0, sku: "", stockQuantity: 0 }],
        },
    ])
    const [errors, setErrors] = useState<string[]>([])

    const addProduct = () => {
        setProducts([
            ...products,
            {
                name: "",
                image: "",
                sizes: [{ sizeNumber: null, priceList: 0, priceCost: 0, sku: "", stockQuantity: 0 }],
            },
        ])
    }

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index))
    }

    const handleProductChange = (index: number, field: keyof CreateProductFormData, value: any) => {
        const updated = [...products]
        updated[index][field] = value
        setProducts(updated)
    }

    const handleSizeChange = <K extends keyof Size>(
        productIndex: number,
        sizeIndex: number,
        field: K,
        value: Size[K]
    ) => {
        const updated = [...products]
        updated[productIndex].sizes[sizeIndex][field] = field === "sizeNumber" && value === "" ? null : value
        setProducts(updated)
    }

    const addSize = (productIndex: number) => {
        const updated = [...products]
        updated[productIndex].sizes.push({
            sizeNumber: null,
            priceList: 0,
            priceCost: 0,
            sku: "",
            stockQuantity: 0,
        })
        setProducts(updated)
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []
        products.forEach((product, productIndex) => {
            if (!product.name) newErrors.push(`Falta el nombre del producto #${productIndex + 1}`)
            if (!product.image) newErrors.push(`Falta la imagen del producto #${productIndex + 1}`)
            product.sizes.forEach((size, sizeIndex) => {
                if (size.sizeNumber === null)
                    newErrors.push(`Falta la talla en producto #${productIndex + 1}, talla #${sizeIndex + 1}`)
                if (!size.sku.trim())
                    newErrors.push(`Falta el SKU en producto #${productIndex + 1}, talla #${sizeIndex + 1}`)
                if (size.priceList <= 0)
                    newErrors.push(`Precio de lista inválido en producto #${productIndex + 1}, talla #${sizeIndex + 1}`)
                if (size.priceCost <= 0)
                    newErrors.push(`Precio de costo inválido en producto #${productIndex + 1}, talla #${sizeIndex + 1}`)
            })
        })

        setErrors(newErrors)
        return newErrors.length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) {
            toast.error("Corrige los errores antes de continuar.")
            return
        }

        startTransition(async () => {
            const result = await createMassiveProducts(products)
            if (result.success) {
                toast.success("Productos guardados correctamente.")
                router.push("/inventory")
            } else {
                toast.error(result.error || "Error al guardar productos.")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded space-y-1">
                    {errors.map((err, idx) => (
                        <p key={idx}>{err}</p>
                    ))}
                </div>
            )}

            {products.map((product, productIndex) => (
                <Card
                    key={productIndex}
                    className="space-y-4 p-6 border border-muted bg-background shadow-xl rounded-xl transition hover:shadow-2xl"
                >
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Producto {productIndex + 1}</h2>
                            {products.length > 1 && (
                                <Button variant="destructive" type="button" onClick={() => removeProduct(productIndex)}>
                                    Quitar Producto
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Nombre del producto</Label>
                            <Input
                                placeholder="Nombre"
                                value={product.name}
                                onChange={(e) => handleProductChange(productIndex, "name", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>URL de Imagen</Label>
                            <Input
                                placeholder="URL de Imagen"
                                value={product.image}
                                onChange={(e) => handleProductChange(productIndex, "image", e.target.value)}
                            />
                        </div>

                        <Separator />

                        {product.sizes.map((size, sizeIndex) => {
                            const markup =
                                size.priceCost > 0
                                    ? (((size.priceList - size.priceCost) / size.priceCost) * 100).toFixed(2)
                                    : "0"

                            return (
                                <div key={sizeIndex} className="grid grid-cols-5 gap-4 items-end">
                                    <div>
                                        <Label>Talla</Label>
                                        <Input
                                            value={size.sizeNumber ?? ""}
                                            onChange={(e) =>
                                                handleSizeChange(productIndex, sizeIndex, "sizeNumber", e.target.value)
                                            }
                                            placeholder="Talla"
                                        />
                                    </div>
                                    <div>
                                        <Label>Precio Lista</Label>
                                        <Input
                                            type="number"
                                            value={size.priceList}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    productIndex,
                                                    sizeIndex,
                                                    "priceList",
                                                    Number(e.target.value)
                                                )
                                            }
                                            placeholder="Precio Lista"
                                        />
                                    </div>
                                    <div>
                                        <Label>Precio Costo</Label>
                                        <Input
                                            type="number"
                                            value={size.priceCost}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    productIndex,
                                                    sizeIndex,
                                                    "priceCost",
                                                    Number(e.target.value)
                                                )
                                            }
                                            placeholder="Precio Costo"
                                        />
                                    </div>
                                    <div>
                                        <Label>SKU</Label>
                                        <Input
                                            value={size.sku}
                                            onChange={(e) =>
                                                handleSizeChange(productIndex, sizeIndex, "sku", e.target.value)
                                            }
                                            placeholder="SKU"
                                        />
                                    </div>
                                    <div>
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={size.stockQuantity}
                                            onChange={(e) =>
                                                handleSizeChange(
                                                    productIndex,
                                                    sizeIndex,
                                                    "stockQuantity",
                                                    Number(e.target.value)
                                                )
                                            }
                                            placeholder="Stock"
                                        />
                                        <p
                                            className={`text-xs mt-1 font-semibold ${
                                                Number(markup) >= 50
                                                    ? "text-green-600"
                                                    : Number(markup) >= 30
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            Markup: {markup}%
                                        </p>
                                    </div>
                                </div>
                            )
                        })}

                        <Button type="button" onClick={() => addSize(productIndex)} variant="secondary">
                            + Agregar Talla
                        </Button>
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-between items-center">
                <Button type="button" onClick={addProduct} variant="outline">
                    + Agregar otro producto
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Guardando..." : "Guardar Productos"}
                </Button>
            </div>
        </form>
    )
}

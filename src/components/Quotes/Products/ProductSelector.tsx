"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { PlusIcon, ChevronDownIcon, CheckIcon, Upload } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"

interface ProductSelectorProps {
    filteredProducts: IProduct[]
    onProductSelect: (productId: string) => void
    onAddNewProduct: (productData: { name: string; image?: string }) => void
}

export function ProductSelector({ filteredProducts, onProductSelect, onAddNewProduct }: ProductSelectorProps) {
    const [isAddingNew, setIsAddingNew] = useState(false)
    const [newProductName, setNewProductName] = useState("")
    const [newProductImage, setNewProductImage] = useState<string>("")
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const handleProductSelect = (productId: string) => {
        onProductSelect(productId)
        setIsPopoverOpen(false)
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewProductImage(reader.result as string)
            }
            reader.readAsDataURL(event.target.files[0])
        }
        event.target.value = ""
    }

    const handleAddNewProduct = () => {
        if (newProductName.trim()) {
            onAddNewProduct({
                name: newProductName.trim(),
                image: newProductImage || undefined,
            })
            setNewProductName("")
            setNewProductImage("")
            setIsAddingNew(false)
        }
    }

    const handleCancelNewProduct = () => {
        setNewProductName("")
        setNewProductImage("")
        setIsAddingNew(false)
    }

    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <PlusIcon className="h-5 w-5 text-green-600" />
                    Agregar Productos
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!isAddingNew ? (
                    <div className="space-y-4">
                        {/* Buscador por nombre */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between bg-white dark:bg-slate-700"
                                        >
                                            Buscar producto existente...
                                            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribí para buscar..." />
                                            <CommandEmpty>No se encontró producto disponible.</CommandEmpty>
                                            <CommandGroup>
                                                {filteredProducts.map((product) => (
                                                    <CommandItem
                                                        key={product.productID}
                                                        onSelect={() => handleProductSelect(product.productID)}
                                                    >
                                                        <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                                                        {product.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsAddingNew(true)}
                                className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Nuevo
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nombre del producto
                            </label>
                            <Input
                                placeholder="Ingresa el nombre del nuevo producto..."
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                                className="bg-white dark:bg-slate-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Imagen del producto (opcional)
                            </label>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        id="new-product-image"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start bg-white dark:bg-slate-700"
                                        onClick={() => {
                                            const input = document.getElementById(
                                                "new-product-image"
                                            ) as HTMLInputElement
                                            input?.click()
                                        }}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {newProductImage ? "Cambiar imagen" : "Subir imagen"}
                                    </Button>
                                </div>
                            </div>
                            {newProductImage && (
                                <div className="mt-2">
                                    <img
                                        src={newProductImage}
                                        alt="Vista previa"
                                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleAddNewProduct}
                                disabled={!newProductName.trim()}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Agregar Producto
                            </Button>
                            <Button variant="outline" onClick={handleCancelNewProduct} className="flex-1">
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
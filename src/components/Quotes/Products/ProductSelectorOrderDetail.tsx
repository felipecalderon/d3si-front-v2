"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { PlusIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"

interface ProductSelectorProps {
    filteredProducts: IProduct[]
    onProductSelect: (productId: string) => void
    onAddNewProduct?: (productData: { name: string; image?: string }) => void
}

export function ProductSelector({ filteredProducts, onProductSelect }: ProductSelectorProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const handleProductSelect = (productId: string) => {
        onProductSelect(productId)
        setIsPopoverOpen(false)
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
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { PlusIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

interface ProductSelectorProps {
    filteredProducts: IProduct[]
    selectedProductID: string | null
    availableVariationsForSelectedProduct: IProductVariation[]
    onProductSelect: (productId: string | null) => void
    onAddProduct: (variationId: string) => void
}

export function ProductSelector({
    filteredProducts,
    selectedProductID,
    availableVariationsForSelectedProduct,
    onProductSelect,
    onAddProduct,
}: ProductSelectorProps) {
    return (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <PlusIcon className="h-5 w-5 text-green-600" />
                    Agregar Productos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex lg:flex-row gap-4 items-start">
                    {/* Buscador por nombre - Solo productos con variaciones disponibles */}
                    <div className="flex-1 space-y-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between bg-white dark:bg-slate-700"
                                >
                                    {selectedProductID
                                        ? filteredProducts.find((p) => p.productID === selectedProductID)?.name
                                        : "Buscar producto..."}
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
                                                onSelect={() => onProductSelect(product.productID)}
                                            >
                                                <CheckIcon
                                                    className={
                                                        "mr-2 h-4 w-4 " +
                                                        (selectedProductID === product.productID
                                                            ? "opacity-100"
                                                            : "opacity-0")
                                                    }
                                                />
                                                {product.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Tallas disponibles */}
                    {selectedProductID && (
                        <div className="flex-1 space-y-2">
                            <Select onValueChange={onAddProduct}>
                                <SelectTrigger className="bg-white dark:bg-slate-700">
                                    <SelectValue placeholder="Seleccionar Talla" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableVariationsForSelectedProduct.map((v) => (
                                        <SelectItem key={v.variationID} value={v.variationID}>
                                            {v.sizeNumber || "Sin talla"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
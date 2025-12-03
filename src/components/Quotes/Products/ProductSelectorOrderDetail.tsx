"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { PlusIcon, ChevronDownIcon, CheckIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"
import { useEditOrderStore } from "@/stores/order.store"
import { toast } from "sonner"
import { useTienda } from "@/stores/tienda.store"
import { useTerceroProducts } from "@/stores/terceroCost.store"

interface ProductSelectorProps {
    filteredProducts: IProduct[]
}

interface ProductWithVariation extends IProduct {
    sizeNumber: string
    sku: string
}

export function ProductSelector({ filteredProducts }: ProductSelectorProps) {
    const { actions } = useEditOrderStore()
    const { addProduct } = actions
    const { storeSelected } = useTienda()
    const { calculateThirdPartyPrice } = useTerceroProducts()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const productBySkuMap = React.useMemo(() => {
        const map = new Map<string, IProduct>()
        filteredProducts.forEach((product) => {
            product.ProductVariations.forEach((variation) => {
                map.set(variation.sku, product)
            })
        })
        return map
    }, [filteredProducts])

    // lista plana y enriquecida con O(V)
    const productsWithSize: ProductWithVariation[] = React.useMemo(() => {
        return filteredProducts
            .flatMap((product) =>
                product.ProductVariations.map((v) => {
                    return {
                        ...product,
                        sizeNumber: v.sizeNumber,
                        sku: v.sku,
                        stock: v.stockQuantity,
                    }
                })
            )
            .filter((p) => p.stock > 0)
    }, [filteredProducts])

    const handleProductSelect = (sku: string) => {
        const productFinded = productBySkuMap.get(sku)

        if (!productFinded) return toast.error(`No se encontró el sku: ${sku}`)

        const variationFinded = productFinded.ProductVariations.find((pv) => pv.sku === sku)

        if (variationFinded) {
            const { brutoCompra } = calculateThirdPartyPrice(variationFinded)
            addProduct(productFinded, { ...variationFinded, quantity: 1, priceCost: brutoCompra / 1.19 })
        }
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
                                            {productsWithSize.map((product, i) => (
                                                <CommandItem
                                                    key={`${product.productID}-${product.sizeNumber}-${i}`}
                                                    onSelect={() => handleProductSelect(product.sku)}
                                                >
                                                    <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                                                    {product.name} - {product.sizeNumber}
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

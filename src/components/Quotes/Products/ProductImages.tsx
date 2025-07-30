"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCwIcon } from "lucide-react"
import { IProduct } from "@/interfaces/products/IProduct"

interface ProductImagesProps {
    uniqueSelectedProducts: { product: IProduct; count: number }[]
    productsImage: { id: string; image: string }[]
    onImageUpload: (productId: string, file: File) => void
}

export function ProductImages({ uniqueSelectedProducts, productsImage, onImageUpload }: ProductImagesProps) {
    if (uniqueSelectedProducts.length === 0) return null

    const handleImageChange = (productId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(productId, event.target.files[0])
        }
        // Reset the input value to allow selecting the same file again
        event.target.value = ""
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uniqueSelectedProducts.map((productData) => {
                const productImage = productsImage.find((p) => p.id === productData.product.productID)
                const hasImage = productImage?.image && productImage.image.trim() !== ""

                return (
                    <Card
                        key={productData.product.productID}
                        className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 relative"
                    >
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                            {/* Contador en la esquina superior derecha */}
                            <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {productData.count}
                            </Badge>

                            {hasImage ? (
                                <div className="flex flex-col items-center gap-2">
                                    <img
                                        src={productImage.image}
                                        alt={productData.product.name}
                                        className="w-32 h-32 object-cover rounded-md border border-gray-200"
                                    />
                                    {/* Botón para cambiar imagen */}
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(productData.product.productID, e)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            id={`change-image-${productData.product.productID}`}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs bg-white dark:bg-blue-600 dark:border-transparent hover:bg-gray-50 border-gray-300"
                                            onClick={() => {
                                                const input = document.getElementById(
                                                    `change-image-${productData.product.productID}`
                                                ) as HTMLInputElement
                                                input?.click()
                                            }}
                                        >
                                            <RefreshCwIcon className="w-3 h-3 mr-1" />
                                            Cambiar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                                        <p className="text-sm text-gray-500 text-center px-2">Sin imagen</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                        Subir imagen de {productData.product.name}
                                    </p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(productData.product.productID, e)}
                                        className="text-sm"
                                    />
                                </>
                            )}
                            <p className="text-xs text-center font-medium text-slate-700 dark:text-slate-300">
                                {productData.product.name}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
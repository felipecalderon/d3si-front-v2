"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IProduct } from "@/interfaces/products/IProduct"

interface ProductImagesProps {
    uniqueSelectedProducts: { product: IProduct; count: number }[]
    productsImage: { id: string; image: string }[]
    onImageUpload: (productId: string, file: File) => void
}

export function ProductImages({ uniqueSelectedProducts, productsImage, onImageUpload }: ProductImagesProps) {
    if (uniqueSelectedProducts.length === 0) return null

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uniqueSelectedProducts.map((productData) => {
                const productImage = productsImage.find((p) => p.id === productData.product.productID)
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

                            {productImage?.image ? (
                                <img
                                    src={productImage.image}
                                    alt={productData.product.name}
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                        Subir imagen de {productData.product.name}
                                    </p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                onImageUpload(productData.product.productID, e.target.files[0])
                                            }
                                        }}
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
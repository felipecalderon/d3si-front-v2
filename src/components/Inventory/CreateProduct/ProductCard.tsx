"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Shirt, ImageIcon, Users, Package, Trash2, Plus, Hash } from "lucide-react"
import { useProductFormStore } from "@/stores/product-form.store"
import { CategorySelector } from "./CategorySelector"
import { SizeForm } from "./SizeForm"
import type { CreateProductFormData } from "@/interfaces/products/ICreateProductForm"
import type { ICategory } from "@/interfaces/categories/ICategory"

interface ProductCardProps {
    productIndex: number
    product: CreateProductFormData
    categories: ICategory[]
    error?: any
}

export function ProductCard({ productIndex, product, categories, error }: ProductCardProps) {
    const { handleProductChange, removeProduct, addSize } = useProductFormStore()

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 via-purple-500 to-indigo-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white">Producto {productIndex + 1}</h3>
                            <p className="text-blue-100">
                                {product.sizes.length} talla{product.sizes.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    {useProductFormStore.getState().products.length > 1 && (
                        <Button
                            type="button"
                            onClick={() => removeProduct(productIndex)}
                            className="p-3 rounded-xl text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                            title="Eliminar producto"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                            <Shirt className="w-4 h-4" />
                            Nombre del producto
                        </Label>
                        <Input
                            value={product.name}
                            onChange={(e) => handleProductChange(productIndex, "name", e.target.value)}
                            placeholder="Ej: Zapatillas deportivas"
                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                error?.name
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                        />
                        {error?.name && (
                            <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {error.name}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <ImageIcon className="w-4 h-4" />
                            URL de imagen
                        </Label>
                        <Input
                            value={product.image}
                            onChange={(e) => handleProductChange(productIndex, "image", e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className={`h-12 text-base border-2 transition-all duration-200 ${
                                error?.image
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                            }`}
                        />
                        {error?.image && (
                            <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {error.image}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Users className="w-4 h-4" />
                            Género
                        </Label>
                        <Select
                            value={product.genre}
                            onValueChange={(value) => handleProductChange(productIndex, "genre", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona género" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Hombre">Hombre</SelectItem>
                                <SelectItem value="Mujer">Mujer</SelectItem>
                                <SelectItem value="Unisex">Unisex</SelectItem>
                            </SelectContent>
                        </Select>
                        {error?.genre && (
                            <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                {error.genre}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            <Package className="w-4 h-4" />
                            Marca
                        </Label>
                        <Input
                            value={product.brand}
                            onChange={(e) => handleProductChange(productIndex, "brand", e.target.value)}
                            placeholder="Ej: D3SI, Otro..."
                            className="h-12 text-base border-2 transition-all duration-200 border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <CategorySelector
                    categories={categories}
                    selectedCategoryId={product.categoryID}
                    onCategorySelect={(categoryID) => handleProductChange(productIndex, "categoryID", categoryID)}
                    error={error?.category}
                />

                <div className="space-y-6">
                    <div className="flex lg:flex-row flex-col items-center justify-between">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Hash className="w-4 h-4 text-white" />
                            </div>
                            Tallas y Precios
                        </h4>
                    </div>
<div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={() => addSize(productIndex)}
                            className="flex lg:mt-0 mt-3 items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar talla
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {product.sizes.map((size, sIndex) => (
                            <SizeForm
                                key={sIndex}
                                productIndex={productIndex}
                                sizeIndex={sIndex}
                                size={size}
                                error={error?.sizes[sIndex]}
                            />
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

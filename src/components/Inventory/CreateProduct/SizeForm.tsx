"use client"

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Hash, Package, Minus } from "lucide-react";
import { useProductFormStore } from "@/stores/product-form.store";
import { calculateMarkup, generateRandomSku } from "@/utils/product-form.utils";
import type { Size } from "@/interfaces/products/ICreateProductForm";

interface SizeFormProps {
    productIndex: number;
    sizeIndex: number;
    size: Size;
    error?: Record<string, string>;
}

export function SizeForm({ productIndex, sizeIndex, size, error }: SizeFormProps) {
    const { handleSizeChange, removeSize } = useProductFormStore();

    const handleSkuBlur = (value: string) => {
        if (value.trim() === "") {
            handleSizeChange(productIndex, sizeIndex, "sku", generateRandomSku());
        }
    };

    return (
        <div className="relative bg-transparent dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 transition-all hover:shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="space-y-3 -mt-3">
                    <Label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Talla
                    </Label>
                    <Input
                        placeholder="XL, 42, M..."
                        value={size.sizeNumber}
                        onChange={(e) => handleSizeChange(productIndex, sizeIndex, "sizeNumber", e.target.value)}
                        className={`h-11 text-base border-2 transition-all duration-200 ${error?.sizeNumber ? "border-red-300 focus:border-red-500" : "border-gray-300 dark:border-slate-500 focus:border-blue-500"} bg-white dark:bg-slate-900`}
                    />
                    {error?.sizeNumber && <p className="text-red-500 text-xs">{error.sizeNumber}</p>}
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <DollarSign className="w-3 h-3" />
                        Costo Neto
                    </Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={size.priceCost}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => handleSizeChange(productIndex, sizeIndex, "priceCost", Number(e.target.value))}
                        className={`h-11 text-base border-2 transition-all duration-200 ${error?.priceCost ? "border-red-300 focus:border-red-500" : "border-gray-300 dark:border-slate-500 focus:border-blue-500"} bg-white dark:bg-slate-900`}
                    />
                    {error?.priceCost && <p className="text-red-500 text-xs">{error.priceCost}</p>}
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <DollarSign className="w-3 h-3" />
                        Precio Plaza
                    </Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={size.priceList}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => handleSizeChange(productIndex, sizeIndex, "priceList", Number(e.target.value))}
                        className={`h-11 text-base border-2 transition-all duration-200 ${error?.priceList ? "border-red-300 focus:border-red-500" : "border-gray-300 dark:border-slate-500 focus:border-blue-500"} bg-white dark:bg-slate-900`}
                    />
                    {error?.priceList && <p className="text-red-500 text-xs">{error.priceList}</p>}
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <Hash className="w-3 h-3" />
                        SKU
                    </Label>
                    <Input
                        placeholder="ABC123"
                        value={size.sku}
                        onChange={(e) => handleSizeChange(productIndex, sizeIndex, "sku", e.target.value)}
                        onBlur={(e) => handleSkuBlur(e.target.value)}
                        className={`h-11 text-base border-2 transition-all duration-200 ${error?.sku ? "border-red-300 focus:border-red-500" : "border-gray-300 dark:border-slate-500 focus:border-blue-500"} bg-white dark:bg-slate-900`}
                    />
                    {error?.sku && <p className="text-red-500 text-xs">{error.sku}</p>}
                </div>

                <div className="space-y-3">
                    <Label className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        <Package className="w-3 h-3" />
                        Stock
                    </Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={size.stockQuantity}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) => handleSizeChange(productIndex, sizeIndex, "stockQuantity", Number(e.target.value))}
                        className={`h-11 text-base border-2 transition-all duration-200 ${error?.stockQuantity ? "border-red-300 focus:border-red-500" : "border-gray-300 dark:border-slate-500 focus:border-blue-500"} bg-white dark:bg-slate-900`}
                    />
                    {error?.stockQuantity && <p className="text-red-500 text-xs">{error.stockQuantity}</p>}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-gray-200 dark:border-slate-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Markup:{" "}
                            {calculateMarkup(size.priceCost, size.priceList)}
                        </span>
                    </div>
                </div>
            </div>

            {useProductFormStore.getState().products[productIndex].sizes.length > 1 && (
                 <Button
                    type="button"
                    onClick={() => removeSize(productIndex, sizeIndex)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    title="Eliminar talla"
                >
                    <Minus className="w-5 h-5" />
                </Button>
            )}
        </div>
    );
}

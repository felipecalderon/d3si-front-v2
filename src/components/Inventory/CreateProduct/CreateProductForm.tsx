"use client"

import React, { useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Package } from "lucide-react";
import { useProductFormStore } from "@/stores/product-form.store";
import { createMassiveProducts } from "@/actions/products/createMassiveProducts";
import { ExcelImporter } from "./ExcelImporter";
import { ProductCard } from "./ProductCard";
import type { ICategory } from "@/interfaces/categories/ICategory";

export default function CreateProductForm({ categories }: { categories: ICategory[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { products, errors, addProduct, setProducts, resetForm } = useProductFormStore();

    useEffect(() => {
        return () => {
            resetForm();
        }
    }, [resetForm]);

    const hasErrors = (errs: any[]) => {
        return errs.some(
            (err) => err.name || err.category || err.sizes.some((e: any) => Object.keys(e).length > 0)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        useProductFormStore.getState().validate(); // Run validation
        const currentErrors = useProductFormStore.getState().errors;

        if (hasErrors(currentErrors)) {
            toast.error("Corrige los errores antes de guardar.");
            return;
        }

        startTransition(async () => {
            const result = await createMassiveProducts({ products });
            if (result.success) {
                toast.success("Productos guardados correctamente.");
                router.push("/home/inventory");
            } else {
                toast.error(result.error || "Error al guardar productos.");
            }
        });
    };

    return (
        <div className="lg:p-8">
            <div className="flex justify-end mb-4">
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setProducts([])}
                    disabled={products.length === 0}
                >
                    Eliminar todos los productos
                </Button>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            onClick={() => router.push("/home/inventory")}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-slate-700"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inventario
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="lg:text-3xl text-xl font-bold text-gray-900 dark:text-white">
                                    Crear Productos
                                </h1>
                                <p className="text-gray-600 lg:text-base text-xs dark:text-gray-300 mt-1">
                                    Agrega múltiples productos con sus respectivas tallas y precios
                                </p>
                            </div>
                        </div>

                        <div className="flex lg:flex-row flex-col items-center gap-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>
                                    {products.length} producto{products.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>
                                    {products.reduce((acc, p) => acc + p.sizes.length, 0)} variante
                                    {products.reduce((acc, p) => acc + p.sizes.length, 0) !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <ExcelImporter categories={categories} />

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <Button
                            type="button"
                            onClick={addProduct}
                            className="flex items-center gap-3 px-8 py-4 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar otro producto
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending || hasErrors(errors)}
                            onClick={handleSubmit}
                            className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                isPending || hasErrors(errors)
                                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white"
                            }`}
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Productos
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="space-y-8 overflow-y-auto mt-8" style={{ maxHeight: "60vh", minHeight: "200px" }}>
                    {products.map((product, pIndex) => (
                        <ProductCard
                            key={pIndex}
                            productIndex={pIndex}
                            product={product}
                            categories={categories}
                            error={errors[pIndex]}
                        />
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl p-8 mt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <Button
                            type="button"
                            onClick={addProduct}
                            className="flex items-center gap-3 px-8 py-4 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar otro producto
                        </Button>

                        <Button
                            type="submit"
                            disabled={isPending || hasErrors(errors)}
                            onClick={handleSubmit}
                            className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                                isPending || hasErrors(errors)
                                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white"
                            }`}
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar Productos
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
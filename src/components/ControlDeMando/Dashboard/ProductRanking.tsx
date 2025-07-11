"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CategoryManagementModal } from "../EditCategory/CategoryManagementModal"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"

interface Props {
    initialProducts: IProduct[]
    categories: ICategory[]
}

export default function ProductRanking({ initialProducts, categories }: Props) {
    const [categoriesData, setCategoriesData] = useState<ICategory[]>(categories)
    const [products, setProducts] = useState<IProduct[]>(initialProducts)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const totalProductsWithCategory = products.filter((p) => p.categoryID !== null).length

    const getCategoryStats = (categoria: ICategory) => {
        const subcategories = categoria.subcategories || []

        const subStats = subcategories.map((subcat) => {
            const count = products.filter((p) => p.categoryID === subcat.categoryID).length
            return {
                name: subcat.name,
                count,
            }
        })

        const totalInCategory = subStats.reduce((acc, s) => acc + s.count, 0)
        const categoryPercentage = totalProductsWithCategory
            ? Math.round((totalInCategory / totalProductsWithCategory) * 100)
            : 0

        return {
            subStats,
            totalInCategory,
            categoryPercentage,
        }
    }

    const handleModalClose = () => setShowModal(false)

    // Remover esta función:
    // const handleCategoriesUpdate = (updatedCategories: ICategory[]) => {
    //   setCategoriesData(updatedCategories)
    // }

    return (
        <div className="lg:col-span-5 lg:row-span-4 lg:col-start-8">
            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="dark:text-white text-sm md:text-base">
                        Ranking Productos por Categoría
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-96 flex flex-col">
                    {loading ? (
                        <div className="flex items-center justify-center flex-1">
                            <div className="text-sm dark:text-gray-300">Cargando datos...</div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="space-y-4">
                                {categoriesData.length > 0 ? (
                                    <Accordion type="multiple" className="w-full">
                                        {categoriesData.map((categoria, index) => {
                                            const { subStats, totalInCategory, categoryPercentage } =
                                                getCategoryStats(categoria)

                                            return (
                                                <AccordionItem key={categoria.name} value={`item-${index}`}>
                                                    <AccordionTrigger className="hover:no-underline">
                                                        <div className="flex items-center gap-2 md:gap-3 w-full">
                                                            <span className="text-xs md:text-sm dark:text-gray-300 w-16 md:w-auto">
                                                                {categoria.name}
                                                            </span>
                                                            <div className="flex-1 mx-2">
                                                                <Progress
                                                                    value={categoryPercentage}
                                                                    className="h-4 md:h-6"
                                                                />
                                                            </div>
                                                            <span className="text-xs md:text-sm font-medium dark:text-white bg-green-600 text-white px-2 py-1 rounded">
                                                                {categoryPercentage}%
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-3 pt-2 pl-4">
                                                            {subStats.map((subcat, subIndex) => {
                                                                const subPercentage = totalInCategory
                                                                    ? Math.round((subcat.count / totalInCategory) * 100)
                                                                    : 0
                                                                return (
                                                                    <div
                                                                        key={subIndex}
                                                                        className="flex items-center gap-2 md:gap-3"
                                                                    >
                                                                        <span className="text-xs md:text-sm dark:text-gray-400 w-16 md:w-auto">
                                                                            {subcat.name}
                                                                        </span>
                                                                        <div className="flex-1">
                                                                            <Progress
                                                                                value={subPercentage}
                                                                                className="h-3 md:h-4"
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs md:text-sm font-medium dark:text-gray-300 bg-gray-600 text-white px-2 py-1 rounded">
                                                                            {subPercentage}%
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })}
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                                                                Total productos: {totalInCategory}
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        })}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-8 text-sm dark:text-gray-300">
                                        No hay datos de categorías disponibles
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <Button onClick={() => setShowModal(true)} disabled={loading} className="w-full">
                            Administrar Categorías
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <CategoryManagementModal isOpen={showModal} onClose={handleModalClose} categories={categoriesData} />
        </div>
    )
}

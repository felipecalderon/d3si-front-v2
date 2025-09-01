"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CategoryProgressHeader } from "./CategoryProgressHeader"
import { CategoryPieChart } from "./CategoryPieChart"
import { CategoryProgressBars } from "./CategoryProgressBars"
import { CategoryManagementModal } from "./EditCategory/CategoryManagementModal"
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"

interface CategoryProgressProps {
    products: IProduct[]
    categories: ICategory[]
}

export function CategoryProgress({ products, categories }: CategoryProgressProps) {
    const {
        viewMode,
        showModal,
        pieData,
        progressData,
        selectedCategoryId,
        selectedCategoryName,
        hasData,
        handleModeChange,
        handlePieClick,
        setShowModal,
    } = useCategoryAnalytics({ products, categories })

    if (!hasData) {
        return (
            <Card className="mb-6">
                <CardHeader>
                    <CategoryProgressHeader
                        viewMode={viewMode}
                        onModeChange={handleModeChange}
                        onManageCategories={() => setShowModal(true)}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {viewMode === "tipo"
                            ? "No hay datos de productos disponibles por tipo."
                            : "No hay categorías con productos disponibles."}
                    </div>
                </CardContent>
                {viewMode === "categoria" && (
                    <CategoryManagementModal isOpen={showModal} onClose={() => setShowModal(false)} />
                )}
            </Card>
        )
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CategoryProgressHeader
                    viewMode={viewMode}
                    onModeChange={handleModeChange}
                    onManageCategories={() => setShowModal(true)}
                />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CategoryPieChart
                        data={pieData}
                        viewMode={viewMode}
                        selectedCategoryId={selectedCategoryId}
                        onPieClick={handlePieClick}
                    />
                    <div className="max-h-[400px] overflow-y-auto pr-1">
                        <CategoryProgressBars
                            data={progressData ?? []}
                            viewMode={viewMode}
                            selectedCategoryName={selectedCategoryName}
                        />
                    </div>
                </div>
            </CardContent>

            <CategoryManagementModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </Card>
    )
}

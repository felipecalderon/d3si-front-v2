"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CategoryProgressHeader } from "./CategoryProgressHeader"
import { CategoryPieChart } from "./CategoryPieChart"
import { CategoryProgressBars } from "./CategoryProgressBars"
import "@/styles/flip-card.css"
import { CategoryManagementModal } from "./EditCategory/CategoryManagementModal"
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics"
import type { IProduct } from "@/interfaces/products/IProduct"
import type { ICategory } from "@/interfaces/categories/ICategory"

interface CategoryProgressProps {
    products: IProduct[]
    categories: ICategory[]
}

export function CategoryProgress({ products, categories }: CategoryProgressProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const {
        viewMode,
        showModal,
        pieData,
        progressData,
        selectedCategoryId,
        selectedCategoryName,
        hasData,
        parentStats,
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
                <div className="relative perspective-1000">
                    <div
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-transform duration-700 transform-style-preserve-3d hover:cursor-pointer ${
                            isFlipped ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Cara frontal */}
                        <div className="backface-hidden">
                            <CategoryPieChart
                                data={pieData}
                                viewMode={viewMode}
                                selectedCategoryId={selectedCategoryId}
                                onPieClick={handlePieClick}
                            />
                        </div>
                        <div className="backface-hidden max-h-[400px] overflow-y-auto pr-1">
                            <CategoryProgressBars
                                data={progressData ?? []}
                                viewMode={viewMode}
                                selectedCategoryName={selectedCategoryName}
                                parentCategories={parentStats}
                                showSummary={false}
                            />
                            <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg bounce-hover"
                            >
                                <svg
                                    className="w-6 h-6 transform -rotate-90 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Cara trasera */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180">
                            <div className="h-full">
                                <CategoryProgressBars
                                    data={progressData ?? []}
                                    viewMode={viewMode}
                                    selectedCategoryName={selectedCategoryName}
                                    parentCategories={parentStats}
                                    showSummary={true}
                                />
                                <button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg bounce-hover"
                                >
                                    <svg
                                        className="w-6 h-6 transform rotate-90 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CategoryManagementModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </Card>
    )
}

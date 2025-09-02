"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FolderOpen, X } from "lucide-react"
import { useCategories } from "@/stores/categories.store"
import Modal from "./Modal" // Adjust the path as needed
import { CategoryItem } from "./CategoryItem"
import { NewCategoryForm } from "./NewCategoryForm"

interface CategoryManagementModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CategoryManagementModal({ isOpen, onClose }: CategoryManagementModalProps) {
    const { categories, fetchCategories, loading } = useCategories()

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
        }
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Administrar Categorías" maxWidth="max-w-4xl">
            <div className="relative p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
                        <FolderOpen className="w-5 h-5" />
                        <span>Categorías Existentes</span>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No hay categorías disponibles
                        </div>
                    ) : (
                        <div className={`space-y-4 ${loading ? "opacity-70 pointer-events-none cursor-wait" : ""}`}>
                            {categories.map((category) => (
                                <CategoryItem key={category.categoryID} category={category} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="pb-10">
                    <NewCategoryForm />
                </div>

                <div className="fixed bottom-0 left-0 pb-2 bg-black/25 w-full pr-10 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-600 flex items-center space-x-2 bg-transparent"
                    >
                        <X className="w-4 h-4" />
                        <span>Cerrar</span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

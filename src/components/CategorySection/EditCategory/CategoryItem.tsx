"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, Edit2, Trash2, Check, X, Plus, Save, LoaderCircle } from "lucide-react"
import { useCategories } from "@/stores/categories.store"
import { toast } from "sonner"
import { ICategory } from "@/interfaces/categories/ICategory"
import { updateCategory } from "@/actions/categories/updateCategory"
import { deleteCategory } from "@/actions/categories/deleteCategory"
import { createSubategory } from "@/actions/categories/createSubCategory"
import { SubCategoryItem } from "./SubCategoryItem"

interface CategoryItemProps {
    category: ICategory
}

export function CategoryItem({ category }: CategoryItemProps) {
    const { fetchCategories } = useCategories()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(category.name)
    const [isAddingSub, setIsAddingSub] = useState(false)
    const [newSubName, setNewSubName] = useState("")

    const handleUpdate = async () => {
        if (!name.trim() || name === category.name) {
            setIsEditing(false)
            return
        }

        try {
            setLoading(true)
            await updateCategory({ ...category, name: name.trim() })
            toast.success("Categoría actualizada con éxito")
            await fetchCategories()
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating category:", error)
            toast.error("Error al actualizar la categoría")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta categoría y todas sus subcategorías?")) return

        try {
            setLoading(true)
            await deleteCategory(category.categoryID)
            toast.success("Categoría eliminada con éxito")
            await fetchCategories()
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error("Error al eliminar la categoría")
        } finally {
            setLoading(false)
        }
    }

    const handleAddSubcategory = async () => {
        if (!newSubName.trim()) return

        try {
            setLoading(true)
            await createSubategory(category.categoryID, newSubName.trim())
            toast.success("Subcategoría creada con éxito")
            setNewSubName("")
            setIsAddingSub(false)
            await fetchCategories()
        } catch (error) {
            console.error("Error creating subcategory:", error)
            toast.error("Error al crear la subcategoría")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-gray-200 dark:border-gray-600 dark:bg-slate-700">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-gray-900 dark:text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4" />
                        {isEditing ? (
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-8 text-sm dark:bg-slate-800 dark:border-gray-500"
                                    autoFocus
                                />
                                <Button
                                    size="sm"
                                    onClick={handleUpdate}
                                    disabled={!name.trim()}
                                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ) : (
                            <span>{category.name}</span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {category.subcategories?.map((sub) => (
                        <SubCategoryItem key={sub.categoryID} subcategory={sub} />
                    ))}

                    {isAddingSub && (
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-slate-600 rounded-md">
                            <Input
                                value={newSubName}
                                onChange={(e) => setNewSubName(e.target.value)}
                                placeholder="Nombre de la subcategoría"
                                className="flex-1 dark:bg-slate-700 dark:border-gray-500"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddSubcategory}
                                disabled={!newSubName.trim() || loading}
                                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                            >
                                {loading ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsAddingSub(false)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingSub(true)}
                        disabled={isAddingSub || isEditing}
                        className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-600"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Subcategoría
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag, Edit2, Trash2, Check, X, LoaderCircle } from "lucide-react"
import { useCategories } from "@/stores/categories.store"
import { toast } from "sonner"
import { ICategory } from "@/interfaces/categories/ICategory"
import { updateSubCategory } from "@/actions/categories/updateSubCategory"
import { deleteCategory } from "@/actions/categories/deleteCategory"

interface SubCategoryItemProps {
    subcategory: ICategory
}

export function SubCategoryItem({ subcategory }: SubCategoryItemProps) {
    const { fetchCategories } = useCategories()
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(subcategory.name)

    const handleUpdate = async () => {
        if (!name.trim() || name === subcategory.name) {
            setIsEditing(false)
            return
        }

        try {
            setLoading(true)
            await updateSubCategory(name.trim(), subcategory.categoryID, subcategory.parentID)
            toast.success("Subcategoría actualizada con éxito")
            await fetchCategories()
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating subcategory:", error)
            toast.error("Error al actualizar la subcategoría")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta subcategoría?")) return

        try {
            setLoading(true)
            await deleteCategory(subcategory.categoryID)
            toast.success("Subcategoría eliminada con éxito")
            await fetchCategories()
        } catch (error) {
            console.error("Error deleting subcategory:", error)
            toast.error("Error al eliminar la subcategoría")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600 rounded-md">
            <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                {isEditing ? (
                    <div className="flex items-center space-x-2">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-8 text-sm dark:bg-slate-700 dark:border-gray-500"
                            autoFocus
                        />
                        <Button
                            size="sm"
                            onClick={handleUpdate}
                            disabled={!name.trim() || loading}
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                        >
                            <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <span className="text-sm text-gray-700 dark:text-gray-200">{subcategory.name}</span>
                )}
            </div>
            <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                    {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                </Button>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, X, Folder, FolderOpen, FolderPlus, Tag } from "lucide-react"
import { createCategory } from "@/actions/categories/createCategory"
import { createSubategory } from "@/actions/categories/createSubCategory"
import { motion } from "framer-motion"
import Modal from "./Modal" // Adjust the path as needed
import { updateCategory } from "@/actions/categories/updateCategory"
import { updateSubCategory } from "@/actions/categories/updateSubCategory"
import { deleteCategory } from "@/actions/categories/deleteCategory"
import { Edit2, Trash2, Check } from "lucide-react"
import { ICategory } from "@/interfaces/categories/ICategory"
import { useCategories } from "@/stores/categories.store"
import { toast } from "sonner"
import { getAllCategories } from "@/actions/categories/getAllCategories"

interface CategoryManagementModalProps {
    isOpen: boolean
    onClose: () => void
    categories: ICategory[]
}

interface NewSubcategory {
    name: string
    parentID: string
}

export function CategoryManagementModal({ isOpen, onClose }: CategoryManagementModalProps) {
    const { categories, setCategories } = useCategories()
    const [saving, setSaving] = useState(false)
    const [newSubcategories, setNewSubcategories] = useState<NewSubcategory[]>([])
    const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<string | null>(null)
    const [newSubcategoryName, setNewSubcategoryName] = useState("")
    const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
    const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null)
    const [editSubcategoryName, setEditSubcategoryName] = useState("")

    const handleAddSubcategory = (parentID: string) => {
        setAddingSubcategoryFor(parentID)
        setNewSubcategoryName("")
    }

    const handleSaveSubcategory = () => {
        if (newSubcategoryName.trim() && addingSubcategoryFor) {
            setNewSubcategories((prev) => [
                ...prev,
                {
                    name: newSubcategoryName.trim(),
                    parentID: addingSubcategoryFor,
                },
            ])
            setNewSubcategoryName("")
            setAddingSubcategoryFor(null)
        }
    }

    const handleCancelSubcategory = () => {
        setNewSubcategoryName("")
        setAddingSubcategoryFor(null)
    }

    const handleRemoveNewSubcategory = (index: number) => {
        setNewSubcategories((prev) => prev.filter((_, i) => i !== index))
    }

    const handleEditCategory = (category: ICategory) => {
        setEditingCategory(category)
    }

    const handleSaveEditCategory = async (categoryId: string) => {
        if (!editingCategory?.name.trim()) return

        try {
            await updateCategory(editingCategory)
            // Actualizar el estado local
            const updatedCategories = categories.map((cat) =>
                cat.categoryID === categoryId ? { ...cat, name: editingCategory.name.trim() } : cat
            )
            toast.success(`Categoría ${editingCategory.name} actualizada con éxito`)
            setCategories(updatedCategories)
            // Notificar al componente padre
            setEditingCategory(null)
        } catch (error) {
            console.error("Error updating category:", error)
        }
    }

    const handleEditSubcategory = (subcategoryId?: string, currentName?: string) => {
        if (!subcategoryId) return
        if (!currentName) return
        setEditingSubcategory(subcategoryId)
        setEditSubcategoryName(currentName)
    }

    const handleSaveEditSubcategory = async (subcategoryId?: string, parentId?: string) => {
        if (!editSubcategoryName.trim()) return
        if (!subcategoryId) return
        if (!parentId) return
        try {
            await updateSubCategory(editSubcategoryName.trim(), subcategoryId, parentId)
            const categories = await getAllCategories()
            setCategories(categories)
            setEditingSubcategory(null)
            setEditSubcategoryName("")
            toast.success("Categoría actualizada con éxito")
        } catch (error) {
            console.error("Error updating subcategory:", error)
        }
    }

    const handleDeleteCategory = async (categoryId: string, isSubcategory = false) => {
        if (
            !confirm(
                isSubcategory
                    ? "¿Estás seguro de eliminar esta subcategoría?"
                    : "¿Estás seguro de eliminar esta categoría y todas sus subcategorías?"
            )
        ) {
            return
        }

        await deleteCategory(categoryId)
        const categories = await getAllCategories()
        setCategories(categories)
        toast.success("Categoría eliminada")
    }

    const handleCancelEdit = () => {
        setEditingCategory(null)
        setEditingSubcategory(null)
        setAddingSubcategoryFor(null)
        setNewSubcategories([])
        setEditSubcategoryName("")
    }

    const handleSaveAll = async () => {
        setSaving(true)
        try {
            // Crear categoría padre si existe
            if (editingCategory?.name.trim()) {
                await createCategory(editingCategory?.name.trim())
                toast.success(`Categoría ${editingCategory?.name} creada con éxito`)
            }

            // Crear subcategorías
            for (const subcategory of newSubcategories) {
                await createSubategory(subcategory.parentID, subcategory.name)
                toast.success(`Subcategoría ${subcategory.name} creada con éxito`)
            }

            const categories = await getAllCategories()
            setCategories(categories)
            handleCancelEdit()
        } catch (error) {
            console.error("Error saving categories:", error)
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        setEditingCategory(null)
        setNewSubcategories([])
        setAddingSubcategoryFor(null)
        setNewSubcategoryName("")
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Administrar Categorías" maxWidth="max-w-4xl">
            <div className="relative p-6 space-y-6">
                {/* Categorías existentes */}
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
                        <div className="space-y-4">
                            {categories.map((category) => (
                                <Card
                                    key={category.categoryID}
                                    className="border-gray-200 dark:border-gray-600 dark:bg-slate-700"
                                >
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-medium text-gray-900 dark:text-white flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Folder className="w-4 h-4" />
                                                {!!editingCategory ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            value={editingCategory.name}
                                                            onChange={(e) =>
                                                                setEditingCategory({
                                                                    ...editingCategory,
                                                                    name: e.target.value,
                                                                })
                                                            }
                                                            className="h-8 text-sm dark:bg-slate-800 dark:border-gray-500"
                                                            autoFocus
                                                        />
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveEditCategory(category.categoryID)}
                                                            disabled={!editingCategory.name.trim()}
                                                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={handleCancelEdit}
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
                                                    onClick={() => handleEditCategory(category)}
                                                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteCategory(category.categoryID, false)}
                                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {/* Subcategorías existentes */}
                                            {category.subcategories?.map((subcategory) => (
                                                <div
                                                    key={subcategory.categoryID}
                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-600 rounded-md"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <Tag className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                                                        {editingSubcategory === subcategory.categoryID ? (
                                                            <div className="flex items-center space-x-2">
                                                                <Input
                                                                    value={editSubcategoryName}
                                                                    onChange={(e) =>
                                                                        setEditSubcategoryName(e.target.value)
                                                                    }
                                                                    className="h-8 text-sm dark:bg-slate-700 dark:border-gray-500"
                                                                    autoFocus
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleSaveEditSubcategory(
                                                                            subcategory.categoryID,
                                                                            category.categoryID
                                                                        )
                                                                    }
                                                                    disabled={!editSubcategoryName.trim()}
                                                                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Check className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={handleCancelEdit}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                                                {subcategory.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEditSubcategory(
                                                                    subcategory.categoryID,
                                                                    subcategory.name
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        >
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (!subcategory) return
                                                                if (!subcategory.categoryID) return

                                                                handleDeleteCategory(subcategory.categoryID, true)
                                                            }}
                                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Nuevas subcategorías a agregar */}
                                            {newSubcategories
                                                .filter((sub) => sub.parentID === category.categoryID)
                                                .map((subcategory, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-700"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                                                {subcategory.name} (Nueva)
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleRemoveNewSubcategory(
                                                                    newSubcategories.findIndex(
                                                                        (s) =>
                                                                            s.name === subcategory.name &&
                                                                            s.parentID === subcategory.parentID
                                                                    )
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </motion.div>
                                                ))}

                                            {/* Formulario para agregar subcategoría */}
                                            {addingSubcategoryFor === category.categoryID && (
                                                <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-slate-600 rounded-md">
                                                    <Input
                                                        value={newSubcategoryName}
                                                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                                                        placeholder="Nombre de la subcategoría"
                                                        className="flex-1 dark:bg-slate-700 dark:border-gray-500"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleSaveSubcategory}
                                                        disabled={!newSubcategoryName.trim()}
                                                        className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={handleCancelSubcategory}
                                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddSubcategory(category.categoryID)}
                                                disabled={
                                                    addingSubcategoryFor === category.categoryID || !!editingCategory
                                                }
                                                className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-600"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar Subcategoría
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Crear nueva categoría padre */}
                <div className="space-y-4">
                    {editingCategory && (
                        <Card className="border-green-200 dark:border-green-700 dark:bg-slate-700">
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Label htmlFor="editCategoryName" className="text-sm font-medium dark:text-white">
                                        Nombre de la categoría padre *
                                    </Label>
                                    <Input
                                        id="editCategoryName"
                                        value={editingCategory?.name}
                                        onChange={(e) =>
                                            setEditingCategory({ ...editingCategory, name: e.target.value })
                                        }
                                        placeholder="Ingresa el nombre de la nueva categoría"
                                        className="dark:bg-slate-800 dark:border-gray-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="fixed bottom-0 left-0 pb-2 bg-black/25 w-full pr-10 flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={saving}
                        className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-600 flex items-center space-x-2 bg-transparent"
                    >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

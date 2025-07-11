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

interface Subcategory {
  categoryID: string
  name: string
  parentID: string
  createdAt: string
  updatedAt: string
}

interface Category {
  categoryID: string
  name: string
  parentID: string | null
  subcategories: Subcategory[]
  createdAt: string
  updatedAt: string
}

interface CategoryManagementModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
}

interface NewSubcategory {
  name: string
  parentID: string
}

export function CategoryManagementModal({
  isOpen,
  onClose,
  categories: initialCategories,
}: CategoryManagementModalProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newParentCategory, setNewParentCategory] = useState("")
  const [newSubcategories, setNewSubcategories] = useState<NewSubcategory[]>([])
  const [addingSubcategoryFor, setAddingSubcategoryFor] = useState<string | null>(null)
  const [newSubcategoryName, setNewSubcategoryName] = useState("")

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

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

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      // Crear categoría padre si existe
      if (newParentCategory.trim()) {
        await createCategory(newParentCategory.trim())
      }

      // Crear subcategorías
      for (const subcategory of newSubcategories) {
        await createSubategory(subcategory.parentID, subcategory.name)
      }

      // Redireccionar a la página especificada
      window.location.href = "http://localhost:3000/home/controlDeMando"
    } catch (error) {
      console.error("Error saving categories:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setNewParentCategory("")
    setNewSubcategories([])
    setAddingSubcategoryFor(null)
    setNewSubcategoryName("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Administrar Categorías" maxWidth="max-w-4xl">
      <div className="p-6 space-y-6">
        {/* Categorías existentes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
            <FolderOpen className="w-5 h-5" />
            <span>Categorías Existentes</span>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No hay categorías disponibles</div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card key={category.categoryID} className="border-gray-200 dark:border-gray-600 dark:bg-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                        <Folder className="w-4 h-4" />
                        <span>{category.name}</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSubcategory(category.categoryID)}
                        disabled={addingSubcategoryFor === category.categoryID}
                        className="dark:border-gray-500 dark:text-white dark:hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Subcategoría
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Subcategorías existentes */}
                      {category.subcategories?.map((subcategory) => (
                        <div
                          key={subcategory.categoryID}
                          className="flex items-center p-3 bg-gray-50 dark:bg-slate-600 rounded-md"
                        >
                          <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-300" />
                          <span className="text-sm text-gray-700 dark:text-gray-200">{subcategory.name}</span>
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
                                    (s) => s.name === subcategory.name && s.parentID === subcategory.parentID,
                                  ),
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Crear nueva categoría padre */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium dark:text-white text-gray-700">
            <FolderPlus className="w-5 h-5" />
            <span>Crear Nueva Categoría</span>
          </div>

          <Card className="border-green-200 dark:border-green-700 dark:bg-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Label htmlFor="newParentCategory" className="text-sm font-medium dark:text-white">
                  Nombre de la categoría padre *
                </Label>
                <Input
                  id="newParentCategory"
                  value={newParentCategory}
                  onChange={(e) => setNewParentCategory(e.target.value)}
                  placeholder="Ingresa el nombre de la nueva categoría"
                  className="dark:bg-slate-800 dark:border-gray-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
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
            disabled={saving || (!newParentCategory.trim() && newSubcategories.length === 0)}
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

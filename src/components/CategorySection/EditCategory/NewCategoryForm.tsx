"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Save, X } from "lucide-react"
import { createCategory } from "@/actions/categories/createCategory"
import { useCategories } from "@/stores/categories.store"
import { toast } from "sonner"

export function NewCategoryForm() {
    const [newCategoryName, setNewCategoryName] = useState("")
    const [saving, setSaving] = useState(false)
    const { fetchCategories } = useCategories()

    const handleSaveNewCategory = async () => {
        if (!newCategoryName.trim()) return

        setSaving(true)
        try {
            await createCategory(newCategoryName.trim())
            toast.success(`Categoría "${newCategoryName}" creada con éxito`)
            setNewCategoryName("")
            await fetchCategories()
        } catch (error) {
            console.error("Error creating category:", error)
            toast.error("Error al crear la categoría")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card className="border-green-200 dark:border-green-700 dark:bg-slate-700">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-green-600 dark:text-green-400 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Crear Nueva Categoría</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Label htmlFor="newCategoryName" className="text-sm font-medium dark:text-white">
                        Nombre de la categoría
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="newCategoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Ej: Poleras"
                            className="dark:bg-slate-800 dark:border-gray-500"
                        />
                        <Button
                            onClick={handleSaveNewCategory}
                            disabled={saving || !newCategoryName.trim()}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

"use client"

import { CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ViewMode = "categoria" | "tipo"

interface CategoryProgressHeaderProps {
  viewMode: ViewMode
  onModeChange: (mode: ViewMode) => void
  onManageCategories: () => void
}

export function CategoryProgressHeader({ viewMode, onModeChange, onManageCategories }: CategoryProgressHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="text-lg font-semibold">
        Distribución de inventario por {viewMode === "categoria" ? "Categoría" : "Tipo"}
      </CardTitle>
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "categoria" ? "default" : "outline"}
          size="sm"
          onClick={() => onModeChange("categoria")}
        >
          Categoría
        </Button>
        <Button variant={viewMode === "tipo" ? "default" : "outline"} size="sm" onClick={() => onModeChange("tipo")}>
          Tipo
        </Button>
        {viewMode === "categoria" && (
          <Button size="sm" onClick={onManageCategories} className="ml-2">
            Administrar Categorías
          </Button>
        )}
      </div>
    </div>
  )
}

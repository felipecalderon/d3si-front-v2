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
      <div className="flex lg:flex-row flex-col items-center justify-between">
          <CardTitle className="text-lg font-semibold">
              Distribución de inventario por {viewMode === "categoria" ? "Categoría" : "Tipo"}
          </CardTitle>
          <div className="flex items-center lg:mt-0 mt-4 gap-2">
              <Button
                  variant={viewMode === "categoria" ? "default" : "outline"}
                  size="sm"
                  className={viewMode === "categoria" ? "bg-transparent text-white bg-blue-500 " : ""}
                  onClick={() => onModeChange("categoria")}
              >
                  Categoría
              </Button>
              <Button
                  variant={viewMode === "tipo" ? "default" : "outline"}
                  size="sm"
                  className={viewMode === "tipo" ? "bg-transparent text-white bg-blue-500 " : ""}
                  onClick={() => onModeChange("tipo")}
              >
                  Tipo
              </Button>
              {viewMode === "categoria" && (
                  <Button size="sm" onClick={onManageCategories} className="bg-transparent text-white bg-green-500 ">
                      Administrar Categorías
                  </Button>
              )}
          </div>
      </div>
  )
}

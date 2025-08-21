import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
interface ScanInputProps {
    codigo: string
    setCodigo: (value: string) => void
    handleAddProduct: (e: React.FormEvent) => void
    isAdding: boolean | undefined
}

export const ScanInput = ({ codigo, setCodigo, handleAddProduct, isAdding }: ScanInputProps) => (
    <form onSubmit={handleAddProduct} className="flex items-center gap-2 mb-6">
        <Input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de producto"
            className="flex-1"
            autoFocus
        />

        <Button
            type="submit"
            disabled={isAdding}
            className={`px-4 py-2 font-semibold rounded-lg transition ${
                isAdding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
            {isAdding ? "Agregando..." : "Agregar"}
        </Button>
    </form>
)

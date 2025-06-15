import React from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ScanInputProps {
    codigo: string
    setCodigo: (value: string) => void
    handleAddProduct: (e: React.FormEvent) => void
}

export const ScanInput = ({ codigo, setCodigo, handleAddProduct }: ScanInputProps) => (
    <form onSubmit={handleAddProduct} className="flex items-center gap-2 mb-6">
        <Input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de producto"
            className="flex-1 bg-transparent"
        />

        <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
            Agregar
        </Button>
    </form>
)

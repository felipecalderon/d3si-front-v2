import React from "react"

interface ScanInputProps {
    codigo: string
    setCodigo: (value: string) => void
    handleAddProduct: (e: React.FormEvent) => void
}

export const ScanInput = ({ codigo, setCodigo, handleAddProduct }: ScanInputProps) => (
    <form onSubmit={handleAddProduct} className="flex items-center gap-2 mb-6">
        <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de producto"
            className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
            Agregar
        </button>
    </form>
)

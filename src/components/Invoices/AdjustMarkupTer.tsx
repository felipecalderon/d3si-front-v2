"use client"

import { useTerceroProducts } from "@/stores/terceroCost.store"
import { Input } from "../ui/input"

export default function MarkupTerceroAjuste() {
    const {
        markupTerceroMin,
        setMarkupTerceroMin,
        markupTerceroMax,
        setMarkupTerceroMax,
        markupFlotanteMin,
        setMarkupFlotanteMin,
    } = useTerceroProducts()
    return (
        <div className="flex gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg shadow">
            <div className="flex-1">
                <label htmlFor="markupMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Markup Min Tercero
                </label>
                <Input
                    id="markupMin"
                    type="number"
                    value={markupTerceroMin}
                    min={1}
                    onChange={(e) => setMarkupTerceroMin(parseFloat(e.target.value) || 0)}
                    className="w-full"
                    step="0.1"
                />
            </div>
            <div className="flex-1">
                <label htmlFor="markupMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Markup Max Tercero
                </label>
                <Input
                    id="markupMax"
                    type="number"
                    value={markupTerceroMax}
                    onChange={(e) => setMarkupTerceroMax(parseFloat(e.target.value) || 0)}
                    className="w-full"
                    step="0.1"
                />
            </div>
            <div className="flex-1">
                <label
                    htmlFor="MarkupFlotMin"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Markup Min Flotante
                </label>
                <Input
                    id="MarkupFlotMin"
                    type="number"
                    min={1}
                    value={markupFlotanteMin}
                    onChange={(e) => setMarkupFlotanteMin(parseFloat(e.target.value) || 0)}
                    className="w-full"
                    step="0.1"
                />
            </div>
        </div>
    )
}

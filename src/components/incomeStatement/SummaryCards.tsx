"use client"
import { useState } from "react"

const periods = [
    { label: "Mes anterior", value: "lastMonth" },
    { label: "Trimestre móvil", value: "rollingQuarter" },
    { label: "1er trimestre", value: "q1" },
    { label: "2do trimestre", value: "q2" },
    { label: "3er trimestre", value: "q3" },
    { label: "4to trimestre", value: "q4" },
    { label: "Año", value: "year" },
]

export default function SummaryCards({ onSelect, selected }: { onSelect?: (v: string) => void; selected?: string }) {
    const [selectedPeriod, setSelectedPeriod] = useState(selected || "lastMonth")

    const handleSelect = (value: string) => {
        setSelectedPeriod(value)
        onSelect?.(value)
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {periods.map((p) => (
                <button
                    key={p.value}
                    className={`rounded-lg px-4 py-3 text-center font-semibold border transition-all ${
                        selectedPeriod === p.value
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => handleSelect(p.value)}
                >
                    {p.label}
                </button>
            ))}
        </div>
    )
}

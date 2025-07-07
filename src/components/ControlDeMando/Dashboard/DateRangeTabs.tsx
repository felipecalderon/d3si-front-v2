"use client"

import React, { useState } from "react"

export default function DateRangeTabs() {
    const [dateRange, setDateRange] = useState({ start: "01-01-2020", end: "31-12-2020" })
    const [activeTab, setActiveTab] = useState("detallado")
    const tabs = [
        { id: "detallado", label: "Ventas Detallado" },
        { id: "comparadas", label: "Ventas Comparadas" },
        { id: "markup", label: "Mark Up" },
    ]

    return (
        <div className="mb-4 md:mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-4">
                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 lg:flex-row flex-col">
                        <input
                            title="fecharango"
                            type="text"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-32 w-full md:w-auto"
                        />
                        <input
                            type="text"
                            title="fecharango"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-32 w-full md:w-auto"
                        />
                    </div>
                </div>

                <div className="flex lg:flex-row flex-col gap-1 md:gap-2 lg:overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-yellow-400 text-black"
                                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
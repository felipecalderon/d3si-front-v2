import React from "react"

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string
    color?: string
}

export default function StatCard({ icon, label, value, color = "text-black" }: StatCardProps) {
    return (
        <div className="flex dark:bg-slate-700 bg-white shadow rounded p-4 items-center">
            <div className="w-12 h-12 dark:bg-blue-100 bg-orange-100 dark:text-blue-600 text-orange-600 flex items-center justify-center rounded mr-4 text-xl">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-xl dark:text-white font-bold ${color}`}>{value}</p>
            </div>
        </div>
    )
}

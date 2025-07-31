"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
    { mes: "Ene", beneficio: 50000 },
    { mes: "Feb", beneficio: 75000 },
    { mes: "Mar", beneficio: 60000 },
    { mes: "Abr", beneficio: 82000 },
    { mes: "May", beneficio: 92000 },
    { mes: "Jun", beneficio: 87000 },
]

export default function BenefitBarChart() {
    return (
        <Card className="p-4">
            <h3 className="text-base font-semibold mb-4 text-gray-700 dark:text-white">Total beneficio por mes</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Bar dataKey="beneficio" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

const data = [
    {
        name: "Ventas",
        value: 45.8,
        fill: "#0ea5e9",
    },
]

export default function GaugeChart() {
    return (
        <div className="bg-white p-4 shadow rounded text-center">
            <h3 className="text-sm text-gray-600 mb-2">Ventas totales del presente mes / Meta</h3>

            <div className="flex justify-center">
                <RadialBarChart
                    width={200}
                    height={200}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    barSize={20}
                    data={data}
                    startAngle={180}
                    endAngle={0}
                >
                    <PolarAngleAxis type="number" domain={[0, 60]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" />
                </RadialBarChart>
            </div>

            <p className="text-xl font-bold">$45.846.410</p>
            <p className="text-sm text-gray-500">Meta: $60MM</p>
        </div>
    )
}

"use client"

import React, { useState } from "react"
import { Building2, FileText, DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { XAxis, CartesianGrid, AreaChart, Area } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import dynamic from "next/dynamic"
// Datos de ejemplo basados en la imagen
const ventasData = [
    { mes: "Ene", presencial: 45, mayorista: 35, web: 15 },
    { mes: "Feb", presencial: 42, mayorista: 32, web: 18 },
    { mes: "Mar", presencial: 48, mayorista: 38, web: 20 },
    { mes: "Abr", presencial: 44, mayorista: 34, web: 16 },
    { mes: "May", presencial: 50, mayorista: 40, web: 22 },
    { mes: "Jun", presencial: 46, mayorista: 36, web: 19 },
    { mes: "Jul", presencial: 52, mayorista: 42, web: 24 },
    { mes: "Ago", presencial: 49, mayorista: 39, web: 21 },
    { mes: "Sep", presencial: 47, mayorista: 37, web: 18 },
    { mes: "Oct", presencial: 53, mayorista: 43, web: 25 },
    { mes: "Nov", presencial: 51, mayorista: 41, web: 23 },
    { mes: "Dic", presencial: 55, mayorista: 45, web: 27 },
]
const chartConfig = {
    presencial: {
        label: "Canal Presencial",
        color: "#22c55e",
    },
    mayorista: {
        label: "Canal Mayorista",
        color: "#f97316",
    },
    web: {
        label: "Canal Web",
        color: "#3b82f6",
    },
}

const productosData = [
    { nombre: "calzado", porcentaje: 60, color: "#ef4444" },
    { nombre: "poleras", porcentaje: 20, color: "#f97316" },
    { nombre: "bananos", porcentaje: 5, color: "#eab308" },
    { nombre: "pantalón", porcentaje: 5, color: "#22c55e" },
    { nombre: "lockeys", porcentaje: 5, color: "#3b82f6" },
    { nombre: "polares", porcentaje: 5, color: "#8b5cf6" },
]

// Datos por año para el ranking mayorista
const ventasObjetivosPorAño: Record<number, { ventas: number; objetivo: number }> = {
    2018: { ventas: 650304, objetivo: 700000 },
    2019: { ventas: 717304, objetivo: 776000 },
    2020: { ventas: 580000, objetivo: 650000 },
}

const tiendasPorAño: Record<number, { nombre: string; ventas: number }[]> = {
    2018: [
        { nombre: "La Manga", ventas: 250349 },
        { nombre: "Mojacar", ventas: 180997 },
        { nombre: "Aguilas", ventas: 87498 },
        { nombre: "Garrucha", ventas: 54645 },
        { nombre: "Puerto de Mazarrón", ventas: 46564 },
        { nombre: "Cartagena", ventas: 30251 },
    ],
    2019: [
        { nombre: "La Manga", ventas: 277349 },
        { nombre: "Mojacar", ventas: 209997 },
        { nombre: "Aguilas", ventas: 97498 },
        { nombre: "Garrucha", ventas: 64645 },
        { nombre: "Puerto de Mazarrón", ventas: 36564 },
        { nombre: "Cartagena", ventas: 31251 },
    ],
    2020: [
        { nombre: "La Manga", ventas: 200349 },
        { nombre: "Mojacar", ventas: 150997 },
        { nombre: "Aguilas", ventas: 77498 },
        { nombre: "Garrucha", ventas: 44645 },
        { nombre: "Puerto de Mazarrón", ventas: 26564 },
        { nombre: "Cartagena", ventas: 21251 },
    ],
}

const datosRankingWeb = [
    { categoria: "Distribuid...", valor: 29 },
    { categoria: "Importad...", valor: 20 },
    { categoria: "Comercial...", valor: 18 },
    { categoria: "Distribuid...", valor: 17 },
    { categoria: "Transport...", valor: 16 },
    { categoria: "Logística...", valor: 15 },
    { categoria: "Transport...", valor: 14 },
    { categoria: "Logística...", valor: 12 },
    { categoria: "Comercial...", valor: 11 },
    { categoria: "Inversione...", valor: 11 },
]

export default function ControlDashboard() {
    const [dateRange, setDateRange] = useState({ start: "01-01-2020", end: "31-12-2020" })
    const [activeTab, setActiveTab] = useState("detallado")
    const DynamicGaugeChart = dynamic(() => import("@/components/dashboard/GaugeChart"), { ssr: false })

    const [añoSeleccionado, setAñoSeleccionado] = useState(2019)

    const datosActuales = ventasObjetivosPorAño[añoSeleccionado]
    const tiendasActuales = tiendasPorAño[añoSeleccionado]
    const porcentajeObjetivo = (datosActuales.ventas / datosActuales.objetivo) * 100
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <div className="flex-1 w-full flex flex-col">
                <div className="lg:p-3 md:p-6">
                    {/* Header con fechas y tabs */}
                    <div className="mb-4 md:mb-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-2 lg:flex-row flex-col">
                                    <input
                                        title="fecharango"
                                        type="text"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-20 w-full md:w-auto"
                                    />
                                    <input
                                        type="text"
                                        title="fecharango"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="px-2 md:px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm md:text-base lg:w-20 w-full md:w-auto"
                                    />
                                </div>
                            </div>

                            <div className="flex lg:flex-row flex-col gap-1 md:gap-2 lg:overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("detallado")}
                                    className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "detallado"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    }`}
                                >
                                    Ventas Detallado
                                </button>
                                <button
                                    onClick={() => setActiveTab("comparadas")}
                                    className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "comparadas"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    }`}
                                >
                                    Ventas Comparadas
                                </button>
                                <button
                                    onClick={() => setActiveTab("markup")}
                                    className={`px-2 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                                        activeTab === "markup"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    }`}
                                >
                                    Mark Up
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Grid principal - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 md:gap-6">
                        {/* Columna izquierda - Estadísticas */}
                        <div className="lg:col-span-3 lg:row-span-7">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-2">
                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <Building2 className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Depósitos</p>
                                        <p className="text-lg md:text-2xl font-bold dark:text-white">$241.950</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <FileText className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Boletas Emitidas</p>
                                        <p className="text-lg md:text-2xl font-bold dark:text-white">128</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <FileText className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-gray-400" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Facturas Emitidas</p>
                                        <p className="text-lg md:text-2xl font-bold dark:text-white">31</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <DollarSign className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Facturación</p>
                                        <p className="text-sm md:text-2xl font-bold dark:text-white">$45.846.410</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Ventas Web</p>
                                        <p className="text-lg md:text-2xl font-bold dark:text-white">19</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <TrendingUp className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Margen Bruto</p>
                                        <p className="text-sm md:text-2xl font-bold dark:text-white">$13.459.790</p>
                                    </CardContent>
                                </Card>

                                <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                    <CardContent className="p-2 md:p-3 text-center">
                                        <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 text-orange-500" />
                                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Clientes por cobrar</p>
                                        <p className="text-sm md:text-2xl font-bold dark:text-white">$3.400.000</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Columna central - Gráfico circular */}
                        <div className="lg:col-span-4 lg:mb-0 mb-10 lg:row-span-4 lg:col-start-4">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-center dark:text-white text-sm md:text-base">
                                        Ventas totales del presente mes / Meta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center items-center h-48 md:h-full">
                                        <div className="w-full max-w-sm mx-auto">
                                            <DynamicGaugeChart />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Columna derecha - Ranking productos */}
                        <div className="lg:col-span-5 lg:row-span-4 lg:col-start-8">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="dark:text-white text-sm md:text-base">
                                        Ranking Ventas Canal Presencial 80%
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 md:space-y-6">
                                        {productosData.map((producto, index) => (
                                            <div key={index} className="flex items-center gap-2 md:gap-3">
                                                <span className="text-xs md:text-sm dark:text-gray-300 w-16 md:w-auto">
                                                    {producto.nombre}
                                                </span>
                                                <div className="flex-1">
                                                    <Progress
                                                        value={producto.porcentaje}
                                                        className="h-4 md:h-6"
                                                        style={{
                                                            background: `linear-gradient(to right, ${producto.color} 0%, ${producto.color} ${producto.porcentaje}%, #e5e7eb ${producto.porcentaje}%, #e5e7eb 100%)`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs md:text-sm font-medium dark:text-white bg-green-600 text-white px-2 py-1 rounded">
                                                    {producto.porcentaje}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Gráfico de evolución */}
                        <div className="lg:col-span-9 lg:row-span-3 relative lg:col-start-4 lg:row-start-5">
                            {/* Headers del gráfico - Solo en desktop */}
                            <div className="hidden lg:block lg:absolute lg:-top-16 rounded-md left-0 dark:bg-gray-800 border-0 shadow-lg py-4 px-6">
                                <h1 className="text-sm">Evolución de Ventas totales últimos 12 meses / Meta</h1>
                            </div>
                            <div className="hidden lg:flex lg:absolute lg:-top-16 right-0 text-sm gap-3">
                                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-green-600">Ranking Ventas</span>
                                        <span className="text-green-600">Canal Mayorista</span>
                                    </div>
                                    <span className="font-medium mt-3 ml-2 dark:text-white">15%</span>
                                </div>
                                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-blue-600">Ranking Ventas</span>
                                        <span className="text-blue-600">Canal Web</span>
                                    </div>
                                    <span className="font-medium mt-3 ml-2 dark:text-white">5%</span>
                                </div>
                            </div>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xs md:text-sm dark:text-white">
                                        Evolución de Ventas Totales últimos 12 meses / Meta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer className="h-[200px] md:h-[250px] w-full" config={chartConfig}>
                                        <AreaChart data={ventasData}>
                                            <defs>
                                                <linearGradient id="fillPresencial" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="fillMayorista" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                                                </linearGradient>
                                                <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" tickLine={false} axisLine={false} />

                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent
                                                        indicator="dot"
                                                        labelFormatter={(value) => `Mes: ${value}`}
                                                    />
                                                }
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="presencial"
                                                fill="url(#fillPresencial)"
                                                stroke="#22c55e"
                                                stackId="ventas"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="mayorista"
                                                fill="url(#fillMayorista)"
                                                stroke="#f97316"
                                                stackId="ventas"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="web"
                                                fill="url(#fillWeb)"
                                                stroke="#3b82f6"
                                                stackId="ventas"
                                            />

                                            <ChartLegend content={<ChartLegendContent />} />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Segundo grid - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-5 gap-4 md:gap-8 mt-6">
                        {/* Ranking Ventas Canal Web */}
                        <div className="lg:col-span-4 lg:row-span-5">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-sm dark:text-white">
                                        Ranking Ventas Canal Web 5%
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 md:space-y-4">
                                        {datosRankingWeb.map((item, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                        {item.categoria}
                                                    </span>
                                                    <span className="text-xs font-medium text-white bg-teal-600 px-2 py-0.5 rounded">
                                                        {item.valor} mil
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={item.valor}
                                                    className="h-2 md:h-3 bg-gray-200 dark:bg-gray-700 [&>div]:bg-orange-400"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Header Canal Mayorista */}
                        <div className="lg:col-span-5 lg:col-start-5 lg:row-start-1 lg:row-span-1">
                            <Card className="dark:bg-gray-800 flex border-0 shadow-lg">
                                <CardTitle className="text-sm dark:text-white mx-4 mt-4 lg:mt-8">
                                    Ranking Ventas Canal Mayorista 15%
                                </CardTitle>
                                <CardContent>
                                    <div className="flex gap-2 mt-2 lg:mt-6">
                                        {[2018, 2019, 2020].map((año) => (
                                            <button
                                                key={año}
                                                onClick={() => setAñoSeleccionado(año)}
                                                className={`px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-sm font-medium ${
                                                    añoSeleccionado === año
                                                        ? "bg-gray-800 text-white dark:bg-white dark:text-gray-800"
                                                        : "bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                                                }`}
                                            >
                                                {año}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Botones Ranking y Ticket */}
                        <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-1">
                            <Card className="dark:bg-gray-800 flex border-0 rounded-lg shadow-lg">
                                <CardContent className="flex gap-2 py-2 md:py-4 w-full">
                                    <button className="flex-1 px-2 md:px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        Ranking Tiendas
                                    </button>
                                    <button className="flex-1 px-2 md:px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        Ticket Medio
                                    </button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ventas por Tienda */}
                        <div className="lg:col-span-4 lg:col-start-5 lg:row-start-2 lg:row-span-4">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardContent className="space-y-4 md:space-y-6">
                                    <div className="pt-4">
                                        <h4 className="text-sm font-medium mb-3 dark:text-white">Ventas por Tienda</h4>
                                        <div className="space-y-2">
                                            {tiendasActuales.map((tienda, index) => {
                                                const colores = [
                                                    "#ef4444",
                                                    "#22c55e",
                                                    "#f97316",
                                                    "#3b82f6",
                                                    "#8b5cf6",
                                                    "#ec4899",
                                                ]
                                                return (
                                                    <div
                                                        key={index}
                                                        className="py-2 px-4 md:px-16 rounded text-white text-center text-xs md:text-sm font-medium"
                                                        style={{ backgroundColor: colores[index] }}
                                                    >
                                                        {tienda.nombre} → {tienda.ventas.toLocaleString()}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ventas Totales vs Objetivos */}
                        <div className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:row-span-4">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-sm my-2 dark:text-white">
                                        Ventas Totales vs Objetivos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="relative w-40 h-40 md:w-52 md:h-52 mx-auto">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="50%"
                                                        cy="50%"
                                                        r="35%"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="12"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="50%"
                                                        cy="50%"
                                                        r="35%"
                                                        stroke="#ef4444"
                                                        strokeWidth="12"
                                                        fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 0.35 * Math.min(160, 208) * 0.75} ${
                                                            2 * Math.PI * 0.35 * Math.min(160, 208)
                                                        }`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <p className="text-lg md:text-xl font-bold dark:text-white text-gray-900">
                                                            717.304
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            776.000
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

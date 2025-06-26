"use client"

import React, { useState } from "react"
import { Building2, FileText, DollarSign, ShoppingCart, TrendingUp, Users, Calendar, Target, Store } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { VentaCanalMayorista } from "@/components/dashboard/VentasCanalMayorista"

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

    const [añoSeleccionado, setAñoSeleccionado] = useState(2019)

    const datosActuales = ventasObjetivosPorAño[añoSeleccionado]
    const tiendasActuales = tiendasPorAño[añoSeleccionado]
    const porcentajeObjetivo = (datosActuales.ventas / datosActuales.objetivo) * 100
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <div className="flex-1 flex flex-col">
                <div className="p-6">
                    {/* Header con fechas y tabs */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-4 items-center">
                                <div className="flex gap-2">
                                    <input
                                        title="fecharango"
                                        type="text"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                        className="px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        title="fecharango"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                        className="px-3 py-2 border rounded-lg bg-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab("detallado")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        activeTab === "detallado"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    }`}
                                >
                                    Ventas Detallado
                                </button>
                                <button
                                    onClick={() => setActiveTab("comparadas")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        activeTab === "comparadas"
                                            ? "bg-yellow-400 text-black"
                                            : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                                    }`}
                                >
                                    Ventas Comparadas
                                </button>
                                <button
                                    onClick={() => setActiveTab("markup")}
                                    className={`px-4 py-2 rounded-lg font-medium ${
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
                    {/* Grid principal */}
                    <div className="grid grid-cols-12 grid-rows-7 gap-6">
                        {/* Columna izquierda - Estadísticas */}
                        <div className="col-span-3 row-span-7">
                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <Building2 className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Depósitos</p>
                                    <p className="text-2xl font-bold dark:text-white">$241.950</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Boletas Emitidas</p>
                                    <p className="text-2xl font-bold dark:text-white">128</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Facturas Emitidas</p>
                                    <p className="text-2xl font-bold dark:text-white">31</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Facturación</p>
                                    <p className="text-2xl font-bold dark:text-white">$45.846.410</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ventas Web</p>
                                    <p className="text-2xl font-bold dark:text-white">19</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Margen Bruto</p>
                                    <p className="text-2xl font-bold dark:text-white">$13.459.790</p>
                                </CardContent>
                            </Card>

                            <Card className="dark:bg-gray-800 border-0 shadow-lg mb-2">
                                <CardContent className="p-3 text-center">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Clientes por cobrar</p>
                                    <p className="text-2xl font-bold dark:text-white">$3.400.000</p>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Columna central - Gráficos principales */}
                        <div className="col-span-4 row-span-4 col-start-4">
                            {/* Gráfico circular de ventas */}
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-center dark:text-white">
                                        Ventas totales del presente mes / Meta
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative">
                                        {/* <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                            data={[
                                { name: 'Ventas', value: 45846410, fill: '#2563EB' },
                                { name: 'Meta', value: 14153590, fill: '#f59e0b' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            startAngle={90}
                            endAngle={450}
                            dataKey="value"
                            />
                        </PieChart>
                        </ResponsiveContainer> */}
                                        {/* <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">$60MM</p>
                                            <p className="text-2xl font-bold dark:text-white">$45.846.410</p>
                                            </div>
                                            </div> */}
                                        <VentaCanalMayorista />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Columna derecha */}
                        <div className="col-span-5 row-span-4 col-start-8">
                            {/* Ranking de productos */}
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="dark:text-white">
                                        Ranking Ventas Canal Presencial 80%
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {productosData.map((producto, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <span className="text-sm dark:text-gray-300">{producto.nombre}</span>
                                                <div className="flex-1">
                                                    <Progress
                                                        value={producto.porcentaje}
                                                        className="h-7"
                                                        style={{
                                                            background: `linear-gradient(to right, ${producto.color} 0%, ${producto.color} ${producto.porcentaje}%, #e5e7eb ${producto.porcentaje}%, #e5e7eb 100%)`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium dark:text-white bg-green-600 text-white px-2 py-1 rounded">
                                                    {producto.porcentaje}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Columna de grafico ventas totales */}
                        <div className="col-span-9 row-span-3 relative col-start-4 row-start-5 ">
                            <div className="absolute -top-16 rounded-md left-0 dark:bg-gray-800 border-0 shadow-lg py-4 px-6">
                                <h1>Evolución de Ventas totales últimos 12 meses / Meta</h1>
                            </div>
                            <div className="absolute -top-16 right-0 flex text-sm">
                                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6 mr-3">
                                    <div className="flex flex-col ">
                                        <span className="text-green-600">Ranking Ventas</span>
                                        <span className="text-green-600">Canal Mayorista</span>
                                    </div>
                                    <span className="font-medium mt-3 ml-2 dark:text-white">15%</span>
                                </div>
                                <div className="flex text-center rounded-md dark:bg-gray-800 border-0 shadow-lg py-2 px-6">
                                    <div className="flex flex-col ">
                                        <span className="text-blue-600">Ranking Ventas</span>
                                        <span className="text-blue-600">Canal Web</span>
                                    </div>
                                    <span className="font-medium mt-3 ml-2 dark:text-white">5%</span>
                                </div>
                            </div>
                            {/* Evolución de ventas */}
                            <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-sm dark:text-white"></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={ventasData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="presencial"
                                                stroke="#22c55e"
                                                strokeWidth={2}
                                                name="presencial"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="mayorista"
                                                stroke="#f97316"
                                                strokeWidth={2}
                                                name="mayorista"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="web"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                name="web"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                        {/* ultima fila */}
                        <div className="col-span-9 col-start-4 relative">
                            <Card className="dark:bg-gray-800 flex border-0 absolute -top-24 shadow-lg">
                                <CardTitle className="text-sm dark:text-white mx-4 mt-8">
                                    Ranking Ventas Canal Mayorista 15%
                                </CardTitle>
                                <CardContent>
                                    {/* Selector de años */}
                                    <div className="flex gap-2 mt-6">
                                        {[2018, 2019, 2020].map((año) => (
                                            <button
                                                key={año}
                                                onClick={() => setAñoSeleccionado(año)}
                                                className={`px-4 py-2 rounded text-sm font-medium ${
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
                            <Card className="dark:bg-gray-800 flex border-0 rounded-lg absolute -top-24 right-0 shadow-lg">
                                <CardContent className="flex gap-2 py-4">
                                    {/* Botones inferiores */}
                                    <button className="flex-1 px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        Ranking Tiendas
                                    </button>
                                    <button className="flex-1 px-3 py-1 bg-white dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-500 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                        Ticket Medio
                                    </button>
                                </CardContent>
                            </Card>
                            {/* Ventas vs Objetivos */}
                            <Card className="dark:bg-gray-800 border-0 absolute -left-72 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-sm my-2 dark:text-white">
                                        Ventas Totales vs Objetivos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="relative w-52 h-52 mx-auto">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="104"
                                                        cy="104"
                                                        r="90"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="12"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="104"
                                                        cy="104"
                                                        r="90"
                                                        stroke="#ef4444"
                                                        strokeWidth="12"
                                                        fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 90 * 0.75} ${
                                                            2 * Math.PI * 90
                                                        }`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <p className="text-xl font-bold dark:text-white text-gray-900">
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
                            <Card className="bg-transparent border-0">
                                <div className="absolute">
                                    <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                        <CardContent className="space-y-6">
                                            {/* Ventas por Tienda */}
                                            <div className="pt-4">
                                                <h4 className="text-sm font-medium mb-3 dark:text-white">
                                                    Ventas por Tienda
                                                </h4>
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
                                                                className="py-2 px-16 rounded text-white text-center text-sm font-medium"
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
                                <div className="absolute right-0">
                                    <Card className="dark:bg-gray-800 border-0 shadow-lg">
                                        {/* Ranking Ventas Canal Web */}
                                        <CardHeader>
                                            <CardTitle className="text-sm dark:text-white">
                                                Ranking Ventas Canal Web 5%
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {datosRankingWeb.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <span className="text-xs min-w-[70px] text-gray-600 dark:text-gray-400">
                                                            {item.categoria}
                                                        </span>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 bg-orange-400 h-4 w-72 rounded-sm"></div>
                                                                <div className="bg-teal-600 h-4 rounded-sm text-white text-xs px-2 flex items-center justify-center font-medium min-w-[40px]">
                                                                    {item.valor} mil
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

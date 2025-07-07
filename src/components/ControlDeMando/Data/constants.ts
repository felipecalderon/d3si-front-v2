// Datos de ejemplo basados en la imagen
export const ventasData = [
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

export const chartConfig = {
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

export const productosData = [
    { nombre: "calzado", porcentaje: 60, color: "#ef4444" },
    { nombre: "poleras", porcentaje: 20, color: "#f97316" },
    { nombre: "bananos", porcentaje: 5, color: "#eab308" },
    { nombre: "pantalón", porcentaje: 5, color: "#22c55e" },
    { nombre: "lockeys", porcentaje: 5, color: "#3b82f6" },
    { nombre: "polares", porcentaje: 5, color: "#8b5cf6" },
]

// Datos por año para el ranking mayorista
export const ventasObjetivosPorAño: Record<number, { ventas: number; objetivo: number }> = {
    2018: { ventas: 650304, objetivo: 700000 },
    2019: { ventas: 717304, objetivo: 776000 },
    2020: { ventas: 580000, objetivo: 650000 },
}

export const tiendasPorAño: Record<number, { nombre: string; ventas: number }[]> = {
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

export const datosRankingWeb = [
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

export const estadisticasData = [
    {
        icon: "Building2",
        label: "Depósitos",
        value: "$241.950",
        color: "text-orange-500"
    },
    {
        icon: "FileText",
        label: "Boletas Emitidas",
        value: "128",
        color: "text-orange-500"
    },
    {
        icon: "FileText",
        label: "Facturas Emitidas",
        value: "31",
        color: "text-gray-400"
    },
    {
        icon: "DollarSign",
        label: "Facturación",
        value: "$45.846.410",
        color: "text-orange-500"
    },
    {
        icon: "ShoppingCart",
        label: "Ventas Web",
        value: "19",
        color: "text-orange-500"
    },
    {
        icon: "TrendingUp",
        label: "Margen Bruto",
        value: "$13.459.790",
        color: "text-orange-500"
    },
    {
        icon: "Users",
        label: "Clientes por cobrar",
        value: "$3.400.000",
        color: "text-orange-500"
    }
]
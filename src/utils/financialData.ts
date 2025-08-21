// financialData.ts
export const financialData = {
  monthlyData: [
    { mes: "Enero", mesCorto: "Ene", ingresos: 200000, costos: 120000, gastos: 30000, beneficio: 50000, margen: 25 },
    { mes: "Febrero", mesCorto: "Feb", ingresos: 180000, costos: 110000, gastos: 25000, beneficio: 45000, margen: 25 },
    { mes: "Marzo", mesCorto: "Mar", ingresos: 220000, costos: 130000, gastos: 35000, beneficio: 55000, margen: 25 },
    { mes: "Abril", mesCorto: "Abr", ingresos: 210000, costos: 125000, gastos: 32000, beneficio: 53000, margen: 25 },
    { mes: "Mayo", mesCorto: "May", ingresos: 230000, costos: 135000, gastos: 37000, beneficio: 58000, margen: 25 },
    { mes: "Junio", mesCorto: "Jun", ingresos: 240000, costos: 140000, gastos: 40000, beneficio: 60000, margen: 25 },
    { mes: "Julio", mesCorto: "Jul", ingresos: 250000, costos: 145000, gastos: 42000, beneficio: 63000, margen: 25 },
  ],

  storesData: [
    { tienda: "Sucursal Centro", beneficio: 120000, margen: 25 },
    { tienda: "Sucursal Norte", beneficio: 95000, margen: 22 },
    { tienda: "Sucursal Sur", beneficio: 78000, margen: 18 },
  ],

  financialSummary: {
    periodo: "Enero - Julio 2025",
    ventas: 1530000,
    costoVentas: 905000,
    gastosVenta: 90000,
    gastosAdministracion: 45000,
    gastosFinancieros: 15000,
    otrosIngresos: 50000,
    impuestos: 25000,
  },

  operatingExpenses: [
    { name: "Gastos de venta", value: 90000, color: "#ef4444" },
    { name: "Gastos de administración", value: 45000, color: "#f59e0b" },
    { name: "Gastos financieros", value: 15000, color: "#8b5cf6" },
  ],

  periods: [
    { label: "Mes anterior", value: "lastMonth" },
    { label: "Trimestre móvil", value: "rollingQuarter" },
    { label: "1er trimestre", value: "q1" },
    { label: "2do trimestre", value: "q2" },
    { label: "3er trimestre", value: "q3" },
    { label: "4to trimestre", value: "q4" },
    { label: "Año", value: "year" },
  ],

  totals: {
    ingresos: 1530000,
    costos: 905000,
    gastos: 211000,
    beneficio: 416000,
    margen: 25,
  },

  cards: [
    { 
      label: "Total Ingresos", 
      value: 1530000, 
      color: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
    },
    { 
      label: "Total Costos", 
      value: 905000, 
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
    },
    { 
      label: "Total Gastos", 
      value: 211000, 
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
    },
    { 
      label: "Total Beneficio", 
      value: 416000, 
      color: "text-blue-700 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
    },
    { 
      label: "% Margen", 
      value: "25%", 
      color: "text-purple-700 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
      isPercentage: true
    },
  ]
}

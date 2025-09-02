import { getAllCategories } from "@/actions/categories/getAllCategories"
import { getAllProducts } from "@/actions/products/getAllProducts"
import { getResume } from "@/actions/totals/getResume"
import DateRangeTabs from "@/components/ControlDeMando/Dashboard/DateRangeTabs"
import GaugeChartSection from "@/components/ControlDeMando/Dashboard/GaugeChartSection"
import MayoristaSection from "@/components/ControlDeMando/Dashboard/MayoristaSection"
import ProductRanking from "@/components/ControlDeMando/Dashboard/ProductRanking"
import SalesEvolutionChart from "@/components/ControlDeMando/Dashboard/SalesEvolutionChart"
import StatisticsGrid from "@/components/ControlDeMando/Dashboard/StatisticsGrid"
import WebRankingSection from "@/components/ControlDeMando/Dashboard/WebRankingSection"
import React from "react"

export default async function ControlDashboard() {
    // Lógica de obtención en servidor
    const [productsData, categoriesData, resume] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getResume(),
    ])
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <div className="flex-1 w-full flex flex-col">
                <div className="lg:p-3 md:p-6">
                    {/* Header con fechas y tabs */}
                    <DateRangeTabs />

                    {/* Grid principal - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-7 gap-4 md:gap-6">
                        {/* Columna izquierda - Estadísticas */}
                        <StatisticsGrid />

                        {/* Columna central - Gráfico circular */}
                        <GaugeChartSection resume={resume} />

                        {/* Columna derecha - Ranking productos */}
                        <ProductRanking initialProducts={productsData} categories={categoriesData} />

                        {/* Gráfico de evolución */}
                        <SalesEvolutionChart />
                    </div>

                    {/* Segundo grid - Mobile First */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-5 gap-4 md:gap-8 mt-6">
                        {/* Ranking Ventas Canal Web */}
                        <WebRankingSection />

                        {/* Sección Mayorista */}
                        <MayoristaSection />
                    </div>
                </div>
            </div>
        </div>
    )
}

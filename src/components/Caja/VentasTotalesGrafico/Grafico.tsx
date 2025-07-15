"use client"
import dynamic from "next/dynamic"

const GaugeChart = dynamic(() => import("@/components/Caja/VentasTotalesGrafico/GaugeChart"), {
    ssr: false,
})

const Grafico = () => {
    return <GaugeChart />
}

export default Grafico

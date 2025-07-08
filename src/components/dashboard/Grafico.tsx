"use client"
import dynamic from "next/dynamic"

const GaugeChart = dynamic(() => import("@/components/dashboard/GaugeChart"), {
    ssr: false,
})

const Grafico = () => {
    return <GaugeChart />
}

export default Grafico

"use client"
import { updateMeta } from "@/actions/totals/updateMeta"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getResume } from "@/actions/totals/getResume"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

export default function GaugeChart() {
    const [totales, setTotales] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [editingMeta, setEditingMeta] = useState(false)
    const [metaInput, setMetaInput] = useState("")

    const handleMetaSave = async () => {
        const metaNumber = Number(metaInput)
        if (!metaInput || isNaN(metaNumber) || metaNumber <= 0) {
            toast.error("Ingresá una meta válida")
            setEditingMeta(false)
            return
        }

        try {
            const today = new Date()
            const fecha = formatDateToYYYYMMDD(today)

            const result = await updateMeta(fecha, metaNumber)
            if (result) {
                toast.success(`Meta actualizada a $${metaNumber.toLocaleString("es-AR")}`)
                setTotales((prev: any) => ({
                    ...prev,
                    metaMensual: { ...prev.metaMensual, meta: metaNumber },
                }))
            } else {
                toast.error("No se pudo guardar la meta")
            }
        } catch (err) {
            console.error(err)
            toast.error("Ocurrió un error al guardar la meta")
        } finally {
            setEditingMeta(false)
        }
    }

    useEffect(() => {
        const fetchTotales = async () => {
            try {
                setLoading(true)
                setError(null)
                const resume = await getResume()
                console.log("Totales:", resume)
                setTotales(resume)
            } catch (error) {
                console.error("Error al obtener totales:", error)
                setError("Error al cargar los datos")
            } finally {
                setLoading(false)
            }
        }

        fetchTotales()
    }, [])

    // Helper function to safely get nested values with fallbacks
    const getSalesAmount = () => {
        return totales?.totales?.sales?.month?.total?.amount || 0
    }

    const getMetaAmount = () => {
        return totales?.metaMensual?.meta || 0
    }

    // Calculate progress percentage
    const getProgressPercentage = () => {
        const sales = getSalesAmount()
        const meta = getMetaAmount()
        if (meta === 0) return 0
        return Math.min((sales / meta) * 100, 100) // Cap at 100%
    }

    // Generate chart data based on actual progress
    const getChartData = () => {
        const percentage = getProgressPercentage()
        return [
            {
                name: "Ventas",
                value: percentage,
                fill:
                    percentage >= 100
                        ? "#10b981"
                        : percentage >= 75
                        ? "#0ea5e9"
                        : percentage >= 50
                        ? "#f59e0b"
                        : "#ef4444",
            },
        ]
    }

    if (loading) {
        return (
            <div className="dark:bg-gray-800 bg-white p-4 py-5 shadow rounded text-center">
                <h3 className="text-sm dark:text-gray-500 text-gray-600 mb-2">
                    Ventas totales del presente mes / Meta
                </h3>
                <div className="space-y-2">
                    <div className="flex justify-center">
                        <Skeleton className="h-[200px] w-[200px] rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-40 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="dark:bg-gray-800 bg-white p-4 py-5 shadow rounded text-center">
                <h3 className="text-sm dark:text-gray-500 text-gray-600 mb-2">
                    Ventas totales del presente mes / Meta
                </h3>
                <div className="flex justify-center">
                    <RadialBarChart
                        width={200}
                        height={200}
                        cx={100}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        barSize={20}
                        data={getChartData()}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" />
                    </RadialBarChart>
                </div>
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }

    return (
        <div className="dark:bg-gray-800 bg-white p-4 py-5 shadow rounded text-center">
            <h3 className="text-sm dark:text-gray-500 text-gray-600 mb-2">Ventas totales del presente mes / Meta</h3>

            <div className="flex justify-center">
                <RadialBarChart
                    width={200}
                    height={200}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    barSize={20}
                    data={getChartData()}
                    startAngle={180}
                    endAngle={0}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" />
                </RadialBarChart>
            </div>

            <p className="text-xl -mt-6 dark:text-white font-bold">${getSalesAmount().toLocaleString("es-AR")}</p>
            {editingMeta ? (
                <Input
                    type="number"
                    value={metaInput}
                    onWheel={(e) => {
                        e.currentTarget.blur()
                    }}
                    onChange={(e) => setMetaInput(e.target.value)}
                    onBlur={handleMetaSave}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleMetaSave()
                        }
                    }}
                    autoFocus
                    className="w-32 mx-auto text-sm text-center"
                />
            ) : (
                <p
                    className="text-sm text-gray-500 cursor-pointer hover:underline"
                    onClick={() => {
                        setMetaInput(getMetaAmount().toString())
                        setEditingMeta(true)
                    }}
                >
                    Meta: ${getMetaAmount().toLocaleString("es-AR")}
                </p>
            )}

            <p className="text-sm font-medium mt-1" style={{ color: getChartData()[0].fill }}>
                {getProgressPercentage().toFixed(1)}% completado
            </p>
        </div>
    )
}

"use client"
import { updateMeta } from "@/actions/totals/updateMeta"
import { formatDateToYYYYMMDD } from "@/utils/dateTransforms"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { use, useState } from "react"
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"
import { toPrice } from "@/utils/priceFormat"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { useRouter } from "next/navigation"
import { useAuth } from "@/stores/user.store"

export default function TotalSalesResumeGraph({ resume }: { resume: IResume }) {
    const [editingMeta, setEditingMeta] = useState(false)
    const [metaInput, setMetaInput] = useState("")
    const route = useRouter()
    const { user } = useAuth()

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
                toast.success(`Meta actualizada a $${toPrice(metaNumber)}`)
                route.refresh()
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

    const getSalesAmount = (): number => {
        const { orders, sales } = resume.totales
        const totalSaleAndOrderMonth = orders.month.amount + sales.month.total.amount
        return totalSaleAndOrderMonth
    }

    // Calculate progress percentage
    const getProgressPercentage = () => {
        const sales = getSalesAmount()
        const meta = resume?.metaMensual?.meta ?? 0
        if (meta === 0) return 0
        return Math.min((sales / meta) * 100)
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
    if (user?.role !== "admin") return null
    return (
        <div className="flex flex-col items-center dark:bg-gray-800 bg-white p-4 py-5 rounded">
            <h3 className="text-sm dark:text-gray-500 text-gray-600 mb-2">Ventas totales del presente mes / Meta</h3>
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
                <RadialBar background dataKey="value" suppressHydrationWarning />
            </RadialBarChart>

            <p className="text-xl -mt-6 dark:text-white font-bold">${toPrice(getSalesAmount())}</p>
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
                        setMetaInput((resume?.metaMensual?.meta ?? 0).toString())
                        setEditingMeta(true)
                    }}
                >
                    Meta: ${toPrice(resume?.metaMensual?.meta ?? 0)}
                </p>
            )}

            <p className="text-sm font-medium mt-1" style={{ color: getChartData()[0].fill }}>
                {getProgressPercentage().toFixed(1)}% completado
            </p>
        </div>
    )
}

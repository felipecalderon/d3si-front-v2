import StatCard from "@/components/Caja/Dashboard/StatCard"
import { DollarSign } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"

const Ventas = ({ resume }: { resume: IResume }) => {
    const { sales } = resume.totales
    return (
        <>
            <div className="flex flex-col gap-6">
                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas del día (${sales.today.total.count})`}
                    value={`$${sales.today.total.amount.toLocaleString("es-CL", {
                        maximumFractionDigits: 0,
                    })}`}
                    color="text-green-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas de ayer (${sales.yesterday.total.count})`}
                    value={`Efectivo: $${sales.yesterday.efectivo.amount.toLocaleString("es-CL", {
                        maximumFractionDigits: 0,
                    })}, Débito/Crédito: $${sales.yesterday.debitoCredito.amount.toLocaleString("es-CL", {
                        maximumFractionDigits: 0,
                    })}`}
                    color="text-yellow-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas Semana móvil (${sales.last7.total.count})`}
                    value={`$${sales.last7.total.amount.toLocaleString("es-CL")}`}
                    color="text-red-600"
                />
            </div>
        </>
    )
}

export default Ventas

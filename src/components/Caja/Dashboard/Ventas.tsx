import StatCard from "@/components/Caja/Dashboard/StatCard"
import { DollarSign } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"

const Ventas = ({ resume }: { resume: IResume }) => {
    return (
        <>
            <div className="flex flex-col gap-9">
                <StatCard
                    icon={<DollarSign />}
                    label="Ventas del día"
                    value={`${resume.sales.today.count} productos - $${resume.sales.today.amount.toLocaleString(
                        "es-CL"
                    )}`}
                    color="text-green-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label="Ventas de ayer"
                    value={`${resume.sales.yesterday.count} productos - $${resume.sales.yesterday.amount.toLocaleString(
                        "es-CL"
                    )}`}
                    color="text-yellow-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label="Ventas Semana móvil"
                    value={`$${resume.sales.last7.amount.toLocaleString("es-CL")}`}
                    color="text-red-600"
                />
            </div>
        </>
    )
}

export default Ventas

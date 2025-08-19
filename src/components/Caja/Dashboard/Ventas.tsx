import StatCard from "@/components/Caja/Dashboard/StatCard"
import { DollarSign } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"
import { toPrice } from "@/utils/priceFormat"

const Ventas = ({ resume }: { resume: IResume }) => {
    const { sales } = resume.totales
    return (
        <>
            <div className="flex flex-col gap-6">
                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas del día (${sales.today.total.count})`}
                    value={`$${toPrice(sales.today.total.amount)}`}
                    color="text-green-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas de ayer (${sales.yesterday.total.count})`}
                    value={`Efectivo: $${toPrice(sales.yesterday.efectivo.amount)}, Débito/Crédito: $${toPrice(
                        sales.yesterday.debitoCredito.amount
                    )}`}
                    color="text-yellow-600"
                />

                <StatCard
                    icon={<DollarSign />}
                    label={`Ventas Mensuales (${sales.month.total.count})`}
                    value={`$${toPrice(sales.month.total.amount)}`}
                    color="text-red-600"
                />
            </div>
        </>
    )
}

export default Ventas

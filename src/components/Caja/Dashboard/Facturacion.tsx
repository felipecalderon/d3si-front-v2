import StatCard from "@/components/Caja/Dashboard/StatCard"
import { DollarSign, FileText, FileCheck2 } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"

const Facturacion = ({ resume }: { resume: IResume }) => {
    const { orders, sales } = resume.totales
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-9">
                <StatCard icon={<FileText />} label="Boletas Emitidas" value={sales.month.total.count.toString()} />
                <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value={orders.month.count.toString()} />
                <StatCard
                    icon={<DollarSign />}
                    label="Facturación mensual"
                    value={`$${orders.month.amount.toLocaleString("es-CL", { maximumFractionDigits: 0 })}`}
                />
            </div>
        </div>
    )
}

export default Facturacion

import StatCard from "@/components/Caja/Dashboard/StatCard"
import { DollarSign, FileText, FileCheck2 } from "lucide-react"
import { IResume } from "@/interfaces/sales/ISalesResume"

const Facturacion = ({ resume }: { resume: IResume }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-9">
                <StatCard icon={<FileText />} label="Boletas Emitidas" value={resume.orders.month.count.toString()} />
                <StatCard icon={<FileCheck2 />} label="Facturas Emitidas" value={resume.sales.month.count.toString()} />
                <StatCard
                    icon={<DollarSign />}
                    label="Facturación"
                    value={`$${resume.sales.month.amount.toLocaleString("es-CL")}`}
                />
            </div>
        </div>
    )
}

export default Facturacion

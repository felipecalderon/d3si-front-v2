import SummaryCards from "./SummaryCards"
import TotalsCards from "./TotalsCards"
import IncomeStatementTable from "./IncomeStatementTable"
import ResultsPanel from "./ResultsPanel"
import BenefitBarChart from "./BenefitBarChart"
import StoreSummaryTable from "./StoreSummaryTable"

export default function IncomeStatementView() {
    // Aquí se debe obtener los datos de gastos, ingresos y costos, por ahora es estático
    // Se puede usar context o props para pasar los datos reales
    return (
        <div className="p-6 space-y-6">
            <SummaryCards />
            <TotalsCards />

            {/* Gráfica de barras */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <BenefitBarChart />
                </div>
                <div className="w-full md:w-96 flex flex-col">
                    <StoreSummaryTable />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <IncomeStatementTable />
                </div>
                <div className="w-full md:w-96 flex flex-col">
                    <ResultsPanel />
                </div>
            </div>
        </div>
    )
}

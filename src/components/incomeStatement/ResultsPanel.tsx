export default function ResultsPanel() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-blue-700">Estado de Resultados</h2>
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                    <span>Total Ingresos:</span>
                    <span className="font-semibold text-green-700">$2.000.000</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Costos:</span>
                    <span className="font-semibold text-yellow-700">$1.200.000</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Gastos:</span>
                    <span className="font-semibold text-red-700">$300.000</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Beneficio:</span>
                    <span className="font-semibold text-blue-700">$500.000</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>% Margen:</span>
                    <span className="font-semibold text-purple-700">25%</span>
                </div>
            </div>
        </div>
    )
}

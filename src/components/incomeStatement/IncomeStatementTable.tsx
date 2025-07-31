const rows = [
    { mes: "Enero", ingresos: 200000, costos: 120000, gastos: 30000, beneficio: 50000, margen: "25%" },
    { mes: "Febrero", ingresos: 180000, costos: 110000, gastos: 25000, beneficio: 45000, margen: "25%" },
    { mes: "Marzo", ingresos: 220000, costos: 130000, gastos: 35000, beneficio: 55000, margen: "25%" },
    { mes: "Abril", ingresos: 210000, costos: 125000, gastos: 32000, beneficio: 53000, margen: "25%" },
    { mes: "Mayo", ingresos: 230000, costos: 135000, gastos: 37000, beneficio: 58000, margen: "25%" },
    { mes: "Junio", ingresos: 240000, costos: 140000, gastos: 40000, beneficio: 60000, margen: "25%" },
    { mes: "Julio", ingresos: 250000, costos: 145000, gastos: 42000, beneficio: 63000, margen: "25%" },
]

export default function IncomeStatementTable() {
    return (
        <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Ingresos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Costos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Gastos
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Beneficio
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">% Margen</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                            <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.mes}</td>
                            <td className="px-4 py-2 text-green-600 font-semibold">
                                ${row.ingresos.toLocaleString("es-CL")}
                            </td>
                            <td className="px-4 py-2 text-yellow-700 font-semibold">
                                ${row.costos.toLocaleString("es-CL")}
                            </td>
                            <td className="px-4 py-2 text-red-600 font-semibold">
                                ${row.gastos.toLocaleString("es-CL")}
                            </td>
                            <td className="px-4 py-2 text-blue-700 font-semibold">
                                ${row.beneficio.toLocaleString("es-CL")}
                            </td>
                            <td className="px-4 py-2 text-purple-700 font-semibold">{row.margen}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const totals = [
    { label: "Total Ingresos", value: "$2.000.000", color: "bg-green-100 text-green-800" },
    { label: "Total Costos", value: "$1.200.000", color: "bg-yellow-100 text-yellow-800" },
    { label: "Total Gastos", value: "$300.000", color: "bg-red-100 text-red-800" },
    { label: "Total Beneficio", value: "$500.000", color: "bg-blue-100 text-blue-800" },
    { label: "% Margen", value: "25%", color: "bg-purple-100 text-purple-800" },
]

export default function TotalsCards() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-4">
            {totals.map((t) => (
                <div key={t.label} className={`rounded-lg px-4 py-5 text-center font-bold shadow-sm ${t.color}`}>
                    <div className="text-xs uppercase mb-1">{t.label}</div>
                    <div className="text-lg">{t.value}</div>
                </div>
            ))}
        </div>
    )
}

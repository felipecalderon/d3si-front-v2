import { ISaleResponse } from "@/interfaces/sales/ISale"
import { ISalesResume, ITotals } from "@/interfaces/sales/ISalesResume"
import { getAnulatedProducts } from "@/lib/getAnulatedProducts"

const CHILE_TZ = "America/Santiago"
const chileDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const DAY_MS = 24 * 60 * 60 * 1000

const getChileDateMeta = (date: Date) => {
    const parts = chileDateFormatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
        if (part.type === "year" || part.type === "month" || part.type === "day") acc[part.type] = part.value
        return acc
    }, {})
    const year = Number(parts.year)
    const month = Number(parts.month) - 1
    const day = Number(parts.day)
    return {
        year,
        month,
        day,
        dayNumber: Date.UTC(year, month, day),
    }
}

export const salesToResume = (sales: ISaleResponse[], ref: Date): ISalesResume => {
    const resume: ISalesResume = {
        today: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        yesterday: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        last7: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
        month: {
            total: { count: 0, amount: 0 },
            efectivo: { count: 0, amount: 0 },
            debitoCredito: { count: 0, amount: 0 },
        },
    }

    const refMeta = getChileDateMeta(ref)
    const yesterdayDayNumber = refMeta.dayNumber - DAY_MS
    const last7StartDayNumber = refMeta.dayNumber - 6 * DAY_MS

    for (const sale of sales) {
        if (sale.status !== "Pagado" && sale.status !== "Anulado") continue

        const nulledProducts = getAnulatedProducts(sale)
        const totalNulledAmount = nulledProducts.reduce((acc, p) => acc + p.quantitySold * p.unitPrice, 0)
        const amount = sale.total - totalNulledAmount

        // Si el monto resultante es 0 o menor, no la contamos (anulación total)
        if (amount <= 0 && sale.status === "Anulado") continue

        const saleDate = new Date(sale.createdAt)
        const saleMeta = getChileDateMeta(saleDate)

        const addSale = (period: keyof ITotals["sales"]) => {
            const isEfectivo = sale.paymentType === "Efectivo"
            if (isEfectivo) {
                resume[period].efectivo.count += 1
                resume[period].efectivo.amount += amount
            } else {
                resume[period].debitoCredito.count += 1
                resume[period].debitoCredito.amount += amount
            }
            resume[period].total.count += 1
            resume[period].total.amount += amount
        }

        if (saleMeta.dayNumber === refMeta.dayNumber) addSale("today")
        if (saleMeta.dayNumber === yesterdayDayNumber) addSale("yesterday")
        if (saleMeta.dayNumber >= last7StartDayNumber && saleMeta.dayNumber <= refMeta.dayNumber) addSale("last7")
        if (saleMeta.year === refMeta.year && saleMeta.month === refMeta.month) addSale("month")
    }

    return resume
}

import { ISaleResponse } from "@/interfaces/sales/ISale"
import { ISalesResume, ITotals } from "@/interfaces/sales/ISalesResume"
import { getAnulatedProducts } from "@/lib/getAnulatedProducts"

const CHILE_TZ = "America/Santiago"
const chileFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CHILE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
})

const toChileTime = (date: Date) => {
    const parts = chileFormatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
        if (
            part.type === "year" ||
            part.type === "month" ||
            part.type === "day" ||
            part.type === "hour" ||
            part.type === "minute" ||
            part.type === "second"
        ) {
            acc[part.type] = part.value
        }
        return acc
    }, {})
    const toNumber = (value?: string) => Number(value ?? 0)
    return new Date(
        toNumber(parts.year),
        toNumber(parts.month) - 1,
        toNumber(parts.day),
        toNumber(parts.hour),
        toNumber(parts.minute),
        toNumber(parts.second),
        0,
    )
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

    const startOfDay = (date: Date) => {
        const zoned = new Date(date)
        zoned.setHours(0, 0, 0, 0)
        return zoned
    }
    const endOfDay = (date: Date) => {
        const zoned = new Date(date)
        zoned.setHours(23, 59, 59, 999)
        return zoned
    }

    const chileRef = toChileTime(ref)
    const todayStart = startOfDay(chileRef)
    const todayEnd = endOfDay(chileRef)

    const yesterdayRef = new Date(chileRef)
    yesterdayRef.setDate(yesterdayRef.getDate() - 1)
    const yesterdayStart = startOfDay(yesterdayRef)
    const yesterdayEnd = endOfDay(yesterdayRef)

    const last7Ref = new Date(chileRef)
    last7Ref.setDate(last7Ref.getDate() - 6)
    const last7Start = startOfDay(last7Ref)

    const monthRef = new Date(chileRef)
    monthRef.setDate(1)
    const monthStart = startOfDay(monthRef)

    for (const sale of sales) {
        if (sale.status !== "Pagado" && sale.status !== "Anulado") continue

        const nulledProducts = getAnulatedProducts(sale)
        const totalNulledAmount = nulledProducts.reduce((acc, p) => acc + p.quantitySold * p.unitPrice, 0)
        const amount = sale.total - totalNulledAmount

        // Si el monto resultante es 0 o menor, no la contamos (anulación total)
        if (amount <= 0 && sale.status === "Anulado") continue

        const saleDate = toChileTime(new Date(sale.createdAt))

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

        if (saleDate >= todayStart && saleDate <= todayEnd) addSale("today")
        if (saleDate >= yesterdayStart && saleDate <= yesterdayEnd) addSale("yesterday")
        if (saleDate >= last7Start && saleDate <= todayEnd) addSale("last7")
        if (saleDate >= monthStart && saleDate <= todayEnd) addSale("month")
    }

    return resume
}

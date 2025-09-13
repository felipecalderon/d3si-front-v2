import { ISaleResponse } from "@/interfaces/sales/ISale"
import { ISalesResume, ITotals } from "@/interfaces/sales/ISalesResume"

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

    const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)

    const todayStart = startOfDay(ref)
    const todayEnd = endOfDay(ref)

    const yesterday = new Date(ref)
    yesterday.setDate(ref.getDate() - 1)
    const yesterdayStart = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)

    const last7Start = startOfDay(new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() - 6))
    const monthStart = startOfDay(new Date(ref.getFullYear(), ref.getMonth(), 1))

    for (const sale of sales) {
        if (sale.status !== "Pagado") continue
        const saleDate = new Date(sale.createdAt)
        const amount = sale.total

        const addSale = (period: keyof ITotals["sales"]) => {
            resume[period].debitoCredito.count += 1
            resume[period].debitoCredito.amount += amount
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

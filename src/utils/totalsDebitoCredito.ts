import { ISalesResume, ICountAmountResume } from "@/interfaces/sales/ISalesResume"

export function totalDebitoCredito(sales: ISalesResume[]): ISalesResume {
    const periods: (keyof ISalesResume)[] = ["today", "yesterday", "last7", "month"]

    // función auxiliar para crear un objeto vacío del tipo ICountAmountResume
    const emptyCA = (): ICountAmountResume => ({ count: 0, amount: 0 })

    // función auxiliar para crear un bloque vacío de cada periodo
    const emptyPeriod = () => ({
        total: emptyCA(),
        efectivo: emptyCA(),
        debitoCredito: emptyCA(),
    })

    // objeto acumulador inicial
    const initial: ISalesResume = {
        today: emptyPeriod(),
        yesterday: emptyPeriod(),
        last7: emptyPeriod(),
        month: emptyPeriod(),
    }

    return sales.reduce<ISalesResume>((acc, curr) => {
        for (const p of periods) {
            acc[p].total.count += curr[p].total.count
            acc[p].total.amount += curr[p].total.amount
            acc[p].efectivo.count += curr[p].efectivo.count
            acc[p].efectivo.amount += curr[p].efectivo.amount
            acc[p].debitoCredito.count += curr[p].debitoCredito.count
            acc[p].debitoCredito.amount += curr[p].debitoCredito.amount
        }
        return acc
    }, initial)
}

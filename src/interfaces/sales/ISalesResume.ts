export interface IMetaMensual {
    id: number
    fecha: string
    meta: number
    createdAt: string
    updatedAt: string
}
export interface ISalesResume {
    today: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
    yesterday: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
    last7: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
    month: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
}
export interface ICountAmountResume {
    count: number
    amount: number
}
export interface ITotals {
    sales: ISalesResume
    orders: {
        today: ICountAmountResume
        yesterday: ICountAmountResume
        last7: ICountAmountResume
        month: ICountAmountResume
    }
}

export interface IResume {
    metaMensual: IMetaMensual | null
    totales: ITotals
}

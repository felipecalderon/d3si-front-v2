interface IMetaMensual {
    id: number
    fecha: string
    meta: number
    createdAt: string
    updatedAt: string
}

interface ICountAmountResume {
    count: number
    amount: number
}

export interface IResume {
    metaMensual: IMetaMensual
    totales: {
        sales: {
            today: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
            yesterday: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
            last7: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
            month: { total: ICountAmountResume; efectivo: ICountAmountResume; debitoCredito: ICountAmountResume }
        }
        orders: {
            today: ICountAmountResume
            yesterday: ICountAmountResume
            last7: ICountAmountResume
            month: ICountAmountResume
        }
    }
}

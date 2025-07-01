export interface IResume {
    sales: {
        today: { count: number; amount: number }
        yesterday: { count: number; amount: number }
        last7: { count: number; amount: number }
        month: { count: number; amount: number }
    }
    orders: {
        today: { count: number; amount: number }
        yesterday: { count: number; amount: number }
        last7: { count: number; amount: number }
        month: { count: number; amount: number }
    }
}

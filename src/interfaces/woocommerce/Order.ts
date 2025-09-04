export interface WooCommerceOrder {
    id: number
    number: string
    status: string
    date_created: string
    total: string
    billing: {
        first_name: string
        last_name: string
        email: string
        phone: string
    }
    line_items: {
        id: number
        name: string
        product_id: number
        quantity: number
        price: string
        variation_id?: number // ⚠ agregado
        sku?: string // ⚠ opcional
        image?: { src: string } // ⚠ opcional
    }[]
}

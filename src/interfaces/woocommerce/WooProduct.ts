export type NewWooProduct = Pick<WooProduct, "name" | "type" | "sku" | "description" | "images" | "categories">

export interface WooProduct {
    id: number
    name: string
    slug: string
    permalink: string
    date_created: string
    date_created_gmt: string
    date_modified: string
    date_modified_gmt: string
    type: string
    status: string
    featured: boolean
    catalog_visibility: string
    description: string
    short_description: string
    sku: string
    price: string
    regular_price: string
    sale_price: string
    date_on_sale_from: string | null
    date_on_sale_from_gmt: string | null
    date_on_sale_to: string | null
    date_on_sale_to_gmt: string | null
    on_sale: boolean
    purchasable: boolean
    total_sales: number
    virtual: boolean
    downloadable: boolean
    downloads: any[]
    download_limit: number
    download_expiry: number
    external_url: string
    button_text: string
    tax_status: string
    tax_class: string
    manage_stock: boolean
    stock_quantity: number | null
    backorders: string
    backorders_allowed: boolean
    backordered: boolean
    low_stock_amount: number | null
    sold_individually: boolean
    weight: string
    dimensions: {
        length: string
        width: string
        height: string
    }
    shipping_required: boolean
    shipping_taxable: boolean
    shipping_class: string
    shipping_class_id: number
    reviews_allowed: boolean
    average_rating: string
    rating_count: number
    upsell_ids: number[]
    cross_sell_ids: number[]
    parent_id: number
    purchase_note: string
    categories: {
        id: number
        name: string
        slug: string
    }[]
    brands: any[]
    tags: any[]
    images: {
        id: number
        src: string
        name: string
        alt: string
    }[]
    attributes: {
        id: number
        name: string
        slug: string
        position: number
        visible: boolean
        variation: boolean
        options: string[]
    }[]
    default_attributes: any[]
    variations: number[]
    grouped_products: any[]
    menu_order: number
    price_html: string
    related_ids: number[]
    meta_data: {
        id: number
        key: string
        value: any
    }[]
    stock_status: string
    has_options: boolean
    post_password: string
    global_unique_id: string
}

export interface WooProductVariation {
    id: number
    type: string
    date_created: string
    date_created_gmt: string
    date_modified: string
    date_modified_gmt: string
    description: string
    permalink: string
    sku: string
    global_unique_id: string
    price: string
    regular_price: string
    sale_price: string
    date_on_sale_from: string | null
    date_on_sale_from_gmt: string | null
    date_on_sale_to: string | null
    date_on_sale_to_gmt: string | null
    on_sale: boolean
    status: string
    purchasable: boolean
    virtual: boolean
    downloadable: boolean
    downloads: any[]
    download_limit: number
    download_expiry: number
    tax_status: string
    tax_class: string
    manage_stock: boolean
    stock_quantity: number
    stock_status: string
    backorders: string
    backorders_allowed: boolean
    backordered: boolean
    low_stock_amount: number | null
    weight: string
    dimensions: {
        length: string
        width: string
        height: string
    }
    shipping_class: string
    shipping_class_id: number
    image: {
        id: number
        date_created: string
        date_created_gmt: string
        date_modified: string
        date_modified_gmt: string
        src: string
        name: string
        alt: string
    }
    attributes: {
        id: number
        name: string
        slug: string
        option: string
    }[]
    menu_order: number
    meta_data: {
        id: number
        key: string
        value: string
    }[]
    name: string
    parent_id: number
}

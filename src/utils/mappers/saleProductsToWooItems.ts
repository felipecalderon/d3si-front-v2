import { IProduct } from "@/interfaces/products/IProduct"

// Payload para crear producto padre (simple o variable)
export interface WooCreateProductPayload {
    name: string
    type: "variable" | "simple"
    sku?: string
    description?: string
    images?: { src: string }[]
    categories?: { id?: number; name?: string }[]
}

// Payload para crear variación
export interface WooCreateVariationPayload {
    sku: string
    regular_price: string
    stock_quantity: number
    attributes?: { name: string; option: string }[]
}

// Mapper para productos padres (simples o variables)
export function mapToWooParentProducts(products: IProduct[]): WooCreateProductPayload[] {
    return products.map((p) => ({
        name: p.name,
        type: p.ProductVariations && p.ProductVariations.length > 1 ? "variable" : "simple",
        //Es necesario definir ahora description (tambien wooId y sku) en IProduct? porque en sistema no lo tenemos
        description: p.description || "",
        images: p.image ? [{ src: p.image }] : [],
        categories: p.Category ? [{ name: p.Category.name }] : [],
        sku: p.sku || undefined,
    }))
}

// Mapper para variaciones, requiere el wooID del producto padre
// Retorna un objeto donde la clave es el wooID del producto padre
export function mapToWooVariations(products: IProduct[]): { [wooID: number]: WooCreateVariationPayload[] } {
    const result: { [wooID: number]: WooCreateVariationPayload[] } = {}
    products.forEach((p) => {
        if (!p.wooID) return // Solo productos ya sincronizados
        result[p.wooID] = p.ProductVariations.map((v) => ({
            sku: v.sku || "",
            regular_price: String(v.priceList ?? v.priceCost ?? 0),
            stock_quantity: v.stockQuantity ?? p.stock ?? 0,
            attributes: v.sizeNumber ? [{ name: "Size", option: v.sizeNumber }] : [],
        }))
    })
    return result
}

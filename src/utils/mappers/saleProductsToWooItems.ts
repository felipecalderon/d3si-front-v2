import { WooProductOrder } from "@/interfaces/woocommerce/Order"
import { IProduct } from "@/interfaces/products/IProduct"
import { NewWooProduct } from "@/interfaces/woocommerce/WooProduct"

// Mapper: convierte ISaleProduct[] -> WooProduct[] (mantener para compatibilidad)
//A mi punto de vista no tiene caso porque no queremos registrar en Woo un pedido que se hizo en D3SI
// Pero si quieren hacerlo se puede con esto
export const mapIProductToNewWooProduct = (products: IProduct[]): NewWooProduct[] => {
    return products.map((product) => {
        return {
            name: product.name || "",
            type: "variable",
            sku: "",
            description: "",
            images: product.image ? [{ src: product.image, id: 1, alt: "", name: "" }] : [],
            categories: [],
        }
    })
}

//Esta función prepara todo el catálogo/inventario con variaciones, precios, stock, imágenes, categorías… en el formato que WooCommerce espera.
//Esto para poder ya sincronizar inventario del sistema con pagina web
//Notas
// Preparar payloads a enviar a WooCommerce para crear productos y variaciones
// - Identificación por SKU (usaremos sku como clave primaria para sincronizar/crear)
// - priceList se usa como price
// - cantidad tomada desde IProduct.stock/backend
// Esta función NO hace llamadas para woocommerce todavia hasta revision de felipe. Devuelve objetos para revisión.
export interface WooCreateProductPayload {
    name: string
    type: "variable" | "simple"
    sku?: string
    description?: string
    images?: { src: string }[]
    categories?: { id?: number; name?: string }[]
}

export interface WooCreateVariationPayload {
    sku: string
    regular_price: string
    stock_quantity: number
    attributes?: { name: string; option: string }[]
}

export interface PreparedWooSync {
    productPayloads: {
        product: WooCreateProductPayload
        variations: WooCreateVariationPayload[]
        localProductID: string
    }[]
    lineItems: WooProductOrder[] // items listos para incluir en una orden (si se requiere)
}

/*
Agrupar productos padres según se necesite crear o actualizar en Woo
{ create: NewWooProduct[], update: Partial<WooProduct>[] }
para update siempre pasar id de Woo
    ej: {
        create: [{ name: "Producto A", type: "variable", ... }],
        update: [{ id: 123, name: "Producto B Actualizado" }]
    }
*/
export const prepareProductsForWoo = (products: IProduct[]): undefined => {
    // retorna undefined por ahora pero se debe cambiar a {create: ...}
    // const productPayloads = products.map((p) => {
    //     // Crear payload base de producto (variable si hay variaciones)
    //     const productPayload: WooCreateProductPayload = {
    //         name: p.name,
    //         type: p.ProductVariations && p.ProductVariations.length > 1 ? "variable" : "simple",
    //         description: undefined,
    //         images: p.image ? [{ src: p.image }] : undefined,
    //         categories: p.Category ? [{ name: p.Category.name }] : undefined,
    //     }
    //     const variations: WooCreateVariationPayload[] = p.ProductVariations.map((v: IProductVariation) => ({
    //         sku: v.sku,
    //         regular_price: String(v.priceList ?? v.priceCost ?? 0),
    //         stock_quantity: p.stock ?? 0,
    //         attributes: v.sizeNumber ? [{ name: "Size", option: v.sizeNumber }] : undefined,
    //     }))
    //     // Usamos sku y campos compatibles con WooProduct
    //     return { product: productPayload, variations, localProductID: p.productID }
    // })
    // const lineItems: WooProductOrder[] = products.flatMap((p) =>
    //     p.ProductVariations.map((v) => ({
    //         id: Number(p.productID) || 0,
    //         name: p.name,
    //         product_id: 0, // 0 porque no tenemos el ID de Woo aún; se debe reemplazar tras crear/sincronizar
    //         quantity: p.stock ?? 0,
    //         price: String(v.priceList ?? v.priceCost ?? 0),
    //         variation_id: v.variationID ? Number(v.variationID) : undefined,
    //         sku: v.sku || undefined,
    //         image: p.image ? { src: p.image } : undefined,
    //     }))
    // )
    // return { productPayloads, lineItems }
}

import { ISaleProduct } from "@/interfaces/sales/ISale"
import { WooProductOrder } from "@/interfaces/woocommerce/Order"
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"

// Mapper: convierte ISaleProduct[] -> WooProduct[] (mantener para compatibilidad)
//A mi punto de vista no tiene caso porque no queremos registrar en Woo un pedido que se hizo en D3SI
// Pero si quieren hacerlo se puede con esto
export const mapSaleProductsToWooProducts = (products: ISaleProduct[]): WooProductOrder[] => {
    return products.map((product) => {
        const variation = product.StoreProduct.ProductVariation
        return {
            id: Number(product.SaleProductID),
            name: variation.Product?.name || "",
            product_id: Number(variation.productID),
            quantity: product.quantitySold,
            price: String(product.unitPrice),
            variation_id: variation.variationID ? Number(variation.variationID) : undefined,
            sku: variation.sku || undefined,
            image: variation.Product?.image ? { src: variation.Product.image } : undefined,
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

// Transforma tus IProduct (del sistema d3si) a payloads para crear productos/variaciones en Woo y a line_items.
export const prepareProductsForWoo = (products: IProduct[]): PreparedWooSync => {
    const productPayloads = products.map((p) => {
        // Crear payload base de producto (variable si hay variaciones)
        const productPayload: WooCreateProductPayload = {
            name: p.name,
            type: p.ProductVariations && p.ProductVariations.length > 1 ? "variable" : "simple",
            description: undefined,
            images: p.image ? [{ src: p.image }] : undefined,
            categories: p.Category ? [{ name: p.Category.name }] : undefined,
        }

        const variations: WooCreateVariationPayload[] = p.ProductVariations.map((v: IProductVariation) => ({
            sku: v.sku,
            regular_price: String(v.priceList ?? v.priceCost ?? 0),
            stock_quantity: p.stock ?? 0,
            attributes: v.sizeNumber ? [{ name: "Size", option: v.sizeNumber }] : undefined,
        }))

        // Usamos sku y campos compatibles con WooProduct
        return { product: productPayload, variations, localProductID: p.productID }
    })

    const lineItems: WooProductOrder[] = products.flatMap((p) =>
        p.ProductVariations.map((v) => ({
            id: Number(p.productID) || 0,
            name: p.name,
            product_id: 0, // 0 porque no tenemos el ID de Woo aún; se debe reemplazar tras crear/sincronizar
            quantity: p.stock ?? 0,
            price: String(v.priceList ?? v.priceCost ?? 0),
            variation_id: v.variationID ? Number(v.variationID) : undefined,
            sku: v.sku || undefined,
            image: p.image ? { src: p.image } : undefined,
        }))
    )

    return { productPayloads, lineItems }
}

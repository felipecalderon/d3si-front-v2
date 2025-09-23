import { WooProductOrder } from "@/interfaces/woocommerce/Order"
import { IProduct } from "@/interfaces/products/IProduct"
import { NewWooProduct, WooProduct } from "@/interfaces/woocommerce/WooProduct"

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

export const prepareProductsForWoo = (products: IProduct[]): PreparedWooSync => {
    // Mapear cada producto local a un payload de producto (variable/simple) y sus variaciones
    const productPayloads = products.map((p) => {
        const isVariable = p.ProductVariations && p.ProductVariations.length > 1
        const productPayload: WooCreateProductPayload = {
            name: p.name,
            type: isVariable ? "variable" : "simple",
            description: "",
            images: p.image ? [{ src: p.image }] : [],
            categories: p.Category ? [{ name: p.Category.name }] : [],
        }

        const variations: WooCreateVariationPayload[] = p.ProductVariations.map((v) => ({
            sku: v.sku || "",
            regular_price: String(v.priceList ?? v.priceCost ?? 0),
            stock_quantity: v.stockQuantity ?? p.stock ?? 0,
            attributes: v.sizeNumber ? [{ name: "Size", option: v.sizeNumber }] : [],
        }))

        return { product: productPayload, variations, localProductID: p.productID }
    })

    // Crear line items que pueden usarse en una orden de WooCommerce (product_id = 0 por defecto)
    const lineItems: WooProductOrder[] = products.flatMap((p) =>
        p.ProductVariations.map((v) => ({
            id: Number(p.productID) || 0,
            name: p.name,
            product_id: 0, // se coloca 0 hasta sincronizar con Woo
            quantity: v.stockQuantity ?? p.stock ?? 0,
            price: String(v.priceList ?? v.priceCost ?? 0),
            variation_id: v.variationID ? Number(v.variationID) : undefined,
            sku: v.sku || undefined,
            image: p.image ? { src: p.image } : undefined,
        }))
    )

    return { productPayloads, lineItems }
}

export interface GroupedWooResult {
    create: NewWooProduct[]
    update: Partial<WooProduct>[]
}

// Agrupa productos para determinar qué crear y qué actualizar en WooCommerce.
// Empareja por SKU de las variaciones cuando sea posible; si no encuentra SKU,
// intenta emparejar por nombre (case-insensitive) contra `existingWooProducts`.
// Si `existingWooProducts` no se pasa, todos los productos van a `create`.
export const groupProductsForWoo = (products: IProduct[], existingWooProducts?: WooProduct[]): GroupedWooResult => {
    const create: NewWooProduct[] = []
    const updateMap = new Map<number, Partial<WooProduct>>()

    const skuToWoo = new Map<string, WooProduct>()
    const nameToWoo = new Map<string, WooProduct>()

    if (existingWooProducts && existingWooProducts.length) {
        for (const w of existingWooProducts) {
            if (w.sku) skuToWoo.set(w.sku, w)
            if (w.name) nameToWoo.set(w.name.toLowerCase(), w)
        }
    }

    for (const p of products) {
        // intentar encontrar un producto Woo existente por SKU de variación
        let matched: WooProduct | undefined

        for (const v of p.ProductVariations) {
            if (v.sku && skuToWoo.has(v.sku)) {
                matched = skuToWoo.get(v.sku)
                break
            }
        }

        // fallback por nombre
        if (!matched) {
            const n = (p.name || "").toLowerCase()
            if (nameToWoo.has(n)) matched = nameToWoo.get(n)
        }

        if (matched) {
            // agregar a updates (una sola vez por id)
            if (!updateMap.has(matched.id)) {
                const upd: Partial<WooProduct> = {
                    id: matched.id,
                    name: p.name,
                    sku: matched.sku || undefined,
                    images: p.image ? [{ id: 0, src: p.image, name: "", alt: "" }] : undefined,
                    categories: p.Category ? [{ id: 0, name: p.Category.name, slug: "" }] : undefined,
                }
                updateMap.set(matched.id, upd)
            }
        } else {
            // no existe en Woo -> crear
            const [newProd] = mapIProductToNewWooProduct([p])
            create.push(newProd)
        }
    }

    return { create, update: Array.from(updateMap.values()) }
}

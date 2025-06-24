import { getProductByStoreId } from "@/actions/products/getProductByStoreId"

export const getProductById = async (storeId: string, skuInput: string) => {
    const products = await getProductByStoreId(storeId)

    for (const product of products) {
        const variation = product.ProductVariations.find((v) => v.sku === skuInput)
        if (variation) {
            return {
                ...variation,
                name: product.name,
                image: product.image || "",
            }
        }
    }

    return null
}

/**
 *
 * Debería traer un producto por ID o por SKU. Para poder agregar en la sección de ventas
 */

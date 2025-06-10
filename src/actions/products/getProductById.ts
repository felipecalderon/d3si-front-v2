import { getProductByStoreId } from "@/actions/products/getProductByStoreId"

export const getProductById = async (storeId: string, skuInput: string) => {
    const products = await getProductByStoreId(storeId)
    const flatProducts = products.flatMap((p) => p.ProductVariations)
    const product = flatProducts.find((p) => p.sku === skuInput)

    // if (!product) throw new Error("Product not found")
    return product
}

/**
 *
 * Debería traer un producto por ID o por SKU. Para poder agregar en la sección de ventas
 */

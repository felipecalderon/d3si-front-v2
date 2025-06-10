import { getProductByStoreId } from "@/actions/products/getProductByStoreId"

export const getProductById = async (storeId: string, productId: string) => {
    const products = await getProductByStoreId(storeId)
    const product = products.find((p) => p.storeProductID === productId)

    if (!product) throw new Error("Product not found")
    return product
}

/**
 *
 * Debería traer un producto por ID o por SKU. Para poder agregar en la sección de ventas
 */

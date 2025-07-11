import { getAllProducts } from "@/actions/products/getAllProducts" 

export const getProductById = async (storeId: string, skuInput: string) => {
    const products = await getAllProducts()

    for (const product of products) {
        const variation = product.ProductVariations.find((v) => v.sku === skuInput)
        if (variation) {
            const storeProduct = Array.isArray(variation.StoreProducts)
                ? variation.StoreProducts.find((sp) => sp.storeID === storeId)
                : null

            
            return {
                ...variation,
                name: product.name,
                image: product.image || "",
                storeProductID: storeProduct?.storeProductID || "",
                priceList: Number(variation.priceList),
                stock: storeProduct?.quantity ?? 0,
            }
        }
    }

    return null
}

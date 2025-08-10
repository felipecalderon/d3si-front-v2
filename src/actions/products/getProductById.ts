import { IProduct } from "@/interfaces/products/IProduct"

export const getProductById = async (products: IProduct[], storeId: string, skuInput: string) => {
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

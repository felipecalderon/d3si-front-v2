import { IProduct } from "@/interfaces/products/IProduct"

export const getProductById = async (products: IProduct[], storeId: string, skuInput: string) => {
    for (const product of products) {
        const variation = product.ProductVariations.find((v) => v.sku === skuInput)
        if (variation) {
            const variationStoreProduct = variation.StoreProducts.find((sp) => sp.storeID === storeId)
            if (!variationStoreProduct) return null

            return {
                ...variationStoreProduct,
                ...variation,
                name: product.name,
                image: product.image || "",
                storeProductID: variationStoreProduct.storeProductID || "",
                priceList: Number(variation.priceList),
                stock: variationStoreProduct.quantity ?? 0,
            }
        }
    }

    return null
}

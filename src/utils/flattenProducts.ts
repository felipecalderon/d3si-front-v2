import { IProduct } from "@/interfaces/products/IProduct"
import { FlattenedProduct } from "@/interfaces/products/IFlatternProduct"

export const flattenProducts = (products: IProduct[]): FlattenedProduct[] => {
    return products.flatMap((product) =>
        product.ProductVariations.map((variation) => {
            const centralStock = variation.stockQuantity
            const totalStock = variation.StoreProducts?.reduce((acc, sp) => acc + sp.quantity, 0) ?? 0

            return {
                id: variation.variationID,
                name: product.name,
                image: product.image,
                sku: variation.sku,
                size: variation.sizeNumber,
                priceCost: variation.priceCost,
                priceList: variation.priceList,
                centralStock,
                totalStock,
                totalProducts: product.totalProducts,
            }
        })
    )
}

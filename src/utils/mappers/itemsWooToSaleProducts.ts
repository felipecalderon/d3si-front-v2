import { ISaleProduct } from "@/interfaces/sales/ISale"
import { WooProductOrder } from "@/interfaces/woocommerce/Order"

// map (products: ISaleProduct[]): WooProductOrder[]) ..
export const mapLineItemsToSaleProducts = (lineItems: WooProductOrder[]): ISaleProduct[] => {
    return lineItems.map((item) => ({
        SaleProductID: String(item.id),
        storeProductID: String(item.product_id),
        quantitySold: item.quantity,
        unitPrice: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        StoreProduct: {
            ProductVariation: {
                variationID: String(item.id), // o null si quieres
                name: item.name,
                sku: "",
                productID: String(item.product_id),
                sizeNumber: "",
                color: "",
                createdAt: "",
                updatedAt: "",
                priceList: 0,
                priceCost: 0,
                stockQuantity: 0,
                Stores: [],
                StoreProduct: {} as any,
                StoreProducts: [],
                Product: {
                    productID: String(item.product_id),
                    name: item.name,
                    image: "",
                    wooID: null,
                    description: "",
                    category: "",
                    brand: "Otro", // valor por defecto
                    genre: "Unisex", // valor por defecto
                    totalProducts: item.quantity,
                    createdAt: "",
                    updatedAt: "",
                    ProductVariations: [], // vacío porque no tenemos info
                    categoryID: null,
                    stock: 0,
                },
            },
        },
    }))
}

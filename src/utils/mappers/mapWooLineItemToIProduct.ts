// src/mappers/mapWooLineItemToIProduct.ts
import { IProduct } from "@/interfaces/products/IProduct"
import { IProductVariation } from "@/interfaces/products/IProductVariation"
import { ISaleProduct } from "@/interfaces/sales/ISale"
import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"

export const mapWooLineItemToISaleProduct = (
    lineItem: WooCommerceOrder["line_items"][0],
    orderDate: string
): ISaleProduct => {
    const product: IProduct = {
        productID: String(lineItem.product_id),
        name: lineItem.name,
        brand: "Otro", // se pone otro por ahora el detalle de venta no expone marca
        genre: "Unisex", // Igual
        image: lineItem.image?.src || "",
        totalProducts: lineItem.quantity,
        createdAt: orderDate,
        updatedAt: orderDate,
        categoryID: null,
        stock: lineItem.quantity,
        ProductVariations: [],
    }

    const variation: IProductVariation = {
        variationID: lineItem.variation_id ? String(lineItem.variation_id) : `${lineItem.product_id}-default`,
        productID: String(lineItem.product_id),
        sizeNumber: "", // ver si woo tiene size , pero para el detalle de la venta no se necesita
        priceList: Number(lineItem.price),
        priceCost: Number(lineItem.price),
        sku: lineItem.sku || "",
        stockQuantity: lineItem.quantity,
        Stores: [],
        StoreProducts: [],
        createdAt: orderDate,
        updatedAt: orderDate,
    }

    // ligamos la variación al producto
    product.ProductVariations = [variation]

    const saleProduct: ISaleProduct = {
        SaleProductID: String(lineItem.id),
        storeProductID: `${lineItem.product_id}-${lineItem.variation_id || "default"}`,
        quantitySold: lineItem.quantity,
        unitPrice: Number(lineItem.price),
        subtotal: Number(lineItem.price) * lineItem.quantity,
        StoreProduct: {
            ProductVariation: {
                ...variation,
                Product: product,
            },
        },
    }

    return saleProduct
}

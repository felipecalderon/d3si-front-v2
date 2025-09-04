import { WooCommerceOrder } from "@/interfaces/woocommerce/Order"
import { ISaleResponse, ISaleProduct, PaymentStatus } from "@/interfaces/sales/ISale"
import { IStore } from "@/interfaces/stores/IStore"

const mapWooStatusToPaymentStatus = (status: string): PaymentStatus => {
    switch (status) {
        case "completed":
            return "Pagado"
        case "processing":
            return "Pendiente"
        case "cancelled":
            return "Anulado"
        default:
            return "Pendiente" // fallback para otros estados
    }
}
// mapper básico de orden (sin productos por ahora)
export const mapOrderToSaleBasic = (order: WooCommerceOrder): Omit<ISaleResponse, "SaleProducts"> => {
    const status: PaymentStatus = mapWooStatusToPaymentStatus(order.status)

    const store: IStore = {
        storeID: "web",
        name: "Web",
        storeImg: null,
        location: order.billing.first_name, // no hay shipping, usamos billing
        rut: "",
        phone: order.billing.phone,
        address: order.billing.first_name, // simplificado
        city: "", // no hay ciudad
        markup: "0",
        isAdminStore: false,
        role: "web",
        email: order.billing.email,
        createdAt: order.date_created,
        updatedAt: order.date_created, // no hay date_modified
        StoreProduct: {} as any,
        Users: [],
    }

    return {
        saleID: String(order.id),
        storeID: store.storeID,
        total: Number(order.total),
        status,
        createdAt: order.date_created,
        paymentType: "Webpay" /* como no hay payment_method_title */,
        Store: store,
        Return: null,
    }
}

// Paso 2: mapper de productos
export const mapLineItemsToSaleProducts = (lineItems: WooCommerceOrder["line_items"]): ISaleProduct[] => {
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

// Paso 3: mapper completo
export const mapWooOrderToSale = (order: WooCommerceOrder): ISaleResponse => {
    const sale = mapOrderToSaleBasic(order)
    const products = mapLineItemsToSaleProducts(order.line_items)

    return {
        ...sale,
        SaleProducts: products,
    }
}

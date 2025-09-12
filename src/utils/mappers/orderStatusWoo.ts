import { PaymentStatus } from "@/interfaces/sales/ISale"
import { WooSaleStatus } from "@/interfaces/woocommerce/Order"

export const mapWooStatusToPaymentStatus = (status: WooSaleStatus): PaymentStatus => {
    switch (status) {
        case "completed":
            return "Pagado"
        case "refunded":
            return "Anulado"
        case "shipping-progress":
            return "Pagado"
        case "processing":
            return "Pendiente"
        case "cancelled":
            return "Anulado"
        default:
            return "Pendiente" // fallback para otros estados
    }
}

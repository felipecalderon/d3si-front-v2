import { PaymentStatus } from "@/interfaces/sales/ISale"

export const mapWooStatusToPaymentStatus = (status: string): PaymentStatus => {
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

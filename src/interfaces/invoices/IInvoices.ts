import { IOrderWithStore } from "../orders/IOrderWithStore"
import { IStore } from "../stores/IStore"

export interface InvoicesClientProps {
    initialOrders: IOrderWithStore[]
    stores: IStore[]
}

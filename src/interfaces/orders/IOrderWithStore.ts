import { IOrder } from "@/interfaces/orders/IOrder"
import { IStore } from "@/interfaces/stores/IStore"

export interface IOrderWithStore extends IOrder {
    Store?: IStore
}

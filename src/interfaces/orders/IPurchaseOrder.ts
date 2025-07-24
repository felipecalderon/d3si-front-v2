import { ICategory } from "../categories/ICategory"
import { IProduct } from "../products/IProduct"
import { IStore } from "../stores/IStore"

export interface PurchaseOrderClientProps {
    initialProducts: IProduct[]
    initialCategories: ICategory[]
    initialStores: IStore[]
}

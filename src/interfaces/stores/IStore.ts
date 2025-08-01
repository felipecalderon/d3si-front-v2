import { IUser } from "../users/IUser"
import { IStoreProduct } from "./IStoreProduct"

export interface IStore {
    storeID: string
    name: string
    storeImg: string | null
    location: string
    rut: string
    phone: string
    address: string
    city: string
    markup: string
    isAdminStore: boolean
    role: string
    email: string
    createdAt: string
    updatedAt: string
    StoreProduct: IStoreProduct
    Users: IUser[]
}

import { IStore } from "../stores/IStore"
import { UserRole } from "@/lib/userRoles"
export interface IUser {
    userID: string
    name: string
    email: string
    role: UserRole
    password: string
    userImg: string
    createdAt: string
    updatedAt: string
    Stores: IStore[]
}

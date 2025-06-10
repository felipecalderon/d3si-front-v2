import { IStore } from "../stores/IStore"

export interface IUser {
    userID: string
    name: string
    email: string
    role: string
    password: number
    userImg: string
    createdAt: string
    updatedAt: string
    Stores: IStore[]
}
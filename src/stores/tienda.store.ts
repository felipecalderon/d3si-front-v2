import { create } from "zustand"
import { IStore } from "@/interfaces/stores/IStore"
import { IUser } from "@/interfaces/users/IUser"

interface TiendaStore {
    users: IUser[]
    stores: IStore[]
    setUsers: (users: IUser[]) => void
    setStores: (stores: IStore[]) => void
}

export const useTienda = create<TiendaStore>((set) => ({
    stores: [],
    users: [],
    setUsers: (users) => set({ users }),
    setStores: (stores) => set({ stores }),
}))

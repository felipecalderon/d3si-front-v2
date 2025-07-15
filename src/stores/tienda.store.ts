import { create } from "zustand"
import { IStore } from "@/interfaces/stores/IStore"
import { IUser } from "@/interfaces/users/IUser"

interface TempStore {
    storeID: string
    name: string
}

interface TiendaStore {
    stores: IStore[]
    storeSelected: { storeID: string; name: string } | null
    setStoreSelected: (store: TempStore) => void
    setStores: (stores: IStore[]) => void
    users: IUser[]
    setUsers: (users: IUser[]) => void
}

export const useTienda = create<TiendaStore>((set) => ({
    stores: [],
    storeSelected: null,
    setStoreSelected: (store) => {
        set({ storeSelected: store })
    },
    setStores: (stores) => set({ stores }),
    users: [],
    setUsers: (users) => set({ users }),
}))

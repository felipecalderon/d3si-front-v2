import { create } from "zustand"
import { IStore } from "@/interfaces/stores/IStore"

interface TempStore {
    storeID: string
    name: string
    isAdminStore: boolean
}

interface TiendaStore {
    stores: IStore[]
    storeSelected: TempStore | null
    setStoreSelected: (store: TempStore) => void
    setStores: (stores: IStore[]) => void
}

export const useTienda = create<TiendaStore>((set) => ({
    stores: [],
    storeSelected: null,
    setStoreSelected: (store) => {
        set({ storeSelected: store })
    },
    setStores: (stores) => set({ stores }),
}))

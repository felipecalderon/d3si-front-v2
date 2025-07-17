import { create } from "zustand"
import { IStore } from "@/interfaces/stores/IStore"

interface TiendaStore {
    stores: IStore[]
    storeSelected: IStore | null
    setStoreSelected: (store: IStore) => void
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

import { create } from "zustand"
import { IStore } from "@/interfaces/stores/IStore"
import { persist } from "zustand/middleware"

interface TiendaStore {
    stores: IStore[]
    storesFromUser: IStore[]
    storeSelected: IStore | null
    setStores: (stores: IStore[]) => void
    setStoresUser: (storesFromUser: IStore[]) => void
    setStoreSelected: (store: IStore | null) => void
    cleanStores: () => void
}

export const useTienda = create(
    persist<TiendaStore>(
        (set) => ({
            stores: [],
            storesFromUser: [],
            storeSelected: null,
            setStores: (stores) => set({ stores }),
            setStoresUser: (storesFromUser) => set({ storesFromUser }),
            setStoreSelected: (store) => {
                set({ storeSelected: store })
            },
            cleanStores: () => {
                set({ stores: [], storesFromUser: [], storeSelected: null })
            },
        }),
        { name: "stores" }
    )
)
